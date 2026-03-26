# app/models/vectors.py
from datetime import datetime
from sqlalchemy import ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector

from .base import Base

class MarketSentiment(Base):
    """Vector database table for the Sentiment and Fundamental Agents."""
    __tablename__ = "market_sentiments"

    id: Mapped[int] = mapped_column(primary_key=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"))
    
    # Raw text scraped from news/earnings calls
    context_text: Mapped[str] = mapped_column(Text)
    
    # Embedding representation (1536 is standard for OpenAI/Gemini models)
    embedding: Mapped[Vector] = mapped_column(Vector(1536)) 
    
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)