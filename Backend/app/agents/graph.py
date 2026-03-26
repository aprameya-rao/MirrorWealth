import os
from typing import TypedDict, List, Annotated
import operator
import json
import re
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage

# Import the updated tools
from .tools import fetch_live_market_news, search_vault_news, get_macro_indicators

# 1. Define the Shared State
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    sentiment_data: str
    fundamental_data: str
    rra_score: float
    optimization_constraints: dict 
    approved_asset_classes: list

# 2. Initialize the LLM (Keeping your working config)
llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0)

# --- NODE 1: Sentiment Agent (Now uses RAG + GNews) ---
async def sentiment_node(state: AgentState):
    print("--- SENTIMENT AGENT: ANALYZING VAULT + GNEWS ---")
    
    # 1. Search our high-quality internal news (Moneycontrol, etc.)
    vault_data = await search_vault_news.ainvoke("Indian Stock Market Sentiment Nifty 50")
    
    # 2. Search broad GNews as backup
    gnews_data = await  fetch_live_market_news.ainvoke("NSE Nifty India market trend")
    
    prompt = f"""
    You are a Financial News Analyst. 
    Analyze these news sources:
    
    INTERNAL VAULT (Moneycontrol/ET):
    {vault_data}
    
    EXTERNAL NEWS:
    {gnews_data}
    
    1. Determine overall Sentiment (BULLISH/BEARISH/NEUTRAL).
    2. Identify the most critical market risks.
    3. Focus heavily on Indian Rupee stability and FII flows.
    """
    
    response = await llm.ainvoke(prompt)
    clean_content = str(response.content)
    
    return {
        "sentiment_data": clean_content,
        "messages": [HumanMessage(content=f"Sentiment Analysis: {clean_content[:200]}...")]
    }


# --- NODE 2: Fundamental Agent (Now uses Real Macro Tool) ---
async def fundamental_node(state: AgentState):
    print("--- FUNDAMENTAL AGENT: ANALYZING REAL MACRO ---")
    
    # Fetch real-time (or latest tool-provided) macro stats
    macro_context = await get_macro_indicators.ainvoke({})
    
    prompt = f"""
    Given these latest Indian macro indicators: {macro_context}
    
    Provide a brief professional outlook on:
    1. Interest rate trajectory (Repo Rate).
    2. Expected impact on Equity vs Liquid/Cash assets.
    """
    response = await llm.ainvoke(prompt)
    
    return {
        "fundamental_data": str(response.content),
        "messages": [HumanMessage(content="Real-time Macro Analysis added to state.")]
    }

# --- NODE 3: Senior Agent (Synthesizer) ---
async def senior_agent_node(state: AgentState):
    print("--- SENIOR AGENT: SYNTHESIZING FINAL CONSTRAINTS ---")
    
    sentiment = state.get("sentiment_data", "Neutral")
    fundamentals = state.get("fundamental_data", "Stable")
    rra = state.get("rra_score", 5.0)
    
    prompt = f"""ACT AS A SENIOR RISK OFFICER.
    Synthesize the news sentiment and macro data for a user with Risk Score {rra}.
    (1=Aggressive/High Equity, 10=Conservative/High Cash).

    SENTIMENT: {sentiment}
    FUNDAMENTALS: {fundamentals}

    Output ONLY a JSON object:
    {{
        "equity_max": float (0.0 to 1.0),
        "cash_min": float (0.0 to 1.0),
        "approved_asset_classes": ["Equity", "Liquid Funds"],
        "rationale": "One sentence explanation"
    }}

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
        json_match = re.search(r"\{[\s\S]*\}", raw_text)
        if json_match:
            ai_data = json.loads(json_match.group(0).replace("'", '"'))
            final_constraints.update(ai_data)
            print("SUCCESS: AI constraints parsed from Real Data.")
    except Exception as e:
        print(f"ERROR: Parsing failed: {e}")

    return {
        "optimization_constraints": final_constraints, 
        "approved_asset_classes": final_constraints["approved_asset_classes"],
        "messages": [HumanMessage(content=f"Senior Decision: {final_constraints.get('rationale', 'Analysis complete.')}")]
    }

# 3. Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("sentiment_agent", sentiment_node)
workflow.add_node("fundamental_agent", fundamental_node)
workflow.add_node("senior_agent", senior_agent_node)

workflow.add_edge(START, "sentiment_agent")
workflow.add_edge("sentiment_agent", "fundamental_agent")
workflow.add_edge("fundamental_agent", "senior_agent")
workflow.add_edge("senior_agent", END)

# 4. Compile
app_graph = workflow.compile()