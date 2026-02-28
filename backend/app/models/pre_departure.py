"""
Pre-departure checklist model — spec section 11.4
"""

import uuid

from sqlalchemy import Column, String, Numeric, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSON

from app.core.database import Base


class PreDepartureChecklist(Base):
    __tablename__ = "pre_departure_checklists"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    country_code = Column(String(5), nullable=False)
    city = Column(String(100), nullable=True)
    items = Column(JSON, default=list)
    departure_date = Column(Date, nullable=True)
    completion_pct = Column(Numeric, default=0)
