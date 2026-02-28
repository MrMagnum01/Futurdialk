"""
Roadmap schemas — request/response models for roadmap generation & tracking.
"""

from pydantic import BaseModel
from typing import Optional, List, Any


class RoadmapTemplateResponse(BaseModel):
    id: str
    country_code: str
    pathway: str
    name: str
    total_steps: int
    estimated_duration_weeks: Optional[int] = None
    steps: Optional[Any] = None

    class Config:
        from_attributes = True


class UserRoadmapResponse(BaseModel):
    id: str
    user_id: str
    template_id: str
    program_id: Optional[str] = None
    status: str = "not_started"
    target_date: Optional[str] = None
    current_phase: int = 1
    steps_status: Optional[Any] = None
    generated_documents: Optional[Any] = None
    notifications_enabled: bool = True
    # Joined template info
    template: Optional[RoadmapTemplateResponse] = None

    class Config:
        from_attributes = True


class RoadmapListResponse(BaseModel):
    roadmaps: List[UserRoadmapResponse]
    total: int


class GenerateRoadmapRequest(BaseModel):
    template_id: str
    program_id: Optional[str] = None
    target_date: Optional[str] = None


class StepStatusUpdate(BaseModel):
    status: str  # not_started, in_progress, completed, blocked
    notes: Optional[str] = None
