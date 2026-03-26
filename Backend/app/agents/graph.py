import os
from typing import TypedDict, List, Annotated
import operator
import json
import re
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage

# Import the live news tool we created
from .tools import fetch_live_market_news

# 1. Define the Shared State
class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    sentiment_data: str
    fundamental_data: str
    rra_score: float
    optimization_constraints: dict 
    approved_asset_classes: list

# 2. Initialize the LLM (using Gemini 2.0 Flash)
llm = ChatGoogleGenerativeAI(model="gemini-3-flash-preview", temperature=0)

# --- NODE 1: Sentiment Agent ---
def sentiment_node(state: AgentState):
    print("--- SENTIMENT AGENT: ANALYZING GNEWS ---")
    
    # Query for Indian Market news
    news_data = fetch_live_market_news("Indian Stock Market NSE Nifty")
    
    prompt = f"""
    You are a Financial News Analyst. 
    Analyze these headlines from GNews:
    {news_data}
    
    1. Determine overall Sentiment (BULLISH/BEARISH/NEUTRAL).
    2. List the 2 most critical market risks.
    3. Keep it concise.
    """
    
    response = llm.invoke(prompt)
    
    # helper to clean 2026 Gemini metadata
    def _clean(content):
        if isinstance(content, list): return content[0].get('text', '')
        return str(content)

    clean_content = _clean(response.content)
    
    return {
        "sentiment_data": clean_content,
        "messages": [HumanMessage(content=f"Sentiment Analysis: {clean_content}")]
    }


# --- NODE 2: Fundamental Agent ---
def fundamental_node(state: AgentState):
    print("--- FUNDAMENTAL AGENT: ANALYZING MACRO ---")
    
    # For now, using verified 2026 data points
    macro_context = "India Repo Rate: 5.25%, Inflation: 1.33%, GDP Growth: 7.6%."
    
    prompt = f"Given these macro stats: {macro_context}, provide a brief outlook on Equity vs Cash."
    response = llm.invoke(prompt)
    
    return {
        "fundamental_data": response.content,
        "messages": [HumanMessage(content="Fundamental Macro Analysis added to state.")]
    }

def senior_agent_node(state: AgentState):
    print("--- SENIOR AGENT: SYNTHESIZING FINAL CONSTRAINTS ---")
    
    # 1. Safely get data from state
    sentiment = state.get("sentiment_data", "Neutral")
    fundamentals = state.get("fundamental_data", "Stable")
    rra = state.get("rra_score", 5.0)
    
    # 2. DEFINE THE PROMPT (The missing piece!)
    prompt = f"""ACT AS A SENIOR RISK OFFICER.
    Based on the following data, output ONLY a JSON object for portfolio constraints.
    
    SENTIMENT: {sentiment}
    FUNDAMENTALS: {fundamentals}
    USER RISK SCORE: {rra} (1=Aggressive, 10=Conservative)

    EXPECTED OUTPUT FORMAT:
    {{
        "equity_max": 0.3,
        "cash_min": 0.7,
        "approved_asset_classes": ["Equity", "Liquid Funds"]
    }}

    STRICT: JSON ONLY. NO MARKDOWN. NO CONVERSATION."""

    # 3. Invoke LLM
    response = llm.invoke(prompt)
    
    # 4. Clean 2026 Gemini Metadata
    if isinstance(response.content, list):
        raw_text = response.content[0].get('text', '')
    else:
        raw_text = str(response.content)

    print(f"DEBUG: Senior Agent Raw Output: {raw_text[:100]}")
    # 5. Default "Emergency" Constraints (Different from 0.4/0.6 to test success)
    final_constraints = {
        "equity_max": 0.22, 
        "cash_min": 0.78, 
        "approved_asset_classes": ["Liquid Funds"]
    }
    
    try:
        # Greedily find JSON structure
        json_match = re.search(r"\{[\s\S]*\}", raw_text)
        if json_match:
            json_str = json_match.group(0).replace("'", '"')
            ai_data = json.loads(json_str)
            final_constraints.update(ai_data)
            print("SUCCESS: AI constraints parsed.")
        else:
            print("WARNING: No JSON found in response.")
            
    except Exception as e:
        print(f"ERROR: Parsing failed: {e}")

    return {
        "optimization_constraints": final_constraints, 
        "approved_asset_classes": final_constraints["approved_asset_classes"], # Use brackets here
        "messages": [HumanMessage(content=f"Senior Decision: {raw_text[:500]}")]
    }
# 3. Build the Graph
workflow = StateGraph(AgentState)

# Add our nodes
workflow.add_node("sentiment_agent", sentiment_node)
workflow.add_node("fundamental_agent", fundamental_node)
workflow.add_node("senior_agent", senior_agent_node)

# Define the flow
workflow.add_edge(START, "sentiment_agent")
workflow.add_edge("sentiment_agent", "fundamental_agent")
workflow.add_edge("fundamental_agent", "senior_agent")
workflow.add_edge("senior_agent", END)

# 4. Compile the Graph
app_graph = workflow.compile()