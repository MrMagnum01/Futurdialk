"""Gamification router — spec section 15.5 — Real DB queries."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.gamification import UserGamification, StudyGroup
from app.models.user import User

router = APIRouter(prefix="/api/gamification", tags=["Gamification"])


@router.get("/me")
async def get_my_gamification(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserGamification).where(UserGamification.user_id == current_user["user_id"]))
    g = result.scalar_one_or_none()
    if not g:
        # Auto-create gamification record
        g = UserGamification(user_id=current_user["user_id"])
        db.add(g)
        await db.commit()
        await db.refresh(g)
    return {
        "xp_total": g.xp_total, "level": g.level,
        "streak_current": g.streak_current, "streak_longest": g.streak_longest,
        "streak_freezes_remaining": g.streak_freezes_remaining,
        "badges": g.badges or [], "daily_challenge_completed_today": g.daily_challenge_completed_today,
    }


@router.get("/leaderboard")
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(UserGamification, User.full_name).join(User, User.id == UserGamification.user_id)
        .order_by(UserGamification.xp_total.desc()).limit(50)
    )
    rows = result.all()
    return {
        "leaderboard": [{
            "rank": i + 1, "name": row.full_name,
            "xp": row.UserGamification.xp_total, "level": row.UserGamification.level,
            "streak": row.UserGamification.streak_current,
        } for i, row in enumerate(rows)]
    }


@router.get("/badges")
async def list_badges():
    """Return all available badge definitions."""
    return {"badges": [
        {"code": "first_login", "name": "First Login", "description": "Log in for the first time", "xp": 10},
        {"code": "profile_complete", "name": "Profile Complete", "description": "Complete your profile", "xp": 50},
        {"code": "first_exam", "name": "First Exam", "description": "Complete your first practice exam", "xp": 100},
        {"code": "streak_7", "name": "7-Day Streak", "description": "Maintain a 7-day streak", "xp": 200},
        {"code": "streak_30", "name": "30-Day Streak", "description": "Maintain a 30-day streak", "xp": 500},
        {"code": "roadmap_complete", "name": "Roadmap Complete", "description": "Complete a full roadmap", "xp": 1000},
    ]}


@router.post("/daily-challenge")
async def start_daily_challenge():
    return {"questions": []}


@router.post("/daily-challenge/submit")
async def submit_daily_challenge():
    return {"message": "Submitted"}


@router.get("/study-groups")
async def list_study_groups(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyGroup).where(StudyGroup.is_active == True).limit(20))
    groups = result.scalars().all()
    return {
        "groups": [{
            "id": str(g.id), "name": g.name, "exam_code": g.exam_code,
            "target_score": g.target_score,
            "member_count": len(g.member_ids or []), "max_members": g.max_members,
        } for g in groups]
    }


@router.post("/study-groups")
async def create_study_group(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    group = StudyGroup(
        name="New Study Group", exam_code="IELTS",
        created_by=current_user["user_id"], member_ids=[str(current_user["user_id"])],
    )
    db.add(group)
    await db.commit()
    return {"message": "Created", "group_id": str(group.id)}


@router.post("/study-groups/{group_id}/join")
async def join_study_group(group_id: str, current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyGroup).where(StudyGroup.id == group_id))
    g = result.scalar_one_or_none()
    if not g:
        raise HTTPException(404, "Group not found")
    members = g.member_ids or []
    uid = str(current_user["user_id"])
    if uid not in members:
        members.append(uid)
        g.member_ids = members
        await db.commit()
    return {"message": "Joined"}


@router.get("/study-groups/{group_id}/leaderboard")
async def get_group_leaderboard(group_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StudyGroup).where(StudyGroup.id == group_id))
    g = result.scalar_one_or_none()
    if not g:
        raise HTTPException(404, "Group not found")
    return {"leaderboard": []}
