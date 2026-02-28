"""
Explore router — spec section 3.8 (exploration endpoints)
Paginated programs & schools with filtering + joins.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Optional

from app.core.database import get_db
from app.models.school import School
from app.models.program import Program
from app.schemas.explore import (
    ProgramResponse, ProgramListResponse, SchoolBrief,
    SchoolResponse, SchoolListResponse, SchoolDetailResponse,
)

router = APIRouter(prefix="/api/explore", tags=["Explore"])


def _school_brief(s: School) -> SchoolBrief:
    return SchoolBrief(
        id=str(s.id), name=s.name, short_name=s.short_name,
        country_code=s.country_code, city=s.city, type=s.type,
        is_public=s.is_public,
        ranking_world=s.ranking_world,
        tuition_international_yearly=s.tuition_international_yearly,
        has_moroccan_students=s.has_moroccan_students,
        scholarship_available=s.scholarship_available,
    )


def _program_response(p: Program) -> ProgramResponse:
    return ProgramResponse(
        id=str(p.id), school_id=str(p.school_id), name=p.name,
        degree_type=p.degree_type, field_category=p.field_category,
        language_of_instruction=p.language_of_instruction,
        duration_months=p.duration_months,
        admission_requirements=p.admission_requirements,
        career_outcomes=p.career_outcomes,
        is_moroccan=p.is_moroccan,
        school=_school_brief(p.school) if p.school else None,
    )


def _school_response(s: School) -> SchoolResponse:
    return SchoolResponse(
        id=str(s.id), name=s.name, short_name=s.short_name,
        country_code=s.country_code, city=s.city, type=s.type,
        is_public=s.is_public,
        ranking_national=s.ranking_national, ranking_world=s.ranking_world,
        tuition_international_yearly=s.tuition_international_yearly,
        acceptance_rate=float(s.acceptance_rate) if s.acceptance_rate else None,
        has_moroccan_students=s.has_moroccan_students,
        application_platform=s.application_platform,
        scholarship_available=s.scholarship_available,
    )


@router.get("/programs", response_model=ProgramListResponse)
async def list_programs(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    country: Optional[str] = None,
    field: Optional[str] = None,
    degree: Optional[str] = None,
    language: Optional[str] = None,
    search: Optional[str] = None,
    is_moroccan: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
):
    """List programs with pagination & filtering."""
    # Build filters separately so we can apply to both count and data queries
    filters = []
    need_school_join = False
    if country:
        filters.append(School.country_code == country.upper())
        need_school_join = True
    if field:
        filters.append(Program.field_category == field)
    if degree:
        filters.append(Program.degree_type == degree)
    if language:
        filters.append(Program.language_of_instruction == language)
    if is_moroccan is not None:
        filters.append(Program.is_moroccan == is_moroccan)
    if search:
        filters.append(Program.name.ilike(f"%{search}%"))

    # Count total (clean query without eager loading)
    count_q = select(func.count(Program.id))
    if need_school_join:
        count_q = count_q.join(School)
    for f in filters:
        count_q = count_q.where(f)
    total_result = await db.execute(count_q)
    total = total_result.scalar() or 0

    # Data query with eager loading + pagination
    query = select(Program).options(selectinload(Program.school))
    if need_school_join:
        query = query.join(School)
    for f in filters:
        query = query.where(f)
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    programs = result.scalars().all()

    return ProgramListResponse(
        programs=[_program_response(p) for p in programs],
        total=total, page=page, per_page=per_page,
    )


@router.get("/programs/{program_id}", response_model=ProgramResponse)
async def get_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """Get single program by ID."""
    result = await db.execute(
        select(Program).options(selectinload(Program.school))
        .where(Program.id == program_id)
    )
    program = result.scalar_one_or_none()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return _program_response(program)


@router.get("/schools", response_model=SchoolListResponse)
async def list_schools(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    country: Optional[str] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List schools with pagination & filtering."""
    query = select(School)

    if country:
        query = query.where(School.country_code == country.upper())
    if type:
        query = query.where(School.type == type)
    if search:
        query = query.where(School.name.ilike(f"%{search}%"))

    # Count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Paginate
    query = query.offset((page - 1) * per_page).limit(per_page)
    result = await db.execute(query)
    schools = result.scalars().all()

    return SchoolListResponse(
        schools=[_school_response(s) for s in schools],
        total=total, page=page, per_page=per_page,
    )


@router.get("/schools/{school_id}", response_model=SchoolDetailResponse)
async def get_school(school_id: str, db: AsyncSession = Depends(get_db)):
    """Get school with its programs."""
    result = await db.execute(
        select(School).options(selectinload(School.programs))
        .where(School.id == school_id)
    )
    school = result.scalar_one_or_none()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    resp = _school_response(school)
    return SchoolDetailResponse(
        **resp.model_dump(),
        programs=[_program_response(p) for p in school.programs],
    )


@router.post("/save-path")
async def save_path():
    """Save exploration path (TODO: needs path model)."""
    return {"message": "Path saved"}


@router.get("/saved-paths")
async def get_saved_paths():
    """Get saved exploration paths (TODO: needs path model)."""
    return {"paths": []}
