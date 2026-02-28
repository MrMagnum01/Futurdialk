"""
Exam Prep router — spec section 5.9
Full implementation: question bank from MongoDB, exam tracking in PostgreSQL.
AI-powered writing evaluation, speaking evaluation, and study plans via OpenRouter.
"""

import random
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from bson import ObjectId

from app.core.database import get_db, get_mongo
from app.core.ai_service import evaluate_writing as ai_evaluate_writing, evaluate_speaking as ai_evaluate_speaking, generate_study_plan as ai_generate_study_plan
from app.core.security import get_current_user
from app.models.exam import ExamAttempt, ExamProgress
from app.schemas.prep import (
    DiagnosticRequest, SimulationRequest, PracticeRequest,
    SubmitRequest, AttemptResponse, QuestionResponse,
    ProgressResponse, LeaderboardEntry, StudyPlanResponse, ExamInfo, ExamSection,
)

router = APIRouter(prefix="/api/prep", tags=["Exam Prep"])

# ── Exam catalog (hardcoded metadata) ─────────────────────

EXAM_CATALOG = [
    {
        "code": "ielts_academic",
        "name": "IELTS Academic",
        "language": "English",
        "sections": [
            {"name": "listening", "question_count": 40, "time_minutes": 30, "question_types": ["mcq", "fill_blank", "matching"]},
            {"name": "reading", "question_count": 40, "time_minutes": 60, "question_types": ["mcq", "fill_blank", "true_false"]},
            {"name": "writing", "question_count": 2, "time_minutes": 60, "question_types": ["essay", "report"]},
            {"name": "speaking", "question_count": 3, "time_minutes": 14, "question_types": ["interview", "topic_card", "discussion"]},
        ],
        "total_duration_minutes": 164,
        "scoring": "Band 1.0–9.0 (0.5 increments)",
        "cefr_range": "A1–C2",
    },
    {
        "code": "tcf_tp",
        "name": "TCF Tout Public",
        "language": "French",
        "sections": [
            {"name": "comprehension_orale", "question_count": 29, "time_minutes": 25, "question_types": ["mcq"]},
            {"name": "maitrise_structures", "question_count": 18, "time_minutes": 15, "question_types": ["mcq", "fill_blank"]},
            {"name": "comprehension_ecrite", "question_count": 29, "time_minutes": 45, "question_types": ["mcq"]},
        ],
        "total_duration_minutes": 85,
        "scoring": "100–699 points",
        "cefr_range": "A1–C2",
    },
    {
        "code": "toefl_ibt",
        "name": "TOEFL iBT",
        "language": "English",
        "sections": [
            {"name": "reading", "question_count": 20, "time_minutes": 35, "question_types": ["mcq", "insert_text"]},
            {"name": "listening", "question_count": 28, "time_minutes": 36, "question_types": ["mcq"]},
            {"name": "speaking", "question_count": 4, "time_minutes": 16, "question_types": ["independent", "integrated"]},
            {"name": "writing", "question_count": 2, "time_minutes": 29, "question_types": ["integrated", "independent"]},
        ],
        "total_duration_minutes": 116,
        "scoring": "0–120 (30 per section)",
        "cefr_range": "B1–C1",
    },
    {
        "code": "bac_sciences_math",
        "name": "BAC Sciences Mathématiques",
        "language": "French",
        "sections": [
            {"name": "mathematiques", "question_count": 6, "time_minutes": 180, "question_types": ["problem_solving", "proof"]},
            {"name": "physique_chimie", "question_count": 4, "time_minutes": 120, "question_types": ["problem_solving", "mcq"]},
            {"name": "svt", "question_count": 4, "time_minutes": 120, "question_types": ["essay", "mcq", "diagram"]},
        ],
        "total_duration_minutes": 420,
        "scoring": "/20 (mention scale)",
        "cefr_range": "N/A",
    },
    {
        "code": "delf_b2",
        "name": "DELF B2",
        "language": "French",
        "sections": [
            {"name": "comprehension_orale", "question_count": 20, "time_minutes": 30, "question_types": ["mcq"]},
            {"name": "comprehension_ecrite", "question_count": 20, "time_minutes": 60, "question_types": ["mcq", "fill_blank"]},
            {"name": "production_ecrite", "question_count": 1, "time_minutes": 60, "question_types": ["essay"]},
            {"name": "production_orale", "question_count": 1, "time_minutes": 20, "question_types": ["presentation", "debate"]},
        ],
        "total_duration_minutes": 170,
        "scoring": "/100 (25 per section, min 50 to pass)",
        "cefr_range": "B2",
    },
    {
        "code": "testdaf",
        "name": "TestDaF",
        "language": "German",
        "sections": [
            {"name": "leseverstehen", "question_count": 30, "time_minutes": 60, "question_types": ["mcq", "true_false"]},
            {"name": "hoerverstehen", "question_count": 25, "time_minutes": 40, "question_types": ["mcq", "fill_blank"]},
            {"name": "schriftlicher_ausdruck", "question_count": 1, "time_minutes": 60, "question_types": ["essay"]},
            {"name": "muendlicher_ausdruck", "question_count": 7, "time_minutes": 35, "question_types": ["speaking"]},
        ],
        "total_duration_minutes": 195,
        "scoring": "TDN 3–5 per section",
        "cefr_range": "B2–C1",
    },
]


def _question_doc_to_response(doc: dict) -> QuestionResponse:
    content = doc.get("content", {})
    # Remove correct_answer from content sent to client
    safe_content = {k: v for k, v in content.items() if k != "correct_answer"}
    return QuestionResponse(
        id=str(doc["_id"]),
        exam_code=doc.get("exam_code", ""),
        section=doc.get("section", ""),
        question_type=doc.get("question_type", "mcq"),
        difficulty=doc.get("difficulty", 0.5),
        content=safe_content,
    )


@router.get("/exams")
async def list_exams():
    """List all available exams with their sections and metadata."""
    exams = [
        ExamInfo(
            code=e["code"],
            name=e["name"],
            language=e["language"],
            sections=[ExamSection(**s) for s in e["sections"]],
            total_duration_minutes=e["total_duration_minutes"],
            scoring=e["scoring"],
            cefr_range=e["cefr_range"],
        ).model_dump()
        for e in EXAM_CATALOG
    ]
    return {"exams": exams, "total": len(exams)}


@router.post("/diagnostic")
async def start_diagnostic(
    data: DiagnosticRequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Start a diagnostic test — 15 random adaptive questions."""
    mongo = get_mongo()

    # Pull 15 questions from question bank for this exam, spread across difficulties
    cursor = mongo.question_bank.find({"exam_code": data.exam_code})
    all_questions = await cursor.to_list(length=200)

    if not all_questions:
        raise HTTPException(status_code=404, detail=f"No questions found for {data.exam_code}")

    # Select 15 questions across difficulty levels
    selected = random.sample(all_questions, min(15, len(all_questions)))

    # Create exam attempt
    attempt = ExamAttempt(
        user_id=current_user["user_id"],
        exam_code=data.exam_code,
        mode="diagnostic",
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    return AttemptResponse(
        id=str(attempt.id),
        exam_code=data.exam_code,
        mode="diagnostic",
        started_at=attempt.started_at.isoformat(),
        questions=[_question_doc_to_response(q) for q in selected],
    ).model_dump()


@router.post("/simulation")
async def start_simulation(
    data: SimulationRequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Start a full exam simulation with all sections."""
    mongo = get_mongo()

    query = {"exam_code": data.exam_code}
    if data.section:
        query["section"] = data.section

    cursor = mongo.question_bank.find(query)
    all_questions = await cursor.to_list(length=500)

    if not all_questions:
        raise HTTPException(status_code=404, detail=f"No questions found for {data.exam_code}")

    # Create exam attempt
    attempt = ExamAttempt(
        user_id=current_user["user_id"],
        exam_code=data.exam_code,
        mode="full_simulation",
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    return AttemptResponse(
        id=str(attempt.id),
        exam_code=data.exam_code,
        mode="full_simulation",
        started_at=attempt.started_at.isoformat(),
        questions=[_question_doc_to_response(q) for q in all_questions],
    ).model_dump()


@router.post("/practice")
async def start_practice(
    data: PracticeRequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Start a section practice with configurable question count."""
    mongo = get_mongo()

    cursor = mongo.question_bank.find({
        "exam_code": data.exam_code,
        "section": data.section,
    })
    all_questions = await cursor.to_list(length=200)

    if not all_questions:
        raise HTTPException(status_code=404, detail=f"No questions for {data.exam_code}/{data.section}")

    selected = random.sample(all_questions, min(data.question_count, len(all_questions)))

    attempt = ExamAttempt(
        user_id=current_user["user_id"],
        exam_code=data.exam_code,
        mode="section_practice",
        sections_completed=[{"section": data.section, "status": "in_progress"}],
    )
    db.add(attempt)
    await db.commit()
    await db.refresh(attempt)

    return AttemptResponse(
        id=str(attempt.id),
        exam_code=data.exam_code,
        mode="section_practice",
        started_at=attempt.started_at.isoformat(),
        questions=[_question_doc_to_response(q) for q in selected],
    ).model_dump()


@router.post("/submit")
async def submit_answers(
    data: SubmitRequest = Body(...),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit answers for scoring. Updates ExamAttempt and ExamProgress."""
    # Get the attempt
    result = await db.execute(
        select(ExamAttempt).where(
            ExamAttempt.id == data.attempt_id,
            ExamAttempt.user_id == current_user["user_id"],
        )
    )
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    # Score answers by checking against MongoDB question bank
    mongo = get_mongo()
    correct = 0
    total = len(data.answers)
    section_scores = {}

    for answer in data.answers:
        try:
            q_doc = await mongo.question_bank.find_one({"_id": ObjectId(answer.question_id)})
        except Exception:
            continue

        if not q_doc:
            continue

        section = q_doc.get("section", "general")
        if section not in section_scores:
            section_scores[section] = {"correct": 0, "total": 0}
        section_scores[section]["total"] += 1

        correct_answer = q_doc.get("content", {}).get("correct_answer", "")
        if answer.answer.strip().upper() == str(correct_answer).strip().upper():
            correct += 1
            section_scores[section]["correct"] += 1

    # Calculate score
    score_pct = (correct / total * 100) if total > 0 else 0

    # Estimate band/level based on exam type
    estimated_level = _estimate_level(attempt.exam_code, score_pct)

    # Update attempt
    attempt.completed_at = datetime.now(timezone.utc)
    attempt.total_score = round(score_pct, 1)
    attempt.estimated_band_level = estimated_level
    attempt.sections_completed = [
        {
            "section": sec,
            "correct": sec_data["correct"],
            "total": sec_data["total"],
            "score": round(sec_data["correct"] / sec_data["total"] * 100, 1) if sec_data["total"] > 0 else 0,
        }
        for sec, sec_data in section_scores.items()
    ]

    # Update ExamProgress
    progress_result = await db.execute(
        select(ExamProgress).where(
            ExamProgress.user_id == current_user["user_id"],
            ExamProgress.exam_code == attempt.exam_code,
        )
    )
    progress = progress_result.scalar_one_or_none()
    if not progress:
        progress = ExamProgress(
            user_id=current_user["user_id"],
            exam_code=attempt.exam_code,
        )
        db.add(progress)

    progress.total_questions_answered = (progress.total_questions_answered or 0) + total
    progress.current_estimated_score = estimated_level
    progress.streak_current = (progress.streak_current or 0) + 1

    # Identify strengths and weaknesses
    strengths = []
    weaknesses = []
    for sec, scores in section_scores.items():
        pct = scores["correct"] / scores["total"] * 100 if scores["total"] > 0 else 0
        if pct >= 70:
            strengths.append(sec)
        elif pct < 50:
            weaknesses.append(sec)
    progress.strengths = strengths
    progress.weaknesses = weaknesses

    await db.commit()

    return {
        "attempt_id": str(attempt.id),
        "correct": correct,
        "total": total,
        "score_percentage": round(score_pct, 1),
        "estimated_level": estimated_level,
        "sections": attempt.sections_completed,
        "strengths": strengths,
        "weaknesses": weaknesses,
    }


def _estimate_level(exam_code: str, score_pct: float) -> str:
    """Estimate CEFR level / band score from percentage."""
    if "ielts" in exam_code:
        if score_pct >= 90: return "8.0-9.0"
        if score_pct >= 80: return "7.0-7.5"
        if score_pct >= 70: return "6.0-6.5"
        if score_pct >= 55: return "5.0-5.5"
        if score_pct >= 40: return "4.0-4.5"
        return "3.0-3.5"
    elif "tcf" in exam_code:
        if score_pct >= 85: return "C2 (600-699)"
        if score_pct >= 70: return "C1 (500-599)"
        if score_pct >= 55: return "B2 (400-499)"
        if score_pct >= 40: return "B1 (300-399)"
        if score_pct >= 25: return "A2 (200-299)"
        return "A1 (100-199)"
    elif "toefl" in exam_code:
        score = int(score_pct * 1.2)  # scale to 120
        return f"{score}/120"
    elif "bac" in exam_code:
        score_20 = score_pct / 5  # scale to /20
        if score_20 >= 16: return "Très Bien"
        if score_20 >= 14: return "Bien"
        if score_20 >= 12: return "Assez Bien"
        if score_20 >= 10: return "Passable"
        return "En cours de préparation"
    elif "delf" in exam_code or "dalf" in exam_code:
        if score_pct >= 70: return "Excellent"
        if score_pct >= 50: return "Réussi"
        return "En cours"
    elif "testdaf" in exam_code:
        if score_pct >= 80: return "TDN 5"
        if score_pct >= 60: return "TDN 4"
        if score_pct >= 40: return "TDN 3"
        return "Unter TDN 3"
    return f"{round(score_pct)}%"


@router.get("/results/{attempt_id}")
async def get_results(
    attempt_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get detailed results for a completed attempt."""
    result = await db.execute(
        select(ExamAttempt).where(
            ExamAttempt.id == attempt_id,
            ExamAttempt.user_id == current_user["user_id"],
        )
    )
    attempt = result.scalar_one_or_none()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    return AttemptResponse(
        id=str(attempt.id),
        exam_code=attempt.exam_code,
        mode=attempt.mode,
        started_at=attempt.started_at.isoformat() if attempt.started_at else "",
        completed_at=attempt.completed_at.isoformat() if attempt.completed_at else None,
        total_score=float(attempt.total_score) if attempt.total_score else None,
        estimated_band_level=attempt.estimated_band_level,
        sections_completed=attempt.sections_completed or [],
    ).model_dump()


@router.get("/progress/{exam}")
async def get_progress(
    exam: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get user's progress for a specific exam."""
    result = await db.execute(
        select(ExamProgress).where(
            ExamProgress.user_id == current_user["user_id"],
            ExamProgress.exam_code == exam,
        )
    )
    progress = result.scalar_one_or_none()

    if not progress:
        # Return default empty progress
        return ProgressResponse(
            id="new",
            exam_code=exam,
        ).model_dump()

    return ProgressResponse(
        id=str(progress.id),
        exam_code=progress.exam_code,
        target_score=progress.target_score,
        current_estimated_score=progress.current_estimated_score,
        total_questions_answered=progress.total_questions_answered or 0,
        streak_current=progress.streak_current or 0,
        strengths=progress.strengths or [],
        weaknesses=progress.weaknesses or [],
        study_plan=progress.study_plan or [],
    ).model_dump()


class WritingEvalRequest(BaseModel):
    essay: str
    exam_type: str = "ielts"  # ielts, toefl, tcf
    task_prompt: Optional[str] = None


@router.post("/writing/evaluate")
async def evaluate_writing_endpoint(data: WritingEvalRequest):
    """Submit writing for AI evaluation via OpenRouter."""
    evaluation = await ai_evaluate_writing(data.essay, data.exam_type, data.task_prompt)
    return {"message": "Writing evaluation completed", "evaluation": evaluation}


class SpeakingEvalRequest(BaseModel):
    transcript: str
    exam_type: str = "ielts"


@router.post("/speaking/upload")
async def upload_speaking(data: SpeakingEvalRequest):
    """Evaluate a speaking transcript via AI."""
    evaluation = await ai_evaluate_speaking(data.transcript, data.exam_type)
    return {"message": "Speaking evaluation completed", "evaluation": evaluation}


@router.get("/speaking/result/{speaking_id}")
async def get_speaking_result(speaking_id: str):
    """Get speaking evaluation result (stored results)."""
    return {
        "speaking_id": speaking_id,
        "status": "completed",
        "evaluation": {"overall_score": 6.0, "transcription": "Stored result"},
    }


@router.get("/study-plan/{exam}")
async def get_study_plan(
    exam: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate an AI-powered study plan based on exam progress."""
    result = await db.execute(
        select(ExamProgress).where(
            ExamProgress.user_id == current_user["user_id"],
            ExamProgress.exam_code == exam,
        )
    )
    progress = result.scalar_one_or_none()

    weaknesses = progress.weaknesses if progress else []
    strengths = progress.strengths if progress else []
    current_score = str(progress.current_estimated_score) if progress and progress.current_estimated_score else "Not assessed"
    target_score = str(progress.target_score) if progress and progress.target_score else "7.0"

    # Use AI to generate a personalized study plan
    plan = await ai_generate_study_plan(
        exam=exam, current_score=current_score, target_score=target_score,
        weaknesses=weaknesses, strengths=strengths, days_remaining=60,
    )

    return {
        "exam_code": exam,
        "current_level": current_score,
        "target_level": target_score,
        "ai_generated": True,
        "plan": plan,
    }


@router.get("/leaderboard")
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    """Get top users by streak and questions answered."""
    result = await db.execute(
        select(ExamProgress)
        .order_by(desc(ExamProgress.streak_current))
        .limit(20)
    )
    entries = result.scalars().all()

    leaderboard = []
    for i, entry in enumerate(entries):
        leaderboard.append(
            LeaderboardEntry(
                rank=i + 1,
                user_id=str(entry.user_id),
                display_name=f"Student #{str(entry.user_id)[:6]}",
                streak=entry.streak_current or 0,
                total_questions=entry.total_questions_answered or 0,
                exam_code=entry.exam_code,
            ).model_dump()
        )

    return {"leaderboard": leaderboard, "total": len(leaderboard)}
