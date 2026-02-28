"""
Mentor model — spec section 12.3
"""

import uuid

from sqlalchemy import Column, String, Boolean, Integer, Numeric, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    country_code = Column(String(5), nullable=False, index=True)
    city = Column(String(100), nullable=True)
    university = Column(String(200), nullable=True)
    field = Column(String(200), nullable=True)
    arrival_year = Column(Integer, nullable=True)
    specialties = Column(JSON, default=list)
    bio = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    rating = Column(Numeric(3, 2), nullable=True)
    total_mentees = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    verification_doc_url = Column(String(500), nullable=True)
