# app/schemas/portfolio.py
from pydantic import BaseModel
from typing import Dict, List

# 1. The Request Model
class PortfolioRequest(BaseModel):
    # We only need the user_id now; the backend securely fetches the rest!
    pass

# 2. Sub-Models for the Response
class PortfolioSummary(BaseModel):
    total_value: float
    projected_cash_balance: float

class OrderDetails(BaseModel):
    action: str  # e.g., "BUY", "SELL", or "HOLD"
    units: float
    current_price: float
    target_weight_percentage: float

# 3. The Ultimate Response Model
class PortfolioResponse(BaseModel):
    status: str
    portfolio_summary: PortfolioSummary
    
    # A dictionary mapping tickers (e.g., "NIFTYBEES.NS") to their exact order instructions
    recommendations: Dict[str, OrderDetails] 
    
    rationale: str
    approved_assets: List[str]


class AnswerSubmission(BaseModel):
    question_id: int
    selected_score: int

class RiskAssessmentRequest(BaseModel):
    answers: List[AnswerSubmission]