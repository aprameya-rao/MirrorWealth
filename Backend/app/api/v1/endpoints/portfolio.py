# app/api/v1/endpoints/portfolio.py
from pydantic import BaseModel
from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from langchain_core.messages import HumanMessage

from app.quant.mvo import get_optimal_weights
from app.schemas.portfolio import PortfolioRequest, PortfolioResponse
# --- CHANGED: Added Asset to the imports ---
from app.models import User, Portfolio, PortfolioPosition, Asset 
from app.quant.execution import execute_trade_plan
from app.agents.graph import app_graph
from app.core.db import get_db
from app.quant.rebalance import calculate_orders
from app.utils.market_data import fetch_live_prices
from celery.result import AsyncResult
from app.worker.tasks import background_portfolio_generation
from app.api.deps import get_current_user

router = APIRouter()

class HoldingDetail(BaseModel):
    ticker: str
    name: str
    asset_class: str
    quantity: float
    average_buy_price: float
    current_price: float
    current_value: float
    pnl_absolute: float
    pnl_percentage: float
    portfolio_weight: float


class DashboardResponse(BaseModel):
    status: str
    summary: Dict[str, float] # Total Value, Invested, Cash, Total PnL
    allocations: Dict[str, float] # e.g., {"EQUITY": 0.60, "FIXED_INCOME": 0.30, "COMMODITY": 0.10}
    holdings: List[HoldingDetail]

@router.post("/recommend", response_model=PortfolioResponse) 
async def get_portfolio_recommendation(
    request: PortfolioRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # 1. Fetch User Data (With Portfolio, Positions, AND Assets attached)
        query = (
            select(User)
            .where(User.id == current_user.id)
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

        # --- NEW: Fetch all available tickers from the database ---
        asset_query = select(Asset.ticker_or_isin).where(Asset.ticker_or_isin.is_not(None))
        asset_result = await db.execute(asset_query)
        available_tickers = list(asset_result.scalars().all())

        if not available_tickers:
            raise HTTPException(status_code=400, detail="No assets available in the database")
        # ----------------------------------------------------------

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
            "available_tickers": available_tickers, # <--- NEW: Injecting the dynamic list into the AI
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
        # --- CHANGED: Now using the dynamic list instead of the hardcoded one ---
        approved_tickers = available_tickers 
        equity_tickers = [a.ticker_or_isin for a in asset_result.scalars().all() if a.asset_class == 'EQUITY']
        # Pass the AI's dynamic limit to the Math Engine
        optimal_weights = await get_optimal_weights(
            tickers=approved_tickers, 
            risk_aversion=real_rra,
            equity_max=float(equity_val),
            equity_tickers=equity_tickers # <--- THE FIX: AI logic injected into SciPy math
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
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        success = await execute_trade_plan(db, current_user.id, action_plan)
        return {"status": "success", "message": "Portfolio updated successfully"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/dashboard/{user_id}", response_model=DashboardResponse)
async def get_portfolio_dashboard(
    user_id: int, 
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. Fetch User, Portfolio, and Positions in one massive JOIN query
        query = (
            select(User)
            .where(User.id == user_id)
            .options(
                selectinload(User.portfolio)
                .selectinload(Portfolio.positions)
                .selectinload(PortfolioPosition.asset)
            )
        )
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user or not user.portfolio:
            raise HTTPException(status_code=404, detail="Portfolio not found")

        portfolio = user.portfolio
        positions = portfolio.positions

        # 2. Fetch Live Prices (Using your cached utility!)
        tickers = [pos.asset.ticker_or_isin for pos in positions if pos.asset]
        live_prices = await fetch_live_prices(tickers)

        # 3. Initialize calculation variables
        total_invested_value = 0.0
        total_pnl = 0.0
        total_cost_basis = 0.0
        holdings_data = []
        allocation_buckets = {}

        # 4. Calculate line-by-line metrics
        for pos in positions:
            if not pos.asset:
                continue
                
            ticker = pos.asset.ticker_or_isin
            current_price = live_prices.get(ticker) or pos.asset.latest_nav or pos.average_buy_price or 1.0
            
            # Math
            current_value = pos.quantity * current_price
            cost_basis = pos.quantity * pos.average_buy_price
            pnl_abs = current_value - cost_basis
            pnl_pct = (pnl_abs / cost_basis * 100) if cost_basis > 0 else 0.0

            # Accumulate totals
            total_invested_value += current_value
            total_cost_basis += cost_basis
            total_pnl += pnl_abs

            # Bucket for Pie Chart
            asset_class = pos.asset.asset_class
            allocation_buckets[asset_class] = allocation_buckets.get(asset_class, 0) + current_value

            # Build holding record
            holdings_data.append({
                "ticker": ticker,
                "name": pos.asset.name,
                "asset_class": asset_class,
                "quantity": pos.quantity,
                "average_buy_price": round(pos.average_buy_price, 2),
                "current_price": round(current_price, 2),
                "current_value": round(current_value, 2),
                "pnl_absolute": round(pnl_abs, 2),
                "pnl_percentage": round(pnl_pct, 2),
                "portfolio_weight": 0.0 # Will calculate in step 5
            })

        # 5. Calculate Final Portfolio Metrics
        total_portfolio_value = total_invested_value + portfolio.cash_balance
        total_pnl_pct = (total_pnl / total_cost_basis * 100) if total_cost_basis > 0 else 0.0

        # Calculate final weights for each holding and asset class
        if total_portfolio_value > 0:
            for h in holdings_data:
                h["portfolio_weight"] = round((h["current_value"] / total_portfolio_value) * 100, 2)
            
            # Add cash to the allocations pie chart
            allocation_buckets["CASH"] = allocation_buckets.get("CASH", 0) + portfolio.cash_balance
            allocations_pct = {k: round((v / total_portfolio_value) * 100, 2) for k, v in allocation_buckets.items()}
        else:
            allocations_pct = {"CASH": 100.0} if portfolio.cash_balance > 0 else {}

        # 6. Return the polished JSON
        return {
            "status": "success",
            "summary": {
                "total_portfolio_value": round(total_portfolio_value, 2),
                "invested_value": round(total_invested_value, 2),
                "cash_balance": round(portfolio.cash_balance, 2),
                "total_pnl_absolute": round(total_pnl, 2),
                "total_pnl_percentage": round(total_pnl_pct, 2)
            },
            "allocations": allocations_pct,
            "holdings": holdings_data
        }

    except Exception as e:
        print(f"!!! DASHBOARD ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate dashboard data")
    


@router.post("/recommend/async") 
async def get_portfolio_recommendation_async(
    request: PortfolioRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch User and Assets (Fast DB operations)
    query = select(User).where(User.id == current_user.id).options(
        selectinload(User.portfolio).selectinload(Portfolio.positions).selectinload(PortfolioPosition.asset) 
    )
    user = (await db.execute(query)).scalar_one_or_none()

    if not user or not user.portfolio:
        raise HTTPException(status_code=400, detail="User or portfolio not found")

    asset_result = await db.execute(select(Asset))
    all_assets = asset_result.scalars().all()
    available_tickers = [a.ticker_or_isin for a in all_assets if a.ticker_or_isin]
    equity_tickers = [a.ticker_or_isin for a in all_assets if a.asset_class == 'EQUITY']

    # 2. Package everything into a pure Python dictionary (JSON serializable for Redis)
    formatted_positions = []
    holdings_summary_list = []
    for pos in user.portfolio.positions:
        if pos.asset:
            ticker = pos.asset.ticker_or_isin
            formatted_positions.append({
                "ticker": ticker,
                "quantity": pos.quantity,
                "current_price": pos.asset.latest_nav or pos.average_buy_price or 1.0
            })
            holdings_summary_list.append(f"{pos.quantity} units of {ticker}")

    payload = {
        "user_id": current_user.id,
        "rra_score": user.rra_coefficient,
        "cash_available": user.portfolio.cash_balance,
        "holdings_summary": ", ".join(holdings_summary_list) or "No existing holdings.",
        "available_tickers": available_tickers,
        "equity_tickers": equity_tickers,
        "current_positions": formatted_positions
    }

    # 3. Dispatch to Celery! (.delay sends it to Redis instantly)
    task = background_portfolio_generation.delay(payload)

    # 4. Return instantly to the user
    return {
        "status": "processing",
        "message": "AI is analyzing your portfolio. This may take 10-15 seconds.",
        "task_id": task.id
    }

@router.get("/task/status/{task_id}")
async def get_task_status(task_id: str):
    """Frontend polls this endpoint to get the final JSON."""
    task_result = AsyncResult(task_id)
    
    if task_result.state == 'PENDING':
        return {"status": "processing", "message": "AI is gathering data..."}
    elif task_result.state == 'SUCCESS':
        # This returns the exact JSON dict that the Celery task returned
        return task_result.result 
    elif task_result.state == 'FAILURE':
        return {"status": "error", "message": str(task_result.info)}
    else:
        return {"status": task_result.state}