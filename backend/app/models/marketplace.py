"""
Marketplace models — spec sections 14.2–14.3
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Boolean, Integer, Numeric, Text, DateTime,
    ForeignKey, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(300), nullable=False)
    category = Column(
        SQLEnum(
            "translator", "legalization", "exam_help", "photo",
            "medical", "tutor", "blocked_acct", "insurance",
            name="service_category"
        ),
        nullable=False,
    )
    city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)
    languages = Column(JSON, default=list)
    price_description = Column(Text, nullable=True)
    turnaround_days = Column(Integer, nullable=True)
    rating = Column(Numeric(3, 2), nullable=True)
    total_reviews = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)


class ServiceReview(Base):
    __tablename__ = "service_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider_id = Column(UUID(as_uuid=True), ForeignKey("service_providers.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    roadmap_step_id = Column(UUID(as_uuid=True), nullable=True)
    stars = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    provider_response = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
