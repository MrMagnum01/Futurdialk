"""Mentors router — spec section 12.6 — Real DB queries."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.mentor import Mentor
from app.models.user import User

router = APIRouter(prefix="/api/mentors", tags=["Mentors"])


@router.get("")
async def list_mentors(country: str = None, field: str = None, db: AsyncSession = Depends(get_db)):
    q = select(Mentor).where(Mentor.is_active == True)
    if country:
        q = q.where(Mentor.country_code == country.upper())
    if field:
        q = q.where(Mentor.field.ilike(f"%{field}%"))
    result = await db.execute(q.limit(50))
    mentors = result.scalars().all()
    out = []
    for m in mentors:
        # Fetch user name
        user_res = await db.execute(select(User.full_name, User.email).where(User.id == m.user_id))
        user = user_res.first()
        out.append({
            "id": str(m.id),
            "name": user.full_name if user else "Unknown",
            "email": user.email if user else None,
            "country_code": m.country_code,
            "city": m.city,
            "university": m.university,
            "field": m.field,
            "arrival_year": m.arrival_year,
            "specialties": m.specialties or [],
            "bio": m.bio,
            "is_verified": m.is_verified,
            "rating": float(m.rating) if m.rating else None,
            "total_mentees": m.total_mentees,
        })
    return {"mentors": out, "total": len(out)}


@router.get("/{mentor_id}")
async def get_mentor(mentor_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mentor).where(Mentor.id == mentor_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(404, "Mentor not found")
    user_res = await db.execute(select(User.full_name, User.email).where(User.id == m.user_id))
    user = user_res.first()
    return {
        "id": str(m.id), "name": user.full_name if user else "Unknown",
        "country_code": m.country_code, "city": m.city, "university": m.university,
        "field": m.field, "arrival_year": m.arrival_year, "specialties": m.specialties or [],
        "bio": m.bio, "is_verified": m.is_verified, "rating": float(m.rating) if m.rating else None,
        "total_mentees": m.total_mentees,
    }


@router.post("/apply")
async def apply_mentor(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    existing = await db.execute(select(Mentor).where(Mentor.user_id == current_user["user_id"]))
    if existing.scalar_one_or_none():
        raise HTTPException(400, "Already applied")
    mentor = Mentor(user_id=current_user["user_id"], country_code="MA", is_active=False)
    db.add(mentor)
    await db.commit()
    return {"message": "Application submitted", "mentor_id": str(mentor.id)}


@router.post("/{mentor_id}/connect")
async def connect_mentor(mentor_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mentor).where(Mentor.id == mentor_id))
    m = result.scalar_one_or_none()
    if not m:
        raise HTTPException(404, "Mentor not found")
    m.total_mentees = (m.total_mentees or 0) + 1
    await db.commit()
    return {"message": "Connection requested"}


@router.get("/chat/conversations")
async def list_conversations():
    return {"conversations": []}


@router.get("/chat/{chat_id}/messages")
async def get_messages(chat_id: str):
    return {"messages": []}


@router.post("/chat/{chat_id}/message")
async def send_message(chat_id: str):
    return {"message": "Sent"}


@router.post("/chat/{chat_id}/rate")
async def rate_mentor_session(chat_id: str):
    return {"message": "Rated"}
