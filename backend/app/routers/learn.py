"""Language Learning router — spec section 19.7 — Real DB queries + AI chat."""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db, mongo_db
from app.core.security import get_current_user
from app.core.ai_service import language_chat
from app.models.learning import LearningProgress
from app.models.user import User

router = APIRouter(prefix="/api/learn", tags=["Language Learning"])

AVAILABLE_LANGUAGES = [
    {"code": "fr", "name": "French", "name_native": "Français", "flag": "🇫🇷"},
    {"code": "en", "name": "English", "name_native": "English", "flag": "🇬🇧"},
    {"code": "de", "name": "German", "name_native": "Deutsch", "flag": "🇩🇪"},
    {"code": "es", "name": "Spanish", "name_native": "Español", "flag": "🇪🇸"},
    {"code": "tr", "name": "Turkish", "name_native": "Türkçe", "flag": "🇹🇷"},
]


@router.get("/languages")
async def list_languages():
    return {"languages": AVAILABLE_LANGUAGES}


@router.get("/{lang}/path")
async def get_learning_path(lang: str):
    """Return course structure from MongoDB."""
    course = await mongo_db.language_courses.find_one({"language": lang})
    if course:
        course.pop("_id", None)
        return course
    # Fallback static structure
    return {
        "language": lang,
        "units": [
            {"unit": 1, "title": "Basics", "lessons": [
                {"lesson": 1, "title": "Greetings", "type": "vocabulary", "xp": 10},
                {"lesson": 2, "title": "Introductions", "type": "vocabulary", "xp": 10},
                {"lesson": 3, "title": "Numbers", "type": "vocabulary", "xp": 10},
            ]},
            {"unit": 2, "title": "Daily Life", "lessons": [
                {"lesson": 1, "title": "At the university", "type": "vocabulary", "xp": 15},
                {"lesson": 2, "title": "At the store", "type": "vocabulary", "xp": 15},
            ]},
        ],
    }


@router.get("/{lang}/lesson/{unit}/{lesson}")
async def get_lesson(lang: str, unit: int, lesson: int):
    """Return lesson content from MongoDB."""
    doc = await mongo_db.language_lessons.find_one({"language": lang, "unit": unit, "lesson": lesson})
    if doc:
        doc.pop("_id", None)
        return doc
    return {"lang": lang, "unit": unit, "lesson": lesson, "exercises": []}


@router.post("/{lang}/lesson/{unit}/{lesson}/complete")
async def complete_lesson(lang: str, unit: int, lesson: int,
                          current_user: User = Depends(get_current_user),
                          db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LearningProgress).where(
            LearningProgress.user_id == current_user["user_id"],
            LearningProgress.language == lang
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        progress = LearningProgress(user_id=current_user["user_id"], language=lang)
        db.add(progress)
    progress.total_lessons_completed = (progress.total_lessons_completed or 0) + 1
    progress.total_xp = (progress.total_xp or 0) + 10
    progress.current_unit = unit
    progress.current_lesson = lesson + 1
    from datetime import date
    progress.last_lesson_date = date.today()
    await db.commit()
    return {"message": "Lesson completed", "xp_earned": 10, "total_xp": progress.total_xp}


@router.get("/{lang}/vocabulary/review")
async def get_vocab_review(lang: str):
    cards = await mongo_db.vocabulary.find({"language": lang}).limit(20).to_list(20)
    for c in cards:
        c.pop("_id", None)
    return {"cards": cards}


@router.post("/{lang}/vocabulary/review")
async def submit_vocab_review(lang: str):
    return {"message": "Review submitted"}


class AIChatMessage(BaseModel):
    message: str
    history: Optional[list] = None


@router.post("/{lang}/ai-chat")
async def ai_chat(lang: str, data: AIChatMessage,
                  current_user: dict = Depends(get_current_user),
                  db: AsyncSession = Depends(get_db)):
    """AI language practice chat — responds in the target language."""
    # Get user's current level for this language
    result = await db.execute(
        select(LearningProgress).where(
            LearningProgress.user_id == current_user["user_id"],
            LearningProgress.language == lang
        )
    )
    progress = result.scalar_one_or_none()
    level = progress.current_level if progress and progress.current_level else "A2"

    response_text = await language_chat(data.message, lang, level, data.history)
    return {"response": response_text, "language": lang, "level": level}


@router.get("/{lang}/bridge/{exam}")
async def get_bridge(lang: str, exam: str):
    return {"bridge": {"language": lang, "exam": exam, "mapping": []}}
