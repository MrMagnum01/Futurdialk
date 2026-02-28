"""
Admin router — Dashboard stats, user management, and full CRUD for content.
"""

import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete

from app.core.database import get_db, mongo_db
from app.models.user import User
from app.models.school import School
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.models.roadmap import RoadmapTemplate, UserRoadmap
from app.models.mentor import Mentor
from app.models.marketplace import ServiceProvider

router = APIRouter(prefix="/api/admin", tags=["Admin"])


# ── Pydantic Schemas ─────────────────────────────────────

class SchoolCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    country_code: str
    city: Optional[str] = None
    type: Optional[str] = None
    is_public: bool = True
    ranking_national: Optional[int] = None
    tuition_international_yearly: Optional[str] = None

class SchoolUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    country_code: Optional[str] = None
    city: Optional[str] = None
    type: Optional[str] = None
    is_public: Optional[bool] = None
    ranking_national: Optional[int] = None
    tuition_international_yearly: Optional[str] = None

class ProgramCreate(BaseModel):
    school_id: str
    name: str
    degree_type: Optional[str] = None
    field_category: Optional[str] = None
    language_of_instruction: Optional[str] = "fr"
    duration_months: Optional[int] = None

class ProgramUpdate(BaseModel):
    name: Optional[str] = None
    degree_type: Optional[str] = None
    field_category: Optional[str] = None
    language_of_instruction: Optional[str] = None
    duration_months: Optional[int] = None

class ScholarshipCreate(BaseModel):
    name: str
    provider: Optional[str] = None
    country_code: str
    amount_description: Optional[str] = None
    application_deadline: Optional[str] = None
    application_url: Optional[str] = None
    competitiveness: Optional[str] = None
    tips: Optional[str] = None

class ScholarshipUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[str] = None
    country_code: Optional[str] = None
    amount_description: Optional[str] = None
    application_deadline: Optional[str] = None
    application_url: Optional[str] = None
    competitiveness: Optional[str] = None
    tips: Optional[str] = None
    is_active: Optional[bool] = None

class UserUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


# ── Stats ────────────────────────────────────────────────

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Get platform overview statistics."""
    users_q = await db.execute(select(func.count(User.id)))
    schools_q = await db.execute(select(func.count(School.id)))
    programs_q = await db.execute(select(func.count(Program.id)))
    scholarships_q = await db.execute(select(func.count(Scholarship.id)))
    templates_q = await db.execute(select(func.count(RoadmapTemplate.id)))
    roadmaps_q = await db.execute(select(func.count(UserRoadmap.id)))

    return {
        "users": users_q.scalar() or 0,
        "schools": schools_q.scalar() or 0,
        "programs": programs_q.scalar() or 0,
        "scholarships": scholarships_q.scalar() or 0,
        "roadmap_templates": templates_q.scalar() or 0,
        "user_roadmaps": roadmaps_q.scalar() or 0,
    }


# ── Users ────────────────────────────────────────────────

@router.get("/users")
async def list_users(db: AsyncSession = Depends(get_db)):
    """List all registered users."""
    result = await db.execute(select(User).order_by(User.created_at.desc()).limit(100))
    users = result.scalars().all()
    return {
        "users": [{
            "id": str(u.id), "email": u.email, "full_name": u.full_name,
            "role": u.role, "is_active": u.is_active, "is_verified": u.is_verified,
            "city": u.city, "nationality": u.nationality,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "last_login": u.last_login.isoformat() if u.last_login else None,
        } for u in users],
        "total": len(users),
    }


@router.get("/users/{user_id}")
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get user details."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "User not found")
    return {
        "id": str(user.id), "email": user.email, "full_name": user.full_name,
        "role": user.role, "is_active": user.is_active, "is_verified": user.is_verified,
        "phone": user.phone, "city": user.city, "nationality": user.nationality,
        "preferred_language": user.preferred_language,
        "onboarding_complete": user.onboarding_complete,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login": user.last_login.isoformat() if user.last_login else None,
    }


@router.put("/users/{user_id}")
async def update_user(user_id: str, data: UserUpdate, db: AsyncSession = Depends(get_db)):
    """Update user role, status, or verification."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "User not found")
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active
    if data.is_verified is not None:
        user.is_verified = data.is_verified
    await db.commit()
    return {"message": "User updated", "id": str(user.id)}


@router.delete("/users/{user_id}")
async def deactivate_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """Deactivate a user (soft delete)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "User not found")
    user.is_active = False
    await db.commit()
    return {"message": "User deactivated", "id": str(user.id)}


# ── Schools CRUD ─────────────────────────────────────────

@router.get("/content/schools")
async def list_schools(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(School).order_by(School.name).limit(100))
    schools = result.scalars().all()
    # Count programs per school
    program_counts = {}
    for s in schools:
        pc = await db.execute(select(func.count(Program.id)).where(Program.school_id == s.id))
        program_counts[str(s.id)] = pc.scalar() or 0
    return {
        "schools": [{
            "id": str(s.id), "name": s.name, "short_name": s.short_name,
            "country_code": s.country_code, "city": s.city,
            "type": s.type, "is_public": s.is_public,
            "ranking_national": s.ranking_national,
            "tuition_international_yearly": s.tuition_international_yearly,
            "program_count": program_counts.get(str(s.id), 0),
        } for s in schools],
        "total": len(schools),
    }


@router.post("/content/schools")
async def create_school(data: SchoolCreate, db: AsyncSession = Depends(get_db)):
    school = School(**data.model_dump())
    db.add(school)
    await db.commit()
    await db.refresh(school)
    return {"message": "School created", "id": str(school.id)}


@router.put("/content/schools/{school_id}")
async def update_school(school_id: str, data: SchoolUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(School).where(School.id == school_id))
    school = result.scalar_one_or_none()
    if not school:
        raise HTTPException(404, "School not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(school, field, value)
    await db.commit()
    return {"message": "School updated", "id": str(school.id)}


@router.delete("/content/schools/{school_id}")
async def delete_school(school_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(School).where(School.id == school_id))
    school = result.scalar_one_or_none()
    if not school:
        raise HTTPException(404, "School not found")
    await db.delete(school)
    await db.commit()
    return {"message": "School deleted"}


# ── Programs CRUD ────────────────────────────────────────

@router.get("/content/programs")
async def list_programs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Program, School.name.label("school_name"))
        .join(School, School.id == Program.school_id, isouter=True)
        .order_by(Program.name).limit(200)
    )
    rows = result.all()
    return {
        "programs": [{
            "id": str(r.Program.id), "name": r.Program.name,
            "school_id": str(r.Program.school_id), "school_name": r.school_name,
            "degree_type": r.Program.degree_type,
            "field_category": r.Program.field_category,
            "language_of_instruction": r.Program.language_of_instruction,
            "duration_months": r.Program.duration_months,
        } for r in rows],
        "total": len(rows),
    }


@router.post("/content/programs")
async def create_program(data: ProgramCreate, db: AsyncSession = Depends(get_db)):
    program = Program(**data.model_dump())
    db.add(program)
    await db.commit()
    await db.refresh(program)
    return {"message": "Program created", "id": str(program.id)}


@router.put("/content/programs/{program_id}")
async def update_program(program_id: str, data: ProgramUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(404, "Program not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(program, field, value)
    await db.commit()
    return {"message": "Program updated", "id": str(program.id)}


@router.delete("/content/programs/{program_id}")
async def delete_program(program_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Program).where(Program.id == program_id))
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(404, "Program not found")
    await db.delete(program)
    await db.commit()
    return {"message": "Program deleted"}


# ── Scholarships CRUD ────────────────────────────────────

@router.get("/content/scholarships")
async def list_scholarships(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scholarship).order_by(Scholarship.name).limit(100))
    scholarships = result.scalars().all()
    return {
        "scholarships": [{
            "id": str(s.id), "name": s.name, "provider": s.provider,
            "country_code": s.country_code, "competitiveness": s.competitiveness,
            "amount_description": s.amount_description,
            "application_deadline": s.application_deadline,
            "application_url": s.application_url,
            "is_active": s.is_active,
        } for s in scholarships],
        "total": len(scholarships),
    }


@router.post("/content/scholarships")
async def create_scholarship(data: ScholarshipCreate, db: AsyncSession = Depends(get_db)):
    scholarship = Scholarship(**data.model_dump())
    db.add(scholarship)
    await db.commit()
    await db.refresh(scholarship)
    return {"message": "Scholarship created", "id": str(scholarship.id)}


@router.put("/content/scholarships/{scholarship_id}")
async def update_scholarship(scholarship_id: str, data: ScholarshipUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scholarship).where(Scholarship.id == scholarship_id))
    scholarship = result.scalar_one_or_none()
    if not scholarship:
        raise HTTPException(404, "Scholarship not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(scholarship, field, value)
    await db.commit()
    return {"message": "Scholarship updated", "id": str(scholarship.id)}


@router.delete("/content/scholarships/{scholarship_id}")
async def delete_scholarship(scholarship_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Scholarship).where(Scholarship.id == scholarship_id))
    scholarship = result.scalar_one_or_none()
    if not scholarship:
        raise HTTPException(404, "Scholarship not found")
    await db.delete(scholarship)
    await db.commit()
    return {"message": "Scholarship deleted"}


# ── Roadmap Templates CRUD ───────────────────────────────

@router.get("/content/roadmaps")
async def list_roadmap_templates(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RoadmapTemplate).order_by(RoadmapTemplate.name).limit(50))
    templates = result.scalars().all()
    return {
        "templates": [{
            "id": str(t.id), "name": t.name,
            "country_code": t.country_code, "pathway": t.pathway,
            "total_steps": t.total_steps,
            "estimated_duration_weeks": t.estimated_duration_weeks,
        } for t in templates],
        "total": len(templates),
    }


@router.delete("/content/roadmaps/{template_id}")
async def delete_roadmap_template(template_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RoadmapTemplate).where(RoadmapTemplate.id == template_id))
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(404, "Roadmap template not found")
    await db.delete(template)
    await db.commit()
    return {"message": "Roadmap template deleted"}


# ── Exams (MongoDB) ──────────────────────────────────────

@router.get("/content/exams")
async def list_exams():
    """List exam types and question counts from MongoDB."""
    exams = await mongo_db.questions.aggregate([
        {"$group": {"_id": "$exam_code", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]).to_list(20)
    return {
        "exams": [{"exam_code": e["_id"], "question_count": e["count"]} for e in exams if e["_id"]],
        "total": len(exams),
    }


# ── Questions (MongoDB) ─────────────────────────────────

@router.get("/questions")
async def list_questions(status: str = None):
    """List questions from MongoDB with optional status filter."""
    query = {}
    if status and status != "all":
        query["status"] = status
    cursor = mongo_db.questions.find(query).sort("created_at", -1).limit(50)
    questions = await cursor.to_list(50)
    for q in questions:
        q["id"] = str(q.pop("_id"))
    pending = await mongo_db.questions.count_documents({"status": "pending"})
    return {"questions": questions, "total": len(questions), "pending": pending}


@router.put("/questions/{question_id}/approve")
async def approve_question(question_id: str):
    from bson import ObjectId
    await mongo_db.questions.update_one(
        {"_id": ObjectId(question_id)},
        {"$set": {"status": "approved"}},
    )
    return {"message": "Question approved"}


@router.put("/questions/{question_id}/reject")
async def reject_question(question_id: str):
    from bson import ObjectId
    await mongo_db.questions.update_one(
        {"_id": ObjectId(question_id)},
        {"$set": {"status": "rejected"}},
    )
    return {"message": "Question rejected"}


# ── Content Overview ─────────────────────────────────────

@router.get("/content/overview")
async def get_content_overview(db: AsyncSession = Depends(get_db)):
    """Get content overview for admin panel with distributions."""
    programs_by_field = await db.execute(
        select(Program.field_category, func.count(Program.id)).group_by(Program.field_category)
    )
    fields = {row[0]: row[1] for row in programs_by_field.all() if row[0]}

    schools_by_country = await db.execute(
        select(School.country_code, func.count(School.id)).group_by(School.country_code)
    )
    countries = {row[0]: row[1] for row in schools_by_country.all() if row[0]}

    scholarships_by_country = await db.execute(
        select(Scholarship.country_code, func.count(Scholarship.id)).group_by(Scholarship.country_code)
    )
    scholarship_countries = {row[0]: row[1] for row in scholarships_by_country.all() if row[0]}

    return {
        "programs_by_field": fields,
        "schools_by_country": countries,
        "scholarships_by_country": scholarship_countries,
    }


# ── Recent Activity ──────────────────────────────────────

@router.get("/recent-activity")
async def get_recent_activity(db: AsyncSession = Depends(get_db)):
    """Get recent platform activity."""
    recent_users = await db.execute(select(User).order_by(User.created_at.desc()).limit(5))
    users = recent_users.scalars().all()

    recent_roadmaps = await db.execute(
        select(UserRoadmap).order_by(UserRoadmap.created_at.desc()).limit(5)
    )
    roadmaps = recent_roadmaps.scalars().all()

    return {
        "recent_registrations": [
            {"id": str(u.id), "email": u.email, "full_name": u.full_name,
             "created_at": u.created_at.isoformat() if u.created_at else None}
            for u in users
        ],
        "recent_roadmaps": [
            {"id": str(r.id), "title": r.title,
             "created_at": r.created_at.isoformat() if r.created_at else None}
            for r in roadmaps
        ],
    }
