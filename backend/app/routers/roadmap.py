"""
Roadmap router — spec section 6.7
Generate roadmaps from templates, track step progress.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.roadmap import RoadmapTemplate, UserRoadmap
from app.schemas.roadmap import (
    RoadmapTemplateResponse, UserRoadmapResponse,
    RoadmapListResponse, GenerateRoadmapRequest, StepStatusUpdate,
)
from app.schemas.auth import MessageResponse

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])


def _template_response(t: RoadmapTemplate) -> RoadmapTemplateResponse:
    return RoadmapTemplateResponse(
        id=str(t.id), country_code=t.country_code,
        pathway=t.pathway, name=t.name,
        total_steps=t.total_steps,
        estimated_duration_weeks=t.estimated_duration_weeks,
        steps=t.steps,
    )


def _roadmap_response(r: UserRoadmap, template: Optional[RoadmapTemplate] = None) -> UserRoadmapResponse:
    return UserRoadmapResponse(
        id=str(r.id), user_id=str(r.user_id),
        template_id=str(r.template_id),
        program_id=str(r.program_id) if r.program_id else None,
        status=r.status, target_date=str(r.target_date) if r.target_date else None,
        current_phase=r.current_phase,
        steps_status=r.steps_status,
        generated_documents=r.generated_documents,
        notifications_enabled=r.notifications_enabled,
        template=_template_response(template) if template else None,
    )


@router.get("/templates")
async def list_templates(db: AsyncSession = Depends(get_db)):
    """List all available roadmap templates."""
    result = await db.execute(select(RoadmapTemplate))
    templates = result.scalars().all()
    return {
        "templates": [_template_response(t).model_dump() for t in templates],
        "total": len(templates),
    }


@router.post("/generate", response_model=UserRoadmapResponse)
async def generate_roadmap(
    data: GenerateRoadmapRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a personalized roadmap from a template."""
    # Verify template exists
    result = await db.execute(
        select(RoadmapTemplate).where(RoadmapTemplate.id == data.template_id)
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    # Initialize steps_status from template steps
    steps_status = []
    if template.steps:
        for i, step in enumerate(template.steps):
            steps_status.append({
                "step_id": i + 1,
                "title": step.get("title", f"Step {i + 1}"),
                "status": "not_started",
                "completed_at": None,
                "notes": "",
            })

    # Create user roadmap
    from datetime import date
    roadmap = UserRoadmap(
        user_id=current_user["user_id"],
        template_id=template.id,
        program_id=data.program_id if data.program_id else None,
        status="not_started",
        target_date=date.fromisoformat(data.target_date) if data.target_date else None,
        current_phase=1,
        steps_status=steps_status,
    )
    db.add(roadmap)
    await db.commit()
    await db.refresh(roadmap)

    return _roadmap_response(roadmap, template)


@router.get("/mine", response_model=RoadmapListResponse)
async def get_my_roadmaps(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List user's active roadmaps."""
    result = await db.execute(
        select(UserRoadmap).where(UserRoadmap.user_id == current_user["user_id"])
    )
    roadmaps = result.scalars().all()

    # Load templates
    responses = []
    for r in roadmaps:
        t_result = await db.execute(
            select(RoadmapTemplate).where(RoadmapTemplate.id == r.template_id)
        )
        template = t_result.scalar_one_or_none()
        responses.append(_roadmap_response(r, template))

    return RoadmapListResponse(roadmaps=responses, total=len(responses))


@router.get("/{roadmap_id}", response_model=UserRoadmapResponse)
async def get_roadmap(
    roadmap_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get roadmap detail with step statuses."""
    result = await db.execute(
        select(UserRoadmap).where(
            UserRoadmap.id == roadmap_id,
            UserRoadmap.user_id == current_user["user_id"],
        )
    )
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    t_result = await db.execute(
        select(RoadmapTemplate).where(RoadmapTemplate.id == roadmap.template_id)
    )
    template = t_result.scalar_one_or_none()

    return _roadmap_response(roadmap, template)


@router.put("/{roadmap_id}/step/{step_id}", response_model=MessageResponse)
async def update_step(
    roadmap_id: str,
    step_id: int,
    data: StepStatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a step's status in a roadmap."""
    result = await db.execute(
        select(UserRoadmap).where(
            UserRoadmap.id == roadmap_id,
            UserRoadmap.user_id == current_user["user_id"],
        )
    )
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    steps = roadmap.steps_status or []
    # Find the step by step_id
    found = False
    for step in steps:
        if step.get("step_id") == step_id:
            step["status"] = data.status
            if data.notes:
                step["notes"] = data.notes
            if data.status == "completed":
                from datetime import datetime, timezone
                step["completed_at"] = datetime.now(timezone.utc).isoformat()
            found = True
            break

    if not found:
        raise HTTPException(status_code=404, detail=f"Step {step_id} not found")

    roadmap.steps_status = steps
    # Update current phase based on progress
    completed = sum(1 for s in steps if s.get("status") == "completed")
    if completed == len(steps):
        roadmap.status = "completed"
    elif completed > 0:
        roadmap.status = "in_progress"
        roadmap.current_phase = completed + 1

    # Force SQLAlchemy to detect JSON change
    from sqlalchemy.orm.attributes import flag_modified
    flag_modified(roadmap, "steps_status")

    await db.commit()
    return MessageResponse(message=f"Step {step_id} updated to {data.status}")


@router.post("/{roadmap_id}/step/{step_id}/upload")
async def upload_step_doc(roadmap_id: str, step_id: str):
    """Upload document for a roadmap step (TODO: MinIO integration)."""
    return {"message": "Document uploaded"}
