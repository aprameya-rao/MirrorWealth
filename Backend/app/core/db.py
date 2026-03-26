# app/core/db.py
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# Load environment variables from the .env file
load_dotenv()

# Fetch the URL securely. 
# It will throw an error if you forgot to create the .env file.
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set. Please check your .env file.")

# Create the async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create a session factory
AsyncSessionLocal = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Dependency injection for FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session