# app/api/v1/endpoints/auth.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.db import get_db
from app.models.user import User, RiskProfile
from app.schemas.user import UserCreate, UserResponse 

from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # 1. ASYNC: Check if email exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 2. Hash password
    hashed_pw = get_password_hash(user_in.password)
    
    # 3. Calculate baseline RRA
    total_score = (
        user_in.risk_answers.time_horizon_score + 
        user_in.risk_answers.liquidity_score + 
        user_in.risk_answers.loss_tolerance_score
    )
    calculated_rra = max(2.0, 12.0 - (total_score * 0.66))

    # 4. Save User to DB
    new_user = User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        rra_coefficient=calculated_rra
    )
    db.add(new_user)
    await db.commit() 
    await db.refresh(new_user) 
    
    # 5. Save Risk Profile to DB
    new_risk_profile = RiskProfile(
        user_id=new_user.id,
        time_horizon_score=user_in.risk_answers.time_horizon_score,
        liquidity_score=user_in.risk_answers.liquidity_score,
        loss_tolerance_score=user_in.risk_answers.loss_tolerance_score
    )
    db.add(new_risk_profile)
    await db.commit() 

    return new_user


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db) 
):
    # 1. ASYNC: Find user
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalars().first()

    # 2. Verify password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generate Access Token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, 
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }