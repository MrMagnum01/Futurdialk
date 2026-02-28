"""
Profile router — spec section 3.8
Full CRUD for user profile + student profile + onboarding.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.schemas.profile import (
    FullProfileResponse, ProfileResponse, StudentProfileResponse,
    ProfileUpdate, StudentProfileUpdate, OnboardingRequest,
)
from app.schemas.auth import MessageResponse

router = APIRouter(prefix="/api/profile", tags=["Profile"])


def _user_to_response(user: User) -> ProfileResponse:
    return ProfileResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        nationality=user.nationality or "Moroccan",
        city=user.city,
        preferred_language=user.preferred_language or "fr",
        is_verified=user.is_verified,
        onboarding_complete=user.onboarding_complete,
        date_of_birth=str(user.date_of_birth) if user.date_of_birth else None,
    )


def _student_to_response(sp: StudentProfile) -> StudentProfileResponse:
    return StudentProfileResponse(
        id=str(sp.id),
        user_id=str(sp.user_id),
        education_level=sp.education_level,
        bac_filiere=sp.bac_filiere,
        bac_year=sp.bac_year,
        bac_mention=sp.bac_mention,
        bac_average=float(sp.bac_average) if sp.bac_average else None,
        bac_math_score=float(sp.bac_math_score) if sp.bac_math_score else None,
        bac_physics_score=float(sp.bac_physics_score) if sp.bac_physics_score else None,
        bac_french_score=float(sp.bac_french_score) if sp.bac_french_score else None,
        bac_english_score=float(sp.bac_english_score) if sp.bac_english_score else None,
        university_name=sp.university_name,
        university_field=sp.university_field,
        university_gpa=float(sp.university_gpa) if sp.university_gpa else None,
        university_gpa_system=sp.university_gpa_system,
        languages_spoken=sp.languages_spoken or [],
        exam_scores=sp.exam_scores or [],
        budget_max_yearly_mad=sp.budget_max_yearly_mad,
        preferred_countries=sp.preferred_countries or [],
        preferred_fields=sp.preferred_fields or [],
        preferred_language_of_study=sp.preferred_language_of_study or [],
        timeline=sp.timeline,
        interested_in_scholarships=sp.interested_in_scholarships or False,
    )


@router.get("", response_model=FullProfileResponse)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get full profile (user + student profile)."""
    result = await db.execute(
        select(User)
        .options(selectinload(User.student_profile))
        .where(User.id == current_user["user_id"])
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return FullProfileResponse(
        user=_user_to_response(user),
        student_profile=_student_to_response(user.student_profile) if user.student_profile else None,
    )


@router.put("", response_model=ProfileResponse)
async def update_profile(
    data: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update basic user fields."""
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return _user_to_response(user)


@router.put("/student", response_model=StudentProfileResponse)
async def update_student_profile(
    data: StudentProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update student academic profile."""
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user["user_id"])
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found")

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            # Convert Pydantic models to dicts for JSON fields
            if isinstance(value, list) and value and hasattr(value[0], "model_dump"):
                value = [v.model_dump() for v in value]
            setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
    return _student_to_response(profile)


@router.post("/onboarding", response_model=FullProfileResponse)
async def complete_onboarding(
    data: OnboardingRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save 5-step onboarding wizard data and mark onboarding complete."""
    # Get user
    result = await db.execute(select(User).where(User.id == current_user["user_id"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get or create student profile
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user["user_id"])
    )
    profile = result.scalar_one_or_none()
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.add(profile)

    # Update student profile with onboarding data
    profile.education_level = data.education_level
    profile.bac_filiere = data.bac_filiere
    profile.bac_year = data.bac_year
    profile.bac_mention = data.bac_mention
    profile.bac_average = data.bac_average
    profile.bac_math_score = data.bac_math_score
    profile.bac_physics_score = data.bac_physics_score
    profile.bac_french_score = data.bac_french_score
    profile.bac_english_score = data.bac_english_score
    profile.university_name = data.university_name
    profile.university_field = data.university_field
    profile.university_gpa = data.university_gpa
    profile.preferred_countries = data.preferred_countries
    profile.preferred_fields = data.preferred_fields
    profile.budget_max_yearly_mad = data.budget_max_yearly_mad
    profile.timeline = data.timeline
    profile.interested_in_scholarships = data.interested_in_scholarships
    profile.languages_spoken = [l.model_dump() for l in data.languages_spoken]
    profile.exam_scores = [e.model_dump() for e in data.exam_scores]
    profile.preferred_language_of_study = data.preferred_language_of_study

    # Mark onboarding complete
    user.onboarding_complete = True

    await db.commit()
    await db.refresh(user)
    await db.refresh(profile)

    return FullProfileResponse(
        user=_user_to_response(user),
        student_profile=_student_to_response(profile),
    )
