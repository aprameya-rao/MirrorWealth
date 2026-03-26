# app/models/__init__.py
from .base import Base
from .user import User, RiskProfile  # RiskProfile is here
from .portfolio import Portfolio, Asset, PortfolioPosition, PortfolioHistory, RiskQuestion # RiskProfile removed from here
from .news import NewsArticle

__all__ = [
    "Base", 
    "User", 
    "Portfolio", 
    "Asset", 
    "PortfolioPosition", 
    "PortfolioHistory",
    "RiskProfile",
    "RiskQuestion", 
    "NewsArticle"
]