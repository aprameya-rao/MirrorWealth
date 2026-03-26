# app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import portfolio 
from app.api.v1.endpoints import auth # 1. Import your new auth router

app = FastAPI(title="MirrorWealth AI Backend")

# 2. CRITICAL: Add CORS middleware so React can talk to FastAPI
app.add_middleware(
    CORSMiddleware,
    # Update these if your React app runs on a different port (e.g., 3000 or 5173)
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Register the routes
# Note: We mount auth without a prefix so it precisely matches your frontend's fetch to "/token"
app.include_router(auth.router, tags=["Authentication"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio"])

@app.get("/")
def read_root():
    return {"message": "MirrorWealth API is online"}