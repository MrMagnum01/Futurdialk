"""
Explore schemas — request/response models for programs & schools.
"""

from pydantic import BaseModel
from typing import Optional, List, Any


class SchoolBrief(BaseModel):
    id: str
    name: str
    short_name: Optional[str] = None
    country_code: str
    city: Optional[str] = None
    type: Optional[str] = None
    is_public: Optional[bool] = None
    ranking_world: Optional[int] = None
    tuition_international_yearly: Optional[str] = None
    has_moroccan_students: bool = False
    scholarship_available: bool = False

    class Config:
        from_attributes = True


class SchoolResponse(BaseModel):
    id: str
    name: str
    short_name: Optional[str] = None
    country_code: str
    city: Optional[str] = None
    type: Optional[str] = None
    is_public: Optional[bool] = None
    ranking_national: Optional[int] = None
    ranking_world: Optional[int] = None
    tuition_international_yearly: Optional[str] = None
    acceptance_rate: Optional[float] = None
    has_moroccan_students: bool = False
    application_platform: Optional[str] = None
    scholarship_available: bool = False

    class Config:
        from_attributes = True


class ProgramResponse(BaseModel):
    id: str
    school_id: str
    name: str
    degree_type: Optional[str] = None
    field_category: Optional[str] = None
    language_of_instruction: Optional[str] = None
    duration_months: Optional[int] = None
    admission_requirements: Optional[Any] = None
    career_outcomes: Optional[Any] = None
    is_moroccan: bool = False
    # Joined school info
    school: Optional[SchoolBrief] = None

    class Config:
        from_attributes = True


class ProgramListResponse(BaseModel):
    programs: List[ProgramResponse]
    total: int
    page: int = 1
    per_page: int = 20


class SchoolListResponse(BaseModel):
    schools: List[SchoolResponse]
    total: int
    page: int = 1
    per_page: int = 20


class SchoolDetailResponse(SchoolResponse):
    programs: List[ProgramResponse] = []
