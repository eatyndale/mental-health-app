from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from app.database import get_db
from app.models.user import User
from app.router.auth import get_current_user
from app.services.llm_handler import generate_chat_response

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    suggested_action: Optional[str] = None

@router.post("/message", response_model=ChatResponse)
async def send_message(
    chat_message: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Add user context to the message
        context = chat_message.context or {}
        context.update({
            "user_name": current_user.first_name,
            "user_id": current_user.id
        })
        
        # Generate response using LLM
        response = await generate_chat_response(chat_message.message, context)
        
        # Determine if we should suggest starting an EFT session
        suggested_action = None
        if any(keyword in chat_message.message.lower() for keyword in [
            "anxiety", "stress", "worry", "fear", "panic", "overwhelm",
            "depressed", "sad", "angry", "upset", "emotional"
        ]):
            suggested_action = "start_eft_session"
        
        return ChatResponse(
            response=response,
            suggested_action=suggested_action
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing message: {str(e)}"
        ) 