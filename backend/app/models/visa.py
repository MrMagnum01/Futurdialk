"""
Visa Interview Prep model — spec section 18.4
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, String, Integer, Numeric, Text, DateTime, ForeignKey,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class VisaMockSession(Base):
    __tablename__ = "visa_mock_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    country_code = Column(String(5), nullable=False)
    embassy_city = Column(String(100), nullable=True)
    mode = Column(SQLEnum("voice", "text", name="interview_mode"), nullable=False)
    questions_asked = Column(Integer, default=0)
    overall_score = Column(Numeric, nullable=True)
    scores_breakdown = Column(JSON, default=dict)
    feedback_summary = Column(Text, nullable=True)
    recording_urls = Column(JSON, default=list)
    transcript = Column(JSON, default=list)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
