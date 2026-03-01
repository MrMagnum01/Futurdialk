"""
Career Advisor schemas — spec section 4.6
"""

from pydantic import BaseModel
from typing import Optional


class MarketData(BaseModel):
    demand: str  # low, medium, high, very_high
    avg_salary: int
    currency: str = "MAD"
    growth_pct: float


class CareerPathResponse(BaseModel):
    id: str
    name: str
    name_fr: Optional[str] = None
    category: str
    riasec_codes: list[str] = []
    required_education: list[str] = []
    job_titles: list[str] = []
    description_fr: Optional[str] = None
    description_en: Optional[str] = None
    skills: list[str] = []
    automation_risk: str  # low, medium, high
    demand_level: Optional[str] = None
    market_data: dict[str, dict] = {}
    match_score: Optional[float] = None
    match_reason: Optional[str] = None


class MarketSnapshotResponse(BaseModel):
    career: str
    country: str
    job_postings_count: int = 0
    avg_salary: int = 0
    salary_growth_yoy: float = 0.0
    unemployment_rate_field: float = 0.0
    top_employers: list[str] = []
    required_skills: list[str] = []


class CompareRequest(BaseModel):
    career_ids: list[str]


class ROIRequest(BaseModel):
    career_id: str
    program_cost_mad: int
    years: int = 10


class ROIResponse(BaseModel):
    career_name: str
    program_cost_mad: int
    avg_salary_mad: int
    total_earnings_10yr: int
    net_roi: int
    roi_percentage: float
    payback_years: float


class DiscoverRequest(BaseModel):
    interests: list[str] = []
    riasec: list[str] = []
    preferred_fields: list[str] = []
