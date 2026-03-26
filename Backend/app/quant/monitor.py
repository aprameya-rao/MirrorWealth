from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models import User, Portfolio, PortfolioPosition
from app.utils.market_data import fetch_live_prices

async def check_portfolio_drift(db: AsyncSession):
    """
    Scans all portfolios to find those deviating from their target weights.
    """
    # 1. Fetch all users with their positions and assets
    query = select(User).options(
        selectinload(User.portfolio).selectinload(Portfolio.positions).selectinload(PortfolioPosition.asset)
    )
    result = await db.execute(query)
    users = result.scalars().all()

    alerts = []

    for user in users:
        if not user.portfolio or not user.portfolio.positions:
            continue
            
        # 2. Get Live Prices for all assets in this portfolio
        tickers = [p.asset.ticker_or_isin for p in user.portfolio.positions if p.asset]
        prices = await fetch_live_prices(tickers)

        # 3. Calculate Current Total Value
        total_market_value = user.portfolio.cash_balance
        for pos in user.portfolio.positions:
            price = prices.get(pos.asset.ticker_or_isin, pos.asset.latest_nav or 0)
            total_market_value += (pos.quantity * price)

        # 4. Check for Drift
        for pos in user.portfolio.positions:
            price = prices.get(pos.asset.ticker_or_isin, 0)
            current_weight = (pos.quantity * price) / total_market_value if total_market_value > 0 else 0
            
            drift = abs(current_weight - pos.target_weight)
            
            # TRIGGER: If drift > 5% absolute
            if drift > 0.05:
                alerts.append({
                    "user_id": user.id,
                    "ticker": pos.asset.ticker_or_isin,
                    "target": pos.target_weight,
                    "current": current_weight,
                    "action_required": "REBALANCE"
                })

    return alerts