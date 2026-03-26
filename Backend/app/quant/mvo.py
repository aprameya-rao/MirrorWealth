# app/quant/mvo.py
import yfinance as yf
from pypfopt import expected_returns, risk_models
from pypfopt.efficient_frontier import EfficientFrontier

TICKER_MAP = {
    "Large Cap Equity": "NIFTYBEES.NS",
    "Government Bonds": "LIQUIDBEES.NS" # Updated Ticker
}

def generate_optimal_weights(approved_classes: list, constraints: dict):
    print("\n[MVO Engine] Fetching live market data...")
    
    tickers = [TICKER_MAP[cls] for cls in approved_classes if cls in TICKER_MAP]
    
    if not tickers:
        raise ValueError("No valid tickers found for the approved asset classes.")

    # Download data
    data = yf.download(tickers, period="1y")["Close"]
    
    # Drop any columns (tickers) that completely failed to download
    data = data.dropna(axis=1, how='all')
    data = data.dropna() # Drop remaining empty rows

    # Ensure we still have data left after cleaning
    if data.empty or len(data.columns) < 2:
         raise ValueError("Not enough valid market data downloaded to optimize a portfolio.")

    mu = expected_returns.mean_historical_return(data)
    S = risk_models.sample_cov(data)

    print("[MVO Engine] Running Mean-Variance Optimization...")

    ef = EfficientFrontier(mu, S, weight_bounds=(0, 1))
    ticker_indices = {ticker: i for i, ticker in enumerate(ef.tickers)}

    # Apply AI Constraints dynamically based on what actually downloaded
    if "NIFTYBEES.NS" in ticker_indices and "equity_weight_max" in constraints:
        eq_idx = ticker_indices["NIFTYBEES.NS"]
        eq_max = constraints["equity_weight_max"]
        ef.add_constraint(lambda w: w[eq_idx] <= eq_max)

    if "LIQUIDBEES.NS" in ticker_indices and "fixed_income_weight_min" in constraints:
        fi_idx = ticker_indices["LIQUIDBEES.NS"]
        fi_min = constraints["fixed_income_weight_min"]
        ef.add_constraint(lambda w: w[fi_idx] >= fi_min)

    raw_weights = ef.min_volatility()
    cleaned_weights = ef.clean_weights()
    
    return cleaned_weights