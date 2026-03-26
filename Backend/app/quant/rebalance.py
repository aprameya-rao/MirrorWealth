from typing import Dict, List

def calculate_orders(
    cash_balance: float, 
    current_positions: List[Dict], 
    target_weights: Dict[str, float]
) -> Dict:
    """
    Calculates the exact BUY/SELL orders needed to reach the target portfolio.
    """
    # 1. Calculate Total Current Portfolio Value
    invested_value = sum(pos["quantity"] * pos["current_price"] for pos in current_positions)
    total_portfolio_value = cash_balance + invested_value

    action_plan = {}
    remaining_cash = cash_balance

    # 2. Calculate the Action for each target asset
    for ticker, target_weight in target_weights.items():
        # Find if the user already owns this asset
        current_pos = next((p for p in current_positions if p["ticker"] == ticker), None)
        
        current_qty = current_pos["quantity"] if current_pos else 0.0
        current_price = current_pos["current_price"] if current_pos else 0.0 # Will handle missing prices in the API
        
        if current_price <= 0:
            continue # Skip if we don't have price data

        # The Math: What should they own vs What do they own?
        target_value = total_portfolio_value * target_weight
        target_qty = int(target_value / current_price) # Can't buy fractional ETFs in India usually
        
        unit_difference = target_qty - current_qty

        if unit_difference > 0:
            action = "BUY"
            estimated_cost = unit_difference * current_price
            remaining_cash -= estimated_cost
        elif unit_difference < 0:
            action = "SELL"
            # Selling adds to our cash pool
            estimated_cost = abs(unit_difference) * current_price 
            remaining_cash += estimated_cost
        else:
            action = "HOLD"
            estimated_cost = 0.0

        action_plan[ticker] = {
            "action": action,
            "units": abs(unit_difference),
            "current_price": current_price,
            "target_weight_percentage": round(target_weight * 100, 2)
        }

    return {
        "total_portfolio_value": round(total_portfolio_value, 2),
        "projected_remaining_cash": round(remaining_cash, 2),
        "orders": action_plan
    }