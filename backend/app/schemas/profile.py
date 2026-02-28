"""
Profile schemas — request/response models for profile & onboarding endpoints.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class LanguageSkill(BaseModel):
    language: str
    level: str  # A1, A2, B1, B2, C1, C2


class ExamScore(BaseModel):
    exam: str
    score: str
    date: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    nationality: str = "Moroccan"
    city: Optional[str] = None
    preferred_language: str = "fr"
    is_verified: bool = False
    onboarding_complete: bool = False
    date_of_birth: Optional[str] = None

    class Config:
        from_attributes = True


class StudentProfileResponse(BaseModel):
    id: str
    user_id: str
    education_level: Optional[str] = None
    bac_filiere: Optional[str] = None
    bac_year: Optional[int] = None
    bac_mention: Optional[str] = None
    bac_average: Optional[float] = None
    bac_math_score: Optional[float] = None
    bac_physics_score: Optional[float] = None
    bac_french_score: Optional[float] = None
    bac_english_score: Optional[float] = None
    university_name: Optional[str] = None
    university_field: Optional[str] = None
    university_gpa: Optional[float] = None
    university_gpa_system: Optional[str] = None
    languages_spoken: Optional[List[LanguageSkill]] = []
    exam_scores: Optional[List[ExamScore]] = []
    budget_max_yearly_mad: Optional[int] = None
    preferred_countries: Optional[List[str]] = []
    preferred_fields: Optional[List[str]] = []
    preferred_language_of_study: Optional[List[str]] = []
    timeline: Optional[str] = None
    interested_in_scholarships: bool = True

    class Config:
        from_attributes = True


class FullProfileResponse(BaseModel):
    user: ProfileResponse
    student_profile: Optional[StudentProfileResponse] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    preferred_language: Optional[str] = None
    nationality: Optional[str] = None
    date_of_birth: Optional[str] = None


class StudentProfileUpdate(BaseModel):
    education_level: Optional[str] = None
    bac_filiere: Optional[str] = None
    bac_year: Optional[int] = None
    bac_mention: Optional[str] = None
    bac_average: Optional[float] = None
    bac_math_score: Optional[float] = None
    bac_physics_score: Optional[float] = None
    bac_french_score: Optional[float] = None
    bac_english_score: Optional[float] = None
    university_name: Optional[str] = None
    university_field: Optional[str] = None
    university_gpa: Optional[float] = None
    university_gpa_system: Optional[str] = None
    languages_spoken: Optional[List[LanguageSkill]] = None
    exam_scores: Optional[List[ExamScore]] = None
    budget_max_yearly_mad: Optional[int] = None
    preferred_countries: Optional[List[str]] = None
    preferred_fields: Optional[List[str]] = None
    preferred_language_of_study: Optional[List[str]] = None
    timeline: Optional[str] = None
    interested_in_scholarships: Optional[bool] = None


class OnboardingRequest(BaseModel):
    """5-step onboarding wizard data."""
    # Step 1: Role (already set at register)
    # Step 2: Education
    education_level: str
    bac_filiere: Optional[str] = None
    bac_year: Optional[int] = None
    bac_mention: Optional[str] = None
    bac_average: Optional[float] = None
    bac_math_score: Optional[float] = None
    bac_physics_score: Optional[float] = None
    bac_french_score: Optional[float] = None
    bac_english_score: Optional[float] = None
    university_name: Optional[str] = None
    university_field: Optional[str] = None
    university_gpa: Optional[float] = None
    # Step 3: Preferences
    preferred_countries: List[str] = []
    preferred_fields: List[str] = []
    budget_max_yearly_mad: Optional[int] = None
    timeline: Optional[str] = None
    interested_in_scholarships: bool = True
    # Step 4: Languages
    languages_spoken: List[LanguageSkill] = []
    exam_scores: List[ExamScore] = []
    preferred_language_of_study: List[str] = []
