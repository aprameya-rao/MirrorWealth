# app/agents/nodes.py
from typing import Literal
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState
from .tools import fetch_economic_indicators, fetch_market_sentiment, fetch_historical_valuations
import os
from pydantic import BaseModel, Field
import json
# Initialize the LLM (You can swap this for ChatGoogleGenerativeAI if using Gemini)
# Make sure OPENAI_API_KEY is in your .env file
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)

def fundamental_node(state: AgentState):
    """Analyzes the macro environment."""
    print("--- FUNDAMENTAL AGENT WORKING ---")
    
    # 1. Agent uses its tool to get raw data
    raw_data = fetch_economic_indicators.invoke({"region": "India"})
    
    # 2. Agent analyzes the data in the context of the user
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Fundamental Macroeconomist. Analyze the provided economic data and summarize how it should impact a portfolio for an investor with a Relative Risk Aversion (RRA) of {rra}. Keep it to 3 sentences."),
        ("user", "Economic Data: {data}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "rra": state["rra_coefficient"], 
        "data": raw_data
    })
    
    # 3. Return the updated state
    return {"fundamental_analysis": response.content}

def sentiment_node(state: AgentState):
    """Analyzes market mood and news."""
    print("--- SENTIMENT AGENT WORKING ---")
    
    raw_data = fetch_market_sentiment.invoke({"asset_category": "Indian Equity & Debt"})
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a Quantitative Sentiment Analyst. Based on the news data, identify the current market mood. Warn about any irrational exuberance or panic. RRA is {rra}."),
        ("user", "Sentiment Data: {data}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "rra": state["rra_coefficient"],
        "data": raw_data
    })
    
    return {"sentiment_analysis": response.content}

def valuation_node(state: AgentState):
    """Analyzes mathematical pricing models."""
    print("--- VALUATION AGENT WORKING ---")
    
    raw_data = fetch_historical_valuations.invoke({"index_name": "NIFTY 50"})
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a strict Valuation Actuary. Compare current metrics to historical norms. Advise if the market is cheap or expensive. User RRA is {rra}."),
        ("user", "Valuation Data: {data}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "rra": state["rra_coefficient"],
        "data": raw_data
    })
    
    return {"valuation_analysis": response.content}

AllowedAssets = Literal["Large Cap Equity", "Government Bonds"]

class PortfolioConstraints(BaseModel):
    approved_asset_classes: list[AllowedAssets] = Field(
        description="List of asset classes to include. You MUST ONLY pick from: 'Large Cap Equity', 'Government Bonds'."
    )
    equity_weight_max: float = Field(description="Maximum total percentage allocated to equities (0.0 to 1.0)")
    fixed_income_weight_min: float = Field(description="Minimum total percentage allocated to fixed income (0.0 to 1.0)")
    rationale: str = Field(description="A brief 2-sentence explanation of why these constraints were chosen.")


def senior_portfolio_node(state: AgentState):
    """Synthesizes all research and outputs mathematical constraints."""
    print("--- SENIOR PORTFOLIO AGENT SYNTHESIZING ---")
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are the Senior Portfolio Manager. 
        Review the findings from your fundamental, sentiment, and valuation analysts.
        The client's Relative Risk Aversion (RRA) coefficient is {rra}. (Higher means more risk-averse).
        Based on the team's research and the client's risk profile, output strict constraints for our Mean-Variance Optimizer.
        """),
        ("user", """
        Fundamental Analysis: {fundamental}
        Sentiment Analysis: {sentiment}
        Valuation Analysis: {valuation}
        """)
    ])
    
    # Force the LLM to output the exact Pydantic schema
    structured_llm = llm.with_structured_output(PortfolioConstraints)
    chain = prompt | structured_llm
    
    response = chain.invoke({
        "rra": state["rra_coefficient"],
        "fundamental": state.get("fundamental_analysis", "No data"),
        "sentiment": state.get("sentiment_analysis", "No data"),
        "valuation": state.get("valuation_analysis", "No data")
    })
    
    # Save the structured output back to the state
    return {
        "approved_asset_classes": response.approved_asset_classes,
        "optimization_constraints": {
            "equity_weight_max": response.equity_weight_max,
            "fixed_income_weight_min": response.fixed_income_weight_min
        },
        "messages": [f"Senior Agent Rationale: {response.rationale}"]
    }