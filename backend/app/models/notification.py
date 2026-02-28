"""
Notification model — spec section 9.5
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Integer, DateTime, Text, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class NotificationQueue(Base):
    __tablename__ = "notification_queue"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    type = Column(
        SQLEnum(
            "deadline", "exam_reg", "step_reminder", "results",
            "digest", "acceptance", "study", "parent",
            name="notification_type"
        ),
        nullable=False,
    )
    channel = Column(
        SQLEnum("whatsapp", "email", "push", name="notification_channel"),
        nullable=False,
    )
    payload = Column(JSON, default=dict)
    status = Column(
        SQLEnum("pending", "sent", "failed", "cancelled", name="notification_status"),
        default="pending",
    )
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    error = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
