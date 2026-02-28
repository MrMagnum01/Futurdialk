"""
User model — spec section 3.3
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum as SQLEnum, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(
        SQLEnum("student", "parent", "mentor", "admin", name="user_role"),
        nullable=False,
        default="student",
    )
    full_name = Column(String(200), nullable=False)
    date_of_birth = Column(DateTime, nullable=True)
    nationality = Column(String(50), default="Moroccan")
    city = Column(String(100), nullable=True)
    preferred_language = Column(String(5), default="fr")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime(timezone=True), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    onboarding_complete = Column(Boolean, default=False)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    gamification = relationship("UserGamification", back_populates="user", uselist=False)
