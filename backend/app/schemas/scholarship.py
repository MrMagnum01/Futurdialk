"""
Scholarship schemas — request/response models.
"""

from pydantic import BaseModel
from typing import Optional, List, Any


class ScholarshipResponse(BaseModel):
    id: str
    name: str
    provider: Optional[str] = None
    country_code: Optional[str] = None
    target_level: Optional[str] = None
    field_restrictions: Optional[Any] = None
    amount_description: Optional[str] = None
    deadline: Optional[str] = None
    eligibility: Optional[Any] = None
    url: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True


class ScholarshipListResponse(BaseModel):
    scholarships: List[ScholarshipResponse]
    total: int


class ScholarshipMatchResponse(BaseModel):
    scholarship: ScholarshipResponse
    match_score: float  # 0-100
    missing_requirements: List[str] = []
