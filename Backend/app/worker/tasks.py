import asyncio
from app.core.celery_app import celery_app

# Import your heavy lifting modules
from app.agents.graph import app_graph
from app.quant.mvo import get_optimal_weights
from app.quant.rebalance import calculate_orders
from app.utils.market_data import fetch_live_prices
from langchain_core.messages import HumanMessage

# Database and Models
from app.core.db import SessionLocal
from app.models import User, Portfolio, PortfolioPosition, Asset, RiskProfile # Added RiskProfile
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

async def _async_portfolio_generation(user_id, cash_available, holdings_summary, available_tickers, equity_tickers, current_positions):
    """The actual async function doing the heavy lifting."""
    
    # --- NEW: FETCH DYNAMIC RRA FROM DATABASE ---
    async with SessionLocal() as session:
        stmt = select(RiskProfile).where(RiskProfile.user_id == user_id)
        result = await session.execute(stmt)
        profile = result.scalar_one_or_none()
        
        # Fallback to 4.5 if no questionnaire has been taken yet
        rra_score = profile.rra_coefficient if profile else 4.5
        print(f"🎯 [Worker] Using Dynamic RRA for User {user_id}: {rra_score}")
    # --------------------------------------------

    # 1. Initialize Graph State
    initial_state = {
        "rra_score": rra_score,
        "available_tickers": available_tickers,
        "messages": [
            HumanMessage(content=(
                f"Generate portfolio for risk score {rra_score}. "
                f"User has ₹{cash_available} in cash and currently owns: {holdings_summary}."
            ))
        ]
    }

    # 2. Run the AI Graph
    final_state = await app_graph.ainvoke(initial_state)

    # 3. Extract AI Constraints
    ai_data = final_state.get("optimization_constraints", {})
    # Use AI or fall back to a safe default based on RRA
    equity_val = ai_data.get("equity_max", 0.85) 

    messages = final_state.get("messages", [])
    clean_texts = [m.content for m in messages if isinstance(m.content, str)]
    rationale = max(clean_texts, key=len) if clean_texts else "Analysis complete."

    # 4. Run the MVO Math Engine
    optimal_weights = await get_optimal_weights(
        tickers=available_tickers, 
        risk_aversion=rra_score, # Now dynamic
        equity_max=float(equity_val),
        equity_tickers=equity_tickers
    )

    # 5. Fetch Live Prices
    all_target_tickers = set(optimal_weights.keys())
    for pos in current_positions:
        all_target_tickers.add(pos["ticker"])
        
    live_prices = await fetch_live_prices(list(all_target_tickers))

    # 6. Update Current Positions
    for pos in current_positions:
        ticker = pos["ticker"]
        pos["current_price"] = live_prices.get(ticker) or pos["current_price"]

    for ticker in optimal_weights.keys():
        if not any(p["ticker"] == ticker for p in current_positions):
            current_positions.append({
                "ticker": ticker,
                "quantity": 0,
                "current_price": live_prices.get(ticker) or 100.0 
            })

    # 7. Calculate Final Trades
    action_plan = calculate_orders(
        cash_balance=cash_available,
        current_positions=current_positions,
        target_weights=optimal_weights
    )

    return {
        "status": "success",
        "portfolio_summary": {
            "total_value": action_plan["total_portfolio_value"],
            "projected_cash_balance": action_plan["projected_remaining_cash"]
        },
        "recommendations": action_plan["orders"],
        "rationale": rationale,
        "rra_used": rra_score, # Useful for debugging
        "approved_assets": final_state.get("approved_asset_classes", ["Equity", "Liquid Funds"])
    }


@celery_app.task(name="app.worker.tasks.background_portfolio_generation")
def background_portfolio_generation(payload: dict):
    """
    The Celery entry point.
    """
    print(f"🚀 [Worker] Starting AI Analysis for User {payload.get('user_id')}...")
    
    # We no longer strictly need rra_score in the payload, 
    # but we keep the others for initialization.
    result = asyncio.run(_async_portfolio_generation(
        user_id=payload["user_id"],
        cash_available=payload["cash_available"],
        holdings_summary=payload["holdings_summary"],
        available_tickers=payload["available_tickers"],
        equity_tickers=payload["equity_tickers"],
        current_positions=payload["current_positions"]
    ))
    
    print(f"✅ [Worker] Analysis Complete for User {payload.get('user_id')}!")
    return result


async def _async_drift_monitor():
    """Scans all users to check if their portfolios have drifted."""
    print("🔍 [Beat] Waking up to scan portfolios for drift...")
    
    # Corrected: Call the async session maker
    async with SessionLocal() as session:
        # Fetch users with their portfolios, positions, and assets attached
        query = (
            select(User)
            .options(
                selectinload(User.portfolio)
                .selectinload(Portfolio.positions)
                .selectinload(PortfolioPosition.asset),
                selectinload(User.risk_profile)
            )
        )
        result = await session.execute(query)
        users = result.scalars().all()

        drifted_users = []

        for user in users:
            rra = user.risk_profile.rra_coefficient if user.risk_profile else 4.5
            if not user.portfolio or not user.portfolio.positions:
                continue
                
            print(f"   📊 Scanning User {user.id} ({user.full_name})...")
            
            # 1. Fetch live prices for this specific user's holdings
            tickers = [pos.asset.ticker_or_isin for pos in user.portfolio.positions if pos.asset]
            live_prices = await fetch_live_prices(tickers)

            # 2. Calculate their current Equity % vs Total Value
            total_invested = 0.0
            equity_invested = 0.0

            for pos in user.portfolio.positions:
                if not pos.asset:
                    continue
                    
                ticker = pos.asset.ticker_or_isin
                price = live_prices.get(ticker) or pos.asset.latest_nav or pos.average_buy_price or 1.0
                current_value = pos.quantity * price
                
                total_invested += current_value
                
                if pos.asset.asset_class == 'EQUITY':
                    equity_invested += current_value

            total_portfolio_value = total_invested + user.portfolio.cash_balance
            
            if total_portfolio_value == 0:
                continue

            current_equity_pct = equity_invested / total_portfolio_value
            target_equity_pct = (10.0 - rra) / 10.0 
            drift = abs(current_equity_pct - target_equity_pct)
            
            print(f"      -> Current Equity: {current_equity_pct:.1%} | Target: {target_equity_pct:.1%} | Drift: {drift:.1%}")

            if drift > 0.05:
                print(f"      ⚠️ DRIFT EXCEEDS 5%! User {user.id} needs rebalancing.")
                drifted_users.append(user.id)
            else:
                print("      ✅ Portfolio is within safe bounds.")

        # Notification Phase (Can be expanded later)
        if drifted_users:
            print(f"🚨 [Beat] Action Required for Users: {drifted_users}")

    print("✅ [Beat] Scan complete. Going back to sleep.")

@celery_app.task(name="app.worker.tasks.daily_drift_monitor")
def daily_drift_monitor():
    """The Celery Beat entry point."""
    asyncio.run(_async_drift_monitor())
    return "Drift scan complete"