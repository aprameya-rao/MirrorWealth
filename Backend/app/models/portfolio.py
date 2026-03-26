from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User

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
    __tablename__ = "assets"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    ticker_or_isin: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    asset_class: Mapped[AssetClass] = mapped_column(SQLEnum(AssetClass))
    instrument_type: Mapped[InstrumentType] = mapped_column(SQLEnum(InstrumentType))
    latest_nav: Mapped[Optional[float]] = mapped_column(Float)


class Portfolio(Base):
    """The user's master portfolio record."""
    __tablename__ = "portfolios"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    # --- THIS LINE IS MISSING OR MISSPELLED IN YOUR CURRENT FILE ---
    cash_balance: Mapped[float] = mapped_column(Float, default=0.0) 
    # ---------------------------------------------------------------
    
    last_rebalanced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    user: Mapped["User"] = relationship("app.models.user.User", back_populates="portfolio")
    positions: Mapped[List["PortfolioPosition"]] = relationship(
        "app.models.portfolio.PortfolioPosition", 
        back_populates="portfolio", 
        cascade="all, delete-orphan"
    )

class PortfolioPosition(Base):
    """Individual line items. Crucial for the 5/25 Rebalancing Strategy."""
    __tablename__ = "portfolio_positions"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"))
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"))
    
    # --- ADDED TO MATCH YOUR SUPABASE SCREENSHOT ---
    quantity: Mapped[float] = mapped_column(Float, default=0.0)
    average_buy_price: Mapped[float] = mapped_column(Float, default=0.0)
    target_weight: Mapped[float] = mapped_column(Float, default=0.0)
    current_weight: Mapped[float] = mapped_column(Float, default=0.0) 
    # -----------------------------------------------

    # Relationships using fully qualified module paths
    portfolio: Mapped["Portfolio"] = relationship(
        "app.models.portfolio.Portfolio", 
        back_populates="positions"
    )
    asset: Mapped["Asset"] = relationship("app.models.portfolio.Asset")