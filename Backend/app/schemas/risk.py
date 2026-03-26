from pydantic import BaseModel
from typing import List

class Answer(BaseModel):
    question_id: int
    selected_score: int # Range 1-10

class RiskAssessmentRequest(BaseModel):
    user_id: int
    answers: List[Answer]

class RiskAssessmentResponse(BaseModel):
    user_id: int
    rra_coefficient: float
    risk_level: str

class QuestionOption(BaseModel):
    text: str
    score: int

class RiskQuestionDisplay(BaseModel):
    id: int
    question_text: str
    category: str
    options: List[QuestionOption]

    class Config:
        from_attributes = True