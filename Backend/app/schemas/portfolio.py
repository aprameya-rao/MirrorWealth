# app/schemas/portfolio.py
from pydantic import BaseModel
from typing import Dict, List

class PortfolioRequest(BaseModel):
    user_id: int
    rra_coefficient: float
    investment_amount: float

class PortfolioResponse(BaseModel):
    status: str
    recommendations: Dict[str, float]
    rationale: str
    approved_assets: List[str]