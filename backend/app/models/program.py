"""
Program model — spec section 3.6
"""

import uuid

from sqlalchemy import Column, String, Boolean, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=False)
    name = Column(String(300), nullable=False)
    degree_type = Column(
        SQLEnum(
            "licence", "master", "phd", "dut", "bts", "cpge",
            "diplome_ingenieur", "mba", "certificate",
            name="degree_type"
        ),
        nullable=True,
    )
    field_category = Column(String(100), nullable=True)
    language_of_instruction = Column(String(10), nullable=True)
    duration_months = Column(Integer, nullable=True)
    admission_requirements = Column(JSON, default=dict)
    career_outcomes = Column(JSON, default=list)
    is_moroccan = Column(Boolean, default=False)

    # Relationships
    school = relationship("School", back_populates="programs")
