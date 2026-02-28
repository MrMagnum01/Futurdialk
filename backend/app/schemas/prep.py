"""
Exam Prep schemas — spec section 5.9
"""

from pydantic import BaseModel
from typing import Optional


class ExamSection(BaseModel):
    name: str
    question_count: int
    time_minutes: int
    question_types: list[str] = []


class ExamInfo(BaseModel):
    code: str
    name: str
    language: str
    sections: list[ExamSection] = []
    total_duration_minutes: int = 0
    scoring: str = ""
    cefr_range: str = ""


class DiagnosticRequest(BaseModel):
    exam_code: str


class SimulationRequest(BaseModel):
    exam_code: str
    section: Optional[str] = None


class PracticeRequest(BaseModel):
    exam_code: str
    section: str
    question_count: int = 10


class AnswerItem(BaseModel):
    question_id: str
    answer: str


class SubmitRequest(BaseModel):
    attempt_id: str
    answers: list[AnswerItem]


class QuestionResponse(BaseModel):
    id: str
    exam_code: str
    section: str
    question_type: str
    difficulty: float
    content: dict


class AttemptResponse(BaseModel):
    id: str
    exam_code: str
    mode: str
    started_at: str
    completed_at: Optional[str] = None
    total_score: Optional[float] = None
    estimated_band_level: Optional[str] = None
    sections_completed: list[dict] = []
    questions: list[QuestionResponse] = []


class ProgressResponse(BaseModel):
    id: str
    exam_code: str
    target_score: Optional[str] = None
    current_estimated_score: Optional[str] = None
    total_questions_answered: int = 0
    streak_current: int = 0
    strengths: list[str] = []
    weaknesses: list[str] = []
    study_plan: list[dict] = []


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    display_name: str
    streak: int
    total_questions: int
    exam_code: str


class StudyPlanResponse(BaseModel):
    exam_code: str
    current_level: Optional[str] = None
    target_level: Optional[str] = None
    weeks: list[dict] = []
    daily_minutes: int = 45
    focus_areas: list[str] = []
