# app/models/portfolio.py
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from .base import Base

# --- Enums ---
class AssetClass(str, enum.Enum):
    EQUITY = "equity"
    FIXED_INCOME = "fixed_income"
    COMMODITY = "commodity"
    CASH = "cash"

class InstrumentType(str, enum.Enum):
    ETF = "etf"
    MUTUAL_FUND = "mutual_fund"
    STOCK = "stock"

# --- Models ---
class Asset(Base):
    """The universe of available SIPs/ETFs."""
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    ticker_or_isin: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    asset_class: Mapped[AssetClass] = mapped_column(SQLEnum(AssetClass))
    instrument_type: Mapped[InstrumentType] = mapped_column(SQLEnum(InstrumentType))
    latest_nav: Mapped[Optional[float]] = mapped_column(Float) # Updated by Celery


class Portfolio(Base):
    """The user's master portfolio record."""
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    # ADDED: To track uninvested money the AI can deploy
    cash_balance: Mapped[float] = mapped_column(Float, default=0.0) 
    
    last_rebalanced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    user: Mapped["User"] = relationship(back_populates="portfolio")
    positions: Mapped[List["PortfolioPosition"]] = relationship(back_populates="portfolio", cascade="all, delete-orphan")


class PortfolioPosition(Base):
    """Individual line items. Crucial for the 5/25 Rebalancing Strategy."""
    __tablename__ = "portfolio_positions"

    id: Mapped[int] = mapped_column(primary_key=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"))
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"))
    
    # ADDED: Actual ownership metrics
    quantity: Mapped[float] = mapped_column(Float, default=0.0)
    average_buy_price: Mapped[float] = mapped_column(Float, default=0.0)

    target_weight: Mapped[float] = mapped_column(Float, default=0.0)
    current_weight: Mapped[float] = mapped_column(Float, default=0.0) 

    portfolio: Mapped["Portfolio"] = relationship(back_populates="positions")
    asset: Mapped["Asset"] = relationship()