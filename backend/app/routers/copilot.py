"""
AI Copilot router — Conversational study assistant for Moroccan students.
Chat sessions stored in MongoDB, AI via OpenRouter.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

from app.core.database import mongo_db
from app.core.security import get_current_user
from app.core.ai_service import copilot_chat, ai_available

router = APIRouter(prefix="/api/copilot", tags=["AI Copilot"])


class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None


@router.post("/message")
async def send_message(data: ChatMessage, current_user: dict = Depends(get_current_user)):
    """Send a message to the AI Copilot."""
    user_id = current_user["user_id"]
    session_id = data.session_id

    # Get or create session
    if session_id:
        session = await mongo_db.copilot_sessions.find_one({"_id": session_id, "user_id": user_id})
    else:
        session = None

    if not session:
        session_id = f"s_{user_id}_{int(datetime.now(timezone.utc).timestamp())}"
        session = {
            "_id": session_id, "user_id": user_id,
            "title": data.message[:50], "messages": [],
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }
        await mongo_db.copilot_sessions.insert_one(session)

    # Build history from session
    history = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in session.get("messages", [])[-10:]
    ]

    # Get AI response
    language = current_user.get("preferred_language", "fr")
    response_text = await copilot_chat(data.message, history, language)

    # Save messages to session
    now = datetime.now(timezone.utc)
    await mongo_db.copilot_sessions.update_one(
        {"_id": session_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {"role": "user", "content": data.message, "ts": now},
                        {"role": "assistant", "content": response_text, "ts": now},
                    ]
                }
            },
            "$set": {"updated_at": now},
        },
    )

    return {
        "response": response_text,
        "session_id": session_id,
        "ai_available": ai_available(),
    }


@router.get("/sessions")
async def list_sessions(current_user: dict = Depends(get_current_user)):
    """List user's chat sessions."""
    user_id = current_user["user_id"]
    cursor = mongo_db.copilot_sessions.find(
        {"user_id": user_id},
        {"messages": 0},  # Don't return full message history in list
    ).sort("updated_at", -1).limit(20)

    sessions = await cursor.to_list(20)
    return {
        "sessions": [{
            "id": str(s["_id"]),
            "title": s.get("title", "Chat"),
            "created_at": s.get("created_at", "").isoformat() if s.get("created_at") else None,
            "updated_at": s.get("updated_at", "").isoformat() if s.get("updated_at") else None,
        } for s in sessions]
    }


@router.get("/sessions/{session_id}")
async def get_session(session_id: str, current_user: dict = Depends(get_current_user)):
    """Get session with full message history."""
    user_id = current_user["user_id"]
    session = await mongo_db.copilot_sessions.find_one({"_id": session_id, "user_id": user_id})
    if not session:
        return {"session_id": session_id, "messages": []}

    return {
        "session_id": session_id,
        "title": session.get("title", "Chat"),
        "messages": [
            {"role": m["role"], "content": m["content"],
             "ts": m.get("ts", "").isoformat() if m.get("ts") else None}
            for m in session.get("messages", [])
        ],
    }


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a chat session."""
    user_id = current_user["user_id"]
    await mongo_db.copilot_sessions.delete_one({"_id": session_id, "user_id": user_id})
    return {"message": "Session deleted"}


@router.post("/feedback")
async def submit_feedback(current_user: dict = Depends(get_current_user)):
    """Submit feedback on AI response quality."""
    return {"message": "Feedback received — thank you!"}
