# app/quant/mvo.py
import asyncio
import numpy as np
import pandas as pd
import yfinance as yf
import scipy.optimize as sco
from typing import List, Dict

def _calculate_mvo_sync(tickers: List[str], risk_aversion: float, equity_max: float = 0.85) -> Dict[str, float]:
    """
    Synchronous function that does the heavy math.
    It minimizes negative utility to find the optimal portfolio weights,
    respecting the AI-generated maximum equity constraint.
    """
    if not tickers:
        return {}
    if len(tickers) == 1:
        return {tickers[0]: 1.0}

    print(f"🧮 Running MVO for {tickers} | Risk Aversion (A) = {risk_aversion} | AI Equity Max = {equity_max}")

    try:
        # 1. Download 1 year of daily closing prices
        data = yf.download(tickers, period="1y", progress=False)
        
        if 'Close' in data.columns:
            prices = data['Close']
        else:
            prices = data

        prices = prices.ffill().dropna()

        # 2. Calculate Expected Returns and Covariance (Annualized)
        daily_returns = prices.pct_change().dropna()
        mean_returns = daily_returns.mean() * 252
        cov_matrix = daily_returns.cov() * 252

        # --- THE QUANT FIX: SYNTHETIC RISK-FREE RATE ---
        # LIQUIDBEES does not appreciate in price (it pays dividends), so its historical 
        # price return looks like 0%. We override it with a realistic Indian risk-free yield.
        if "LIQUIDBEES.NS" in mean_returns.index:
            mean_returns["LIQUIDBEES.NS"] = 0.065 # 6.5% Expected Return
            print("💉 Injected Synthetic Risk-Free Rate (6.5%) for LIQUIDBEES.NS")
        # -----------------------------------------------

        num_assets = len(tickers)

        # 3. Define the Objective Function (Maximize Utility)
        def negative_utility(weights, expected_returns, cov_matrix, risk_aversion):
            portfolio_return = np.sum(expected_returns * weights)
            portfolio_variance = np.dot(weights.T, np.dot(cov_matrix, weights))
            utility = portfolio_return - (risk_aversion / 2) * portfolio_variance
            return -utility

        # 4. Set the Constraints and Bounds
        constraints = ({'type': 'eq', 'fun': lambda x: np.sum(x) - 1})
        
        # --- THE FINAL FIX: DYNAMIC BOUNDS FROM AI ---
        custom_bounds = []
        for ticker in tickers:
            if "NIFTY" in ticker.upper():
                # Restrict Equity to the AI's recommended maximum.
                # Minimum 5% to force diversification.
                custom_bounds.append((0.05, float(equity_max)))
            else:
                # Cash/Liquid can be anywhere from 5% to 100%
                custom_bounds.append((0.05, 1.0))
        
        bounds = tuple(custom_bounds)
        # ---------------------------------------------

        initial_guess = num_assets * [1. / num_assets]

        # 5. Run the SciPy Optimizer
        optimized = sco.minimize(
            negative_utility, 
            initial_guess, 
            args=(mean_returns.values, cov_matrix.values, risk_aversion), 
            method='SLSQP', 
            bounds=bounds, 
            constraints=constraints
        )

        if not optimized.success:
            print(f"⚠️ Optimizer failed: {optimized.message}. Falling back to equal weights.")
            return {ticker: round(1.0 / num_assets, 4) for ticker in tickers}

        # 6. Map the optimized weights back to their tickers
        optimal_weights = optimized.x
        
        # Clean up near-zero weights
        final_weights = {tickers[i]: round(optimal_weights[i], 4) for i in range(num_assets)}
        print(f"🎯 MVO Final Weights: {final_weights}")
        
        return final_weights

    except Exception as e:
        print(f"❌ Error during MVO calculation: {e}")
        return {ticker: round(1.0 / len(tickers), 4) for ticker in tickers}

async def get_optimal_weights(tickers: List[str], risk_aversion: float, equity_max: float = 0.85) -> Dict[str, float]:
    """
    Async wrapper to prevent the heavy Pandas/SciPy math from blocking FastAPI.
    """
    return await asyncio.to_thread(_calculate_mvo_sync, tickers, risk_aversion, equity_max)