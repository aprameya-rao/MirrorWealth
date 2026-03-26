import numpy_financial as npf
from datetime import date

def calculate_performance(history_logs: list):
    """
    history_logs: List of dicts [{'date': d, 'value': v, 'cash_flow': cf}]
    """
    # 1. MWR (Money-Weighted Return)
    # We treat initial value as an inflow and final value as an outflow
    cash_flows = [log['cash_flow'] for log in history_logs]
    # Add final portfolio value as a negative "exit" flow to find IRR
    cash_flows.append(-history_logs[-1]['value']) 
    
    mwr = npf.irr(cash_flows)
    
    # 2. TWR (Time-Weighted Return)
    # Calculated by multiplying sub-period returns
    twr_product = 1.0
    for i in range(1, len(history_logs)):
        prev_val = history_logs[i-1]['value']
        current_val = history_logs[i]['value']
        flow = history_logs[i]['cash_flow']
        
        # Period Return = (End Value - Cash Flow) / Start Value
        period_return = (current_val - flow) / prev_val
        twr_product *= period_return
        
    return {
        "mwr_annualized": round(mwr * 252 * 100, 2), # Simplified annualization
        "twr_total": round((twr_product - 1) * 100, 2)
    }