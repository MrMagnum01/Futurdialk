"""
Roadmap models — spec sections 6.3–6.4
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Boolean, Integer, Date, DateTime, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class RoadmapTemplate(Base):
    __tablename__ = "roadmap_templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    country_code = Column(String(5), nullable=False, index=True)
    pathway = Column(String(100), nullable=False)
    name = Column(String(300), nullable=False)
    total_steps = Column(Integer, nullable=False)
    estimated_duration_weeks = Column(Integer, nullable=True)
    steps = Column(JSON, default=list)


class UserRoadmap(Base):
    __tablename__ = "user_roadmaps"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("roadmap_templates.id"), nullable=False)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=True)
    status = Column(
        SQLEnum("not_started", "in_progress", "completed", "abandoned", name="roadmap_status"),
        default="not_started",
    )
    target_date = Column(Date, nullable=True)
    current_phase = Column(Integer, default=1)
    steps_status = Column(JSON, default=list)
    generated_documents = Column(JSON, default=list)
    notifications_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
