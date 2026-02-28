"""
Integration Hub model — spec section 17.4
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Boolean, Text, DateTime, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class PlatformConnection(Base):
    __tablename__ = "platform_connections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    platform = Column(
        SQLEnum("campus_france", "uni_assist", "ucas", "google_calendar", name="platform_type"),
        nullable=False,
    )
    credentials_encrypted = Column(Text, nullable=True)
    last_checked_at = Column(DateTime(timezone=True), nullable=True)
    last_status = Column(String(200), nullable=True)
    status_history = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
