# app/api/v1/endpoints/portfolio.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from langchain_core.messages import HumanMessage

from app.quant.mvo import get_optimal_weights
from app.schemas.portfolio import PortfolioRequest, PortfolioResponse
from app.models import User, Portfolio, PortfolioPosition
from app.quant.execution import execute_trade_plan
from app.agents.graph import app_graph
from app.core.db import get_db
from app.quant.rebalance import calculate_orders
from app.utils.market_data import fetch_live_prices

router = APIRouter()

@router.post("/recommend", response_model=PortfolioResponse) 
async def get_portfolio_recommendation(
    request: PortfolioRequest, 
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. Fetch User Data (With Portfolio, Positions, AND Assets attached)
        query = (
            select(User)
            .where(User.id == request.user_id)
            .options(
                selectinload(User.portfolio)
                .selectinload(Portfolio.positions)
                .selectinload(PortfolioPosition.asset) 
            )
        )
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found in database")
        if not user.portfolio:
            raise HTTPException(status_code=400, detail="User has no active portfolio")

        # 2. Extract Real DB Values
        real_rra = user.rra_coefficient
        cash_available = user.portfolio.cash_balance
        
        # Build a string summarizing what they currently own for the AI
        holdings_summary = ", ".join(
            [f"{pos.quantity} units of {pos.asset.ticker_or_isin if pos.asset else 'Unknown'}" 
             for pos in user.portfolio.positions]
        ) or "No existing holdings."

        print(f"--- DB FETCH SUCCESS: User {user.full_name} | RRA: {real_rra} | Cash: {cash_available} ---")

        # 3. Initialize Graph State with REAL Data
        initial_state = {
            "rra_score": real_rra,
            "messages": [
                HumanMessage(content=(
                    f"Generate portfolio for risk score {real_rra}. "
                    f"User has ₹{cash_available} in cash and currently owns: {holdings_summary}."
                ))
            ]
        }

        # 4. Run the AI Graph
        final_state = await app_graph.ainvoke(initial_state)

        # 5. Extract AI Constraints
        ai_data = final_state.get("optimization_constraints", {})
        equity_val = ai_data.get("equity_max")
        cash_val = ai_data.get("cash_min")

        if equity_val is None:
            print("--- WARNING: AI failed to parse constraints. ---")
            equity_val = 0.85 # Safe fallback if AI parsing fails
            cash_val = 0.15

        # Extract Rationale
        messages = final_state.get("messages", [])
        clean_texts = [m.content for m in messages if isinstance(m.content, str)]
        rationale = max(clean_texts, key=len) if clean_texts else "Analysis complete."

        # 6. Mathematically Calculate Target Weights (MVO)
        approved_tickers = ["NIFTYBEES.NS", "LIQUIDBEES.NS"]
        
        # Pass the AI's dynamic limit to the Math Engine
        optimal_weights = await get_optimal_weights(
            tickers=approved_tickers, 
            risk_aversion=real_rra,
            equity_max=float(equity_val) # <--- THE FIX: AI logic injected into SciPy math
        )

        # 7. FETCH LIVE MARKET DATA
        # Figure out all unique tickers we need prices for (currently owned + AI recommended)
        all_tickers = set(optimal_weights.keys())
        for pos in user.portfolio.positions:
            if pos.asset and pos.asset.ticker_or_isin:
                all_tickers.add(pos.asset.ticker_or_isin)
        
        # Call our new yfinance utility
        live_prices = await fetch_live_prices(list(all_tickers))
        
        # 8. Format Current Positions for the Rebalancer
        formatted_positions = []
        for pos in user.portfolio.positions:
            if pos.asset:
                ticker = pos.asset.ticker_or_isin
                # Prioritize Live Price -> Fallback to DB NAV -> Fallback to Buy Price
                current_price = live_prices.get(ticker) or pos.asset.latest_nav or pos.average_buy_price or 1.0
                
                formatted_positions.append({
                    "ticker": ticker,
                    "quantity": pos.quantity,
                    "current_price": current_price
                })

        # Inject target assets if the user doesn't already own them
        for ticker in optimal_weights.keys():
            if not any(p["ticker"] == ticker for p in formatted_positions):
                formatted_positions.append({
                    "ticker": ticker,
                    "quantity": 0,
                    # Prioritize Live Price -> Fallback to 100 as a fail-safe
                    "current_price": live_prices.get(ticker) or 100.0 
                })

        # 9. Run the Quant Engine
        action_plan = calculate_orders(
            cash_balance=cash_available,
            current_positions=formatted_positions,
            target_weights=optimal_weights
        )

        approved_assets = final_state.get("approved_asset_classes", ["Equity", "Liquid Funds"])

        # 10. Return the Ultimate Payload
        return {
            "status": "success",
            "portfolio_summary": {
                "total_value": action_plan["total_portfolio_value"],
                "projected_cash_balance": action_plan["projected_remaining_cash"]
            },
            "recommendations": action_plan["orders"],
            "rationale": rationale,
            "approved_assets": approved_assets
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"!!! CRITICAL API ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")
    


@router.post("/execute")
async def confirm_trade_execution(
    request: PortfolioRequest, # Using same schema for now
    action_plan: dict,         # The JSON output from /recommend
    db: AsyncSession = Depends(get_db)
):
    try:
        success = await execute_trade_plan(db, request.user_id, action_plan)
        return {"status": "success", "message": "Portfolio updated successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))