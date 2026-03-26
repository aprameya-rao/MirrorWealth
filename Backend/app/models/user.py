# app/models/user.py
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String)
    
    # Mathematical output from your Psychometric Scoring Algorithm
    rra_coefficient: Mapped[Optional[float]] = mapped_column(Float) 
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships (Using strings for type hinting prevents circular imports)
    risk_profile: Mapped["RiskProfile"] = relationship(back_populates="user", uselist=False)
    portfolio: Mapped["Portfolio"] = relationship(back_populates="user", uselist=False)


class RiskProfile(Base):
    """Stores the raw questionnaire answers to recalculate RRA if needed."""
    __tablename__ = "risk_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    
    time_horizon_score: Mapped[int] = mapped_column(Integer)
    liquidity_score: Mapped[int] = mapped_column(Integer)
    loss_tolerance_score: Mapped[int] = mapped_column(Integer)
    
    user: Mapped["User"] = relationship(back_populates="risk_profile")