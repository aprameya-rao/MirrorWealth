from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models import Portfolio, PortfolioPosition, Asset
from datetime import datetime

async def execute_trade_plan(db: AsyncSession, user_id: int, action_plan: dict):
    """
    Physically updates the DB based on the calculate_orders output.
    """
    # 1. Fetch the Portfolio (with positions loaded to avoid 'lazy load' errors)
    portfolio_query = await db.execute(
        select(Portfolio)
        .where(Portfolio.user_id == user_id)
        .options(selectinload(Portfolio.positions).selectinload(PortfolioPosition.asset))
    )
    portfolio = portfolio_query.scalar_one_or_none()
    
    if not portfolio:
        raise Exception("Portfolio not found for execution")

    # 2. Safety Check: Ensure projected cash isn't negative
    new_cash = action_plan.get("portfolio_summary", {}).get("projected_cash_balance")
    if new_cash is None:
        # Fallback if the key is nested differently in your JSON
        new_cash = action_plan.get("projected_remaining_cash", portfolio.cash_balance)
    
    if new_cash < -1.0: # Allowing a ₹1 buffer for rounding
        raise Exception(f"Insufficient cash for this trade plan. Need ₹{abs(new_cash)} more.")

    portfolio.cash_balance = new_cash
    portfolio.last_rebalanced_at = datetime.utcnow()

    # 3. Process each order
    # Note: Using .get() because 'recommendations' is the key in your /recommend output
    orders = action_plan.get("recommendations", [])

    for order in orders:
        ticker = order["ticker"]
        action = order["action"]
        
        if action == "HOLD":
            continue

        # Find the Asset object
        asset_query = await db.execute(select(Asset).where(Asset.ticker_or_isin == ticker))
        asset = asset_query.scalar_one_or_none()
        if not asset:
            print(f"⚠️ Warning: Asset {ticker} not found in DB. Skipping.")
            continue

        # Check existing positions
        existing_pos = next((p for p in portfolio.positions if p.asset_id == asset.id), None)

        if action == "BUY":
            units_to_buy = float(order["units"])
            buy_price = float(order["price"])
            
            if existing_pos:
                # Update existing: New Weighted Avg Cost
                total_cost = (existing_pos.quantity * existing_pos.average_buy_price) + (units_to_buy * buy_price)
                existing_pos.quantity += units_to_buy
                existing_pos.average_buy_price = total_cost / existing_pos.quantity
            else:
                # Create new position
                new_pos = PortfolioPosition(
                    portfolio_id=portfolio.id,
                    asset_id=asset.id,
                    quantity=units_to_buy,
                    average_buy_price=buy_price
                )
                db.add(new_pos)

        elif action == "SELL":
            units_to_sell = float(order["units"])
            if existing_pos:
                # Ensure we don't sell more than we have (safety floor)
                existing_pos.quantity = max(0, existing_pos.quantity - units_to_sell)
                
                # Clean up empty rows
                if existing_pos.quantity <= 0.001:
                    await db.delete(existing_pos)
            else:
                print(f"⚠️ Warning: Attempted to sell {ticker} but user doesn't own it.")

    # 4. Commit as one atomic transaction
    try:
        await db.commit()
        return True
    except Exception as e:
        await db.rollback()
        print(f"❌ Execution Database Error: {str(e)}")
        raise e