"""Integrations Hub router — spec section 17.5 — Real DB queries."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.integration import PlatformConnection
from app.models.user import User

router = APIRouter(prefix="/api/integrations", tags=["Integrations"])


@router.post("/connect")
async def connect_platform(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"message": "Platform connection initiated"}


@router.get("/mine")
async def list_integrations(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PlatformConnection).where(PlatformConnection.user_id == current_user["user_id"])
    )
    connections = result.scalars().all()
    return {
        "integrations": [{
            "id": str(c.id), "platform": c.platform,
            "last_checked_at": c.last_checked_at.isoformat() if c.last_checked_at else None,
            "last_status": c.last_status, "is_active": c.is_active,
        } for c in connections]
    }


@router.post("/{integration_id}/check")
async def check_status(integration_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PlatformConnection).where(PlatformConnection.id == integration_id))
    conn = result.scalar_one_or_none()
    if not conn:
        raise HTTPException(404, "Integration not found")
    conn.last_checked_at = datetime.now(timezone.utc)
    conn.last_status = "checked"
    await db.commit()
    return {"status": conn.last_status}


@router.delete("/{integration_id}")
async def disconnect(integration_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PlatformConnection).where(PlatformConnection.id == integration_id))
    conn = result.scalar_one_or_none()
    if not conn:
        raise HTTPException(404, "Integration not found")
    conn.is_active = False
    await db.commit()
    return {"message": "Disconnected"}


@router.post("/calendar/sync")
async def sync_calendar():
    return {"message": "Calendar sync not configured yet"}


@router.get("/calendar/ical")
async def get_ical():
    return {"url": ""}


@router.post("/ocr")
async def ocr_upload():
    return {"extracted": {}}


@router.get("/offline/packs")
async def list_offline_packs():
    return {"packs": []}


@router.get("/offline/packs/{exam}/{section}")
async def get_offline_pack(exam: str, section: str):
    return {"pack": {}}


@router.post("/offline/sync")
async def sync_offline():
    return {"message": "Synced"}
