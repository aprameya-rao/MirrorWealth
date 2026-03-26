import yfinance as yf
import asyncio
from typing import Dict, List

async def fetch_live_prices(tickers: List[str]) -> Dict[str, float]:
    """
    Fetches live market prices for a list of tickers.
    Runs in a background thread to prevent blocking the FastAPI event loop.
    """
    if not tickers:
        return {}

    def get_prices_sync() -> Dict[str, float]:
        prices = {}
        for ticker in tickers:
            try:
                # yfinance uses .NS for Indian stocks (e.g., NIFTYBEES.NS)
                stock = yf.Ticker(ticker)
                
                # Fetch only 1 day of history to make it extremely fast
                history = stock.history(period="1d")
                
                if not history.empty:
                    # Get the most recent closing price
                    prices[ticker] = float(history['Close'].iloc[-1])
                else:
                    print(f"⚠️ No price data found for {ticker}")
                    prices[ticker] = 0.0
            except Exception as e:
                print(f"❌ Error fetching {ticker}: {e}")
                prices[ticker] = 0.0
        return prices

    # Offload the synchronous yfinance calls to a separate thread
    print(f"📈 Fetching live prices from Yahoo Finance for: {tickers}...")
    live_prices = await asyncio.to_thread(get_prices_sync)
    print(f"✅ Live prices retrieved: {live_prices}")
    
    return live_prices