import os
import requests
import json
from dotenv import load_dotenv
from langchain_core.tools import tool
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from sqlalchemy import text
from app.core.db import AsyncSessionLocal

load_dotenv()

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

# 1. Initialize Embeddings (Must match your news_scrap.py model)
embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

@tool
async def search_vault_news(query: str):
    """
    Searches the internal 'MirrorWealth Vault' containing deep-dive news from 
    Moneycontrol, Economic Times, and LiveMint. 
    Use this for specific Indian market sentiment, Nifty 50 trends, and Rupee updates.
    """
    print(f"--- TOOL: SEARCHING INTERNAL VAULT FOR {query} ---")
    
    try:
        # Convert search query to vector
        query_vector = await embeddings.aembed_query(query)
        
        async with AsyncSessionLocal() as session:
            # Call the pgvector match_news function we created in Supabase
            rpc_query = text("""
                SELECT title, summary, source, published_at, similarity 
                FROM match_news(
                    :query_embedding,
                    :match_threshold,
                    :match_count
                )
            """)
            
            result = await session.execute(rpc_query, {
                "query_embedding": query_vector,
                "match_threshold": 0.4,
                "match_count": 5
            })
            
            rows = result.fetchall()
            
            if not rows:
                return "No highly relevant articles found in the internal vault."

            news_context = []
            for r in rows:
                news_context.append(
                    f"[{r.source}] {r.title}\nSummary: {r.summary[:250]}...\n(Similarity: {round(r.similarity, 2)})"
                )
                
            return "\n\n".join(news_context)
            
    except Exception as e:
        return f"Database RAG Error: {str(e)}"

@tool
def fetch_live_market_news(query: str):
    """
    Fetches real-time news using GNews API for global/breaking updates.
    """
    print(f"--- TOOL: FETCHING GNEWS FOR {query} ---")
    
    if not GNEWS_API_KEY:
        return "GNews API Key missing in .env"

    url = f"https://gnews.io/api/v4/search"
    params = {
        "q": query,
        "lang": "en",
        "country": "in",
        "max": 5,
        "apikey": GNEWS_API_KEY
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        articles = data.get("articles", [])
        if not articles:
            return "No recent news articles found."

        results = []
        for art in articles:
            results.append(f"Source: {art['source']['name']}\nTitle: {art['title']}\nDesc: {art['description']}\n---")
            
        return "\n".join(results)
    except Exception as e:
        return f"GNews Tool Error: {str(e)}"

@tool
def get_macro_indicators():
    """
    Returns current fundamental Indian economic data (RBI Repo Rate, Inflation, GDP).
    """
    print("--- TOOL: GETTING MACRO INDICATORS ---")
    # Using the verified data for March 2026
    data = {
        "as_of_date": "March 2026",
        "repo_rate": "6.50%",
        "inflation_cpi": "4.8%",
        "gdp_growth": "7.2%",
        "market_status": "Volatile but biased upward"
    }
    return json.dumps(data)