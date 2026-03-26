# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.core.db import engine
from app.models.base import Base # Import your declarative base
from app.models import user      # Import models to ensure they are registered before create_all
from app.api.v1.endpoints import auth

# Async lifespan context to create tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        # Run the synchronous table creation inside this async wrapper
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title="MirrorWealth AI Backend", lifespan=lifespan)

# Setup CORS so your React frontend can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your React dev server port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your authentication routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])