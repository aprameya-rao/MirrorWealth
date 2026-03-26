def get_tax_harvesting_opportunities(positions: list, live_prices: dict):
    """
    Identifies assets where current market value < average buy price.
    """
    harvest_list = []
    
    for pos in positions:
        ticker = pos.asset.ticker_or_isin
        price = live_prices.get(ticker)
        
        if not price or not pos.average_buy_price:
            continue
            
        # If the position is down by more than 2% or ₹500
        unrealized_pnl = (price - pos.average_buy_price) * pos.quantity
        
        if unrealized_pnl < -500:
            harvest_list.append({
                "ticker": ticker,
                "current_quantity": pos.quantity,
                "unrealized_loss": abs(round(unrealized_pnl, 2)),
                "tax_savings_estimate": abs(round(unrealized_pnl * 0.15, 2)), # 15% STCG Rate
                "strategy": "SELL_AND_SWITCH" 
            })
            
    return harvest_list