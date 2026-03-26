# app/api/v1/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db

# Adjust these imports based on your actual file structure
from app.models.models import User, RiskProfile 
from app.schemas.user import UserCreate, UserResponse
from app.quant.risk_scoring import calculate_rra

router = APIRouter()

@router.post("/onboard", response_model=UserResponse)
async def onboard_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    
    # 1. Calculate the RRA mathematically
    rra = calculate_rra(
        time_score=user_in.risk_answers.time_horizon_score,
        liquidity_score=user_in.risk_answers.liquidity_score,
        loss_tolerance_score=user_in.risk_answers.loss_tolerance_score
    )

    # 2. Save the User record with the calculated RRA
    new_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        rra_coefficient=rra
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user) # Get the DB-generated ID

    # 3. Save the raw questionnaire answers for audit/re-evaluation purposes
    new_profile = RiskProfile(
        user_id=new_user.id,
        time_horizon_score=user_in.risk_answers.time_horizon_score,
        liquidity_score=user_in.risk_answers.liquidity_score,
        loss_tolerance_score=user_in.risk_answers.loss_tolerance_score
    )
    db.add(new_profile)
    await db.commit()

    return new_user