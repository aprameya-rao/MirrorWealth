# app/models/news.py
from sqlalchemy import Column, Integer, String, Text, DateTime
from pgvector.sqlalchemy import Vector
from datetime import datetime, timezone
from app.models.base import Base # Adjust import if your Base is elsewhere

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    source = Column(String, nullable=False)
    published_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # 768 dimensions is standard for Google/OpenAI embeddings. 
    # Change to 1536 if using OpenAI's text-embedding-ada-002, or 768 for Google's text-embedding-004
    embedding = Column(Vector(3072))