# 🎓 Tawjihi V4

AI-powered study abroad platform for Moroccan students. Built with FastAPI, React, PostgreSQL, MongoDB, Redis, and OpenRouter AI.

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v4+)
- [Git](https://git-scm.com/)

### 1. Clone & configure

```bash
git clone git@gitlab.com:tawjihteam/tawjih-v4.git
cd tawjih-v4
cp .env.example .env
```

### 2. Set your API key

Edit `.env` and set your OpenRouter key (get one free at [openrouter.ai/keys](https://openrouter.ai/keys)):

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### 3. Run

**Linux / Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```powershell
.\setup.bat
```

**Or manually:**
```bash
docker compose up -d --build
# Wait 15s for DBs to start, then:
docker compose exec backend alembic upgrade head
docker compose exec backend python -m seed
docker compose exec backend python -m seed_content
```

### 4. Open

| Service | URL |
|---------|-----|
| **Frontend** | [http://localhost:3089](http://localhost:3089) |
| **Backend API** | [http://localhost:8089](http://localhost:8089) |
| **API Docs** | [http://localhost:8089/docs](http://localhost:8089/docs) |
| **MinIO Console** | [http://localhost:9001](http://localhost:9001) |

**Default login:** `admin@tawjihi.ma` / `Admin1234!`

---

## Architecture

```
┌────────────┐     ┌──────────────┐     ┌────────────┐
│  React     │────▶│  FastAPI     │────▶│ PostgreSQL │
│  (Vite)    │     │  Backend     │     │ (users,    │
│  :3089     │     │  :8089       │     │  programs) │
└────────────┘     └──────┬───────┘     └────────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
        ┌──────────┐ ┌─────────┐ ┌────────┐
        │ MongoDB  │ │  Redis  │ │ MinIO  │
        │(questions│ │(cache,  │ │(files) │
        │ chat)    │ │ celery) │ │        │
        └──────────┘ └─────────┘ └────────┘
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS |
| Backend | FastAPI + SQLAlchemy + Pydantic |
| AI | OpenRouter (GPT-4o-mini) |
| SQL DB | PostgreSQL 16 |
| NoSQL DB | MongoDB 7 |
| Cache/Queue | Redis 7 + Celery |
| Storage | MinIO (S3-compatible) |
| Container | Docker Compose |

## Project Structure

```
tawjih-v4/
├── backend/
│   ├── app/
│   │   ├── core/           # config, database, security, ai_service
│   │   ├── models/         # SQLAlchemy models (15 tables)
│   │   └── routers/        # API routes (18 modules)
│   ├── alembic/            # DB migrations
│   ├── seed.py             # PostgreSQL seed data
│   ├── seed_content.py     # MongoDB seed data
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/          # 62 React pages
│   │   ├── i18n/           # FR/EN translations
│   │   └── api.js          # API service layer
│   └── Dockerfile
├── docker-compose.yml      # 6 services
├── .env.example            # Environment template
├── setup.sh                # Linux/Mac setup
├── setup.bat               # Windows setup
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env`. Only **one key is required** to get started:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ Yes | AI features (chat, evaluation, doc gen) |
| `OPENAI_API_KEY` | ❌ Optional | Only for Whisper audio transcription |
| `WHATSAPP_TOKEN` | ❌ Optional | WhatsApp notifications |
| `RESEND_API_KEY` | ❌ Optional | Email delivery |
| Everything else | Auto-set | DB passwords, Redis, MinIO set by default |

## Common Commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# Full reset (wipes all data)
docker compose down -v && ./setup.sh

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Run migrations
docker compose exec backend alembic upgrade head

# Re-seed data
docker compose exec backend python -m seed
docker compose exec backend python -m seed_content

# Enter backend shell
docker compose exec backend bash
```

## Features

- 📚 **Explore** — Programs, schools, and universities database
- 📝 **Exam Prep** — IELTS, TOEFL, TCF with AI evaluation
- 🤖 **AI Copilot** — Chat assistant for study abroad questions
- 🗺️ **Roadmap** — Step-by-step procedure tracking
- 📄 **Documents** — AI-powered motivation letter & CV generator
- 💰 **Budget** — Financial planning by country
- 🎓 **Scholarships** — Search and matching
- 🏠 **Housing** — City guides for students
- 🗣️ **Languages** — French & English courses with exercises
- 👥 **Community** — Student stories, Q&A, mentors
- 📊 **Admin** — Full dashboard, user management, content editor

---

Built with ❤️ for Moroccan students — **توجيهي**
