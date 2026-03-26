import pandas as pd
import numpy as np
import yfinance as yf
from typing import Dict, List
import json

class PortfolioBacktester:
    def __init__(self, tickers: List[str], weights: List[float], start_date: str):
        self.tickers = tickers
        self.weights = np.array(weights)
        self.start_date = start_date

    async def run(self):
        # 1. Fetch Historical Data (Using yfinance for now)
        data = yf.download(self.tickers, start=self.start_date)['Adj Close']
        
        # 2. Calculate Daily Returns
        returns = data.pct_change().dropna()
        
        # 3. Calculate Portfolio Daily Return
        # (Weights * Returns)
        port_returns = returns.dot(self.weights)
        
        # 4. Calculate Key Metrics
        cum_return = (1 + port_returns).prod() - 1
        
        # Sharpe Ratio (Assuming 5% Risk-Free Rate in India)
        rf = 0.05 / 252 
        sharpe = (port_returns.mean() - rf) / port_returns.std() * np.sqrt(252)
        
        # Max Drawdown
        cum_wealth = (1 + port_returns).cumprod()
        peak = cum_wealth.cummax()
        drawdown = (cum_wealth - peak) / peak
        max_drawdown = drawdown.min()

        return {
            "cumulative_return": round(cum_return * 100, 2),
            "annualized_sharpe": round(sharpe, 2),
            "max_drawdown": round(max_drawdown * 100, 2),
            "daily_history": cum_wealth.tolist()
        }