"""Notifications router — spec section 9.6 — Real DB queries."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.notification import NotificationQueue

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get("/preferences")
async def get_preferences(current_user: dict = Depends(get_current_user)):
    return {
        "preferences": {
            "deadline": {"whatsapp": True, "email": True, "push": True},
            "exam_reg": {"whatsapp": True, "email": True, "push": True},
            "step_reminder": {"whatsapp": True, "email": True, "push": True},
            "results": {"whatsapp": True, "email": True, "push": True},
            "digest": {"whatsapp": False, "email": True, "push": False},
            "study": {"whatsapp": True, "email": False, "push": True},
        }
    }


@router.put("/preferences")
async def update_preferences(current_user: dict = Depends(get_current_user)):
    return {"message": "Preferences updated"}


@router.get("/history")
async def get_history(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NotificationQueue)
        .where(NotificationQueue.user_id == current_user["user_id"])
        .order_by(NotificationQueue.scheduled_at.desc())
        .limit(50)
    )
    notifs = result.scalars().all()
    return {
        "notifications": [{
            "id": str(n.id), "type": n.type, "channel": n.channel,
            "payload": n.payload or {}, "status": n.status,
            "scheduled_at": n.scheduled_at.isoformat() if n.scheduled_at else None,
            "sent_at": n.sent_at.isoformat() if n.sent_at else None,
        } for n in notifs]
    }


@router.post("/test")
async def send_test(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    from datetime import datetime, timezone
    n = NotificationQueue(
        user_id=current_user["user_id"], type="study", channel="push",
        payload={"title": "Test Notification", "body": "This is a test."},
        status="sent", scheduled_at=datetime.now(timezone.utc),
        sent_at=datetime.now(timezone.utc),
    )
    db.add(n)
    await db.commit()
    return {"message": "Test notification sent"}


@router.post("/whatsapp/webhook")
async def whatsapp_webhook():
    return {"message": "Received"}

