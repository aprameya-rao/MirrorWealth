import os
import json
import re
import operator
from typing import TypedDict, List, Annotated
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage

# 1. Imports from your custom modules
from .tools import fetch_live_market_news, search_vault_news, get_macro_indicators
from app.quant.bt_engine import run_bt_backtest
from app.quant.tax_engine import get_tax_harvesting_opportunities # Ensure this exists

# 2. Define the Shared State (Corrected Types)
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    sentiment_data: str
    fundamental_data: str
    rra_score: float
    backtest_stats: dict        
    tax_report: list           
    optimization_constraints: dict 
    approved_asset_classes: list

# 3. Initialize LLM
llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0)

# --- NODES ---

async def sentiment_node(state: AgentState):
    print("--- SENTIMENT AGENT: ANALYZING VAULT + GNEWS ---")
    vault_data = await search_vault_news.ainvoke("Indian Stock Market Sentiment Nifty 50")
    gnews_data = await fetch_live_market_news.ainvoke("NSE Nifty India market trend")
    
    prompt = f"Analyze market sentiment based on: \nVAULT: {vault_data}\nGNEWS: {gnews_data}"
    response = await llm.ainvoke(prompt)
    
    return {
        "sentiment_data": str(response.content),
        "messages": [HumanMessage(content="Sentiment analyzed.")]
    }

async def fundamental_node(state: AgentState):
    print("--- FUNDAMENTAL AGENT: ANALYZING REAL MACRO ---")
    macro_context = await get_macro_indicators.ainvoke({})
    prompt = f"Analyze Indian Repo Rate impact: {macro_context}"
    response = await llm.ainvoke(prompt)
    
    return {
        "fundamental_data": str(response.content),
        "messages": [HumanMessage(content="Macro analyzed.")]
    }

async def tax_analyzer_node(state: AgentState):
    print("--- TAX ANALYST: CHECKING HARVESTING OPPORTUNITIES ---")
    # This should eventually pull from state['portfolio_data']
    opportunities = [] # Logic to find losses > 1%
    return {"tax_report": opportunities}

async def backtest_node(state: AgentState):
    print("--- QUANT ANALYST: RUNNING BT BACKTEST ---")
    # We use the updated bt_engine.py here
    res = await run_bt_backtest(
        tickers=["NIFTYBEES.NS", "LIQUIDBEES.NS"],
        weights={"NIFTYBEES.NS": 0.6, "LIQUIDBEES.NS": 0.4},
        start_date="2023-01-01"
    )
    # This dictionary 'res' is passed directly to the state
    return {"backtest_stats": res}

async def senior_agent_node(state: AgentState):
    print("--- SENIOR AGENT: SYNTHESIZING FINAL CONSTRAINTS ---")
    
    # CRITICAL: We now feed the Tax and Backtest data into the LLM
    sentiment = state.get("sentiment_data", "")
    backtest = state.get("backtest_stats", {})
    tax = state.get("tax_report", [])
    rra = state.get("rra_score", 5.0)

    prompt = f"""ACT AS A SENIOR RISK OFFICER.
    
    USER RISK SCORE: {rra} (1=Aggressive, 10=Conservative)
    MARKET SENTIMENT: {sentiment}
    
    BACKTEST RESULTS FOR PROPOSED 60/40 SPLIT:
    - Total Return: {backtest.get('total_return')}%
    - Sharpe Ratio: {backtest.get('sharpe')}
    - Max Drawdown: {backtest.get('max_drawdown')}%
    
    TAX OPPORTUNITIES: {tax}

    Output ONLY a JSON object:
    {{
        "equity_max": float (0.0 to 1.0),
        "cash_min": float (0.0 to 1.0),
        "approved_asset_classes": ["Equity", "Liquid Funds"],
        "tax_alpha_comment": "One sentence on tax savings",
        "rationale": "One sentence explanation connecting Backtest stats to Sentiment"
    }}
    "IMPORTANT: Use only double quotes for the JSON. Do not use apostrophes or single quotes inside the text strings (e.g., instead of 'It's', use 'It is')."
    STRICT: JSON ONLY. NO MARKDOWN."""

    response = await llm.ainvoke(prompt)
    raw_text = str(response.content)

    # Default Fallbacks
    final_constraints = {
        "equity_max": 0.5, 
        "cash_min": 0.5, 
        "approved_asset_classes": ["Equity", "Liquid Funds"]
    }
    
    try:
        # 1. Strip markdown backticks if they exist
        clean_text = raw_text.replace("```json", "").replace("```", "").strip()
        
        # 2. Find the first '{' and last '}'
        start_idx = clean_text.find('{')
        end_idx = clean_text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            json_str = clean_text[start_idx:end_idx+1]
            # Use json.loads on the sliced string
            ai_data = json.loads(json_str)
            final_constraints.update(ai_data)
            print("SUCCESS: AI constraints parsed perfectly.")
    except Exception as e:
        print(f"PARSING ERROR: {e} | Raw Text: {raw_text[:100]}")
    
    
    return {
        "optimization_constraints": final_constraints,
        "messages": [HumanMessage(content=f"Senior Decision finalized based on Backtest & Tax.")]
    }

# --- BUILD GRAPH ---

workflow = StateGraph(AgentState)

workflow.add_node("sentiment_agent", sentiment_node)
workflow.add_node("fundamental_agent", fundamental_node)
workflow.add_node("tax_analyzer", tax_analyzer_node)
workflow.add_node("backtester", backtest_node)
workflow.add_node("senior_agent", senior_agent_node)

# Flow: Parallel/Sequential logic
workflow.add_edge(START, "sentiment_agent")
workflow.add_edge("sentiment_agent", "fundamental_agent")
workflow.add_edge("fundamental_agent", "tax_analyzer")
workflow.add_edge("tax_analyzer", "backtester")
workflow.add_edge("backtester", "senior_agent")
workflow.add_edge("senior_agent", END)

app_graph = workflow.compile()