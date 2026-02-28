@echo off
REM ============================================
REM Tawjih V4 — One-command setup (Windows)
REM ============================================
REM Usage: setup.bat
REM ============================================

echo 🚀 Tawjih V4 — Setup
echo ====================

REM 1. Check .env exists
if not exist .env (
    echo 📋 .env not found — creating from .env.example...
    copy .env.example .env
    echo ⚠️  IMPORTANT: Edit .env and set your OPENROUTER_API_KEY
    echo    Get one at: https://openrouter.ai/keys
    echo.
)

REM 2. Start all services
echo 🐳 Starting Docker containers...
docker compose up -d --build

REM 3. Wait for services
echo ⏳ Waiting for databases to be ready...
timeout /t 15 /nobreak > nul

REM 4. Run migrations
echo 🗄️  Running database migrations...
docker compose exec -T backend alembic upgrade head
if errorlevel 1 (
    echo ⚠️  Alembic failed, creating tables from models...
    docker compose exec -T backend python -c "import asyncio; from app.core.database import engine, Base; from app.models.user import User; from app.models.student_profile import StudentProfile; from app.models.school import School; from app.models.program import Program; from app.models.exam import ExamAttempt, ExamProgress; from app.models.roadmap import RoadmapTemplate, UserRoadmap; from app.models.notification import NotificationQueue; from app.models.scholarship import Scholarship; from app.models.gamification import UserGamification, StudyGroup; from app.models.mentor import Mentor; from app.models.marketplace import ServiceProvider, ServiceReview; from app.models.visa import VisaMockSession; from app.models.learning import LearningProgress; from app.models.integration import PlatformConnection; from app.models.pre_departure import PreDepartureChecklist; from app.models.career import CareerPath; asyncio.run((lambda: (async_fn := (lambda: engine.begin().__aenter__().then(lambda conn: conn.run_sync(Base.metadata.create_all))), asyncio.run(async_fn())))())"
)

REM 5. Seed PostgreSQL
echo 🌱 Seeding PostgreSQL data...
docker compose exec -T backend python -m seed

REM 6. Seed MongoDB
echo 📚 Seeding MongoDB data...
docker compose exec -T backend python -m seed_content

echo.
echo ============================================
echo ✅ Tawjih V4 is ready!
echo ============================================
echo.
echo 🌐 Frontend:  http://localhost:3089
echo 🔧 Backend:   http://localhost:8089
echo 📊 API Docs:  http://localhost:8089/docs
echo 💾 MinIO:     http://localhost:9001
echo.
echo 🔑 Default login:
echo    Email:    admin@tawjihi.ma
echo    Password: Admin1234!
echo.
echo 📝 To stop:   docker compose down
echo 📝 To reset:  docker compose down -v ^&^& setup.bat
echo ============================================
