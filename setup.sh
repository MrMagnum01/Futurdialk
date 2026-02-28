#!/bin/bash
# ============================================
# Tawjih V4 — One-command setup
# ============================================
# Usage:
#   chmod +x setup.sh
#   ./setup.sh
# ============================================

set -e

echo "🚀 Tawjih V4 — Setup"
echo "===================="

# 1. Check .env exists
if [ ! -f .env ]; then
    echo "📋 .env not found — creating from .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit .env and set your OPENROUTER_API_KEY"
    echo "   Get one at: https://openrouter.ai/keys"
    echo ""
fi

# 2. Start all services
echo "🐳 Starting Docker containers..."
docker compose up -d --build

# 3. Wait for services to be healthy
echo "⏳ Waiting for databases to be ready..."
sleep 10

# 4. Run PostgreSQL migrations
echo "🗄️  Running database migrations..."
docker compose exec -T backend alembic upgrade head || {
    echo "⚠️  Alembic migration failed, creating tables from models..."
    docker compose exec -T backend python -c "
import asyncio
from app.core.database import engine, Base
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

async def init():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('✅ Tables created')

asyncio.run(init())
"
}

# 5. Seed PostgreSQL data (schools, programs, scholarships, etc.)
echo "🌱 Seeding PostgreSQL data..."
docker compose exec -T backend python -m seed || echo "⚠️ PostgreSQL seed skipped (may already exist)"

# 6. Seed MongoDB data (questions, language courses, community)
echo "📚 Seeding MongoDB data..."
docker compose exec -T backend python -m seed_content || echo "⚠️ MongoDB seed skipped (may already exist)"

echo ""
echo "============================================"
echo "✅ Tawjih V4 is ready!"
echo "============================================"
echo ""
echo "🌐 Frontend:  http://localhost:3089"
echo "🔧 Backend:   http://localhost:8089"
echo "📊 API Docs:  http://localhost:8089/docs"
echo "💾 MinIO:     http://localhost:9001"
echo ""
echo "🔑 Default login:"
echo "   Email:    admin@tawjihi.ma"
echo "   Password: Admin1234!"
echo ""
echo "📝 To stop:   docker compose down"
echo "📝 To reset:  docker compose down -v && ./setup.sh"
echo "============================================"
