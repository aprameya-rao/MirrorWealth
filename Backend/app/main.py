# app/main.py
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from app.api.v1.endpoints import portfolio # Import your new router

app = FastAPI(title="MirrorWealth AI Backend")

# Register the route
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio"])

@app.get("/")
def read_root():
    return {"message": "MirrorWealth API is online"}