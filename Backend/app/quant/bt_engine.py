import bt
import pandas as pd
import asyncio
from typing import List, Dict

async def run_bt_backtest(tickers: List[str], weights: Dict[str, float], start_date: str):
    """
    Uses the 'bt' library to run a target-weight rebalancing backtest.
    """
    try:
        # 1. Sanitize Inputs
        # Tickers must be a unique list of strings
        clean_tickers = list(set([str(t).strip() for t in tickers]))
        
        # 2. Fetch Data
        # We run this in a thread because bt.get is a blocking network call
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: bt.get(clean_tickers, start=start_date))

        # IMPORTANT: Ensure 'weights' keys match the DataFrame column names exactly
        # yfinance often changes NIFTYBEES.NS to niftybeesns or keeps it exact.
        # We force a mapping here to prevent WeighTarget from failing.
        actual_columns = data.columns.tolist()
        final_weights = {col: weights.get(col, 0.0) for col in actual_columns}

        # 3. Define the Strategy
        strategy = bt.Strategy('Arjun_Risk_4.5', [
            bt.algos.RunMonthly(),          # Rebalance monthly
            bt.algos.SelectAll(),           # Use all columns from the 'data'
            bt.algos.WeighTarget(final_weights), # Apply the AI-suggested weights
            bt.algos.Rebalance()            # Execute trades
        ])

        # 4. Run the Backtest
        backtest = bt.Backtest(strategy, data)
        # report = bt.run(backtest) can be slow, wrap in executor if needed
        report = await loop.run_in_executor(None, lambda: bt.run(backtest))

        # 5. Extract Stats safely
        # Use .get() or check index to avoid KeyErrors if the strategy name changes
        res = report.stats['Arjun_Risk_4.5']
        
        # Convert index to strings to ensure JSON serializability
        equity_curve = report.prices.to_dict()
        # Clean the dictionary keys (dates) to strings for FastAPI JSON response
        formatted_curve = {str(k): v for k, v in equity_curve['Arjun_Risk_4.5'].items()}

        return {
            "status": "success",
            "total_return": round(float(report.total_return) * 100, 2),
            "cagr": round(float(res.get('cagr', 0)) * 100, 2),
            "sharpe": round(float(res.get('daily_sharpe', 0)), 2),
            "max_drawdown": round(float(res.get('max_drawdown', 0)) * 100, 2),
            "equity_curve": formatted_curve
        }

    except Exception as e:
        # Catching errors here prevents the whole LangGraph from dying
        return {
            "status": "error",
            "message": f"Backtest failed: {str(e)}",
            "total_return": 0.0,
            "sharpe": 0.0
        }