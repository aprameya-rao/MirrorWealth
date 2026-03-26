# app/models/__init__.py

from .base import Base
from .user import User, RiskProfile
from .portfolio import Asset, Portfolio, PortfolioPosition, AssetClass, InstrumentType
from .vectors import MarketSentiment
from .news import NewsArticle
# This ensures all models are loaded into the Base.metadata registry