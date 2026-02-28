"""
Scholarships router — spec section 10.6
Full CRUD with filtering + profile-based matching.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.scholarship import Scholarship
from app.models.student_profile import StudentProfile
from app.schemas.scholarship import (
    ScholarshipResponse, ScholarshipListResponse, ScholarshipMatchResponse,
)
from app.schemas.auth import MessageResponse

router = APIRouter(prefix="/api/scholarships", tags=["Scholarships"])


def _scholarship_response(s: Scholarship) -> ScholarshipResponse:
    return ScholarshipResponse(
        id=str(s.id),
        name=s.name,
        provider=s.provider,
        country_code=s.country_code,
        target_level=", ".join(s.eligibility_education_level) if s.eligibility_education_level else None,
        field_restrictions=s.eligibility_field,
        amount_description=s.amount_description,
        deadline=s.application_deadline,
        eligibility={
            "nationality": s.eligibility_nationality,
            "education_level": s.eligibility_education_level,
            "field": s.eligibility_field,
            "min_gpa": float(s.eligibility_gpa_min) if s.eligibility_gpa_min else None,
        },
        url=s.application_url,
        is_active=s.is_active,
    )


@router.get("", response_model=ScholarshipListResponse)
async def list_scholarships(
    country: Optional[str] = None,
    field: Optional[str] = None,
    active_only: bool = True,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List scholarships with optional filtering."""
    query = select(Scholarship)

    if active_only:
        query = query.where(Scholarship.is_active == True)
    if country:
        query = query.where(Scholarship.country_code == country.upper())
    if search:
        query = query.where(Scholarship.name.ilike(f"%{search}%"))

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    result = await db.execute(query)
    scholarships = result.scalars().all()

    return ScholarshipListResponse(
        scholarships=[_scholarship_response(s) for s in scholarships],
        total=total,
    )


@router.get("/{scholarship_id}", response_model=ScholarshipResponse)
async def get_scholarship(scholarship_id: str, db: AsyncSession = Depends(get_db)):
    """Get single scholarship by ID."""
    result = await db.execute(
        select(Scholarship).where(Scholarship.id == scholarship_id)
    )
    scholarship = result.scalar_one_or_none()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return _scholarship_response(scholarship)


@router.post("/match")
async def match_scholarships(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Match scholarships to user's profile."""
    # Get student profile
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user["user_id"])
    )
    profile = result.scalar_one_or_none()

    # Get all active scholarships
    result = await db.execute(
        select(Scholarship).where(Scholarship.is_active == True)
    )
    scholarships = result.scalars().all()

    matches = []
    for s in scholarships:
        score = 0.0
        missing = []

        # Country match (does user want this country?)
        if profile and profile.preferred_countries:
            if s.country_code in profile.preferred_countries:
                score += 30
            else:
                missing.append(f"Country {s.country_code} not in preferences")

        # Education level match
        if profile and profile.education_level and s.eligibility_education_level:
            if profile.education_level in s.eligibility_education_level:
                score += 25
            else:
                missing.append(f"Requires: {', '.join(s.eligibility_education_level)}")

        # Field match
        if profile and profile.preferred_fields and s.eligibility_field:
            overlap = set(profile.preferred_fields) & set(s.eligibility_field)
            if overlap:
                score += 25
            else:
                missing.append(f"Field restriction: {', '.join(s.eligibility_field)}")
        elif not s.eligibility_field:
            score += 25  # No field restriction = open to all

        # GPA match
        if profile and profile.bac_average and s.eligibility_gpa_min:
            if float(profile.bac_average) >= float(s.eligibility_gpa_min):
                score += 20
            else:
                missing.append(f"Min GPA: {s.eligibility_gpa_min}")
        elif not s.eligibility_gpa_min:
            score += 20  # No GPA requirement

        # If no profile, give base score
        if not profile:
            score = 50
            missing = ["Complete your profile for better matching"]

        matches.append({
            "scholarship": _scholarship_response(s).model_dump(),
            "match_score": round(score, 1),
            "missing_requirements": missing,
        })

    # Sort by match score
    matches.sort(key=lambda x: x["match_score"], reverse=True)

    return {"matches": matches, "total": len(matches)}
