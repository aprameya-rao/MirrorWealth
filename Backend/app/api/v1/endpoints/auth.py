from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr

from app.core.db import get_db
from app.models import User
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user  # ✅ Add this line!

router = APIRouter()

# --- Temporary Schemas (Move to app/schemas/user.py later) ---
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
# -------------------------------------------------------------

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """Creates a new user and returns a JWT token immediately."""
    # Check if user exists
    stmt = select(User).where(User.email == user_in.email)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Hash password and save
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        email=user_in.email, 
        full_name=user_in.full_name, 
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate token
    token = create_access_token(subject=new_user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: AsyncSession = Depends(get_db)
):
    """Authenticates a user and returns a JWT token."""
    # Note: OAuth2PasswordRequestForm expects 'username' and 'password'
    # We will treat the 'username' field as the user's email.
    stmt = select(User).where(User.email == form_data.username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/auth/me")
async def get_current_user(current_user: User= Depends(get_current_user)):
    return current_user