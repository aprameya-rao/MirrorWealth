# app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.api.v1.endpoints import portfolio ,risk
from fastapi_utils.tasks import repeat_every
from app.core.db import SessionLocal
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime
from app.quant.monitor import check_portfolio_drift
from app.core.db import SessionLocal
from app.models import Portfolio, PortfolioPosition, PortfolioHistory
from app.utils.market_data import fetch_live_prices

app = FastAPI(title="MirrorWealth AI Backend")


@app.on_event("startup")
@repeat_every(seconds=60 * 60 * 24)  # Runs every 24 hours
async def record_daily_snapshots():
    """
    Background task to calculate and save the Total Value of all user portfolios.
    """
    async with SessionLocal() as db:
        print(f"--- [SNAPSHOT START] {datetime.now()} ---")
        
        # 1. Fetch all portfolios with their positions and asset tickers
        query = select(Portfolio).options(
            selectinload(Portfolio.positions).selectinload(PortfolioPosition.asset)
        )
        result = await db.execute(query)
        portfolios = result.scalars().all()

        # 2. Collect all unique tickers to fetch prices in one batch (Efficiency!)
        all_tickers = set()
        for p in portfolios:
            for pos in p.positions:
                if pos.asset:
                    all_tickers.add(pos.asset.ticker_or_isin)

        # 3. Fetch Live Market Prices
        live_prices = await fetch_live_prices(list(all_tickers))

        # 4. Calculate and Save for each portfolio
        for p in portfolios:
            market_value_of_assets = 0.0
            
            for pos in p.positions:
                ticker = pos.asset.ticker_or_isin if pos.asset else None
                price = live_prices.get(ticker) or pos.asset.latest_nav or 0.0
                market_value_of_assets += (pos.quantity * price)

            total_portfolio_value = p.cash_balance + market_value_of_assets

            # Create the history entry
            history_entry = PortfolioHistory(
                portfolio_id=p.id,
                total_value=total_portfolio_value,
                cash_flow=0.0, # This would be populated if a deposit happened today
                snapshot_date=datetime.utcnow()
            )
            db.add(history_entry)

        try:
            await db.commit()
            print(f"--- [SNAPSHOT SUCCESS] Recorded {len(portfolios)} portfolios ---")
        except Exception as e:
            await db.rollback()
            print(f"--- [SNAPSHOT ERROR] {str(e)} ---")


# Register the route
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio"])
app.include_router(risk.router, prefix="/risk", tags=["Risk"])

@app.get("/")
def read_root():
    return {"message": "MirrorWealth API is online"}