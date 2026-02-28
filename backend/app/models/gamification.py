"""
Gamification models — spec sections 15.3–15.4
"""

import uuid

from sqlalchemy import (
    Column, String, Boolean, Integer, Date, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserGamification(Base):
    __tablename__ = "user_gamification"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    xp_total = Column(Integer, default=0)
    level = Column(
        SQLEnum("beginner", "intermediate", "advanced", "expert", "master", name="gamer_level"),
        default="beginner",
    )
    streak_current = Column(Integer, default=0)
    streak_longest = Column(Integer, default=0)
    streak_freezes_remaining = Column(Integer, default=1)
    last_activity_date = Column(Date, nullable=True)
    badges = Column(JSON, default=list)
    daily_challenge_completed_today = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="gamification")


class StudyGroup(Base):
    __tablename__ = "study_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    exam_code = Column(String(50), nullable=False)
    target_score = Column(String(20), nullable=True)
    member_ids = Column(JSON, default=list)
    max_members = Column(Integer, default=30)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    is_active = Column(Boolean, default=True)
