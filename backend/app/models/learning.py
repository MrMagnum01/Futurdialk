"""
Language Learning model — spec section 19.6
"""

import uuid

from sqlalchemy import Column, String, Integer, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    language = Column(String(5), nullable=False)
    current_level = Column(String(5), nullable=True)
    current_unit = Column(Integer, default=1)
    current_lesson = Column(Integer, default=1)
    total_lessons_completed = Column(Integer, default=0)
    total_xp = Column(Integer, default=0)
    vocab_mastered = Column(Integer, default=0)
    vocab_learning = Column(Integer, default=0)
    streak_current = Column(Integer, default=0)
    last_lesson_date = Column(Date, nullable=True)
