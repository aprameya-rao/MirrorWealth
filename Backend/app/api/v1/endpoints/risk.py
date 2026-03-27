from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.db import get_db
from app.models import RiskProfile, RiskQuestion,User
from app.api.deps import get_current_user
from app.schemas.risk import RiskAssessmentRequest, RiskAssessmentResponse, RiskQuestionDisplay

router = APIRouter()

@router.get("/questions", response_model=List[RiskQuestionDisplay])
async def get_questions(db: AsyncSession = Depends(get_db)):
    """Fetch the questionnaire for the frontend."""
    stmt = select(RiskQuestion)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/submit", response_model=RiskAssessmentResponse)
async def submit_risk_assessment(
    payload: RiskAssessmentRequest, 
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    The Scoring Matrix Engine:
    Translates answers into a 1.0 - 10.0 RRA Coefficient.
    """
    # 1. Fetch questions to get weights
    q_ids = [a.question_id for a in payload.answers]
    stmt = select(RiskQuestion).where(RiskQuestion.id.in_(q_ids))
    result = await db.execute(stmt)
    questions = {q.id: q for q in result.scalars().all()}

    if not questions:
        raise HTTPException(status_code=400, detail="No valid questions found")

    total_weighted_score = 0.0
    max_possible_weighted_score = 0.0

    # 2. Apply the Scoring Matrix Logic
    for answer in payload.answers:
        q = questions.get(answer.question_id)
        if q:
            # Score (1-10) * Weight (e.g. 1.5 for Tolerance)
            total_weighted_score += (answer.selected_score * q.weight)
            max_possible_weighted_score += (10.0 * q.weight)

    # 3. Calculate RRA (Inversion: High Score = Low Aversion)
    # Formula: RRA = 10 - ((WeightedTotal / MaxPossible) * 9)
    # Result: 1.0 (Aggressive) to 10.0 (Very Conservative)
    if max_possible_weighted_score == 0:
        rra_coeff = 4.5
    else:
        norm_score = total_weighted_score / max_possible_weighted_score
        rra_coeff = round(10.0 - (norm_score * 9.0), 2)

    # 4. Save to Database
    stmt = select(RiskProfile).where(RiskProfile.user_id == payload.user_id)
    res = await db.execute(stmt)
    profile = res.scalar_one_or_none()

    if not profile:
        profile = RiskProfile(user_id=payload.user_id)
        db.add(profile)

    profile.rra_coefficient = rra_coeff
    profile.total_risk_score = int(total_weighted_score)
    
    await db.commit()

    # Determine Label
    risk_label = "Aggressive" if rra_coeff < 3.5 else "Moderate" if rra_coeff < 7.0 else "Conservative"

    return {
        "user_id": payload.user_id,
        "rra_coefficient": rra_coeff,
        "risk_level": risk_label
    }