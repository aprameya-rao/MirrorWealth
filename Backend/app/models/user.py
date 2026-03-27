# app/models/user.py
from datetime import datetime
from typing import Optional
from typing import Optional, TYPE_CHECKING
from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum as SQLEnum

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.portfolio import Portfolio

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String)
    
    # Mathematical output from your Psychometric Scoring Algorithm
    rra_coefficient: Mapped[Optional[float]] = mapped_column(Float) 
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships (Using strings for type hinting prevents circular imports)
    risk_profile: Mapped["RiskProfile"] = relationship(back_populates="user", uselist=False)
    portfolio: Mapped["Portfolio"] = relationship(
        "app.models.portfolio.Portfolio", 
        back_populates="user", 
        uselist=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    risk_profile = relationship("RiskProfile", back_populates="user", uselist=False)


class RiskProfile(Base):
    __tablename__ = "risk_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    total_risk_score = Column(Integer, default=0)
    rra_coefficient = Column(Float, default=4.5)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="risk_profile")