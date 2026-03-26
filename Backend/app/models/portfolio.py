from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from app.models.base import Base

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User

# --- Enums ---
class AssetClass(str, enum.Enum):
    EQUITY = "EQUITY"
    FIXED_INCOME = "FIXED_INCOME"
    COMMODITY = "COMMODITY"
    CASH = "CASH"

class InstrumentType(str, enum.Enum):
    ETF = "ETF"
    MUTUAL_FUND = "MUTUAL_FUND"
    STOCK = "STOCK"

# --- Models ---
class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    ticker_or_isin: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    asset_class: Mapped[AssetClass] = mapped_column(SQLEnum(AssetClass), nullable=False)
    instrument_type: Mapped[InstrumentType] = mapped_column(SQLEnum(InstrumentType), nullable=False)
    latest_nav: Mapped[Optional[float]] = mapped_column(Float, nullable=True)


class Portfolio(Base):
    __tablename__ = "portfolios"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    
    # Supabase expects DOUBLE PRECISION NOT NULL
    cash_balance: Mapped[float] = mapped_column(Float, default=0.0, nullable=False) 
    last_rebalanced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    user: Mapped["User"] = relationship("app.models.user.User", back_populates="portfolio")
    positions: Mapped[List["PortfolioPosition"]] = relationship(
        "PortfolioPosition", 
        back_populates="portfolio", 
        cascade="all, delete-orphan"
    )

class PortfolioPosition(Base):
    __tablename__ = "portfolio_positions"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), nullable=False)
    
    # All of these must be NOT NULL according to your inspector
    quantity: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    average_buy_price: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    target_weight: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    current_weight: Mapped[float] = mapped_column(Float, default=0.0, nullable=False) 

    portfolio: Mapped["Portfolio"] = relationship("Portfolio", back_populates="positions")
    asset: Mapped["Asset"] = relationship("Asset")


class PortfolioHistory(Base):
    __tablename__ = "portfolio_history"
    __table_args__ = {'extend_existing': True}

    id: Mapped[int] = mapped_column(primary_key=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolios.id"), nullable=False)
    
    total_value: Mapped[float] = mapped_column(Float, nullable=False)
    cash_flow: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    snapshot_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    portfolio: Mapped["Portfolio"] = relationship("Portfolio")


class RiskQuestion(Base):
    __tablename__ = "risk_questions"
    
    # Use lowercase primary_key=True inside Column()
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(String, nullable=False)
    category = Column(String) 
    options = Column(JSON)    
    weight = Column(Float, default=1.0)

