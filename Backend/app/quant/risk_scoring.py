# app/quant/risk_scoring.py

def calculate_rra(time_score: int, liquidity_score: int, loss_tolerance_score: int) -> float:
    """
    Maps questionnaire scores to an RRA coefficient.
    Standard RRA usually ranges from 1 (highly aggressive) to 10+ (highly conservative).
    """
    # Assuming each score is out of 5, total max is 15
    total_score = time_score + liquidity_score + loss_tolerance_score
    max_score = 15.0

    # Normalize score between 0 and 1
    # 1.0 = Max Risk Tolerance, 0.0 = Zero Risk Tolerance
    normalized_score = total_score / max_score

    # Map to an RRA curve. 
    # High tolerance (score ~1.0) results in a low RRA (e.g., 2.0)
    # Low tolerance (score ~0.0) results in a high RRA (e.g., 10.0)
    base_rra = 10.0
    rra_reduction = normalized_score * 8.0 
    
    final_rra = base_rra - rra_reduction
    
    return round(final_rra, 2)