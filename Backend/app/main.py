# app/main.py
from fastapi import FastAPI
from app.api.v1 import users

app = FastAPI(
    title="Personalized SIP Engine API",
    description="Backend for AI-driven portfolio allocation and dynamic rebalancing.",
    version="1.0.0"
)

# Include the users router
app.include_router(users.router, prefix="/api/v1/users", tags=["User Onboarding"])

@app.get("/health")
async def health_check():
    return {"status": "System Online", "agents": "Standing by"}