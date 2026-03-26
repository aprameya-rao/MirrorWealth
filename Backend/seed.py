import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import delete
from dotenv import load_dotenv

# Import your models
from app.models.portfolio import Asset, AssetClass, InstrumentType
from app.models.base import Base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# HIGH-LIQUIDITY TICKERS (Verified for Yahoo Finance)
RAW_DATA = [
    # Equity - Large Cap
    {"ticker_or_isin": "NIFTYBEES", "name": "Nippon India ETF Nifty BeES", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 264.0},
    {"ticker_or_isin": "JUNIORBEES", "name": "Nippon India ETF Junior BeES", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 686.0},
    {"ticker_or_isin": "SETFNIF50", "name": "SBI Nifty 50 ETF", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 249.0},
    
    # Equity - Sectors & Factors
    {"ticker_or_isin": "BANKBEES", "name": "Nippon India ETF Bank BeES", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 553.0},
    {"ticker_or_isin": "ITBEES", "name": "Nippon India ETF IT BeES", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 32.0},
    {"ticker_or_isin": "CPSEETF", "name": "CPSE ETF", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 100.0},
    {"ticker_or_isin": "MAFANG", "name": "Mirae Asset NYSE FANG+ ETF", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 159.0},
    {"ticker_or_isin": "MID150BEES", "name": "Nippon India ETF Nifty Midcap 150", "asset_class": "Equity", "instrument_type": "ETF", "latest_nav": 211.0},
    
    # Commodities
    {"ticker_or_isin": "GOLDBEES", "name": "Nippon India ETF Gold BeES", "asset_class": "Commodity", "instrument_type": "ETF", "latest_nav": 119.0},
    {"ticker_or_isin": "SILVERBEES", "name": "Nippon India ETF Silver BeES", "asset_class": "Commodity", "instrument_type": "ETF", "latest_nav": 221.0},
    {"ticker_or_isin": "HDFCGOLD", "name": "HDFC Gold ETF", "asset_class": "Commodity", "instrument_type": "ETF", "latest_nav": 122.0},

    # Cash / Liquid (Crucial for the "Risk-Free Rate" calculation)
    {"ticker_or_isin": "LIQUIDBEES", "name": "Nippon India ETF Liquid BeES", "asset_class": "Cash", "instrument_type": "ETF", "latest_nav": 1000.0},
]

async def seed_assets():
    async with AsyncSessionLocal() as session:
        print("🚀 Seeding High-Liquidity Assets...")
        try:
            # We don't delete here because we already ran TRUNCATE manually
            asset_objects = []
            for item in RAW_DATA:
                ticker = f"{item['ticker_or_isin']}.NS"
                
                asset = Asset(
                    ticker_or_isin=ticker,
                    name=item["name"],
                    asset_class=AssetClass[item["asset_class"].upper()],
                    instrument_type=InstrumentType[item["instrument_type"].upper()],
                    latest_nav=float(item["latest_nav"])
                )
                asset_objects.append(asset)
            
            session.add_all(asset_objects)
            await session.commit()
            print(f"✅ Successfully seeded {len(asset_objects)} verified assets.")
        except Exception as e:
            await session.rollback()
            print(f"❌ Error: {e}")
        finally:
            await session.close()

if __name__ == "__main__":
    asyncio.run(seed_assets())