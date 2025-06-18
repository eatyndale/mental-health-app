from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.database import get_db
from app.models.assessment import Assessment
from app.models.user import User
from app.router.auth import get_current_user

router = APIRouter()

class PHQ9Answer(BaseModel):
    question_id: int
    answer: int  # 0-3 scale

class AssessmentCreate(BaseModel):
    answers: List[PHQ9Answer]

class AssessmentResponse(BaseModel):
    id: int
    total_score: int
    severity_level: str
    created_at: str

    class Config:
        from_attributes = True

def calculate_severity_level(score: int) -> str:
    if score <= 4:
        return "Minimal depression"
    elif score <= 9:
        return "Mild depression"
    elif score <= 14:
        return "Moderate depression"
    elif score <= 19:
        return "Moderately severe depression"
    else:
        return "Severe depression"

@router.post("/submit", response_model=AssessmentResponse)
async def submit_assessment(
    assessment: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate total score
    total_score = sum(answer.answer for answer in assessment.answers)
    
    # Create assessment record
    db_assessment = Assessment(
        user_id=current_user.id,
        answers=[{"question_id": a.question_id, "answer": a.answer} for a in assessment.answers],
        total_score=total_score,
        severity_level=calculate_severity_level(total_score)
    )
    
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    return db_assessment

@router.get("/history", response_model=List[AssessmentResponse])
async def get_assessment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessments = db.query(Assessment)\
        .filter(Assessment.user_id == current_user.id)\
        .order_by(Assessment.created_at.desc())\
        .all()
    return assessments

@router.get("/latest", response_model=AssessmentResponse)
async def get_latest_assessment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assessment = db.query(Assessment)\
        .filter(Assessment.user_id == current_user.id)\
        .order_by(Assessment.created_at.desc())\
        .first()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No assessment found"
        )
    
    return assessment 