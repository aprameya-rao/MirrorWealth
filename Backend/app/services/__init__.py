from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.portfolio import RiskProfile
from app.models.risk_questions import RiskQuestion # Create this model first

class RiskAssessmentService:
    @staticmethod
    async def calculate_and_save_rra(user_id: int, answers: list, db: AsyncSession):
        """
        answers format: [{"question_id": 1, "selected_score": 10}, ...]
        """
        total_weighted_score = 0
        max_possible_score = 0
        
        # 1. Calculate Score
        for ans in answers:
            # In a real app, fetch the weight from DB here
            total_weighted_score += ans['selected_score']
            max_possible_score += 10 # Assuming 10 is max per question
            
        # 2. Map Score to RRA (1.0 to 10.0)
        # We invert it: High Score = Low Aversion
        # Formula: RRA = 10 - ((score / max) * 9)
        raw_rra = 10 - ((total_weighted_score / max_possible_score) * 9)
        final_rra = max(1.0, min(10.0, round(raw_rra, 2)))

        # 3. Update the Profile
        stmt = select(RiskProfile).where(RiskProfile.user_id == user_id)
        result = await db.execute(stmt)
        profile = result.scalar_one_or_none()
        
        if profile:
            profile.rra_coefficient = final_rra
            profile.total_risk_score = total_weighted_score
            await db.commit()
            
        return final_rra