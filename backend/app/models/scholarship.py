"""
Scholarship model — spec section 10.2
"""

import uuid

from sqlalchemy import Column, String, Boolean, Numeric, Text, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(300), nullable=False)
    provider = Column(String(200), nullable=True)
    country_code = Column(String(5), nullable=False, index=True)
    eligibility_nationality = Column(JSON, default=list)
    eligibility_education_level = Column(JSON, default=list)
    eligibility_field = Column(JSON, default=list)
    eligibility_gpa_min = Column(Numeric, nullable=True)
    coverage = Column(JSON, default=dict)
    amount_description = Column(Text, nullable=True)
    application_deadline = Column(String(200), nullable=True)
    application_url = Column(String(500), nullable=True)
    competitiveness = Column(
        SQLEnum("low", "medium", "high", "very_high", name="competitiveness_level"),
        nullable=True,
    )
    success_rate_moroccan = Column(Numeric, nullable=True)
    tips = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
