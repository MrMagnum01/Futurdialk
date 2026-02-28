"""
Financial Planning schemas — budget calculation models.
"""

from pydantic import BaseModel
from typing import Optional, List


class BudgetItem(BaseModel):
    category: str
    label: str
    amount_mad: int
    notes: Optional[str] = None


class BudgetRequest(BaseModel):
    country_code: str
    city: Optional[str] = None
    program_type: Optional[str] = None  # licence, master, phd
    duration_months: int = 12
    include_visa: bool = True
    include_insurance: bool = True
    include_exams: bool = True


class BudgetResponse(BaseModel):
    country_code: str
    city: Optional[str] = None
    items: List[BudgetItem]
    total_yearly_mad: int
    total_monthly_mad: int
    currency_rate: Optional[float] = None
    currency_code: Optional[str] = None
    total_yearly_foreign: Optional[int] = None


class BudgetCompareRequest(BaseModel):
    countries: List[str]  # country codes
    program_type: Optional[str] = None
    duration_months: int = 12


class BudgetCompareResponse(BaseModel):
    comparisons: List[BudgetResponse]
