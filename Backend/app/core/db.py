# app/core/db.py
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import pool
from dotenv import load_dotenv

# IMPORTANT: Import the Base that your models are using. 
# Based on your file structure, it's in app/models/base.py
from app.models.base import Base 

load_dotenv()

engine = create_async_engine(
    os.getenv("DATABASE_URL"), 
    poolclass=pool.NullPool,
    connect_args={
        "prepared_statement_cache_size": 0,
        "statement_cache_size": 0
    } 
)

# Use sessionmaker (or async_sessionmaker if using SQLAlchemy 2.0)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session