from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class TappingSession(Base):
    __tablename__ = "tapping_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_description = Column(Text)
    initial_intensity = Column(Float)
    final_intensity = Column(Float)
    setup_statements = Column(Text)  # JSON string of setup statements
    reminder_phrases = Column(Text)  # JSON string of reminder phrases
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="tapping_sessions") 