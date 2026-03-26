# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class RiskQuestionnaire(BaseModel):
    """Expects scores from 1 to 5 from the frontend UI"""
    time_horizon_score: int 
    liquidity_score: int    
    loss_tolerance_score: int 

class UserCreate(BaseModel):
    """What the React frontend sends us when a user signs up"""
    email: EmailStr
    password: str
    full_name: str
    risk_answers: RiskQuestionnaire

class UserResponse(BaseModel):
    """What we send back to the frontend (excludes sensitive data, includes RRA)"""
    id: int
    email: EmailStr
    full_name: str
    rra_coefficient: Optional[float]

    class Config:
        from_attributes = True # Tells Pydantic to read SQLAlchemy models