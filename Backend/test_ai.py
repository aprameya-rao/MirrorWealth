# test_ai.py
import os
from dotenv import load_dotenv

# 1. ALWAYS LOAD ENVIRONMENT VARIABLES FIRST
# This ensures your API keys are active before LangChain tries to boot up
load_dotenv()

# 2. Import your AI Graph and Math Engine
from app.agents.graph import app_graph
from app.quant.mvo import generate_optimal_weights

# 3. Simulate a new user who just finished the onboarding questionnaire
initial_state = {
    "user_id": 1,
    "rra_coefficient": 8.5,  # 8.5 indicates a highly conservative investor
    "investment_amount": 100000.0,
    "messages": []
}

print("Starting the SIP Recommendation Engine...\n")

# 4. Run the AI Agents (Phase 4)
final_state = app_graph.invoke(initial_state)

print("\n=== FINAL AI OUTPUT ===")
approved_classes = final_state['approved_asset_classes']
constraints = final_state['optimization_constraints']

print(f"Approved Asset Classes: {approved_classes}")
print(f"Mathematical Constraints: {constraints}")
print(f"Rationale: {final_state['messages'][-1]}")

# 5. Run the Quantitative Math Engine (Phase 3)
print("\n=== QUANTITATIVE EXECUTION ===")
try:
    # Pass the AI's exact constraints into Markowitz Optimization
    optimal_weights = generate_optimal_weights(approved_classes, constraints)
    
    print("\n✅ Final Target Portfolio Allocation:")
    for ticker, weight in optimal_weights.items():
        percentage = weight * 100
        # Only print assets that actually got an allocation
        if percentage > 0.01: 
            print(f"- {ticker}: {percentage:.2f}%")
            
except Exception as e:
    print(f"\n❌ Quant Engine Failed: {e}")
    print("Check your terminal for yfinance download errors or math constraint conflicts.")