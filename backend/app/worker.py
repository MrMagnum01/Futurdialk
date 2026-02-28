"""
FuturDialk V4 — Celery Worker
Background tasks: AI generation, notifications, scraping.
Uses OpenRouter via ai_service for AI tasks.
"""

import asyncio
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "FuturDialk",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)


def _run_async(coro):
    """Run an async function from a sync Celery task."""
    loop = asyncio.new_event_loop()
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@celery_app.task(name="send_notification")
def send_notification(user_id: str, channel: str, payload: dict):
    """Send a notification via WhatsApp/Email/Push."""
    # TODO: Implement with WhatsApp API + Resend
    print(f"Sending {channel} notification to {user_id}: {payload}")
    return {"status": "sent"}


@celery_app.task(name="evaluate_writing")
def evaluate_writing(attempt_id: str, essay_text: str, exam_code: str):
    """AI writing evaluation via OpenRouter."""
    from app.core.ai_service import evaluate_writing as ai_eval
    result = _run_async(ai_eval(essay_text, exam_code))
    print(f"Writing evaluation for attempt {attempt_id}: score={result.get('overall_score', 'N/A')}")
    return {"status": "evaluated", "result": result}


@celery_app.task(name="transcribe_speaking")
def transcribe_speaking(recording_url: str, attempt_id: str):
    """Transcribe speaking recording using Whisper + evaluate."""
    from app.core.ai_service import transcribe_audio, evaluate_speaking
    # For now, return a placeholder until audio file handling is implemented
    print(f"Transcription task for attempt {attempt_id} — audio handling pending")
    return {"status": "pending", "message": "Audio file handling requires MinIO integration"}


@celery_app.task(name="generate_questions")
def generate_questions(exam_code: str, section: str, count: int = 10):
    """Generate exam questions using AI via OpenRouter, save to MongoDB."""
    from app.core.ai_service import generate_questions as ai_gen
    from app.core.database import mongo_db
    from datetime import datetime, timezone

    questions = _run_async(ai_gen(exam_code, section, count))
    if not questions:
        print(f"Question generation failed for {exam_code}/{section}")
        return {"status": "failed"}

    # Save to MongoDB with pending status for admin review
    docs = []
    for q in questions:
        docs.append({
            "exam_code": exam_code,
            "section": section,
            "question_text": q.get("question_text", q.get("question", "")),
            "options": q.get("options", []),
            "correct_answer": q.get("correct_answer", ""),
            "explanation": q.get("explanation", ""),
            "difficulty": q.get("difficulty", "medium"),
            "status": "pending",
            "ai_generated": True,
            "created_at": datetime.now(timezone.utc),
        })

    if docs:
        _run_async(mongo_db.questions.insert_many(docs))

    print(f"Generated {len(docs)} questions for {exam_code}/{section}")
    return {"status": "generated", "count": len(docs)}
