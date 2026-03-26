from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage
from app.schemas.portfolio import PortfolioRequest, PortfolioResponse
from app.agents.graph import app_graph

router = APIRouter()

@router.post("/recommend", response_model=PortfolioResponse)
async def get_portfolio_recommendation(request: PortfolioRequest):
    try:
        # 1. Initialize State for the Graph
        # Ensure 'rra_score' matches the key used in senior_agent_node
        initial_state = {
            "rra_score": request.rra_coefficient,
            "messages": [HumanMessage(content=f"Generate portfolio for risk {request.rra_coefficient}")]
        }

        final_state = app_graph.invoke(initial_state)
        
        # 2. DEBUG PRINT (This will tell us exactly what keys are in the state)
        print(f"DEBUG: All Keys in Final State: {final_state.keys()}")

        # 3. Flexible extraction
        # Try both common names for the constraints key
        ai_data = final_state.get("optimization_constraints") or final_state.get("constraints") or {}
        
        equity_val = ai_data.get("equity_max")
        cash_val = ai_data.get("cash_min")
        
        # If the AI failed to parse, or provided nothing, use emergency fallbacks
        # (I've set these to 0.1 / 0.9 so you can easily see if it failed in Swagger)
        if equity_val is None:
            print("--- WARNING: AI failed to provide equity_max. Using Emergency Fallback. ---")
            equity_val = 0.1
        if cash_val is None:
            cash_val = 0.9

        # 5. Extract and Clean the Rationale
        # We look for the most detailed message in the history
        messages = final_state.get("messages", [])
        clean_texts = [m.content for m in messages if isinstance(m.content, str)]
        
        # Pick the longest text (usually the Senior Agent's detailed logic)
        rationale = max(clean_texts, key=len) if clean_texts else "Analysis complete."

        # 6. Map to Final Recommendations
        # This maps the AI's logic directly to the tickers
        optimal_weights = {
            "NIFTYBEES.NS": round(float(equity_val), 2),
            "LIQUIDBEES.NS": round(float(cash_val), 2)
        }

        # 7. Extract Approved Assets
        approved_assets = final_state.get("approved_asset_classes", ["Equity", "Liquid Funds"])

        return {
            "status": "success",
            "recommendations": optimal_weights,
            "rationale": rationale,
            "approved_assets": approved_assets
        }

    except Exception as e:
        # Detailed logging for the terminal
        print(f"!!! CRITICAL API ERROR: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal Portfolio Engine Error: {str(e)}"
        )