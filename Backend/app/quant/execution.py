from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from app.models import Portfolio, PortfolioPosition, Asset
from datetime import datetime

async def execute_trade_plan(db: AsyncSession, user_id: int, action_plan: dict):
    """
    Physically updates the DB based on the calculate_orders output.
    """
    # 1. Fetch the Portfolio
    portfolio_query = await db.execute(
        select(Portfolio).where(Portfolio.user_id == user_id)
    )
    portfolio = portfolio_query.scalar_one_or_none()
    
    if not portfolio:
        raise Exception("Portfolio not found for execution")

    # 2. Update Cash Balance
    # action_plan['projected_remaining_cash'] comes from your Rebalancer
    portfolio.cash_balance = action_plan["projected_remaining_cash"]
    portfolio.last_rebalanced_at = datetime.utcnow()

    # 3. Process each order
    for ticker, details in action_plan["orders"].items():
        if details["action"] == "HOLD":
            continue

        # Find the Asset ID for this ticker
        asset_query = await db.execute(
            select(Asset).where(Asset.ticker_or_isin == ticker)
        )
        asset = asset_query.scalar_one_or_none()
        if not asset:
            print(f"Warning: Asset {ticker} not found in DB. Skipping.")
            continue

        # Check if user already owns this asset
        pos_query = await db.execute(
            select(PortfolioPosition).where(
                PortfolioPosition.portfolio_id == portfolio.id,
                PortfolioPosition.asset_id == asset.id
            )
        )
        existing_pos = pos_query.scalar_one_or_none()

        if details["action"] == "BUY":
            if existing_pos:
                # Update existing: New Qty & New Weighted Avg Cost
                total_cost = (existing_pos.quantity * existing_pos.average_buy_price) + (details["units"] * details["current_price"])
                existing_pos.quantity += details["units"]
                existing_pos.average_buy_price = total_cost / existing_pos.quantity
            else:
                # Create new position
                new_pos = PortfolioPosition(
                    portfolio_id=portfolio.id,
                    asset_id=asset.id,
                    quantity=details["units"],
                    average_buy_price=details["current_price"],
                    target_weight=details["target_weight_percentage"]
                )
                db.add(new_pos)

        elif details["action"] == "SELL":
            if existing_pos:
                existing_pos.quantity -= details["units"]
                # If quantity hits near zero, you might want to delete the row or keep it at 0
                if existing_pos.quantity <= 0.001:
                    await db.delete(existing_pos)

    # 4. Commit everything as one transaction
    await db.commit()
    return True