"""
School model — spec section 3.5
"""

import uuid

from sqlalchemy import Column, String, Boolean, Integer, Numeric, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class School(Base):
    __tablename__ = "schools"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(300), nullable=False)
    short_name = Column(String(100), nullable=True)
    country_code = Column(String(5), nullable=False, index=True)
    city = Column(String(100), nullable=True)
    type = Column(
        SQLEnum(
            "university", "grande_ecole", "community_college",
            "language_school", "prep_school",
            name="school_type"
        ),
        nullable=True,
    )
    is_public = Column(Boolean, default=True)
    ranking_national = Column(Integer, nullable=True)
    ranking_world = Column(Integer, nullable=True)
    tuition_international_yearly = Column(String(100), nullable=True)
    acceptance_rate = Column(Numeric(5, 2), nullable=True)
    has_moroccan_students = Column(Boolean, default=False)
    application_platform = Column(String(100), nullable=True)
    scholarship_available = Column(Boolean, default=False)

    # Relationships
    programs = relationship("Program", back_populates="school")
