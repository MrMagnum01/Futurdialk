"""
Exam models — spec sections 5.5–5.6
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Integer, Numeric, DateTime, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    exam_code = Column(String(50), nullable=False, index=True)
    mode = Column(
        SQLEnum("full_simulation", "section_practice", "diagnostic", "timed_challenge", name="exam_mode"),
        nullable=False,
    )
    started_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime(timezone=True), nullable=True)
    sections_completed = Column(JSON, default=list)
    total_score = Column(Numeric, nullable=True)
    estimated_band_level = Column(String(20), nullable=True)


class ExamProgress(Base):
    __tablename__ = "exam_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    exam_code = Column(String(50), nullable=False)
    target_score = Column(String(20), nullable=True)
    current_estimated_score = Column(String(20), nullable=True)
    total_questions_answered = Column(Integer, default=0)
    streak_current = Column(Integer, default=0)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    study_plan = Column(JSON, default=list)
