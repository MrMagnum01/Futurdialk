"""
Career Path model — for career exploration data.
"""

import uuid

from sqlalchemy import Column, String, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    title_fr = Column(String(200), nullable=True)
    field_category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    description_fr = Column(Text, nullable=True)
    riasec_code = Column(String(10), nullable=True)  # e.g. "RIA"
    required_degree = Column(String(100), nullable=True)
    avg_salary_mad = Column(Integer, nullable=True)
    growth_rate = Column(Numeric(5, 2), nullable=True)  # percentage
    demand_level = Column(String(20), nullable=True)  # high, medium, low
    skills = Column(JSON, default=list)
    related_programs = Column(JSON, default=list)  # list of field_category strings
    country_demand = Column(JSON, default=dict)  # {"FR": "high", "CA": "medium"}
    is_trending = Column(String(10), nullable=True)  # "up", "down", "stable"
