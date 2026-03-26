import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")

def fetch_live_market_news(query: str):
    """
    Fetches real-time news using GNews API.
    """
    print(f"--- TOOL: FETCHING GNEWS FOR {query} ---")
    
    if not GNEWS_API_KEY:
        return "GNews API Key missing in .env"

    # GNews specifically likes 'q' for query and 'lang' for language
    url = f"https://gnews.io/api/v4/search"
    
    params = {
        "q": query,
        "lang": "en",
        "country": "in", # Focused on Indian Market
        "max": 5,        # Top 5 headlines
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
            # We only send Title and Description to save tokens
            results.append(f"Source: {art['source']['name']}\nTitle: {art['title']}\nDesc: {art['description']}\n---")
            
        return "\n".join(results)

    except Exception as e:
        return f"GNews Tool Error: {str(e)}"

def get_macro_indicators():
    """
    Mock or API call for fundamental data (RBI Rates, Inflation, etc.)
    In a real app, you'd use an API like Alpha Vantage or Quandl here.
    """
    # March 2026 Mock Data
    return {
        "repo_rate": "6.50%",
        "inflation_cpi": "4.8%",
        "gdp_growth": "7.2%",
        "market_status": "Volatile but biased upward"
    }