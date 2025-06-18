from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.session import TappingSession
from app.models.user import User
from app.router.auth import get_current_user
from app.services.llm_handler import generate_setup_statements, generate_reminder_phrases

router = APIRouter()

class TappingSessionCreate(BaseModel):
    problem_description: str
    initial_intensity: float

class TappingSessionUpdate(BaseModel):
    final_intensity: float

class TappingSessionResponse(BaseModel):
    id: int
    problem_description: str
    initial_intensity: float
    final_intensity: Optional[float]
    setup_statements: List[str]
    reminder_phrases: List[str]
    created_at: str

    class Config:
        from_attributes = True

@router.post("/generate", response_model=TappingSessionResponse)
async def create_tapping_session(
    session: TappingSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Generate setup statements and reminder phrases using LLM
    setup_statements = await generate_setup_statements(session.problem_description)
    reminder_phrases = await generate_reminder_phrases(session.problem_description)
    
    # Create tapping session
    db_session = TappingSession(
        user_id=current_user.id,
        problem_description=session.problem_description,
        initial_intensity=session.initial_intensity,
        setup_statements=setup_statements,
        reminder_phrases=reminder_phrases
    )
    
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return db_session

@router.put("/{session_id}/complete", response_model=TappingSessionResponse)
async def complete_tapping_session(
    session_id: int,
    update: TappingSessionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_session = db.query(TappingSession)\
        .filter(TappingSession.id == session_id, TappingSession.user_id == current_user.id)\
        .first()
    
    if not db_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tapping session not found"
        )
    
    db_session.final_intensity = update.final_intensity
    db.commit()
    db.refresh(db_session)
    
    return db_session

@router.get("/history", response_model=List[TappingSessionResponse])
async def get_tapping_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(TappingSession)\
        .filter(TappingSession.user_id == current_user.id)\
        .order_by(TappingSession.created_at.desc())\
        .all()
    return sessions

@router.get("/{session_id}", response_model=TappingSessionResponse)
async def get_tapping_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(TappingSession)\
        .filter(TappingSession.id == session_id, TappingSession.user_id == current_user.id)\
        .first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tapping session not found"
        )
    
    return session 