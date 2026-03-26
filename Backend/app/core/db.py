# app/core/db.py
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import pool
from dotenv import load_dotenv

# Import the Base that your models are using
from app.models.base import Base 

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# The ultimate Supabase-compatible engine
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, 
    echo=False,
    poolclass=pool.NullPool, # Critical for Supabase connection pooler
    connect_args={
        "prepared_statement_cache_size": 0, # Prevents prepared statement errors
        "statement_cache_size": 0
    } 
)

# Modern SQLAlchemy 2.0 Async Session Maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False,
    autocommit=False, 
    autoflush=False
)

# Async Dependency to inject DB sessions into our routes
async def get_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()