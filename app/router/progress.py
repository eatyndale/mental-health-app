from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.models.session import TappingSession
from app.models.assessment import Assessment
from app.router.auth import get_current_user

router = APIRouter()

@router.get("/summary")
async def get_progress_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a summary of the user's progress."""
    # Get latest assessment
    latest_assessment = db.query(Assessment)\
        .filter(Assessment.user_id == current_user.id)\
        .order_by(Assessment.created_at.desc())\
        .first()
    
    # Get tapping session statistics
    tapping_stats = db.query(
        func.count(TappingSession.id).label("total_sessions"),
        func.avg(TappingSession.initial_intensity).label("avg_initial_intensity"),
        func.avg(TappingSession.final_intensity).label("avg_final_intensity")
    ).filter(TappingSession.user_id == current_user.id).first()
    
    # Get recent sessions (last 7 days)
    recent_sessions = db.query(TappingSession)\
        .filter(
            TappingSession.user_id == current_user.id,
            TappingSession.created_at >= datetime.utcnow() - timedelta(days=7)
        )\
        .order_by(TappingSession.created_at.desc())\
        .all()
    
    return {
        "latest_assessment": {
            "score": latest_assessment.total_score if latest_assessment else None,
            "severity_level": latest_assessment.severity_level if latest_assessment else None,
            "date": latest_assessment.created_at if latest_assessment else None
        },
        "tapping_stats": {
            "total_sessions": tapping_stats.total_sessions or 0,
            "avg_initial_intensity": round(tapping_stats.avg_initial_intensity, 1) if tapping_stats.avg_initial_intensity else None,
            "avg_final_intensity": round(tapping_stats.avg_final_intensity, 1) if tapping_stats.avg_final_intensity else None,
            "avg_reduction": round(
                (tapping_stats.avg_initial_intensity - tapping_stats.avg_final_intensity) / tapping_stats.avg_initial_intensity * 100, 1
            ) if tapping_stats.avg_initial_intensity and tapping_stats.avg_final_intensity else None
        },
        "recent_sessions": [
            {
                "id": session.id,
                "problem": session.problem_description,
                "initial_intensity": session.initial_intensity,
                "final_intensity": session.final_intensity,
                "date": session.created_at
            }
            for session in recent_sessions
        ]
    }

@router.get("/trends")
async def get_progress_trends(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get progress trends over time."""
    # Get assessment history
    assessments = db.query(Assessment)\
        .filter(Assessment.user_id == current_user.id)\
        .order_by(Assessment.created_at.asc())\
        .all()
    
    # Get tapping session history
    sessions = db.query(TappingSession)\
        .filter(TappingSession.user_id == current_user.id)\
        .order_by(TappingSession.created_at.asc())\
        .all()
    
    return {
        "assessment_trends": [
            {
                "date": assessment.created_at,
                "score": assessment.total_score,
                "severity_level": assessment.severity_level
            }
            for assessment in assessments
        ],
        "tapping_trends": [
            {
                "date": session.created_at,
                "initial_intensity": session.initial_intensity,
                "final_intensity": session.final_intensity,
                "reduction": round(
                    (session.initial_intensity - session.final_intensity) / session.initial_intensity * 100, 1
                ) if session.final_intensity else None
            }
            for session in sessions
        ]
    } 