"""
Student Profile model — spec section 3.4
"""

import uuid

from sqlalchemy import (
    Column, String, Boolean, Integer, Numeric, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    education_level = Column(
        SQLEnum(
            "bac_current", "bac_obtained", "licence", "master", "phd", "professional",
            name="education_level"
        ),
        nullable=True,
    )
    bac_filiere = Column(String(50), nullable=True)
    bac_year = Column(Integer, nullable=True)
    bac_mention = Column(String(30), nullable=True)
    bac_average = Column(Numeric(4, 2), nullable=True)
    bac_math_score = Column(Numeric(4, 2), nullable=True)
    bac_physics_score = Column(Numeric(4, 2), nullable=True)
    bac_french_score = Column(Numeric(4, 2), nullable=True)
    bac_english_score = Column(Numeric(4, 2), nullable=True)

    university_name = Column(String(200), nullable=True)
    university_field = Column(String(200), nullable=True)
    university_gpa = Column(Numeric(4, 2), nullable=True)
    university_gpa_system = Column(
        SQLEnum("out_of_20", "out_of_4", name="gpa_system"),
        nullable=True,
    )

    languages_spoken = Column(JSON, default=list)
    exam_scores = Column(JSON, default=list)
    budget_max_yearly_mad = Column(Integer, nullable=True)
    preferred_countries = Column(JSON, default=list)
    preferred_fields = Column(JSON, default=list)
    preferred_language_of_study = Column(JSON, default=list)
    timeline = Column(String(50), nullable=True)
    interested_in_scholarships = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="student_profile")
