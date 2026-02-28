"""
Tawjihi V4 — FastAPI Application Entry Point
18 modules, all routers, CORS, health check, startup events.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base, mongo_db, redis_client, init_minio

# Import all models so they register with Base.metadata
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.school import School
from app.models.program import Program
from app.models.exam import ExamAttempt, ExamProgress
from app.models.roadmap import RoadmapTemplate, UserRoadmap
from app.models.notification import NotificationQueue
from app.models.scholarship import Scholarship
from app.models.gamification import UserGamification, StudyGroup
from app.models.mentor import Mentor
from app.models.marketplace import ServiceProvider, ServiceReview
from app.models.visa import VisaMockSession
from app.models.learning import LearningProgress
from app.models.integration import PlatformConnection
from app.models.pre_departure import PreDepartureChecklist
from app.models.career import CareerPath

# Import routers
from app.routers import (
    auth, profile, explore, prep, career, roadmap,
    documents, community, notifications, financial,
    scholarships, housing, marketplace, mentors,
    visa_prep, learn, copilot, gamification, admin,
    integrations, translations,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    print("🚀 Tawjihi V4 starting up...")

    # Create tables (dev only — use Alembic migrations in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ PostgreSQL tables created")

    # Initialize MinIO buckets
    try:
        await init_minio()
        print("✅ MinIO buckets initialized")
    except Exception as e:
        print(f"⚠️ MinIO init skipped: {e}")

    # Test Redis
    try:
        await redis_client.ping()
        print("✅ Redis connected")
    except Exception as e:
        print(f"⚠️ Redis not available: {e}")

    # Test MongoDB
    try:
        await mongo_db.command("ping")
        print("✅ MongoDB connected")
    except Exception as e:
        print(f"⚠️ MongoDB not available: {e}")

    print("🟢 Tawjihi V4 is ready!")
    yield

    # Shutdown
    print("Shutting down Tawjihi V4...")
    await engine.dispose()


# ── App ───────────────────────────────────────────────────

app = FastAPI(
    title="Tawjihi API",
    description="AI-Native Study Abroad & Career Platform for Moroccan Students",
    version="4.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3089",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────

@app.get("/api/health", tags=["System"])
async def health_check():
    """Health check endpoint — verifies all service connections."""
    services = {}

    # PostgreSQL
    try:
        async with engine.begin() as conn:
            await conn.execute(
                __import__("sqlalchemy").text("SELECT 1")
            )
        services["postgresql"] = "healthy"
    except Exception:
        services["postgresql"] = "unhealthy"

    # MongoDB
    try:
        await mongo_db.command("ping")
        services["mongodb"] = "healthy"
    except Exception:
        services["mongodb"] = "unhealthy"

    # Redis
    try:
        await redis_client.ping()
        services["redis"] = "healthy"
    except Exception:
        services["redis"] = "unhealthy"

    # MinIO
    try:
        from app.core.database import minio_client
        minio_client.list_buckets()
        services["minio"] = "healthy"
    except Exception:
        services["minio"] = "unhealthy"

    overall = "ok" if all(v == "healthy" for v in services.values()) else "degraded"
    return {"status": overall, "services": services}


# ── Register Routers ──────────────────────────────────────

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(explore.router)
app.include_router(prep.router)
app.include_router(career.router)
app.include_router(roadmap.router)
app.include_router(documents.router)
app.include_router(community.router)
app.include_router(notifications.router)
app.include_router(financial.router)
app.include_router(scholarships.router)
app.include_router(housing.router)
app.include_router(marketplace.router)
app.include_router(mentors.router)
app.include_router(visa_prep.router)
app.include_router(learn.router)
app.include_router(copilot.router)
app.include_router(gamification.router)
app.include_router(admin.router)
app.include_router(integrations.router)
app.include_router(translations.router)
