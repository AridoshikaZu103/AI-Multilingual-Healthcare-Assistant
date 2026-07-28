import uuid
import time
import logging
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.database import get_db
from app.models import ChatHistory
from app.schemas import ChatRequest, ChatResponse, ChatHistoryItem
from app.services.ai_service import ai_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def send_message(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """Send a message to the AI healthcare assistant and receive a response."""

    session_id = request.session_id or str(uuid.uuid4())
    start_time = time.time()

    # Generate AI response
    reply = await ai_service.generate_response(
        user_message=request.message,
        language=request.language,
    )

    response_time_ms = int((time.time() - start_time) * 1000)

    # Save to chat history
    chat_entry = ChatHistory(
        session_id=session_id,
        user_message=request.message,
        bot_response=reply,
        language=request.language,
        response_time_ms=response_time_ms,
    )
    db.add(chat_entry)

    logger.info(f"Chat response generated in {response_time_ms}ms for session {session_id}")

    return ChatResponse(
        reply=reply,
        language=request.language,
        session_id=session_id,
        response_time_ms=response_time_ms,
    )


@router.get("/history", response_model=list[ChatHistoryItem])
async def get_chat_history(
    session_id: str = Query(..., description="Chat session ID"),
    limit: int = Query(default=50, le=200),
    db: AsyncSession = Depends(get_db),
):
    """Retrieve chat history for a given session."""
    result = await db.execute(
        select(ChatHistory)
        .where(ChatHistory.session_id == session_id)
        .order_by(desc(ChatHistory.created_at))
        .limit(limit)
    )
    history = result.scalars().all()
    return list(reversed(history))
