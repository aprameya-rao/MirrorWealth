# seed.py
import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Import your models
from app.models.user import User
from app.models.portfolio import Asset, Portfolio, PortfolioPosition, AssetClass, InstrumentType

# Load environment variables
load_dotenv()

async def seed_database():
    print("🌱 Starting database seed...")
    
    # 1. Connect to the database
    db_url = os.getenv("DATABASE_URL")
    engine = create_async_engine(db_url, connect_args={"prepared_statement_cache_size": 0})
    AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with AsyncSessionLocal() as session:
        try:
            # 2. Create the Universe of Assets
            print("Injecting Assets...")
            nifty_etf = Asset(
                ticker_or_isin="NIFTYBEES.NS",
                name="Nippon India Nifty 50 BeES ETF",
                asset_class=AssetClass.EQUITY,
                instrument_type=InstrumentType.ETF,
                latest_nav=250.50
            )
            liquid_etf = Asset(
                ticker_or_isin="LIQUIDBEES.NS",
                name="Nippon India ETF Liquid BeES",
                asset_class=AssetClass.CASH,
                instrument_type=InstrumentType.ETF,
                latest_nav=1000.00
            )
            session.add_all([nifty_etf, liquid_etf])
            await session.commit() # Commit to generate their IDs

            # 3. Create the Test User
            print("Injecting Test User...")
            test_user = User(
                email="test_user@mirrorwealth.com",
                full_name="Arjun Developer",
                rra_coefficient=4.5 # Moderately aggressive
            )
            session.add(test_user)
            await session.commit()

            # 4. Create their Portfolio (with ₹50,000 uninvested cash)
            print("Injecting Portfolio...")
            test_portfolio = Portfolio(
                user_id=test_user.id,
                cash_balance=50000.0 
            )
            session.add(test_portfolio)
            await session.commit()

            # 5. Give them some existing holdings
            print("Injecting Existing Holdings...")
            pos1 = PortfolioPosition(
                portfolio_id=test_portfolio.id,
                asset_id=nifty_etf.id,
                quantity=100.0,
                average_buy_price=240.0,
                target_weight=0.0,
                current_weight=0.0
            )
            pos2 = PortfolioPosition(
                portfolio_id=test_portfolio.id,
                asset_id=liquid_etf.id,
                quantity=20.0,
                average_buy_price=1000.0,
                target_weight=0.0,
                current_weight=0.0
            )
            session.add_all([pos1, pos2])
            await session.commit()

            print("✅ Database successfully seeded!")
            print(f"👉 User ID to use in Postman/Swagger: {test_user.id}")

        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            await session.rollback()
        finally:
            await session.close()
            await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_database())