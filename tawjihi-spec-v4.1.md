TAWJIHI

—

AI-Native Study Abroad & Career Platform for Moroccan Students

Complete Platform Specification — Version 4.1 — Build-Ready

18 Modules  ·  Every Schema  ·  Every Endpoint  ·  Every Screen

February 2026  |  STRICTLY CONFIDENTIAL

Unauthorized distribution, reproduction, or disclosure is prohibited

# Table of Contents

# 1. Executive Summary

## 1.1 Vision

Tawjihi is an AI-native platform that transforms how Moroccan students plan, prepare for, and execute their study abroad journey. It replaces the fragmented ecosystem of scattered forums, outdated guides, expensive consultants, and generic exam prep sites with a single intelligent system that knows every exam, every school, every procedure, and every deadline — and personalizes everything to each student’s unique profile.

The name "توجيهي" (Tawjihi) means "my guidance" in Arabic — a personal navigator for the most important decision in a young Moroccan’s life.

## 1.2 The Problem Space

For Moroccan students, studying abroad is a maze:

Information asymmetry: Requirements for France alone involve Campus France, FEI, Institut Français, AEFE, and each university. A student targeting Canada must navigate IRCC, MIFI (Québec), and bilingual scoring strategies. No single source has it all.

Exam confusion: 30+ language exams across 13 languages. Students don’t know which to take, where to register in Morocco, what score to target, or how to prepare.

Procedure complexity: Campus France DAP vs Hors-DAP vs architecture. uni-assist for Germany. UCAS for UK. Common App for USA. Each has different documents, timelines, and formats.

Cost opacity: Students don’t know the true total cost (tuition + living + visa + insurance + exams + translations + flights) until deep in the process.

No career guidance: Choices based on prestige or family advice, not labor market data. Many end up in fields with poor employment prospects.

No templates: Every student reinvents motivation letters, study projects, and CVs specific to each country.

No community memory: Each cohort starts from zero. Previous students’ experiences are lost.

## 1.3 The Solution: 18 Modules

| # | Module | Purpose |
| --- | --- | --- |
| 1 | Profile & Exploration | Input marks/GPA → personalized school + country matches (local & abroad) |
| 2 | AI Career Advisor | Career paths with market analysis + salary projections + demand forecasting |
| 3 | Exam Prep Platform | Full simulation engine: timed tests, AI scoring, adaptive difficulty, 30+ exams |
| 4 | Procedure Roadmap | Step-by-step from idea to arrival, templates + deadlines + document tracking |
| 5 | Community Knowledge | Crowdsourced: acceptance rates, processing times, tips — anonymized |
| 6 | Document Generator | Auto-generate motivation letters, CVs, study projects per country format |
| 7 | Notifications | WhatsApp + email + push for deadlines, exams, status changes |
| 8 | Financial Planning | Budget calculators, scholarship matching, cost comparison |
| 9 | Housing & Pre-Departure | Housing guides, CROUS timeline, first-30-days guides per city |
| 10 | Mentorship Network | Connect prospective students with current students abroad |
| 11 | Admin Dashboard | CMS, analytics, question bank management, support queue |
| 12 | Marketplace | Directory of sworn translators, legalization, tutors with reviews |
| 13 | Gamification | XP, streaks, badges, leaderboards, study groups, daily challenges |
| 14 | Multi-Platform | React Native mobile, PWA, offline, Arabic/French/English, Darija tooltips |
| 15 | Integration Hub | Campus France tracker, Calendar sync, OCR for documents |
| 16 | Visa Interview Prep | AI mock visa interviews per country + embassy, coaching |
| 17 | Language Learning | Structured A1→C2 courses per language, not just exam prep |
| 18 | AI Copilot | Conversational assistant across platform, RAG-powered, WhatsApp-enabled |

## 1.4 Target Users

| Persona | Description | Key Needs |
| --- | --- | --- |
| Bac Student | Terminale or just passed Bac (S/SM/L/Eco). Age 17-19. | Explore options, career guidance, Campus France, exam prep from zero |
| License Holder | Moroccan Licence (Bac+3). Targeting Master’s abroad. | Master’s matching, advanced exams (B2+), procedure help |
| Masters Holder | Moroccan Master’s. Targeting PhD or employment. | PhD matching, research labs, visa-to-work paths |
| Parent | Parent of any above. May not be tech-savvy. | Overview of options, costs, safety. Document help. |
| Professional | Career change or advancement via study abroad. | Part-time programs, employer sponsorship, ROI analysis |

## 1.5 Competitive Advantage

Morocco-first: Every feature designed for Moroccan students. Darija tooltips. Moroccan exam centers. MAD pricing. Campus France Maroc specifics.

All-in-one: No other platform combines exam prep + career AI + procedure automation + document generation + community + financial planning.

AI-native: Every module uses AI as core capability (adaptive testing, career predictions, doc generation, conversational copilot).

Community flywheel: Every completed journey feeds data back. Acceptance rates, processing times, and tips compound over time.

30+ exams in 13 languages: No competitor covers TCF + IELTS + TOEFL + Goethe + TestDaF + HSK + DELE + JLPT + TOPIK + CILS in one place.

# 2. System Architecture

## 2.1 High-Level Services

| Service | Tech | Port | Role |
| --- | --- | --- | --- |
| API Gateway | Python 3.12 + FastAPI | 8089 | All business logic, auth, orchestration |
| PostgreSQL | PostgreSQL 16 | 5433 | Relational: users, schools, exams, procedures, progress |
| MongoDB | MongoDB 7 | 27018 | Documents: question banks, career data, AI logs, community |
| MinIO | MinIO (S3-compat) | 9001/9002 | Objects: audio, PDFs, templates, uploads, media |
| Redis | Redis 7 | 6380 | Cache, sessions, rate limits, leaderboards, pub/sub |
| Frontend | React 18 + Vite + Nginx | 3089 | SPA with responsive design |
| Worker | Python + Celery | internal | Background: AI generation, notifications, scraping |
| WhatsApp | Meta Cloud API | internal | Messaging, bot interactions |

## 2.2 External Integrations

| Service | API | Purpose |
| --- | --- | --- |
| OpenAI | GPT-4o / GPT-4o-mini | Career AI, question gen, doc gen, copilot, writing eval |
| OpenAI | Whisper | Speech-to-text for speaking + visa interview |
| OpenAI | TTS | Text-to-speech for listening + language learning |
| Meta | WhatsApp Business Cloud | Notifications and bot |
| Google | Calendar API | Deadline sync |
| Stripe/PayPal | Payment API | Subscription billing (Phase 2+) |
| PostHog | Analytics | Behavior tracking, funnels, A/B testing |
| Resend | Email | Transactional emails |

## 2.3 Storage Architecture Rationale

PostgreSQL (relational):

Structured data with strict schemas and relationships. Users, schools, exams, procedures, progress tracking — anything needing ACID transactions, joins, and referential integrity.

MongoDB (document):

Flexible-schema data varying per exam type. A TCF question has different fields than IELTS or JLPT. Question banks, career market snapshots, AI conversation logs, community reports benefit from schema flexibility.

MinIO (object):

Binary files. Audio for listening exams, speaking recordings, PDF templates, user uploads (passport scans, transcripts), exam images. S3-compatible for zero-effort migration to AWS.

## 2.4 Authentication & Authorization

Auth flow:

Register with email + password OR phone (OTP via WhatsApp).

Backend issues JWT access token (15 min) + refresh token (30 days, httpOnly cookie).

Authorization: Bearer header on every API call. Auto-refresh before expiry.

Roles: student, parent, mentor, admin. RBAC on all endpoints.

Admin requires 2FA (TOTP).

Password security:

bcrypt hashing (cost factor 12). Rate limit: 5 failed logins → 15-min lockout.

Email verification required before paid features. Reset via 6-digit OTP (10-min expiry).

## 2.5 Data Privacy & Security

Encrypted at rest: PostgreSQL TDE, MinIO server-side encryption, AES-256 for PII at app level.

Encrypted in transit: TLS 1.3 via Caddy reverse proxy.

Community data ALWAYS anonymized. No personal identifiers in shared statistics. Minimum 10 data points before showing aggregates.

GDPR-compliant: data export (JSON) + right to deletion.

Document uploads virus-scanned (ClamAV). Admin 2FA required.

# 3. Module 1: Profile & Exploration Engine

## 3.1 Overview

Entry point to Tawjihi. Student creates a profile with academic background, preferences, and constraints. System immediately generates personalized recommendations: schools, countries, and programs they qualify for — both local (Moroccan) and international.

## 3.2 User Stories

As a Bac student, I input my filière and marks, and see which programs I can apply to in Morocco and abroad.

As a Licence holder, I input my university, field, and GPA, and see Master’s programs I qualify for.

As a parent, I create a profile for my child and explore options on their behalf.

As any user, I set preferences: countries, budget, fields, languages, timeline.

As any user, I save multiple exploration paths (e.g., France Engineering + Canada CS).

## 3.3 PostgreSQL: users

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK | Unique user ID |
| email | VARCHAR(255) UNIQUE | Login email (verified) |
| phone | VARCHAR(20) | For WhatsApp |
| password_hash | VARCHAR(255) | bcrypt hash |
| role | ENUM | student, parent, mentor, admin |
| full_name | VARCHAR(200) ENCRYPTED | Legal name |
| date_of_birth | DATE | Age-based eligibility |
| nationality | VARCHAR(50) | Default: Moroccan |
| city | VARCHAR(100) | Moroccan city |
| preferred_language | VARCHAR(5) | UI: ar, fr, en |
| created_at | TIMESTAMPTZ |  |
| last_login | TIMESTAMPTZ |  |
| is_verified | BOOLEAN | Email verified |
| is_active | BOOLEAN | Account active |
| onboarding_complete | BOOLEAN | Profile setup done |

## 3.4 PostgreSQL: student_profiles

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK → users.id | One-to-one |
| education_level | ENUM | bac_current, bac_obtained, licence, master, phd, professional |
| bac_filiere | VARCHAR(50) | Sciences Math, Sciences Physiques, SVT, Lettres, Sciences Éco, Techniques |
| bac_year | INTEGER | Year obtained or expected |
| bac_mention | VARCHAR(30) | Très Bien, Bien, Assez Bien, Passable, null |
| bac_average | DECIMAL(4,2) | General average /20 |
| bac_math_score | DECIMAL(4,2) | Important for CPGE/engineering |
| bac_physics_score | DECIMAL(4,2) |  |
| bac_french_score | DECIMAL(4,2) | Language readiness indicator |
| bac_english_score | DECIMAL(4,2) |  |
| university_name | VARCHAR(200) | For Licence/Master holders |
| university_field | VARCHAR(200) | Field of study |
| university_gpa | DECIMAL(4,2) |  |
| university_gpa_system | ENUM | out_of_20, out_of_4 |
| languages_spoken | JSON | [{language, level}] |
| exam_scores | JSON | [{exam, score, date}] existing scores |
| budget_max_yearly_mad | INTEGER | Max yearly budget in MAD |
| preferred_countries | JSON | ["FR","CA","DE"] ordered |
| preferred_fields | JSON | ["computer_science","engineering"] |
| preferred_language_of_study | JSON | ["fr","en"] |
| timeline | VARCHAR(50) | next_year, in_2_years, exploring |
| interested_in_scholarships | BOOLEAN | Prioritize scholarship programs |

## 3.5 PostgreSQL: schools

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| name | VARCHAR(300) | Full name |
| short_name | VARCHAR(100) | e.g., ENSAM, EPFL |
| country_code | FK | ISO code |
| city | VARCHAR(100) |  |
| type | ENUM | university, grande_ecole, community_college, language_school, prep_school |
| is_public | BOOLEAN |  |
| ranking_national | INTEGER |  |
| ranking_world | INTEGER | QS/THE/Shanghai |
| tuition_international_yearly | VARCHAR(100) | For intl students |
| acceptance_rate | DECIMAL(5,2) |  |
| has_moroccan_students | BOOLEAN | Known Moroccan community |
| application_platform | VARCHAR(100) | campus_france, uni-assist, ucas, common_app, direct |
| scholarship_available | BOOLEAN |  |

## 3.6 PostgreSQL: programs

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| school_id | FK |  |
| name | VARCHAR(300) |  |
| degree_type | ENUM | licence, master, phd, dut, bts, cpge, diplome_ingenieur, mba, certificate |
| field_category | VARCHAR(100) | engineering, business, sciences, humanities, medicine, arts, law |
| language_of_instruction | VARCHAR(10) |  |
| duration_months | INTEGER |  |
| admission_requirements | JSON | {min_gpa, required_exams: [{exam, min_score}], documents, prerequisites} |
| career_outcomes | JSON | [{title, avg_salary, demand_level}] |
| is_moroccan | BOOLEAN | True if Moroccan institution |

## 3.7 Matching Algorithm

Filter by education level: Bac → Licence programs. Licence → Master’s. Master’s → PhD/MBA.

Filter by eligibility: bac_filiere compatibility, GPA minimums, existing exam scores vs requirements.

Filter by preferences: countries, fields, budget, language of study.

Score each match: eligibility fit (40%), preference match (30%), scholarship (15%), community acceptance rate (15%).

Rank and present: Top first with clear “what’s missing” indicators.

Include local: Always show Moroccan programs alongside international for comparison.

## 3.8 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/auth/register | Register (email + password + role) |
| POST | /api/auth/login | Login → JWT + refresh |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/verify-email | Verify with OTP |
| GET | /api/profile | Get current user profile |
| PUT | /api/profile | Update profile |
| PUT | /api/profile/student | Update student fields |
| PUT | /api/profile/parent | Update parent fields |
| GET | /api/explore/programs | Matched programs (uses profile + params) |
| GET | /api/explore/programs/{id} | Program detail |
| GET | /api/explore/schools | Browse/search schools |
| GET | /api/explore/schools/{id} | School detail |
| POST | /api/explore/save-path | Save exploration path |
| GET | /api/explore/saved-paths | List saved paths |

## 3.9 Frontend Pages

### 3.9.1 Onboarding (5 Steps)

"Who are you?" — Role selection (Student/Parent/Professional). Clean cards.

"Your education" — Level selector. Bac: filière + marks. Licence: university + field + GPA.

"Preferences" — Country flags multi-select, field cards, budget slider (0–200K MAD/yr), timeline.

"Languages" — Self-assessed levels + existing exam scores.

"Your results" — Instantly shows 50+ matched programs. Hero moment.

### 3.9.2 Explore Dashboard

Map view: Interactive world map. Click country → drill into programs.

List view: Sortable/filterable cards. Sort: best match, tuition, ranking, deadline.

Comparison: Select up to 3 programs side-by-side.

"What’s missing" indicator on each card (exam needed, GPA gap, documents).

# 4. Module 2: AI Career Advisor

## 4.1 Overview

AI-powered career planning: not just "what do you want to study?" but "what should you study given who you are, what the market needs, and where the world is heading?"

## 4.2 Features

### 4.2.1 Career Path Discovery

Input: profile (marks, interests, personality traits, values). RIASEC assessment.

Output: 5–10 career paths with reasoning. Each shows: education, timeline, job titles, industries.

Considers Moroccan context: demand in Morocco vs abroad.

### 4.2.2 Market Analysis

Per career: current demand by country, salary ranges by experience, growth projections.

AI disruption risk: low/medium/high automation risk per career.

Visa-to-work pipeline: "In Germany, engineering grads get 18-month job-seeking visa."

### 4.2.3 Program-Career Alignment

Maps career paths → specific programs in database.

ROI calculator: total program cost vs expected salary increase over 10 years.

Employment rate per program from community data + public stats.

## 4.3 MongoDB: career_paths

{

  _id: ObjectId,

  name: "Software Engineering", category: "engineering",

  riasec_codes: ["I","R","C"],

  required_education: ["bac+3","bac+5"],

  job_titles: ["Software Engineer","Full-Stack Developer","DevOps"],

  automation_risk: "low",

  market_data: {

    morocco: {demand:"high", avg_salary_mad:180000, growth_pct:15},

    france: {demand:"very_high", avg_salary_eur:45000, growth_pct:12},

    canada: {demand:"very_high", avg_salary_cad:85000, growth_pct:18},

  }

}

## 4.4 MongoDB: market_snapshots

Updated quarterly from OECD, LinkedIn Economic Graph, national statistics.

{

  career_path_id: ObjectId, country: "FR",

  snapshot_date: ISODate, job_postings_count: 12450,

  avg_salary: 47000, salary_growth_yoy: 4.2,

  unemployment_rate_field: 3.1,

  top_employers: ["Google","Capgemini","Thales"],

  required_skills: ["Python","Cloud","CI/CD"]

}

## 4.5 AI Integration

GPT-4o for career reasoning, GPT-4o-mini for quick suggestions.

Anti-hallucination: AI ONLY recommends careers/programs in our database. Salaries from market_snapshots, not AI.

Structured output: AI returns JSON with career_path_ids + reasoning.

Conversation history in MongoDB for continuity.

## 4.6 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/career/discover | Generate career paths from profile |
| GET | /api/career/paths | Browse all career paths |
| GET | /api/career/paths/{id} | Detail with market data |
| GET | /api/career/market/{career}/{country} | Market data for career+country |
| POST | /api/career/compare | Compare 2–3 careers |
| POST | /api/career/roi | ROI for program+career combo |
| GET | /api/career/trending | Trending/growing careers |

## 4.7 Frontend Pages

Career Discovery: RIASEC questionnaire → AI generates suggestions with market charts.

Career Detail: Market data charts (salary by country, demand over time), required education, related programs.

Career Compare: Side-by-side across salary, demand, timeline, automation risk.

Program-Career Matrix: Visual flowchart — which programs lead to which careers.

# 5. Module 3: Exam Prep Platform

## 5.1 Overview

Full simulation engine replicating every major language exam. 30+ exams across 13 languages with timed tests, AI adaptive difficulty, writing evaluation, speaking practice, and granular progress tracking.

## 5.2 Exam Coverage

| Language | Exams | Question Types |
| --- | --- | --- |
| French | TCF (TP/Canada/Québec/IRN/DAP), DELF A1–B2, DALF C1–C2, TEF Canada | MCQ, fill-blank, essay, oral, document analysis |
| English | IELTS Academic/General, TOEFL iBT, DET, CAE, PTE Academic | MCQ, drag-drop, cloze, essay, graph desc, speak, integrated |
| German | Goethe A1–C2, TestDaF, telc C1 Hochschule, DSH | MCQ, cloze, Aufsatz, Sprechen, Hörverstehen |
| Chinese | HSK 1–9 (new 3.0), HSKK | Character recognition, pinyin, ordering, essay, oral |
| Spanish | DELE A1–C2, SIELE | MCQ, cloze, essay, oral interview |
| Japanese | JLPT N5–N1 | MCQ (vocab, grammar, reading, listening) |
| Korean | TOPIK I + II | MCQ, cloze, essay (TOPIK II) |
| Italian | CILS A1–C2, CELI | MCQ, cloze, essay, oral |

## 5.3 Core Features

### 5.3.1 Diagnostic Test

15–20 min adaptive diagnostic: starts mid-difficulty, adjusts per answer.

Output: estimated level (e.g., "IELTS 5.5–6.0"), strength/weakness map per section.

Generates study plan: "8 weeks to Band 7.0. Focus on Writing and Speaking."

### 5.3.2 Full Exam Simulation

Exact real exam replication: sections, questions/section, time limits.

Enforced timing (countdown). Audio plays once for listening (like real IELTS).

All question types: drag-drop, fill-blank, MCQ, multi-select, ordering.

"Exam mode": full-screen, no distractions. Auto-submit on time expiry.

### 5.3.3 AI Writing Evaluation

AI evaluates against official rubric for specific exam.

IELTS: scores Task Achievement, Coherence, Lexical Resource, Grammar. Band per criterion.

TCF: scores 3 tasks on 0–20 with feedback. TestDaF: TDN level evaluation.

Returns: corrections, vocabulary suggestions, structural improvements, model answer.

GPT-4o with exam-specific prompts containing official scoring rubrics.

### 5.3.4 Speaking Practice

Browser mic recording (MediaRecorder API) → MinIO → Whisper transcription.

IELTS: all 3 parts simulated. AI generates Part 2 topic cards.

TCF: 3 tasks simulated. Goethe Sprechen: AI plays other candidate.

Scores: fluency, lexical resource, grammar, pronunciation. Filler word detection.

### 5.3.5 Adaptive Difficulty (IRT)

Item Response Theory / Rasch model to estimate ability.

Each question has calibrated difficulty parameter (theta).

After each answer, ability estimate updates. Next question maximizes information gain.

Students spend time at their level, not too easy or too hard.

## 5.4 MongoDB: question_bank

{

  _id: ObjectId,

  exam_code: "ielts_academic", section: "reading",

  question_type: "mcq"|"fill_blank"|"drag_drop"|"ordering"|"essay"|"speaking",

  difficulty: 0.65,  // IRT parameter (0-1)

  cefr_level: "B2",

  content: {

    passage: "Reading passage...",

    audio_url: "s3://tawjihi/audio/ielts/listening/s3_q21.mp3",

    image_url: "s3://tawjihi/images/ielts/writing/task1_graph.png",

    question_text: "What is the main idea of paragraph 3?",

    options: [{id:"A",text:"..."},{id:"B",text:"..."}],

    correct_answer: "B",

    explanation: "Paragraph 3 discusses...",

  },

  metadata: {

    source: "ai_generated"|"official_adapted"|"examiner_created",

    validated: true, validated_by: "examiner_id",

    times_answered: 1240, correct_rate: 0.62,

    discrimination: 0.78  // IRT discrimination

  }

}

## 5.5 PostgreSQL: exam_attempts

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| exam_code | VARCHAR(50) | e.g., ielts_academic, tcf_tp |
| mode | ENUM | full_simulation, section_practice, diagnostic, timed_challenge |
| started_at | TIMESTAMPTZ |  |
| completed_at | TIMESTAMPTZ | null if abandoned |
| sections_completed | JSON | [{section, score, time_spent, questions_answered, correct}] |
| total_score | DECIMAL |  |
| estimated_band_level | VARCHAR(20) | e.g., "6.5", "B2", "TDN 4" |

## 5.6 PostgreSQL: exam_progress

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| exam_code | VARCHAR(50) |  |
| target_score | VARCHAR(20) | Student’s target |
| current_estimated_score | VARCHAR(20) | Latest estimated |
| total_questions_answered | INTEGER | Lifetime |
| streak_current | INTEGER | Daily streak |
| strengths | JSON | ["reading","vocabulary"] |
| weaknesses | JSON | ["writing_task2","speaking_part3"] |
| study_plan | JSON | [{week, focus, daily_minutes, targets}] |

## 5.7 MinIO Buckets

| Bucket | Contents | Path Pattern |
| --- | --- | --- |
| tawjihi-audio | Listening audio (MP3/WAV) | audio/{exam}/{section}/{qid}.mp3 |
| tawjihi-images | Exam images (graphs, photos) | images/{exam}/{type}/{qid}.png |
| tawjihi-recordings | User speaking recordings | recordings/{uid}/{exam}/{attempt}.webm |
| tawjihi-documents | PDFs, templates, uploads | documents/{uid}/{type}/{file} |

## 5.8 AI Question Generation Pipeline

Template: Choose exam-specific prompt (e.g., IELTS Reading passage + 13 questions).

Generate: GPT-4o following exact format specs, difficulty target, topic constraints.

Auto-validate: Correct answer exists, no dupes, proper format, length.

Human review: Queue in Admin Dashboard. Certified examiners validate. Target: 30%+ rejection rate.

Calibrate: Start estimated difficulty. After 50+ attempts, IRT parameters recalculated from real data.

Retire: Questions with <0.3 discrimination or >90%/<10% correct rate flagged.

## 5.9 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/prep/exams | List available exams |
| POST | /api/prep/diagnostic | Start diagnostic |
| POST | /api/prep/simulation | Start full simulation |
| POST | /api/prep/practice | Start section practice |
| POST | /api/prep/submit | Submit answers for scoring |
| GET | /api/prep/results/{attempt_id} | Detailed results |
| GET | /api/prep/progress/{exam} | Progress summary |
| POST | /api/prep/writing/evaluate | Submit writing for AI eval |
| POST | /api/prep/speaking/upload | Upload speaking recording |
| GET | /api/prep/speaking/result/{id} | Speaking eval result |
| GET | /api/prep/study-plan/{exam} | AI study plan |

# 6. Module 4: Procedure Roadmap Generator

## 6.1 Overview

When a student selects 1–3 destinations and clicks "Start Procedures," Tawjihi generates a complete personalized roadmap: every document, every step, every deadline, every template — from idea to arrival.

## 6.2 8 Phases

| Phase | Name | Duration |
| --- | --- | --- |
| 1 | Eligibility Check — verify requirements, identify gaps | 1 day |
| 2 | Exam Prep — register + pass required language exams | 2–6 months |
| 3 | Document Collection — gather existing + obtain new docs | 2–4 weeks |
| 4 | Document Creation — motivation letters, CVs, study projects | 1–2 weeks |
| 5 | Application — submit on platform (Campus France, etc.) | 1–2 weeks |
| 6 | Follow-Up — track status, prepare for interviews | 1–3 months |
| 7 | Visa — compile dossier, book appointment, attend | 2–6 weeks |
| 8 | Pre-Departure — housing, insurance, flights, arrival | 2–4 weeks |

## 6.3 PostgreSQL: roadmap_templates

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| country_code | VARCHAR(5) |  |
| pathway | VARCHAR(100) | e.g., france_l1_dap, canada_master, germany_master_en |
| name | VARCHAR(300) | "France — L1 via Campus France DAP" |
| total_steps | INTEGER |  |
| estimated_duration_weeks | INTEGER |  |
| steps | JSON | [{phase, order, title, description, documents_needed, cost_mad, tips, links}] |

## 6.4 PostgreSQL: user_roadmaps

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| template_id | FK |  |
| program_id | FK NULLABLE |  |
| status | ENUM | not_started, in_progress, completed, abandoned |
| target_date | DATE | Target arrival date |
| current_phase | INTEGER | 1–8 |
| steps_status | JSON | [{step_id, status, completed_at, notes, uploaded_docs}] |
| generated_documents | JSON | [{type, template_used, storage_url}] |
| notifications_enabled | BOOLEAN |  |

## 6.5 France L1 DAP Example (20 Steps)

| # | Step | Cost | Timeline |
| --- | --- | --- | --- |
| 1 | Create Campus France account on Études en France | Free | Day 1 |
| 2 | Register TCF DAP at Institut Français | 1,500 MAD | Book 2mo before |
| 3 | Take TCF DAP exam | — | Test day |
| 4 | Get Bac + Relevé de notes (certified copies) | 50 MAD | 1 week |
| 5 | Get casier judiciaire | Free | 3–5 days |
| 6 | Get acte de naissance | Free | Same day |
| 7 | Translate all docs (traducteur assermenté) | 300–600 MAD | 3–7 days |
| 8 | Fill Campus France form + upload | 1,800 MAD | 1–2 hours |
| 9 | Choose 3 university programs (DAP vœux) | Free | Before Jan 17 |
| 10 | Write lettre de motivation (→ Template) | → Template | 1–2 days |
| 11 | Write projet d’études (→ Template) | → Template | 1–2 days |
| 12 | Campus France interview | Free | Feb–Mar |
| 13 | Wait for admission response | Free | Apr–Jun |
| 14 | Accept admission offer | Free | Within deadline |
| 15 | Open blocked bank account | 7,380€ deposit | 1–2 weeks |
| 16 | Book visa at VFS/Consulate | 500 MAD | 2–4 weeks wait |
| 17 | Attend visa appointment | Free | Appt day |
| 18 | Receive visa | Free | 2–3 weeks |
| 19 | Book housing (CROUS or private) | Varies | After visa |
| 20 | Book flight + prepare | 3–6K MAD | 1–2 weeks before |

## 6.6 Document Templates

Lettre de motivation: Per-country format. France (formal academic), Canada (achievement), Germany (research).

Projet d’études: Campus France structure: current situation → why field → why France → career goals.

CV: Europass (EU), Standard (US/CA), Academic (PhD). Auto-fill from profile.

Budget justificatif: Country-specific cost breakdown for visa.

Lettre de garant: Financial sponsor letter. Parent name auto-filled from parent_profile.

Cover letter (visa): Per-consulate format with admission/financial references.

## 6.7 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/roadmap/generate | Generate roadmap for program(s) |
| GET | /api/roadmap/mine | User’s active roadmaps |
| GET | /api/roadmap/{id} | Roadmap with step statuses |
| PUT | /api/roadmap/{id}/step/{sid} | Update step status |
| POST | /api/roadmap/{id}/step/{sid}/upload | Upload doc for step |
| POST | /api/documents/generate | Generate doc from template |
| GET | /api/documents/templates | Templates by country/purpose |

## 6.8 Frontend Pages

Roadmap View: Vertical timeline. Each step = card with title, status badge (done/in-progress/blocked), cost, documents, tips. Click to expand detail + upload area.

Document Generator: Select template type → form with profile pre-filled → preview → download PDF/DOCX.

Document Vault: File manager UI. Upload, categorize, view expiry dates. Drag-and-drop upload.

Roadmap Dashboard: Cards for each active roadmap. Progress bar, next deadline, blocked items alert.

# 7. Module 5: Community Knowledge Base

## 7.1 Overview

Every completed journey enriches the platform. Anonymized data feeds collective intelligence: "127 Moroccan students applied here in 2025. 68% accepted. Average TCF: 432. Avg processing: 4.2 months."

## 7.2 Data Collection

Automatic: Roadmap step completions extract anonymized data (exam score range, processing time, outcome).

Voluntary surveys: After acceptance/rejection, 5-minute experience survey.

Moderated Q&A: Post questions, answer others. Upvoted/curated answers.

Experience reports: Detailed journey write-ups (anonymized before publication).

## 7.3 Anonymization Rules

NEVER expose: name, email, phone, exact GPA, exact exam score, specific university of origin.

ALWAYS aggregate as ranges: "TCF 420–440", "Acceptance 60–70%".

Minimum 10 data points before showing any statistics. Prevents de-anonymization.

Opt-in: Users consent to data contribution. Can opt out (data removed from future aggregations).

## 7.4 MongoDB: community_experiences

{

  _id: ObjectId,

  user_id_hash: "sha256",  // irreversible, dedup only

  country: "FR", program_type: "L1", field: "cs",

  pathway: "france_l1_dap", year: 2025,

  exam_scores: [{exam:"TCF", score_range:"400-450"}],

  bac_average_range: "14-16",

  outcome: "accepted"|"rejected"|"waitlisted",

  processing_time_weeks: 18,

  visa_outcome: "granted"|"denied", visa_weeks: 3,

  tips: "Book TCF early, IF Casa fills fast.",

  difficulty_rating: 4, would_recommend: true

}

## 7.5 MongoDB: community_qa

{

  _id: ObjectId,

  type: "question"|"answer",

  author_id_hash: "sha256",

  author_display: "Student in Lyon (2025)",

  forum: "france"|"canada"|"ielts_prep"|"general",

  title: "How long for Campus France interview call?",

  body: "I submitted my dossier on...",

  parent_id: null,  // for answers: refs question

  upvotes: 12, downvotes: 1,

  is_pinned: false, is_moderated: true,

  tags: ["campus_france","timing"]

}

## 7.6 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/community/insights/{program_id} | Aggregated stats for a program |
| GET | /api/community/insights/country/{code} | Country-level stats |
| POST | /api/community/experience | Submit experience report |
| GET | /api/community/qa | List Q&A threads (filter: forum, tags) |
| POST | /api/community/qa | Post question or answer |
| POST | /api/community/qa/{id}/vote | Upvote/downvote |
| GET | /api/community/stories | Success stories feed |

## 7.7 Frontend Pages

Program Insights Card: Shows on each program page — acceptance rate donut chart, score distributions, processing timeline, top tips.

Country Dashboard: Aggregated stats for all programs in country. Comparison table of pathways.

Q&A Forum: Reddit-style threads by forum (country/exam). Search, filter by tags, sort by votes/date.

Stories Feed: Card-based anonymized journeys. Filter by destination, field, level.

# 8. Module 6: Document Generator & Manager

## 8.1 Overview

Auto-generates all documents from profile data + roadmap context. Professional PDFs per country format. Secure vault for uploaded originals with expiry tracking.

## 8.2 Document Types

| Document | Format | Smart Features |
| --- | --- | --- |
| Lettre de motivation | PDF/DOCX | Pre-filled program/university/background. AI refines. Per-country tone. |
| Projet d’études | PDF | Campus France structure: situation → field → France → career → 5-year. |
| CV / Résumé | PDF | Europass (EU), Standard (US/CA), Academic (PhD). Auto-fills from profile. |
| Budget justificatif | PDF | Country-specific costs. Auto-calculated. Visa-formatted. |
| Attestation hébergement | PDF/DOCX | Parent/host info. Adjusts for student vs parent mode. |
| Lettre de garant | PDF | Sponsor letter. Parent name from parent_profile. |
| Cover letter (visa) | PDF | Per-consulate. References admission + financial docs. |
| Checklist summary | PDF | Printable checklist with status (have/need/in-progress). |

## 8.3 Document Vault

Upload scans: passport, bac, transcripts, casier judiciaire. Drag-and-drop.

Auto-categorization via OCR (detect document type).

Expiry tracking: casier (3mo), TCF (2yr), passport (6mo beyond stay).

Version control: multiple versions per document. Secure sharing via temp links.

Storage: MinIO tawjihi-documents/{user_id}/

## 8.4 Parent Mode Adjustments

Attestation: Parent’s name as guarantor, child as beneficiary.

Lettre de garant: Parent’s financial info, child as sponsored.

Budget justificatif: Parent’s income as funding source.

CV/Motivation: Generated for the student (child_name), not parent.

## 8.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/documents/generate | Generate doc from template + profile |
| GET | /api/documents/templates | Available templates (filter: country, type) |
| GET | /api/documents/generated | User’s generated documents |
| POST | /api/vault/upload | Upload document to vault |
| GET | /api/vault | List vault contents |
| GET | /api/vault/{id}/download | Download from vault |
| DELETE | /api/vault/{id} | Delete document |
| GET | /api/vault/expiring | Documents expiring within 30 days |

## 8.6 Frontend Pages

Document Generator: Step 1 select type → Step 2 review pre-filled data → Step 3 AI-enhanced preview → Step 4 download PDF/DOCX.

Document Vault: File manager grid. Category tabs (identity, academic, financial, applications). Upload dropzone. Expiry warning badges (orange <30 days, red expired).

Quick Actions: Contextual from roadmap. "Generate motivation letter for step 10" → opens generator pre-configured.

# 9. Module 7: WhatsApp & Notification Engine

## 9.1 Overview

Multi-channel: WhatsApp (primary for Morocco), email, push. Proactive deadline management ensures no critical date is missed.

## 9.2 Notification Types

| Type | Channel | Trigger | Example |
| --- | --- | --- | --- |
| Deadline | WA+Email | 7 days before | "📅 Campus France due in 7 days. 3 docs missing." |
| Exam registration | WhatsApp | Window opens | "TCF March opened at IF Casa. Book now — fills in 3 days." |
| Step reminder | WhatsApp | 3 days overdue | "Casier judiciaire not uploaded. Need it for Step 7." |
| Results | WhatsApp | Expected date | "TCF results should be available this week." |
| Weekly digest | Email | Sunday | "3/7 tasks done. Next: bank attestation. Streak: 12🔥" |
| Acceptance | WA+Email | Status change | "Accepted at Paris-Saclay! Next steps: [link]" |
| Study reminder | WhatsApp | Streak breaking | "Don’t break 15-day streak! 5-min quiz: [link]" |
| Parent update | WhatsApp | Weekly | "Child completed 2 tasks. Visa booked Mar 15." |

## 9.3 WhatsApp Bot

"What’s my next step?" → current roadmap status.

"Show deadlines" → upcoming deadlines list.

"How to get casier judiciaire?" → step-by-step guide.

Powered by AI Copilot (Module 18). Escalation to human if stuck.

## 9.4 Technical

Meta WhatsApp Business Cloud API. Template messages (pre-approved) for proactive. Session messages for bot (24h window).

Celery worker processes notification queue. Redis as broker.

PostgreSQL: notification_queue (user_id, type, channel, payload, status, scheduled_at, sent_at).

Rate limit: Max 3 WhatsApp messages/user/day to avoid spam.

## 9.5 PostgreSQL: notification_queue

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| type | ENUM | deadline, exam_reg, step_reminder, results, digest, acceptance, study, parent |
| channel | ENUM | whatsapp, email, push |
| payload | JSON | {template_name, variables, links} |
| status | ENUM | pending, sent, failed, cancelled |
| scheduled_at | TIMESTAMPTZ | When to send |
| sent_at | TIMESTAMPTZ | When actually sent |
| error | TEXT NULLABLE | Failure reason |
| retry_count | INTEGER | Max 3 retries |

## 9.6 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/notifications/preferences | Get user notification preferences |
| PUT | /api/notifications/preferences | Update preferences (channels, frequency) |
| GET | /api/notifications/history | Sent notifications history |
| POST | /api/notifications/test | Send test notification (debug) |
| POST | /api/whatsapp/webhook | Incoming WhatsApp message webhook |

## 9.7 Frontend Pages

Notification Center: Bell icon in navbar with unread count. Dropdown shows recent notifications with timestamps.

Preferences Page: Toggle channels per notification type. Quiet hours setting. Parent notification channel toggle.

Notification History: Full list with status (sent/failed). Resend option for failed.

# 10. Module 8: Financial Planning & Scholarship Engine

## 10.1 Budget Calculator

Input: country, city, duration, lifestyle (budget/moderate/comfortable).

Output: monthly + yearly: tuition, rent, food, transport, insurance, phone, books, visa, exams, translations, flights.

Currency: real-time MAD → EUR/USD/CAD/GBP/CNY/JPY via API.

Comparison: Side-by-side 2–3 destinations. Total cost of degree.

## 10.2 PostgreSQL: scholarships

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| name | VARCHAR(300) |  |
| provider | VARCHAR(200) | Government, university, foundation |
| country_code | VARCHAR(5) |  |
| eligibility_nationality | JSON | ["MA","ALL"] |
| eligibility_education_level | JSON | ["licence","master"] |
| eligibility_field | JSON | ["engineering","ALL"] |
| eligibility_gpa_min | DECIMAL |  |
| coverage | JSON | {tuition, living, flight, insurance, books} |
| amount_description | TEXT | "Full tuition + €1K/month + flight" |
| application_deadline | VARCHAR(200) |  |
| application_url | VARCHAR(500) |  |
| competitiveness | ENUM | low, medium, high, very_high |
| success_rate_moroccan | DECIMAL | From community data |
| tips | TEXT | Moroccan-specific application tips |
| is_active | BOOLEAN |  |

## 10.3 Scholarship Matching

Profile → ranked eligible scholarships. Ranking: eligibility (hard filter), success rate, coverage amount, deadline proximity.

## 10.4 Financial Proof Generator

France: €7,380/yr minimum. Template for attestation de virement irrévocable.

Germany: €11,208/yr Sperrkonto. Links to Fintiba/Expatrio.

Canada: GIC (CAD 10K) + tuition proof. Template for bank request.

## 10.5 MongoDB: budget_data

{

  _id: ObjectId,

  country: "FR", city: "Paris",

  lifestyle: "moderate",

  monthly: {rent: 700, food: 300, transport: 75, insurance: 0,

    phone: 20, books: 30, personal: 150},

  yearly_extras: {tuition_public: 243, visa_fee: 500, exam_avg: 1500,

    translation: 400, flight: 4000, setup: 2000},

  currency: "EUR", exchange_rate_mad: 10.8,

  updated_at: ISODate

}

## 10.6 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/financial/budget | Calculate budget for destination |
| POST | /api/financial/compare | Compare budgets for 2–3 destinations |
| GET | /api/scholarships | Search scholarships (filter: country, field, level) |
| GET | /api/scholarships/{id} | Scholarship detail |
| POST | /api/scholarships/match | Match scholarships to user profile |
| GET | /api/financial/proof-templates | Financial proof templates by country |

## 10.7 Frontend Pages

Budget Calculator: Input form (country, city, lifestyle) → interactive breakdown chart (donut for categories, bar for monthly). MAD toggle. Total cost card.

Budget Compare: Side-by-side bar charts for 2–3 cities. Difference highlights.

Scholarship Explorer: Card grid. Filter sidebar (country, field, level, deadline). Match score indicator on each card.

Scholarship Detail: Coverage breakdown, eligibility checklist (green=met, red=not), tips from community, deadline countdown.

Financial Proof: Select country → shows required amount + template download + bank request letter generator.

# 11. Module 9: Housing & Pre-Departure

## 11.1 Housing Guide

Per-city guides for top 50 student cities: Paris, Lyon, Montréal, Berlin, Munich, Madrid, London, etc.

Average rent by neighborhood. Student-friendly areas. Moroccan community presence.

Types: CROUS/student residence, private studio, colocation, host family.

CROUS timeline for France (March submit, June results). Equivalent per country.

Platform links: Studapart, ImmoJeune, WG-Gesucht, SpareRoom, Kijiji.

## 11.2 Pre-Departure Checklists

Country-specific: legalize docs, activate intl. bank card, buy adapter, etc.

"First 30 days" guide: préfecture (FR), Anmeldung (DE), GP registration (UK), SIN (CA).

Essential apps per country: transport, banking, food, student discounts.

Emergency: Moroccan consulate, student union, local Moroccan association.

## 11.3 MongoDB: city_guides

{

  _id: ObjectId, country_code: "FR", city: "Lyon",

  neighborhoods: [{

    name: "Guillotière", avg_rent_studio_eur: 450,

    vibe: "Diverse, student-friendly, near Part-Dieu",

    moroccan_community: true, transport: "Métro B+D", safety: 3.5

  }],

  housing_types: {

    crous: {available: true, monthly_eur: 200, deadline: "March 15"},

    private_avg: 500, coloc_avg: 350

  },

  cost_of_living: {food: 250, transport: 30, phone: 15, total_monthly: 750},

  essential_apps: [{name: "TCL", purpose: "Transport"}, {name: "LeBonCoin", purpose: "Housing"}],

  first_30_days: [

    {day: "1-3", task: "Activate SIM (Free Mobile 19.99€/mo)"},

    {day: "1-7", task: "Open bank account (BoursoBank)"},

    {day: "1-14", task: "Préfecture for titre de séjour"},

    {day: "1-30", task: "Register CAF for APL housing aid"}

  ],

  emergency: {consulate: "+33...", police: "17", moroccan_assoc: "..."}

}

## 11.4 PostgreSQL: pre_departure_checklists

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| country_code | VARCHAR(5) |  |
| city | VARCHAR(100) |  |
| items | JSON | [{category, title, description, is_done, due_before, links, cost_mad}] |
| departure_date | DATE | Planned departure |
| completion_pct | DECIMAL | Auto-calc from items |

## 11.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/housing/cities | List cities with guides (filter: country) |
| GET | /api/housing/cities/{country}/{city} | Full guide: neighborhoods, costs, first-30-days |
| GET | /api/housing/compare | Compare 2–3 cities (query: cities=Lyon,Berlin,Montreal) |
| POST | /api/pre-departure/generate | Generate checklist from profile + destination |
| GET | /api/pre-departure/mine | User’s active checklists |
| PUT | /api/pre-departure/{id}/item/{idx} | Toggle checklist item |

## 11.6 Frontend Pages

City Explorer: Search/browse. Map view with pins. Click city → full guide with neighborhood cards (rent, vibe, transport, safety rating), cost breakdown chart (stacked bar), first-30-days interactive timeline.

City Compare: Side-by-side 2–3 cities. Bar charts for rent, food, transport. Traffic light affordability indicators. Winner badges per category.

My Checklist: Interactive checklist grouped by category (documents, logistics, finances, arrival). Progress bar at top. Check-off animations. WhatsApp reminder toggle per item.

# 12. Module 10: Mentorship & Community Network

## 12.1 Mentor Matching

Verified mentors: current students abroad, verified via university email or enrollment proof.

Match by: destination country, field, Moroccan city of origin, education path.

Profiles: country, university, field, year, languages, specialties (visa, housing, exams).

1-on-1 in-app chat. Rating system after interaction.

## 12.2 Community Features

Country forums: France, Canada, Germany, etc. Moderated.

Exam groups: IELTS prep, TCF prep, TestDaF prep.

Success stories: Featured anonymized journeys.

Events: Webinars ("How I got into Sciences Po", "My CSC Scholarship").

Moroccan student associations directory per city abroad.

## 12.3 PostgreSQL: mentors

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK | Linked account |
| country_code | VARCHAR(5) | Study country |
| city | VARCHAR(100) |  |
| university | VARCHAR(200) |  |
| field | VARCHAR(200) |  |
| arrival_year | INTEGER |  |
| specialties | JSON | ["campus_france","visa","housing"] |
| bio | TEXT | Short bio |
| is_verified | BOOLEAN | Enrollment verified |
| rating | DECIMAL(3,2) | 1–5 avg |
| total_mentees | INTEGER | Students helped |
| is_active | BOOLEAN | Accepting mentees |
| verification_doc_url | VARCHAR(500) | MinIO path to enrollment proof |

## 12.4 MongoDB: mentor_chats

{

  _id: ObjectId,

  mentor_id: UUID, mentee_id: UUID,

  status: "active"|"closed"|"reported",

  messages: [

    {sender: UUID, text: "Salam! Questions about CF...",

     timestamp: ISODate, read: true}

  ],

  started_at: ISODate, last_message_at: ISODate,

  mentee_rating: {stars: 5, comment: "Very helpful!"}

}

## 12.5 MongoDB: community_posts

{

  _id: ObjectId,

  type: "question"|"answer"|"story"|"event",

  author_id: UUID, author_display: "Student in Lyon (2025)",

  forum: "france"|"canada"|"ielts_prep",

  title: "How long did CF interview take?",

  body: "I have my interview next week...",

  parent_id: null,  // answers ref question _id

  upvotes: 12, downvotes: 1,

  is_pinned: false, is_moderated: true,

  tags: ["campus_france","interview"]

}

## 12.6 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/mentors | Search (filter: country, field, specialty) |
| GET | /api/mentors/{id} | Profile detail |
| POST | /api/mentors/apply | Apply to become mentor |
| POST | /api/mentors/{id}/connect | Request connection |
| GET | /api/chat/conversations | User’s mentor chats |
| GET | /api/chat/{id}/messages | Messages in conversation |
| POST | /api/chat/{id}/message | Send message |
| POST | /api/chat/{id}/rate | Rate mentor |
| GET | /api/community/posts | List (filter: forum, type, tag) |
| POST | /api/community/posts | Create post |
| POST | /api/community/posts/{id}/vote | Upvote/downvote |
| GET | /api/community/stories | Success stories |

## 12.7 Frontend Pages

Find a Mentor: Card grid with country flag, university, field, rating, specialties. Filter sidebar. "Connect" button.

Mentor Chat: WhatsApp-style UI. Bubbles, timestamps, read receipts. Rating prompt on close.

Forum: Reddit-style. Tabs for country + exam forums. Post cards with upvotes, answer count. Thread view.

Stories: Instagram-style cards. Journey summary, key stats, anonymized. Share button.

Become Mentor: Application form with email verification, enrollment upload, specialty picker.

# 13. Module 11: Admin & Analytics Dashboard

## 13.1 Content Management

Exam editor: Add/edit exams, sections, scoring rules. No code needed.

School/program editor: CRUD + bulk CSV import.

Question bank: Review AI-generated questions. Approve/reject/edit. Examiner assignment.

Roadmap template editor: Create/edit per country/pathway.

Scholarship editor: CRUD with deadline tracking.

## 13.2 Analytics

Funnel: Register → Profile → Exam started → Roadmap → Applied → Accepted.

Exam metrics: avg scores, difficulty calibration, most missed questions.

Popular destinations, programs, exam combos.

Revenue (Phase 2+): MRR, churn, LTV, conversion.

Community health: active mentors, Q&A activity, experience reports.

## 13.3 RBAC

| Role | Access | Capabilities |
| --- | --- | --- |
| super_admin | Full platform | All CMS, user mgmt, config, billing |
| content_admin | Content only | Edit exams/schools/programs/roadmaps. No user PII. |
| question_reviewer | Question bank | Review/approve/reject. See question stats. |
| support_agent | User support | View tickets, user roadmap (limited PII). Respond. |
| analytics_viewer | Read-only | View dashboards. No edit, no user data. |

## 13.4 API Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | /api/admin/stats | super/analytics | Dashboard stats |
| GET | /api/admin/users | super | User list (paginated) |
| GET | /api/admin/funnel | analytics | Conversion funnel |
| GET | /api/admin/questions/review | reviewer | Pending review queue |
| PUT | /api/admin/questions/{id}/approve | reviewer | Approve question |
| PUT | /api/admin/questions/{id}/reject | reviewer | Reject with reason |
| POST | /api/admin/exams | content | Create/edit exam |
| POST | /api/admin/schools/import | content | Bulk CSV import |
| POST | /api/admin/programs | content | Create/edit program |
| POST | /api/admin/roadmap-templates | content | Create/edit roadmap |
| POST | /api/admin/scholarships | content | Create/edit scholarship |
| GET | /api/admin/support/tickets | support | Open tickets |
| PUT | /api/admin/support/tickets/{id} | support | Respond/close |
| POST | /api/admin/broadcast | super | Bulk notification |

## 13.5 Frontend Pages

Admin Login: /admin route, 2FA (TOTP after password).

Dashboard Home: Metric cards (users, active today, exams today, roadmaps). Funnel chart. Trending destinations.

Question Queue: Card per question. Exam type, section, difficulty, content preview. Approve/reject buttons. Stats sidebar.

CMS Editor: Tab-based for exams/schools/programs/roadmaps/scholarships. Form fields match schema. Markdown support. Preview.

Support: Ticket list (priority, status, age). Click → user roadmap + conversation. Reply inline.

Analytics: Recharts dashboards. Time-series registrations. Pie charts destinations. Heatmap DAU.

# 14. Module 12: Marketplace & Services Directory

## 14.1 Service Categories

| Category | Examples | Data |
| --- | --- | --- |
| Sworn translators | Traducteurs assermentés in Casa/Rabat/Fes/Marrakech | Price/page, languages, turnaround, rating |
| Legalization | Apostille, embassy legalization | Price, time, location |
| Exam help | Booking TCF/IELTS in remote cities | Price, availability |
| Visa photos | Biometric photographers | Price, location |
| Medical exams | Health certificates | Price, approved clinics |
| Tutoring | Private exam prep tutors | Price/hr, languages, rating |
| Blocked accounts | Fintiba, Expatrio for Germany | Fees, time |
| Insurance | Student health insurance | Monthly cost, coverage |

## 14.2 PostgreSQL: service_providers

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| name | VARCHAR(300) |  |
| category | ENUM | translator, legalization, exam_help, photo, medical, tutor, blocked_acct, insurance |
| city | VARCHAR(100) | City in Morocco |
| address | TEXT |  |
| phone | VARCHAR(20) |  |
| email | VARCHAR(255) |  |
| website | VARCHAR(500) |  |
| languages | JSON | For translators |
| price_description | TEXT | "80 MAD/page, express +50%" |
| turnaround_days | INTEGER |  |
| rating | DECIMAL(3,2) | 1–5 |
| total_reviews | INTEGER |  |
| is_verified | BOOLEAN | Tawjihi verified |
| is_active | BOOLEAN |  |

## 14.3 PostgreSQL: service_reviews

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| provider_id | FK |  |
| user_id | FK |  |
| roadmap_step_id | UUID NULLABLE | Verification link |
| stars | INTEGER | 1–5 |
| comment | TEXT |  |
| provider_response | TEXT NULLABLE |  |
| is_verified | BOOLEAN | Linked to completed step |
| created_at | TIMESTAMPTZ |  |

## 14.4 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/marketplace/providers | Search (filter: category, city, rating) |
| GET | /api/marketplace/providers/{id} | Detail with reviews |
| POST | /api/marketplace/providers | Suggest provider (admin approves) |
| POST | /api/marketplace/reviews | Submit review |
| GET | /api/marketplace/reviews/{pid} | Reviews for provider |
| GET | /api/marketplace/categories | Categories with counts per city |

## 14.5 Frontend Pages

Directory: 8-category grid with icons. Click → provider list. Filter by city, rating, price.

Provider Card: Name, category badge, city, stars, review count, price, turnaround. Verified badge.

Provider Detail: Full info, map pin, all reviews, response from provider. Review form.

Contextual: Roadmap step mentions "traducteur" → sidebar shows top translators in user’s city.

# 15. Module 13: Gamification & Engagement

## 15.1 XP System

Practice question: +5 XP. Section complete: +50. Full mock: +200. Daily login: +10.

Roadmap step: +100. Community experience report: +150. Q&A answer upvoted: +20.

Levels: Beginner (0–1K), Intermediate (1K–5K), Advanced (5K–15K), Expert (15K–50K), Master (50K+).

## 15.2 Streaks & Badges

Daily streak: 1+ question/day. Visual fire counter. Streak freeze (1/week).

Badges: "First Mock", "B2 Reached", "10-Day Streak", "App Submitted", "Visa!", "Helper" (10 answers).

Study groups: Cohort for same exam. Group leaderboard + shared goals.

Daily challenge: 5 random questions, 3-min timer, bonus XP for perfect.

## 15.3 PostgreSQL: user_gamification

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK UNIQUE | One per user |
| xp_total | INTEGER | Lifetime XP |
| level | ENUM | beginner, intermediate, advanced, expert, master |
| streak_current | INTEGER | Current daily streak |
| streak_longest | INTEGER | All-time longest |
| streak_freezes_remaining | INTEGER | Max 1/week |
| last_activity_date | DATE | For streak calc |
| badges | JSON | [{badge_id, name, earned_at, icon}] |
| daily_challenge_completed_today | BOOLEAN |  |

## 15.4 PostgreSQL: study_groups

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| name | VARCHAR(200) | "IELTS Band 7 — March 2026" |
| exam_code | VARCHAR(50) |  |
| target_score | VARCHAR(20) |  |
| member_ids | JSON | [UUID] |
| max_members | INTEGER | Default 30 |
| created_by | FK |  |
| is_active | BOOLEAN |  |

## 15.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/gamification/me | XP, level, streak, badges |
| GET | /api/gamification/leaderboard | Global (filter: exam, week/month/all) |
| GET | /api/gamification/badges | All badges with earn criteria |
| POST | /api/gamification/daily-challenge | Start today’s challenge |
| POST | /api/gamification/daily-challenge/submit | Submit challenge answers |
| GET | /api/study-groups | List (filter: exam, has_space) |
| POST | /api/study-groups | Create group |
| POST | /api/study-groups/{id}/join | Join group |
| GET | /api/study-groups/{id}/leaderboard | Group leaderboard |

## 15.6 Frontend Pages

XP Widget: Persistent sidebar/header. Level badge, XP bar to next level, streak fire, recent badges.

Leaderboard: Tabs per exam. Top 100 by week/month/all. User rank highlighted. Anonymous names.

Badge Gallery: Grid. Earned = color + date. Unearned = gray + criteria tooltip. Progress bars for partial.

Daily Challenge: Full-screen quiz mode. 5 questions, countdown. Result screen with XP animation.

Study Groups: Card list. Exam, target, members, top scorer. Join button. Group view: member list, leaderboard, goal tracker.

# 16. Module 14: Multi-Platform & Accessibility

## 16.1 Platforms

| Platform | Technology | Status | Key Feature |
| --- | --- | --- | --- |
| Web | React 18 + Vite + Nginx | Phase 1 | Responsive, full features |
| PWA | Service Worker + manifest | Phase 1 | Installable, push notifications |
| iOS | React Native | Phase 2 | Shared logic with web |
| Android | React Native | Phase 2 | Shared logic with web |
| Offline | IndexedDB + SW cache | Phase 1 | Download question packs, sync on reconnect |

## 16.2 Internationalization (i18n)

UI: Arabic (العربية), French, English. RTL layout for Arabic.

Darija tooltips: Toggle on/off. Complex terms in Moroccan dialect.

i18n JSON files for static text. AI responses in user’s preferred language.

Date/number locale: dd/MM/yyyy (AR/FR), MM/dd/yyyy (EN).

## 16.3 Accessibility (WCAG 2.1 AA)

Screen reader: ARIA labels on all interactive elements.

Keyboard nav: Full tab order, focus indicators, shortcuts.

High contrast mode toggle. Font size: small/medium/large.

Audio speed: 0.75x, 1x, 1.25x for listening exercises.

Color-blind safe: No color-only information encoding.

## 16.4 Offline Architecture

Question packs: Download exam section as JSON + audio to IndexedDB.

Practice offline: All question types work without network.

Progress sync: On reconnect, local progress merges with server (last-write-wins).

Size estimate: 1 exam section ≈ 5–20 MB (depends on audio).

## 16.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/offline/packs | List downloadable question packs |
| GET | /api/offline/packs/{exam}/{section} | Download pack (JSON + audio URLs) |
| POST | /api/offline/sync | Sync offline progress to server |
| GET | /api/i18n/{lang} | Get translation strings for language |

## 16.6 Frontend Implementation

Service Worker: Caches static assets + downloaded question packs. Intercepts fetch for offline responses.

Language Switcher: Dropdown in header. Persisted to profile. Instant switch without reload.

Accessibility Panel: Settings gear opens panel with contrast, font size, audio speed toggles.

Offline Indicator: Banner when offline. Shows cached content count. Sync button when back online.

# 17. Module 15: Integration Hub

## 17.1 External Platform Tracking

Campus France: User provides Études en France creds (stored AES-256 encrypted). Periodic status check. Notify on change.

uni-assist (Germany): Track processing status.

UCAS (UK): Track application + offers.

Manual fallback: User updates status manually if scraping breaks.

## 17.2 Calendar Sync

Google Calendar API: All deadlines, exams, visa appointments as events.

iCal export for Apple Calendar / other.

Auto-reminders: 1 week + 1 day before.

## 17.3 OCR & Document Intelligence

Upload photo → OCR → auto-fill profile.

Bac transcript: marks, filière, mention.

Exam result: score, date, type.

Passport: name, number, expiry.

Tesseract OCR or Google Vision API.

## 17.4 PostgreSQL: platform_connections

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| platform | ENUM | campus_france, uni_assist, ucas, google_calendar |
| credentials_encrypted | TEXT | AES-256 encrypted credentials |
| last_checked_at | TIMESTAMPTZ |  |
| last_status | VARCHAR(200) | Last detected status |
| status_history | JSON | [{status, detected_at}] |
| is_active | BOOLEAN | Auto-check enabled |

## 17.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/integrations/connect | Connect external platform |
| GET | /api/integrations/mine | List connected integrations |
| POST | /api/integrations/{id}/check | Manual status check |
| DELETE | /api/integrations/{id} | Disconnect + delete creds |
| POST | /api/integrations/calendar/sync | Sync deadlines to Google Calendar |
| GET | /api/integrations/calendar/ical | Download iCal file |
| POST | /api/integrations/ocr | Upload document image for OCR |

## 17.6 Frontend Pages

Integrations Hub: Card per platform (Campus France, uni-assist, UCAS, Google Calendar). Status indicator (connected/disconnected). Connect/disconnect buttons. Last checked timestamp.

Status Tracker: Timeline view of status changes per platform. Auto-refresh indicator.

Calendar View: Month/week view of synced deadlines. Color-coded by type (exam=blue, visa=red, deadline=orange). Sync button.

OCR Upload: Drag-drop image → processing spinner → extracted fields preview → confirm to auto-fill profile.

## 17.7 Edge Cases & Error Handling

OCR failure: If confidence <60%, show manual input form pre-filled with partial results. Log for model improvement.

Scraping blocked: If Campus France changes HTML structure, auto-disable scraping. Notify user to update manually. Alert admin.

Calendar conflict: If event already exists, update rather than duplicate. Use event UID for dedup.

Credential expiry: If platform login fails, notify user to re-authenticate. Never retry with wrong creds (avoid lockout).

# 18. Module 16: Visa Interview Prep

## 18.1 Overview

AI mock visa interviews per country + embassy. France, USA, Canada, UK all have interviews. AI plays the consul with realistic pressure.

## 18.2 Features

AI interviewer: GPT-4o as visa officer for specific embassy (French consulate Casa, US Embassy Rabat).

Voice mode: Mic recording → Whisper transcription → AI evaluates. Text mode also available.

Scoring: clarity, consistency with application, confidence, red flag detection.

Feedback: "Financial support answer was vague. Specify parent’s profession and reference bank attestation."

Stress simulation: rapid follow-ups, interruptions, skeptical tone.

## 18.3 MongoDB: visa_interview_questions

{

  _id: ObjectId, country: "FR", embassy_city: "Casablanca",

  question_text: "Pourquoi la France et pas un autre pays ?",

  question_text_en: "Why France and not another country?",

  category: "motivation"|"financial"|"academic"|"ties"|"post_study",

  difficulty: "common"|"tricky"|"red_flag",

  ideal_structure: "Specific knowledge of program + why France + career link to Morocco",

  red_flags: ["Want to stay permanently", "No specific reason", "Vague plans"],

  source: "community"|"curated",

  times_asked_reported: 47

}

## 18.4 PostgreSQL: visa_mock_sessions

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| country_code | VARCHAR(5) |  |
| embassy_city | VARCHAR(100) |  |
| mode | ENUM | voice, text |
| questions_asked | INTEGER |  |
| overall_score | DECIMAL | 0–100 |
| scores_breakdown | JSON | {clarity, consistency, confidence, red_flags} |
| feedback_summary | TEXT | AI-generated summary |
| recording_urls | JSON | [MinIO paths] for voice mode |
| transcript | JSON | [{role, text, timestamp}] |
| completed_at | TIMESTAMPTZ |  |

## 18.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/visa-prep/start | Start mock session (country, embassy, mode) |
| POST | /api/visa-prep/{id}/answer | Submit answer (text or audio upload) |
| POST | /api/visa-prep/{id}/next | Get next question from AI |
| POST | /api/visa-prep/{id}/finish | End session, get scoring |
| GET | /api/visa-prep/history | Past sessions with scores |
| GET | /api/visa-prep/questions/{country} | Common questions for country |

## 18.6 Frontend Pages

Select Interview: Choose country → embassy → mode (voice/text). Difficulty (standard/stress). Start button.

Interview Room: Split screen. Left: AI consul avatar + question text. Right: answer area (text input or mic recording with waveform visualization). Timer showing session duration.

Results: Overall score gauge (0–100). Breakdown cards: clarity, consistency, confidence, red flags. Per-question feedback with ideal answer hints. "Practice again" button.

Question Bank: Browse common questions by country/category. User can star questions to practice later.

## 18.7 Edge Cases

Audio upload failure: Auto-retry 3x. If persists, offer text mode fallback mid-session.

Whisper transcription error: Show transcription to user for correction before AI evaluation.

AI generates inappropriate question: Content filter on AI output. Flag + remove. Fallback to curated question.

Session timeout: Auto-save progress every answer. Resume within 24 hours.

# 19. Module 17: Language Learning Engine

## 19.1 Overview

Structured A1→C2 language learning, not just exam prep. Student starting from zero in German follows complete course, then transitions to TestDaF prep. Pipeline: learn → exam → apply.

## 19.2 Learning Paths

| Language | Levels | Special Tracks |
| --- | --- | --- |
| French | A1→C2 | Academic French, administrative vocabulary, Campus France prep |
| English | A1→C2 | Academic English, IELTS/TOEFL bridge modules |
| German | A1→C2 | Uni vocabulary, Studienkolleg prep, Goethe bridge |
| Spanish | A1→C2 | DELE bridge, Latin American vs Castilian |
| Chinese | HSK 1→9 | Character learning (strokes, radicals), tone drilling |
| Japanese | N5→N1 | Hiragana/Katakana → Kanji, grammar patterns, keigo |
| Korean | Beg→TOPIK 6 | Hangul → grammar → TOPIK bridge, K-culture |
| Italian | A1→C2 | CILS bridge, art/design vocabulary |

## 19.3 Lesson Structure

Each level: 10–15 units. Each unit: 5–10 lessons. Each lesson: 15–20 minutes.

Format: Concept intro (text+audio) → Examples → Interactive exercises → Mini-quiz.

Exercises: flashcards, fill-blank, sentence construction, listening, dictation, shadowing.

Spaced repetition (SM-2): Vocabulary reappears at optimal intervals.

AI conversation: Chat in target language at your level. AI adjusts. Inline corrections.

Cultural notes: Per-level info about the country (universities, social norms).

Exam bridge: "Completed B2 French → Ready for TCF prep. Start here."

## 19.4 MongoDB: learning_content

{

  _id: ObjectId, language: "de", level: "A1", unit: 3, lesson: 2,

  title: "Im Restaurant bestellen",

  type: "grammar"|"vocabulary"|"reading"|"listening"|"speaking"|"culture",

  content: {

    introduction: "In this lesson, ordering food...",

    examples: [{target: "Ich hätte gerne...", english: "I would like...", audio_url: "s3://..."}],

    exercises: [{type: "fill_blank", prompt: "Ich ___ gerne einen Kaffee", answer: "hätte"}],

    vocabulary: [{word: "bestellen", translation: "to order", audio: "s3://..."}]

  },

  duration_minutes: 15, xp_reward: 30

}

## 19.5 MongoDB: vocabulary_srs

Spaced Repetition System state per user per word.

{

  user_id: UUID, language: "de",

  word: "bestellen", translation: "to order",

  ease_factor: 2.5,  // SM-2 parameter

  interval_days: 7,  // next review in 7 days

  next_review: ISODate,

  repetitions: 4,  // times correctly recalled

  last_quality: 4  // 0-5 self-reported recall quality

}

## 19.6 PostgreSQL: learning_progress

| Column | Type | Description |
| --- | --- | --- |
| id | UUID PK |  |
| user_id | FK |  |
| language | VARCHAR(5) |  |
| current_level | VARCHAR(5) | A1, A2, etc. |
| current_unit | INTEGER |  |
| current_lesson | INTEGER |  |
| total_lessons_completed | INTEGER |  |
| total_xp | INTEGER |  |
| vocab_mastered | INTEGER | SRS interval >30 days |
| vocab_learning | INTEGER | Active learning |
| streak_current | INTEGER |  |
| last_lesson_date | DATE |  |

## 19.7 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | /api/learn/languages | Available languages + user progress per lang |
| GET | /api/learn/{lang}/path | Full learning path (units, lessons, status) |
| GET | /api/learn/{lang}/lesson/{unit}/{lesson} | Lesson content |
| POST | /api/learn/{lang}/lesson/{unit}/{lesson}/complete | Mark lesson complete |
| GET | /api/learn/{lang}/vocabulary/review | Due SRS vocabulary cards |
| POST | /api/learn/{lang}/vocabulary/review | Submit SRS review results |
| POST | /api/learn/{lang}/ai-chat | AI conversation practice |
| GET | /api/learn/{lang}/bridge/{exam} | Bridge module to exam prep |

## 19.8 Frontend Pages

Language Dashboard: Card per language. Progress ring, current level, streak, "Continue" button. "Start new language" card.

Learning Path: Vertical unit map (like Duolingo tree). Units = nodes. Completed = green, current = pulsing, locked = gray. Click unit → lesson list.

Lesson View: Content area (text + audio player). Exercise area (interactive widgets). Progress bar at top. Mini-quiz at end.

Vocabulary Review: Flashcard mode. Card flip animation. SM-2 self-rating (Again/Hard/Good/Easy). Stats: due today, mastered total.

AI Chat: WhatsApp-style chat in target language. AI corrections appear as inline annotations (red underline + suggestion popup). Level indicator.

# 20. Module 18: AI Copilot

## 20.1 Overview

Conversational AI accessible everywhere. "What’s the difference between TCF and DELF?" "Am I eligible for Eiffel?" "What should I do next?" Grounded in Tawjihi data via RAG.

## 20.2 Capabilities

Q&A: Exams, countries, procedures, deadlines, scholarships — from database, not hallucination.

Personal context: "Your last IELTS practice was 6.0. Target 6.5. Focus on Writing Task 2."

Navigation: "Take me to roadmap" → opens page. "Start IELTS practice" → opens prep.

Document gen: "Write motivation letter for EPFL" → triggers Module 6.

WhatsApp: Same copilot powers WhatsApp bot (Module 7).

Multilingual: Responds in AR/FR/EN. Understands Darija.

## 20.3 Technical Architecture

GPT-4o with function calling (tools) for database access.

RAG: Question → embed → retrieve from vector store → generate grounded response.

Tools: get_user_profile, get_exam_details, get_country_requirements, get_roadmap_status, search_programs, search_scholarships, generate_document.

Anti-hallucination: Facts must be sourced from DB. Unknown = "I don’t have that info" not guess.

Context: Last 20 messages in MongoDB per session + user profile.

Rate limit: 50 msg/day free, unlimited paid.

## 20.4 MongoDB: copilot_conversations

{

  _id: ObjectId, user_id: UUID, session_id: UUID,

  messages: [

    {role: "user", content: "What exams for Canada?", ts: ISODate},

    {role: "assistant", content: "Based on your profile...", ts: ISODate,

     tool_calls: [{name:"get_country_requirements", args:{country:"CA"}}],

     sources: ["countries/CA", "exams/ielts", "exams/tcf_canada"]}

  ],

  created_at: ISODate

}

## 20.5 API Endpoints

| Method | Path | Description |
| --- | --- | --- |
| POST | /api/copilot/message | Send message, get AI response |
| GET | /api/copilot/sessions | List past sessions |
| GET | /api/copilot/sessions/{id} | Get full conversation |
| DELETE | /api/copilot/sessions/{id} | Delete conversation |
| POST | /api/copilot/feedback | Thumbs up/down on response |

## 20.6 Frontend

Floating Chat Button: Bottom-right FAB on every page. Click → chat panel slides up.

Chat Panel: Messages with AI avatar. Markdown rendering for structured answers. Source citations (clickable links to exams/programs). Quick action buttons in responses.

Full Page Mode: Expand chat to full page for complex conversations. Conversation history sidebar.

Contextual Suggestions: Based on current page, copilot suggests relevant questions ("Ask about this program’s requirements").

## 20.7 Edge Cases

AI returns hallucinated program: Validation layer checks all program/school IDs against DB before displaying. Unknown IDs stripped.

User asks about unsupported country: Copilot says "We don’t have data for [country] yet. Suggest it?" → logs feature request.

Token limit exceeded: Summarize older messages. Keep last 20 messages verbatim, summarize rest.

OpenAI API down: Show "AI temporarily unavailable" with fallback FAQ search (keyword-based from static content).

Abusive input: Content filter on input. Flag user if repeated. Block copilot access after 3 strikes.

# 21. Performance Requirements & SLAs

## 21.1 Response Time Targets

| Endpoint Category | P50 Target | P95 Target | P99 Target | Max Acceptable |
| --- | --- | --- | --- | --- |
| Static pages (SPA shell) | <50ms | <100ms | <200ms | 500ms |
| API: simple reads (profile, exam list) | <100ms | <200ms | <400ms | 800ms |
| API: complex queries (program matching) | <300ms | <600ms | <1000ms | 2000ms |
| API: AI-powered (career, copilot) | <2000ms | <4000ms | <6000ms | 10000ms (streaming) |
| API: writing evaluation | <5000ms | <8000ms | <12000ms | 15000ms |
| API: speaking upload + transcription | <3000ms | <5000ms | <8000ms | 12000ms |
| Exam simulation: load section | <200ms | <400ms | <700ms | 1500ms |
| Exam simulation: submit answers | <150ms | <300ms | <500ms | 1000ms |
| Document generation (PDF) | <3000ms | <5000ms | <8000ms | 12000ms |
| Search (programs, scholarships) | <200ms | <400ms | <700ms | 1500ms |
| File upload (MinIO) | <1000ms | <2000ms | <3000ms | 5000ms (50MB max) |

## 21.2 Throughput Targets

| Metric | Phase 1 (MVP) | Phase 2 (Growth) | Phase 3 (Scale) |
| --- | --- | --- | --- |
| Concurrent users | 200 | 2,000 | 20,000 |
| Requests/second (API) | 50 rps | 500 rps | 5,000 rps |
| Exam sessions simultaneously | 50 | 500 | 5,000 |
| AI requests/minute | 20 | 200 | 2,000 |
| WhatsApp messages/day | 1,000 | 50,000 | 500,000 |
| File uploads/hour | 100 | 1,000 | 10,000 |

## 21.3 Availability SLA

| Tier | Availability | Downtime/month | Applies To |
| --- | --- | --- | --- |
| Tier 1 (Critical) | 99.9% | 43 min | Auth, exam sessions, payment |
| Tier 2 (Important) | 99.5% | 3.6 hours | Roadmaps, document gen, search |
| Tier 3 (Standard) | 99.0% | 7.2 hours | AI copilot, analytics, community |
| Tier 4 (Best-effort) | 95.0% | 36 hours | External integrations (Campus France scraping, OCR) |

## 21.4 Database Performance

PostgreSQL: Connection pool size 20 (Phase 1), 100 (Phase 2). PgBouncer for connection pooling.

PostgreSQL indexes: Composite index on (user_id, exam_code) for progress queries. GIN index on JSON columns. B-tree on all FK columns.

MongoDB: Compound indexes on (exam_code, section, difficulty) for question retrieval. Text index on community_qa for full-text search.

Redis: Eviction policy allkeys-lru. Max memory 512MB (Phase 1), 4GB (Phase 2).

Query budget: No single query should take >100ms. Complex aggregations run in Celery worker, results cached.

## 21.5 CDN & Asset Performance

React SPA bundle: Target <300KB gzipped (code-split by module).

Audio files: Served from MinIO with CDN cache. Preload first 30 seconds on exam start.

Images: WebP format with srcset for responsive. Max 200KB per image.

Service Worker: Cache SPA shell + exam question packs for offline. Stale-while-revalidate strategy.

## 21.6 Load Testing Plan

Tool: k6 (open-source) for HTTP load testing.

Scenario 1 — Normal load: 200 virtual users, 10 minutes, all endpoint types. Target: 0 errors, P95 within SLA.

Scenario 2 — Exam rush: 500 concurrent exam sessions starting simultaneously (simulates exam registration day). Target: All sessions start <2 seconds.

Scenario 3 — Spike: Ramp from 50 to 1000 users in 60 seconds. Target: No 5xx errors, graceful degradation.

Scenario 4 — Soak: 100 users for 4 hours. Target: No memory leaks, stable response times.

Frequency: Before every release + monthly regression.

# 22. Testing Strategy

## 22.1 Testing Pyramid

| Layer | Tool | Coverage Target | Scope |
| --- | --- | --- | --- |
| Unit Tests | pytest + pytest-asyncio | 80%+ | All business logic: matching algorithm, scoring engine, IRT calculations, document generation, data transforms |
| Integration Tests | pytest + httpx (TestClient) | 70%+ | All API endpoints against real DB (Docker test containers). Auth flows. CRUD for every entity. |
| Database Tests | pytest + SQLAlchemy fixtures | 100% migrations | Every Alembic migration runs forward and backward. Seed data integrity checks. |
| E2E Tests | Playwright | Critical paths | Onboarding flow, exam simulation (start → answer → submit → results), roadmap creation, document download |
| AI Quality Tests | Custom framework | Key scenarios | Career advisor output quality, writing evaluation accuracy vs human graders, copilot hallucination rate |
| Performance Tests | k6 | Before release | See Section 21.6 |
| Security Tests | OWASP ZAP + manual | Quarterly | Full scan of all endpoints. SQL injection, XSS, CSRF, auth bypass checks. |

## 22.2 Unit Test Specifications

### 22.2.1 Matching Algorithm Tests

test_bac_sm_matches_engineering: Bac Sciences Math student with 16/20 average matches CPGE/engineering programs.

test_bac_lettres_excludes_engineering: Bac Lettres student does NOT match engineering programs requiring SM/SP.

test_budget_filter: Student with 50,000 MAD/year budget excludes programs costing >50,000 MAD.

test_exam_gap_detection: Student without IELTS sees "Missing: IELTS 6.5" on UK programs.

test_local_programs_included: Moroccan ENSAM/ENSA programs appear alongside international options.

test_scoring_weights: Programs with 100% eligibility fit ranked above 80% fit regardless of preference match.

### 22.2.2 Exam Scoring Tests

test_ielts_band_calculation: Raw scores per section map correctly to band scores (e.g., 30/40 reading = Band 7.0).

test_tcf_level_mapping: Scores 400–499 = B2, 500–599 = C1, 600–699 = C2.

test_irt_ability_update: After answering easy question correctly, ability estimate increases by small amount. After hard question correctly, increases by large amount.

test_adaptive_question_selection: Next question difficulty is within 0.2 of estimated ability level.

test_timer_enforcement: Answers submitted after section time expires are not counted.

### 22.2.3 Document Generation Tests

test_motivation_letter_fills_profile: Generated letter contains student name, program name, university, field.

test_parent_mode_attestation: When parent generates attestation, parent’s name is guarantor, child’s name is beneficiary.

test_cv_format_per_country: France CV includes photo placeholder. US CV excludes photo. Both have correct section order.

test_pdf_generates_valid: Generated PDF opens without corruption. Text is selectable. Images render.

## 22.3 Integration Test Specifications

### 22.3.1 Auth Flow Tests

test_register_login_flow: Register → verify email → login → access protected endpoint → 200 OK.

test_expired_token_rejected: Access token past 15 min → 401. Refresh → new access token → 200.

test_rate_limit_login: 6th login attempt within 15 min → 429 Too Many Requests.

test_rbac_student_cannot_admin: Student role accessing /api/admin/* → 403 Forbidden.

test_rbac_parent_sees_child: Parent can GET child’s profile. Cannot GET other students’ profiles.

### 22.3.2 Exam Flow Tests

test_diagnostic_creates_study_plan: Complete diagnostic → exam_progress record created with study plan.

test_simulation_enforces_sections: Cannot submit section 3 answers before completing section 1 and 2.

test_speaking_upload_triggers_eval: Upload audio file → Whisper transcription job queued → AI evaluation returned.

test_progress_updates_after_attempt: After completing mock test, total_questions_answered and current_estimated_score update.

### 22.3.3 Roadmap Flow Tests

test_generate_roadmap_france_dap: Select French L1 program → generates 20-step France DAP roadmap.

test_step_completion_tracks: Mark step 4 as done → steps_status updated → current_phase may advance.

test_document_upload_links_to_step: Upload casier judiciaire → linked to step 5 → step status becomes done.

test_roadmap_notifications: Overdue step → notification queued → WhatsApp template message sent.

## 22.4 E2E Test Scenarios

| Scenario | Steps | Expected Result |
| --- | --- | --- |
| New student onboarding | Register → select Student → input Bac SM 16/20 → prefer France+Canada → see matched programs | 40+ programs displayed, sorted by match score. CPGE and engineering programs visible. |
| Full exam simulation | Select IELTS Academic → start mock → answer all 4 sections → submit | Band score displayed per section + overall. Results saved. Progress updated. |
| Roadmap creation | Select program → click Start Procedures → see roadmap → mark 3 steps done | Roadmap with 15+ steps. Progress bar at 20%. Next action highlighted. |
| Document generation | Open roadmap → click Generate Motivation Letter → download PDF | PDF generated with student data, program name, proper formatting. |
| WhatsApp notification | Set deadline for tomorrow → wait for cron → check WhatsApp | WhatsApp message received with deadline reminder and direct link. |

## 22.5 AI Quality Assurance

Hallucination test suite: 100 questions with known answers. AI must not invent programs, scores, or deadlines. Target: <2% hallucination rate.

Writing evaluation benchmark: 50 essays pre-graded by certified IELTS examiners. AI must match within 0.5 band score 80% of the time.

Career advisor relevance: 30 student profiles with expert-recommended careers. AI suggestions must overlap 70%+ with expert recommendations.

Copilot grounding test: Ask 50 questions where answer is in database. AI must cite correct source in 90%+ of responses.

Adversarial test: 20 trick questions ("What’s the IELTS score for North Korea?"). AI must decline gracefully, not hallucinate.

## 22.6 CI/CD Pipeline

Developer pushes to feature branch → GitHub Actions triggers.

Lint: ruff (Python) + eslint (React). Must pass with 0 errors.

Unit tests: pytest --cov. Must pass with ≥80% coverage.

Integration tests: Docker Compose spins up test DB/Redis/Mongo. pytest runs. Must pass 100%.

Build: Docker images built. Frontend bundle size checked (<300KB gzip).

E2E tests (on merge to main only): Playwright runs critical path scenarios.

Deploy to staging: Automatic on merge to main. Staging environment mirrors production.

Deploy to production: Manual trigger after staging verification. Blue-green deployment via Docker.

# 23. Cost Projections

## 23.1 Infrastructure Costs

| Component | Phase 1 (MVP) | Phase 2 (Growth) | Phase 3 (Scale) | Notes |
| --- | --- | --- | --- | --- |
| VPS (Hetzner/Contabo) | $25/month (8GB RAM, 4 vCPU, 200GB SSD) | $80/month (32GB RAM, 8 vCPU, 400GB SSD) | $300/month (dedicated or multi-VPS) | Start small, vertical scale first |
| Domain + DNS | $15/year | $15/year | $15/year | Cloudflare for DNS + CDN (free tier) |
| SSL/TLS | Free (Let’s Encrypt via Caddy) | Free | Free | Auto-renewal |
| Backup storage | $5/month (100GB Backblaze B2) | $15/month (500GB) | $50/month (2TB) | Daily PostgreSQL + MongoDB + MinIO dumps |
| CDN | Free (Cloudflare) | Free (Cloudflare) | $20/month (Cloudflare Pro) | Static assets + audio files |
| Email (Resend) | Free (100 emails/day) | $20/month (50K emails) | $80/month (200K emails) | Transactional: verification, notifications |
| Monitoring (Uptime Robot) | Free (50 monitors) | Free | $7/month (Pro) | 1-minute checks on all endpoints |
| SUBTOTAL (Infra) | ~$35/month | ~$135/month | ~$470/month |  |

## 23.2 AI API Costs

Based on OpenAI pricing as of early 2026. Costs scale linearly with users.

| Feature | Model | Tokens/Request | Requests/Day (P1) | Cost/Day | Monthly (P1) |
| --- | --- | --- | --- | --- | --- |
| Career Advisor | GPT-4o | ~2,000 input + 1,000 output | 50 | $0.38 | $11.25 |
| Writing Evaluation | GPT-4o | ~3,000 input + 2,000 output | 100 | $1.25 | $37.50 |
| Question Generation | GPT-4o | ~2,000 input + 3,000 output | 20 | $0.25 | $7.50 |
| Copilot Chat | GPT-4o-mini | ~1,500 input + 500 output | 200 | $0.12 | $3.60 |
| Document Generation | GPT-4o | ~1,000 input + 2,000 output | 50 | $0.38 | $11.25 |
| Speaking Transcription | Whisper | ~2 min audio | 50 | $0.60 | $18.00 |
| Visa Interview (voice) | Whisper + GPT-4o | ~3 min audio + 2K tokens | 30 | $0.56 | $16.80 |
| Language Learning Chat | GPT-4o-mini | ~1,000 input + 500 output | 300 | $0.18 | $5.40 |
| SUBTOTAL (AI) |  |  | 800 req/day | $3.72/day | ~$112/month |

Phase 2 estimate: ~$450/month (4x users). Phase 3: ~$2,000/month (20x users, volume discounts likely).

## 23.3 WhatsApp Costs

| Type | Cost Per Message | Volume (Phase 1) | Monthly Cost |
| --- | --- | --- | --- |
| Utility (notifications, reminders) | $0.005–$0.02 (varies by country) | 3,000 msgs/month | $15–$60 |
| Marketing (announcements) | $0.02–$0.08 | 500 msgs/month | $10–$40 |
| Session (bot conversations) | Free (within 24h window) | 5,000 sessions/month | $0 |
| SUBTOTAL (WhatsApp) |  |  | $25–$100/month |

## 23.4 Total Cost Summary

| Category | Phase 1 (0–1K users) | Phase 2 (1K–10K users) | Phase 3 (10K–100K users) |
| --- | --- | --- | --- |
| Infrastructure | $35/month | $135/month | $470/month |
| AI APIs | $112/month | $450/month | $2,000/month |
| WhatsApp | $60/month | $250/month | $1,000/month |
| Email | $0/month | $20/month | $80/month |
| Development tools (GitHub, etc.) | $10/month | $50/month | $100/month |
| TOTAL | $217/month | $905/month | $3,650/month |
| Per active user | $0.22–$2.17 | $0.09–$0.91 | $0.04–$0.37 |

## 23.5 Revenue Model (Future)

Freemium: Free tier includes profile, exploration, basic roadmap, 5 AI copilot messages/day, limited exam practice (10 questions/day).

Premium (99–149 MAD/month): Unlimited exam practice, full mock exams, AI writing evaluation, document generation, WhatsApp notifications, unlimited copilot.

Premium+ (199–299 MAD/month): Everything in Premium + speaking evaluation, visa interview prep, mentor matching, language learning courses.

Break-even estimate: ~1,000 premium subscribers at 149 MAD/month = 149,000 MAD/month (~$15,000). Covers Phase 2 costs.

Marketplace commission (Phase 3): 10–15% referral fee from service providers (translators, tutors). Non-intrusive, opt-in.

# 24. Data Migration & Schema Versioning

## 24.1 PostgreSQL Migrations

Tool: Alembic (SQLAlchemy migration framework).

Every schema change = new migration file with upgrade() and downgrade() functions.

Naming convention: {timestamp}_{description}.py (e.g., 20260301_add_learning_progress.py).

Migration rules: NEVER alter production data in migration. NEVER drop columns without 2-release deprecation cycle.

Zero-downtime migrations: Add new columns as NULLABLE first. Backfill data. Then add NOT NULL constraint in next release.

Migration testing: Every migration runs forward and backward in CI. Test both empty DB and DB with 10K+ records.

Example migration lifecycle for adding a new field:

Release N: Add column as NULLABLE with default value. Deploy. Code handles both old and new format.

Release N+1: Backfill migration populates existing rows. Code now requires the field.

Release N+2 (optional): Add NOT NULL constraint if needed.

## 24.2 MongoDB Schema Versioning

Each document includes _schema_version field (integer, starting at 1).

Application code reads _schema_version and applies transforms if needed (lazy migration).

Bulk migrations run as Celery tasks: iterate all documents, update schema, increment version.

Example: question_bank v1 had "difficulty" as string ("easy"/"hard"). v2 changed to float (0.0–1.0). Migration task converts all v1 documents.

Forward-compatible: Code always handles current version AND previous version. Two-version window.

Lazy migration example:

def get_question(doc):

    if doc.get('_schema_version', 1) < 2:

        doc['difficulty'] = {'easy': 0.3, 'medium': 0.5, 'hard': 0.8}[doc['difficulty']]

        doc['_schema_version'] = 2

        db.question_bank.update_one({'_id': doc['_id']}, {'$set': doc})

    return doc

## 24.3 MinIO Object Versioning

Bucket versioning enabled for tawjihi-documents (user uploads). Keeps previous versions for 90 days.

Audio and image buckets: No versioning (immutable content). New versions = new file with new key.

Lifecycle rules: Recordings older than 6 months moved to Glacier-like tier (MinIO ILM). Deleted after 2 years.

Naming: All object keys include a version component. Example: audio/ielts/v2/listening_s3_q21.mp3.

## 24.4 Feature Flags

PostHog feature flags control rollout of new features.

Every new module launches behind a flag: module_17_language_learning: true/false.

Gradual rollout: 5% → 25% → 50% → 100% of users over 2 weeks.

Kill switch: Any feature can be disabled instantly without deployment.

A/B testing: Use flags to test different AI models, UI layouts, onboarding flows.

## 24.5 Data Seeding

Initial data that must be loaded before launch:

| Data Set | Records | Source | Priority |
| --- | --- | --- | --- |
| Countries (with study-abroad details) | 30+ | Manual curation + OECD data | P0 (launch-blocking) |
| Exams (with sections, scoring rules) | 30+ | Official exam body websites | P0 |
| Schools (top schools per country) | 500+ | QS rankings + Campus France list + uni-assist list | P0 |
| Programs | 2,000+ | School websites, scraped + manual | P0 |
| Roadmap templates (per country/pathway) | 20+ | Expert knowledge + community input | P0 |
| Question bank (per exam) | 5,000+ | AI-generated + examiner-validated | P0 (min 100/exam) |
| Scholarships | 200+ | ScholarshipPortal + government sites + manual | P1 |
| Career paths + market data | 50+ | OECD + LinkedIn + manual | P1 |
| City housing guides | 30+ | Expatica + CROUS + community | P1 |
| Visa interview questions | 300+ | Community collection + curation | P1 |
| Service providers (translators, etc.) | 100+ | Google Maps + manual verification | P2 |

# 25. Error Handling & Resilience

## 25.1 API Error Format

All API errors return consistent JSON:

{

  "error": "validation_error",

  "code": "INVALID_BAC_FILIERE",

  "message": "Bac fili\u00e8re 'Sciences Techniques' is not supported for this program.",

  "detail": {"field": "bac_filiere", "allowed": ["SM", "SP", "SVT"]},

  "request_id": "req_abc123",

  "timestamp": "2026-02-27T10:30:00Z"

}

## 25.2 Error Code Registry

| Code Range | Category | Example Codes |
| --- | --- | --- |
| AUTH_* | Authentication/Authorization | AUTH_INVALID_CREDENTIALS, AUTH_TOKEN_EXPIRED, AUTH_INSUFFICIENT_ROLE, AUTH_ACCOUNT_LOCKED |
| PROFILE_* | Profile & Exploration | PROFILE_INCOMPLETE, PROFILE_INVALID_MARKS, PROFILE_DUPLICATE_EMAIL |
| EXAM_* | Exam Prep | EXAM_NOT_FOUND, EXAM_SESSION_EXPIRED, EXAM_AUDIO_UNAVAILABLE, EXAM_ALREADY_IN_PROGRESS |
| ROAD_* | Roadmap | ROAD_TEMPLATE_NOT_FOUND, ROAD_STEP_ALREADY_DONE, ROAD_PREREQUISITE_NOT_MET |
| DOC_* | Documents | DOC_TEMPLATE_ERROR, DOC_PDF_GENERATION_FAILED, DOC_FILE_TOO_LARGE, DOC_VIRUS_DETECTED |
| AI_* | AI Services | AI_SERVICE_UNAVAILABLE, AI_RATE_LIMITED, AI_RESPONSE_INVALID, AI_TIMEOUT |
| NOTIF_* | Notifications | NOTIF_WHATSAPP_FAILED, NOTIF_INVALID_PHONE, NOTIF_TEMPLATE_NOT_APPROVED |
| PAY_* | Payments (Phase 2+) | PAY_CARD_DECLINED, PAY_SUBSCRIPTION_EXPIRED, PAY_REFUND_FAILED |

## 25.3 Retry & Circuit Breaker Policies

| External Service | Retry Count | Retry Delay | Circuit Breaker Threshold | Fallback |
| --- | --- | --- | --- | --- |
| OpenAI API | 3 | Exponential: 1s, 2s, 4s | 5 failures in 60 seconds | Cache last response / show "AI temporarily unavailable" |
| WhatsApp API | 3 | Fixed: 5s | 10 failures in 5 minutes | Queue message for retry in 30 minutes |
| Whisper (transcription) | 2 | Fixed: 3s | 3 failures in 5 minutes | "Transcription delayed, will notify when ready" |
| Campus France scraper | 1 | N/A | Any failure | "Status check unavailable. Please check manually: [link]" |
| Email (Resend) | 3 | Exponential: 2s, 4s, 8s | 10 failures in 10 minutes | Log for manual retry by admin |

## 25.4 Graceful Degradation

When external services fail, Tawjihi continues working:

OpenAI down: Copilot switches to keyword-based FAQ search from static content. Writing evaluation shows "AI grading temporarily unavailable — your essay is saved and will be graded when service resumes." Career advisor shows pre-computed career paths from database without personalized AI reasoning.

WhatsApp down: Notifications fall back to email. If email also fails, notifications are queued in Redis (24-hour TTL) and retried hourly.

MongoDB down: Exam prep is degraded (no new questions can be loaded) but profile, roadmap, and document features continue (PostgreSQL). Error message: "Practice questions temporarily unavailable."

MinIO down: Audio/PDF features degraded. Exam simulations without listening sections still work. Uploads queued locally and synced when MinIO recovers.

Redis down: Application continues without caching (slower but functional). Rate limiting falls back to in-memory counters (less accurate but prevents total bypass). Sessions fall back to JWT-only (no server-side revocation).

## 25.5 Data Validation Rules

| Field | Validation | Error If Invalid |
| --- | --- | --- |
| bac_average | 0.00 ≤ value ≤ 20.00 | PROFILE_INVALID_MARKS |
| bac_year | 1990 ≤ value ≤ current_year + 1 | PROFILE_INVALID_YEAR |
| email | RFC 5322 compliant + MX record check | PROFILE_INVALID_EMAIL |
| phone | Starts with +212 or 0, 10–13 digits | PROFILE_INVALID_PHONE |
| exam score (IELTS) | 0.0 ≤ value ≤ 9.0, step 0.5 | EXAM_INVALID_SCORE |
| exam score (TCF) | 100 ≤ value ≤ 699 | EXAM_INVALID_SCORE |
| budget | 0 ≤ value ≤ 5,000,000 MAD | PROFILE_INVALID_BUDGET |
| file upload | Max 50MB, allowed types: PDF/JPG/PNG/DOCX/WEBM | DOC_FILE_TOO_LARGE or DOC_INVALID_TYPE |
| question answer | Must match expected format per question_type | EXAM_INVALID_ANSWER |
| motivation letter length | Min 200 words, max 5000 words | DOC_CONTENT_TOO_SHORT / DOC_CONTENT_TOO_LONG |

# 26. Deployment & Operations

## 26.1 Port Map

| Service | Internal Port | External Port | Notes |
| --- | --- | --- | --- |
| PostgreSQL | 5432 | 5433 | Avoid host conflict |
| MongoDB | 27017 | 27018 | Avoid host conflict |
| MinIO API | 9000 | 9002 | S3-compatible API |
| MinIO Console | 9001 | 9001 | Web management UI |
| Redis | 6379 | 6380 | Avoid host conflict |
| FastAPI | 8000 | 8089 | Backend API |
| Nginx (Frontend) | 80 | 3089 | React SPA |
| Caddy (TLS) | 443 | 443 | HTTPS termination |

## 26.2 Environment Variables

| Variable | Example | Required By |
| --- | --- | --- |
| DATABASE_URL | postgresql://tawjihi:***@db:5432/tawjihi | Backend |
| MONGODB_URL | mongodb://tawjihi:***@mongo:27017/tawjihi | Backend |
| MINIO_ENDPOINT | minio:9000 | Backend |
| MINIO_ACCESS_KEY / SECRET | tawjihi_minio / **** | Backend |
| REDIS_URL | redis://redis:6379/0 | Backend + Worker |
| OPENAI_API_KEY | sk-*** | Backend + Worker |
| WHATSAPP_TOKEN / PHONE_ID | *** / *** | Worker |
| JWT_SECRET | random-256-bit | Backend |
| ENCRYPTION_KEY | random-256-bit (AES-256) | Backend (PII encryption) |
| POSTHOG_API_KEY | phc_*** | Frontend + Backend |
| RESEND_API_KEY | re_*** | Worker |

## 26.3 Production Checklist

Change ALL default passwords in docker-compose.yml and .env file.

Set up Caddy reverse proxy with auto-HTTPS (Let’s Encrypt).

Configure firewall: Only expose 443 (HTTPS) + 22 (SSH). Block direct access to all other ports.

Set up automated daily backups (PostgreSQL pg_dump + MongoDB mongodump → encrypted → Backblaze B2).

Run seed scripts for all P0 data (countries, exams, schools, programs, roadmap templates, initial question bank).

Configure PostHog project + set up feature flags for each module.

Set up Uptime Robot monitoring on /api/health.

Configure WhatsApp Business API with Meta (business verification takes 2–5 business days).

Set OpenAI API spending limits ($500/month Phase 1 cap).

Run OWASP ZAP security scan. Fix all high/critical findings.

Run k6 load test (Scenario 1 + 2). Fix any SLA violations.

Set up log aggregation (Loki + Grafana or Papertrail).

Set up PagerDuty / Telegram alerts for downtime and high error rates.

Document runbook: restart, backup, restore, deploy, rollback procedures.

Create staging environment (identical to production, different domain).

Final QA pass: Walk through all 5 user personas end-to-end.

## 26.4 Monitoring Dashboard

Grafana dashboard panels:

Request Rate: Requests/second by endpoint category. Alert if >2x normal.

Error Rate: 4xx and 5xx rates. Alert if 5xx rate >1% sustained for 5 minutes.

Response Time: P50, P95, P99 latency by endpoint. Alert if P95 exceeds SLA.

Active Users: Real-time count from Redis sessions.

Exam Sessions: Active exam sessions. Questions answered/minute.

AI API Usage: Tokens consumed, cost estimate, error rate. Alert if approaching spending limit.

Queue Depth: Celery task queue length. Alert if >100 pending tasks.

Database Connections: Active/idle PostgreSQL and MongoDB connections. Alert if >80% pool utilization.

Disk Usage: PostgreSQL, MongoDB, MinIO disk usage. Alert at 80%.

Backup Status: Last successful backup time. Alert if >26 hours since last backup.

## 26.5 Technology Stack Summary

| Layer | Technology | Version | Purpose |
| --- | --- | --- | --- |
| Frontend | React + Vite + React Router | 18 + 6 + 6 | SPA, responsive, hash routing |
| Frontend (Mobile) | React Native (Phase 2) | Latest | iOS + Android |
| Backend | Python + FastAPI + Uvicorn | 3.12 + 0.115 | Async REST API |
| ORM | SQLAlchemy 2.0 + Alembic | 2.0 + 1.x | PostgreSQL ORM + migrations |
| MongoDB Driver | Motor (async) + PyMongo | 3.x | Document store access |
| Task Queue | Celery + Redis | 5.x + 7 | Background jobs |
| Object Storage | MinIO (S3-compatible) | Latest | Audio, PDFs, user uploads |
| AI | OpenAI GPT-4o / 4o-mini / Whisper / TTS | Latest | All AI features |
| Messaging | WhatsApp Business Cloud API | v18 | Notifications + bot |
| Email | Resend | Latest | Transactional email |
| Analytics | PostHog | Latest | Behavior tracking, A/B tests, flags |
| Monitoring | Grafana + Loki + Uptime Robot | Latest | Dashboards, logs, uptime |
| Security | Caddy + ClamAV + OWASP ZAP | Latest | TLS, antivirus, security scanning |
| CI/CD | GitHub Actions | Latest | Lint, test, build, deploy |
| Container | Docker Compose | 3.9 | Orchestration |

# 27. Confidentiality Notice

This document is the exclusive intellectual property of the Tawjihi project. It contains proprietary business strategies, technical architecture, data models, algorithms, and competitive intelligence that constitute trade secrets.

Distribution, reproduction, or disclosure of any part of this document without explicit written authorization is strictly prohibited. All recipients must acknowledge receipt and agree to maintain confidentiality.

This specification is classified as STRICTLY CONFIDENTIAL. Access is limited to authorized development team members, investors under NDA, and designated technical reviewers.

If you have received this document in error, please delete all copies immediately and notify the sender.

# 28. Edge Cases & Error Handling by Module

This appendix documents expected edge cases and failure modes for each module, with prescribed system behavior. These are critical for QA testing and for developers implementing error-handling code paths.

## 28.1 Module 1: Profile & Exploration

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| Student enters bac_average > 20.00 | Validation rejects. Toast: "Bac average must be between 0 and 20." | PROFILE_INVALID_MARKS |
| Student selects bac_filiere not recognized | Show dropdown only — no free text. If API receives unknown value, reject with 422. | PROFILE_INVALID_FILIERE |
| Student has no exam scores yet | Matching still works: programs shown with "Missing: [exam]" badges. No crash. | N/A (normal flow) |
| Parent creates profile but child already has account | Prompt to link accounts via email verification. Don’t create duplicate. | PROFILE_DUPLICATE_CHILD |
| 0 matching programs found | Show empty state: "No programs match your criteria. Try adjusting your preferences." Suggest widening budget, adding countries. | N/A |
| Student changes bac_filiere after saving | Re-run matching. Warn: "Changing your filière will reset your program matches." | N/A |
| Concurrent profile edits from two devices | Last-write-wins with updated_at check. If conflict detected: "Your profile was updated from another device. Reload to see changes." | PROFILE_CONFLICT |
| Extremely high marks + many preferences | Cap matched programs at 200 results. Paginate. Sort by relevance score. | N/A |

## 28.2 Module 2: AI Career Advisor

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| OpenAI returns malformed JSON | Retry once. If still malformed, show: "Career analysis temporarily unavailable. Try again in a few minutes." Log full response for debugging. | AI_RESPONSE_INVALID |
| Student profile too sparse for meaningful advice | Require minimum fields before enabling career advisor: education_level + at least 2 preferred_fields. Show: "Complete your profile to unlock career suggestions." | PROFILE_INCOMPLETE |
| AI suggests career path not in database | Validation layer checks all career_path_ids. Unknown IDs filtered out. If 0 valid paths remain, retry with stricter prompt. | AI_RESPONSE_INVALID |
| Market data is stale (>6 months old) | Show data with timestamp: "Data from Q3 2025. Updated data coming soon." Never show data >12 months old. | N/A |
| Student asks about extremely niche career | AI responds based on available data. If no market data: "Limited data available for this career in [country]. Consider broader category: [parent category]." | N/A |
| RIASEC assessment abandoned midway | Save partial results. Resume from where left off on return. Don’t generate career paths from partial data. | N/A |

## 28.3 Module 3: Exam Prep Platform

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| Audio file fails to load during listening section | Retry download 3x. If still fails: "Audio unavailable. Skip this section and practice others." Flag question for admin review. Don’t penalize student’s score. | EXAM_AUDIO_UNAVAILABLE |
| Student closes browser mid-exam | Save all answers on every question submit (not just at end). On return within 2 hours: offer to resume. After 2 hours: mark as abandoned. | N/A |
| Speaking recording too short (<5 seconds) | "Your recording seems too short. Minimum 15 seconds for meaningful feedback. Try again." | EXAM_RECORDING_TOO_SHORT |
| Speaking recording too long (>5 minutes) | Auto-stop at section time limit. Trim to limit before upload. | N/A |
| Whisper transcription returns empty string | Retry once. If still empty: "We couldn’t process your audio. Check your microphone and try again." Suggest Chrome/Firefox for best compatibility. | AI_TRANSCRIPTION_FAILED |
| Student gaming adaptive difficulty (intentionally wrong) | IRT detects inconsistent patterns (hard questions right, easy ones wrong). Flag for review. Don’t penalize, but note in progress: "Inconsistent pattern detected." | N/A |
| Question bank runs out for a section/difficulty | Generate new questions via AI pipeline. Meanwhile: recycle questions not seen by this user in 30+ days. Show disclaimer: "Some questions may be repeated." | EXAM_QUESTIONS_LOW |
| Writing submission is copy-pasted from external source | Plagiarism check (similarity to known essays in DB). If >80% match: "This response is very similar to existing content. Please write in your own words for accurate feedback." | EXAM_PLAGIARISM_DETECTED |
| Two simultaneous exam sessions from same user | Block second session. "You already have an active exam session. Complete or abandon it first." | EXAM_ALREADY_IN_PROGRESS |

## 28.4 Module 4: Procedure Roadmap

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| No roadmap template exists for selected country/pathway | Show: "Detailed roadmap not yet available for [country]. Here’s a general international application checklist." Use generic template. Log as content gap. | ROAD_TEMPLATE_NOT_FOUND |
| Student tries to mark step as done without prerequisite | "Complete Step [N] first: [step name]." Highlight dependency. Don’t allow skip unless admin override. | ROAD_PREREQUISITE_NOT_MET |
| Deadline has already passed when student starts roadmap | Flag overdue steps in red. Calculate if still possible (some late submissions allowed). If impossible: "This deadline has passed. Consider applying for next year’s intake." | N/A |
| Student has 3 roadmaps to different countries | All 3 tracked independently. Dashboard shows combined timeline. Conflict detection: if two deadlines overlap, alert: "You have overlapping deadlines for France and Canada." | N/A |
| Document uploaded is wrong type (e.g., selfie instead of passport) | OCR + AI classification attempt. If confidence <60%: "This doesn’t look like a [expected document]. Please upload your [document name]." | DOC_WRONG_TYPE |
| Campus France procedure changes mid-cycle | Admin updates roadmap template. Existing active roadmaps get notification: "Procedure updated: [change]. Your roadmap has been adjusted." Changes applied without losing progress. | N/A |

## 28.5 Module 5: Community Knowledge

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| Fewer than 10 data points for a program | Don’t show statistics. Display: "Not enough data yet. Be the first to share your experience!" | N/A |
| User submits obviously fake experience (TCF 699 with Bac average 5/20) | Automated plausibility check: flag statistical outliers for admin review. Don’t publish until verified. | COMM_DATA_IMPLAUSIBLE |
| Attempted de-anonymization via multiple data points | Aggregation only shows ranges (never exact values). Cross-tabulation limited: max 2 filter dimensions at once. | N/A |
| Toxic or inappropriate Q&A content | Content moderation: AI pre-screen + community flagging + admin review queue. Auto-hide posts with >3 flags. | COMM_CONTENT_FLAGGED |
| User opts out of data contribution | Remove all their data from future aggregations within 24 hours. Recalculate affected statistics. | N/A |

## 28.6 Module 6: Document Generator

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| PDF generation fails (wkhtmltopdf/WeasyPrint crash) | Retry once. If fails: return DOCX instead with note: "PDF generation failed. Here’s a Word version. You can export to PDF from Word." | DOC_PDF_GENERATION_FAILED |
| AI generates motivation letter with hallucinated program details | Post-generation validation: check all program names, university names, and dates against database. Replace any unrecognized entity with placeholder [VERIFY]. | DOC_AI_VALIDATION_WARNING |
| Upload exceeds 50MB limit | Client-side check before upload. Server-side backup check. "File too large. Maximum 50MB. Try compressing your PDF." | DOC_FILE_TOO_LARGE |
| ClamAV detects virus in uploaded document | Block upload. "This file was flagged as potentially harmful. If you believe this is an error, try re-scanning locally or upload a different version." | DOC_VIRUS_DETECTED |
| OCR extraction has low confidence | Show extracted data with yellow highlights: "Please verify these fields — some may be incorrect." Allow manual correction. | N/A |
| Parent generates document but child profile incomplete | "Your child’s profile is missing [fields]. Complete it first to generate accurate documents." | PROFILE_INCOMPLETE |

## 28.7 Module 7: Notifications

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| WhatsApp number invalid or not on WhatsApp | Delivery fails. Fall back to email. Mark number as unverified. Prompt user: "Your WhatsApp number couldn’t be reached. Please verify it in settings." | NOTIF_INVALID_PHONE |
| WhatsApp template not approved by Meta | Use generic approved template. Log for admin to submit new template for approval. | NOTIF_TEMPLATE_NOT_APPROVED |
| User receives too many notifications (spam perception) | Hard cap: 3 WhatsApp messages/day, 1 email/day (except critical). User can customize frequency in settings. | N/A |
| Notification references deleted roadmap/exam | Check existence before sending. If resource deleted: skip notification, remove from queue. Don’t send broken links. | N/A |
| WhatsApp API rate limit exceeded | Queue messages in Redis with priority. Critical (deadline today) sent first. Others delayed up to 6 hours. | NOTIF_RATE_LIMITED |

## 28.8 Module 8: Financial Planning

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| Currency conversion API unavailable | Fall back to cached rates (max 24 hours old). Show: "Exchange rates from [date]. May not reflect current rates." | N/A |
| Budget calculation returns negative living costs | Floor at 0. Flag data error for admin. Show: "Cost data for [city] may be incomplete. Verify with local sources." | N/A |
| Scholarship deadline has passed | Gray out in listings. Show: "Deadline passed. Next cycle opens [date] (if known)." Don’t remove — students plan for next year. | N/A |
| Student matches 0 scholarships | Show: "No scholarships match your current profile. Here’s what you can do: [improve GPA, take exam, broaden search]." | N/A |
| Financial proof amount doesn’t meet requirement | Calculator highlights shortfall in red: "You need €7,380 minimum for France. Your declared budget: €5,000. Shortfall: €2,380." | N/A |

## 28.9 Module 9: Housing & Pre-Departure

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| No housing guide exists for student’s destination city | Show country-level generic advice + link to relevant housing platforms. Log as content gap for prioritization. | N/A |
| CROUS application dates change | Admin updates dates. Active roadmaps with CROUS steps get notification of changed timeline. | N/A |
| Student arrives earlier/later than planned | Pre-departure checklist adjusts based on actual arrival date input. Reorders tasks by new timeline. | N/A |

## 28.10 Module 10: Mentorship Network

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| No mentors available for student’s destination | Show: "No mentors available for [city/country] yet. Join the waitlist — we’ll notify you." Also suggest country-level mentors. | N/A |
| Mentor becomes unresponsive (no reply in 7 days) | Auto-notify mentor. After 14 days: mark as inactive. Suggest alternative mentors to mentee. | N/A |
| Abusive chat between mentor and mentee | Report button on every message. Admin review within 24 hours. Temporary suspension of chat pending review. | COMM_CONTENT_FLAGGED |
| Mentor verification document is fake | Manual admin verification required. If caught: permanent ban. All past advice flagged for review. | N/A |

## 28.11 Module 11: Admin Dashboard

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| Admin accidentally deletes an exam | Soft delete with 30-day recovery. All related data (questions, progress) preserved. Undo button available for 5 minutes. | N/A |
| Bulk CSV import has malformed rows | Process valid rows. Report errors: "Imported 450/500 programs. 50 rows had errors." Download error report CSV. | N/A |
| Two admins edit same content simultaneously | Optimistic locking with version field. Second saver sees: "This content was modified by [admin]. Reload to see changes." | ADMIN_CONFLICT |
| Admin tries to approve AI question with wrong answer | Validation: Correct answer must be one of the options. Red highlight if mismatch. | N/A |

## 28.12 Module 12: Marketplace

| Edge Case | Expected Behavior | Error Code |
| --- | --- | --- |
| Service provider’s contact info is outdated | Community reporting: "Is this info still correct?" button. After 3 reports: flag for admin review. Mark as "unverified" after 6 months without refresh. | N/A |
| Fake review submitted | Reviews only from users with completed roadmap steps matching the service. AI detection for fake patterns. Admin moderation queue. | COMM_FAKE_REVIEW |
| Service provider requests removal | Remove within 48 hours. Keep anonymized aggregate data (ratings) but remove provider name and contact. | N/A |
| Zero providers in student’s city | Show nearest city providers. "No verified providers in [city]. Nearest: [city2] (45km). Consider online services." | N/A |

# 29. Appendix A: Complete Exam Reference

This appendix details every exam supported by Tawjihi. For each exam: sections, timing, scoring, question types, and Morocco-specific registration information. This data seeds the exams and exam_sections tables in PostgreSQL and drives the exam simulation engine in Module 3.

## 29.1 French Language Exams

### 29.1.1 TCF (Test de Connaissance du Français)

Variants: TCF TP (Tout Public), TCF Canada, TCF Québec, TCF IRN, TCF DAP

| Section | Duration | Questions | Scoring | Question Types |
| --- | --- | --- | --- | --- |
| Compréhension orale | 25 min | 29 MCQ | 100–699 points | Listen to audio → answer MCQ. Difficulty increases progressively. |
| Maîtrise des structures | 15 min | 18 MCQ | 100–699 points | Grammar and vocabulary MCQ. Fill-in-the-blank with options. |
| Compréhension écrite | 45 min | 29 MCQ | 100–699 points | Read passages → answer MCQ. Documents, articles, academic texts. |
| Expression écrite (optional) | 60 min | 3 tasks | 0–20 per task | Task 1: describe event (60–80 words). Task 2: article response (120–150 words). Task 3: essay on abstract topic (200+ words). |
| Expression orale (optional) | 12 min | 3 tasks | 0–20 per task | Task 1: structured interview. Task 2: interactive exchange. Task 3: express opinion on complex topic. |

Total score range: 100–699. Level mapping: A1 (100–199), A2 (200–299), B1 (300–399), B2 (400–499), C1 (500–599), C2 (600–699).

Morocco registration:

Centers: Institut Français (Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Meknès, Oujda, Tétouan, Kenitra).

Fee: 1,500 MAD (TCF TP), 1,800 MAD (TCF Canada/Québec).

Frequency: Monthly sessions. Book 4–6 weeks in advance. Casablanca fills fastest.

Results: Online in 4 weeks. Valid for 2 years.

DAP-specific: Required for Campus France L1 applications. Deadline: January.

### 29.1.2 DELF/DALF

DELF: A1, A2, B1, B2. DALF: C1, C2. Each is a separate diploma (lifelong validity).

| Level | Total Duration | Sections | Pass Score |
| --- | --- | --- | --- |
| DELF A1 | 1h20 + oral | Listening (20 min) + Reading (30 min) + Writing (30 min) + Speaking (5–7 min) | 50/100 (min 5/25 per section) |
| DELF A2 | 1h40 + oral | Listening (25 min) + Reading (30 min) + Writing (45 min) + Speaking (6–8 min) | 50/100 (min 5/25 per section) |
| DELF B1 | 1h45 + oral | Listening (25 min) + Reading (35 min) + Writing (45 min) + Speaking (15 min) | 50/100 (min 5/25 per section) |
| DELF B2 | 2h30 + oral | Listening (30 min) + Reading (60 min) + Writing (60 min) + Speaking (20 min) | 50/100 (min 5/25 per section) |
| DALF C1 | 4h + oral | Listening (40 min) + Reading (50 min) + Writing (2h30: synthesis + essay) + Speaking (30 min) | 50/100 (min 5/25 per section) |
| DALF C2 | 3h30 + oral | Listening+Speaking combined (30 min prep + 30 min exam) + Reading+Writing combined (3h30) | 50/100 (min 10/50 per group) |

Morocco: Same centers as TCF. Fee: 1,200–1,800 MAD depending on level. Sessions: March + June (DAP) or May + November.

### 29.1.3 TEF Canada

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Compréhension orale | 40 min | 60 MCQ (audio) | 0–360 |
| Compréhension écrite | 60 min | 50 MCQ | 0–300 |
| Expression écrite | 60 min | 2 tasks (letter + essay) | 0–450 |
| Expression orale | 15 min | 2 sections (A: 5 min, B: 10 min) | 0–450 |

Required for Canadian immigration (Express Entry, PNP). CLB conversion table used. Morocco: Available at specific IF centers.

## 29.2 English Language Exams

### 29.2.1 IELTS (Academic)

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Listening | 30 min + 10 transfer | 40 questions (4 sections, 10 each) | Band 1–9 (raw score mapped) |
| Reading | 60 min | 40 questions (3 passages, academic texts) | Band 1–9 (raw score mapped) |
| Writing | 60 min | Task 1: 150 words (graph/chart/diagram). Task 2: 250 words (essay) | Band 1–9 (4 criteria per task) |
| Speaking | 11–14 min | Part 1: intro (4–5 min). Part 2: long turn (3–4 min). Part 3: discussion (4–5 min) | Band 1–9 (4 criteria) |

IELTS band calculation:

Each section: 0–9 band. Overall: average of 4 sections, rounded to nearest 0.5.

Listening raw-to-band: 39–40=9.0, 37–38=8.5, 35–36=8.0, 32–34=7.5, 30–31=7.0, 26–29=6.5, 23–25=6.0.

Reading raw-to-band: 39–40=9.0, 37–38=8.5, 35–36=8.0, 33–34=7.5, 30–32=7.0, 27–29=6.5, 23–26=6.0.

Writing criteria: Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.

Speaking criteria: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation.

Morocco registration:

Centers: British Council (Casablanca, Rabat). IDP IELTS (Casablanca).

Fee: 2,800–3,200 MAD.

Frequency: 2–4 sessions per month. Book 2–3 weeks in advance.

Results: Online in 13 days. Valid for 2 years.

Required by: UK (all), Canada, Australia, Netherlands, many others.

### 29.2.2 TOEFL iBT

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Reading | 35 min | 20 questions (2 passages) | 0–30 |
| Listening | 36 min | 28 questions (lectures + conversations) | 0–30 |
| Speaking | 16 min | 4 tasks (1 independent + 3 integrated) | 0–30 |
| Writing | 29 min | 1 integrated (20 min) + 1 academic discussion (10 min) | 0–30 |

Total: 0–120. Common requirements: 80+ (good), 90+ (competitive), 100+ (top programs). ETS MyBest Scores allow combining best sections across dates.

Morocco: ETS-authorized test centers in Casablanca and Rabat. Fee: ~2,500 MAD. Online version (Home Edition) available.

### 29.2.3 Duolingo English Test (DET)

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Adaptive test | 45 min total | Reading, writing, listening, speaking (integrated) | 10–160 |
| Video interview | 10 min | Unscored speaking sample sent to institutions | Not scored |
| Writing sample | 5 min | Unscored writing sample sent to institutions | Not scored |

Subscores: Literacy, Conversation, Comprehension, Production. Online-only, from home. Fee: ~$59 USD. Results in 2 days. Accepted by 4,000+ institutions.

### 29.2.4 Cambridge CAE (C1 Advanced)

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Reading & Use of English | 90 min | 56 questions (8 parts: cloze, MCQ, key word transform, etc.) | Score mapped to Cambridge Scale |
| Writing | 90 min | 2 tasks (essay + choice: letter/report/review/proposal) | Cambridge Scale |
| Listening | 40 min | 30 questions (4 parts) | Cambridge Scale |
| Speaking | 15 min | 4 parts (with another candidate) | Cambridge Scale |

Cambridge Scale: 180–210 = C1 pass. 200–210 = Grade A (equivalent to C2). Below 180 = B2 certificate. Lifelong validity.

### 29.2.5 PTE Academic

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Speaking & Writing | 54–67 min | 7 question types (read aloud, repeat, describe image, retell, essay, summarize) | 10–90 |
| Reading | 29–30 min | 5 question types (MCQ, reorder, fill-blank) | 10–90 |
| Listening | 30–43 min | 8 question types (summarize spoken, MCQ, fill-blank, dictation) | 10–90 |

Computer-scored only (no human examiner). Results in 1–2 days. Widely accepted for Australia/NZ immigration. Fee: ~$210 USD.

## 29.3 German Language Exams

### 29.3.1 Goethe-Zertifikat

| Level | Duration | Sections | Pass Score |
| --- | --- | --- | --- |
| A1 (Start Deutsch 1) | ~65 min + oral | Lesen (25 min) + Hören (20 min) + Schreiben (20 min) + Sprechen (15 min pair) | 60/100 |
| A2 (Fit in Deutsch) | ~70 min + oral | Same 4 skills | 60/100 |
| B1 (Zertifikat B1) | ~165 min + oral | Lesen (65 min) + Hören (40 min) + Schreiben (60 min) + Sprechen (15 min) | 60/100 (min 60% per module) |
| B2 | ~190 min + oral | Lesen (65 min) + Hören (40 min) + Schreiben (75 min) + Sprechen (15 min) | 60/100 |
| C1 | ~190 min + oral | Lesen (70 min) + Hören (40 min) + Schreiben (80 min) + Sprechen (15 min) | 60/100 |
| C2 (GDS) | ~195 min + oral | Lesen (80 min) + Hören (35 min) + Schreiben (80 min) + Sprechen (15 min) | 60/100 (each module) |

Morocco: Goethe-Institut Casablanca and Rabat. Fee: 1,200–2,500 MAD depending on level. Sessions: 4–6 per year.

### 29.3.2 TestDaF

| Section | Duration | Format | Scoring |
| --- | --- | --- | --- |
| Leseverstehen (Reading) | 60 min | 30 questions (3 texts, increasing difficulty) | TDN 3/4/5 (below 3 = fail) |
| Hörverstehen (Listening) | 40 min | 25 questions (3 audio texts) | TDN 3/4/5 |
| Schriftlicher Ausdruck (Writing) | 60 min | 1 essay (graph description + argumentation) | TDN 3/4/5 |
| Mündlicher Ausdruck (Speaking) | 35 min | 7 tasks (recorded, no live examiner) | TDN 3/4/5 |

TDN 4 in all sections = minimum for German university admission. TDN 5 = superior. Morocco: Digital TestDaF available at licensed centers.

### 29.3.3 telc C1 Hochschule

Alternative to TestDaF for university admission. 4 sections (Reading, Listening, Writing, Speaking). Pass/fail. Accepted by all German universities. Morocco: Available at selected Goethe-Institut and VHS-affiliated centers.

### 29.3.4 DSH

University-internal exam. Each university administers its own. DSH-1, DSH-2, DSH-3 levels. Usually taken after arriving in Germany during Studienkolleg. Tawjihi provides practice materials in DSH format but cannot simulate the university-specific variants.

## 29.4 Other Language Exams

### 29.4.1 HSK (Chinese)

| Level | Vocabulary | Sections | Duration |
| --- | --- | --- | --- |
| HSK 1 | 150 words | Listening + Reading | 40 min |
| HSK 2 | 300 words | Listening + Reading | 50 min |
| HSK 3 | 600 words | Listening + Reading + Writing | 90 min |
| HSK 4 | 1,200 words | Listening + Reading + Writing | 105 min |
| HSK 5 | 2,500 words | Listening + Reading + Writing | 125 min |
| HSK 6 | 5,000+ words | Listening + Reading + Writing | 140 min |
| HSK 7–9 (new 3.0) | 11,000+ words | Listening + Reading + Writing + Translation + Speaking | ~3 hours |

New HSK 3.0 system merges 7-8-9 into one test with 3 grade levels. Morocco: Confucius Institute Casablanca or Rabat. Fee: 400–1,000 MAD.

### 29.4.2 DELE (Spanish)

Levels: A1, A2, B1, B2, C1, C2. Lifelong validity.

4 sections: Reading, Listening, Writing, Speaking (oral interview with examiner).

Pass: 60/100 (minimum 30/50 per group: Reading+Writing, Listening+Speaking).

Morocco: Instituto Cervantes Casablanca, Rabat, Tangier, Fez, Marrakech. Fee: 1,000–2,000 MAD.

Sessions: May + November (global exam dates).

### 29.4.3 JLPT (Japanese)

| Level | Duration | Sections | Pass Score |
| --- | --- | --- | --- |
| N5 (easiest) | 105 min | Vocabulary & Grammar (25 min) + Reading (50 min) + Listening (30 min) | 80/180 (min 19 per section) |
| N4 | 125 min | Same 3 sections (longer) | 90/180 |
| N3 | 140 min | Same 3 sections | 95/180 |
| N2 | 155 min | Same 3 sections | 90/180 |
| N1 (hardest) | 170 min | Same 3 sections | 100/180 |

All MCQ. No writing or speaking. Held twice per year globally: July + December. Morocco: Not available locally — nearest centers in Spain or France. Online JLPT not available.

### 29.4.4 TOPIK (Korean)

| Test | Levels | Sections | Duration |
| --- | --- | --- | --- |
| TOPIK I | Level 1–2 | Listening (30 min) + Reading (40 min) | 70 min |
| TOPIK II | Level 3–6 | Listening (60 min) + Writing (50 min) + Reading (70 min) | 180 min |

Score determines level: 80–139=Level 1, 140–199=Level 2, etc. up to 270+=Level 6. TOPIK II writing includes short-answer and 200–300 word essay. Morocco: Limited availability, check Korean Cultural Center.

### 29.4.5 CILS (Italian)

Levels A1–C2. 4 sections: Listening, Reading, Writing, Speaking. Administered by Università per Stranieri di Siena. Morocco: Italian Cultural Institute. Fee: ~1,500 MAD. Sessions: June + December.

### 29.4.6 CELI (Italian Alternative)

Administered by Università per Stranieri di Perugia. Similar structure to CILS. Accepted by Italian universities. Morocco: Same centers as CILS.

## 29.5 Question Generation Specifications

These specs drive the AI question generation pipeline (Section 5.5). Each exam type has specific prompt templates and validation rules.

| Exam | Passage Length | Questions/Passage | AI Prompt Requirements |
| --- | --- | --- | --- |
| IELTS Reading | 700–1000 words academic text | 13–14 (mix of MCQ, T/F/NG, matching, fill-blank) | Text must be academic but not require domain knowledge. Questions must have unambiguous answers from text. |
| IELTS Listening | 2–3 min audio script per section | 10 per section | Script must include natural speech features: false starts, self-corrections. Questions test detail, not inference. |
| IELTS Writing T1 | Graph/chart/table data | 1 response prompt | Data must show clear trends, comparisons, or processes. Must be original (not from published sources). |
| IELTS Writing T2 | N/A | 1 essay prompt | Topic must be debatable. Not country-specific. Avoid sensitive topics. Two clear sides. |
| TCF CO | 30s–2min audio per item | 1 MCQ per audio | Natural French, varied accents. Progressively harder. Items 1–10 = A1–A2, 11–20 = B1–B2, 21–29 = C1–C2. |
| TCF CE | 50–500 words per passage | 1–3 MCQ per passage | Text types: notices, letters, articles, academic papers. Progressive difficulty matching item numbers. |
| TestDaF Lesen | 300–800 words per text | 10 per text | Text 1: short texts with matching. Text 2: newspaper article with MCQ. Text 3: academic text with T/F. |
| HSK Reading | Characters appropriate to level | Varies by level | HSK 1–2: single sentences. HSK 3–4: short paragraphs. HSK 5–6: articles. Must use only vocabulary at or below target level. |

## 29.6 Exam Simulation Fidelity Matrix

How closely Tawjihi replicates each exam’s actual experience:

| Feature | IELTS | TCF | TOEFL | TestDaF | DELF | HSK | JLPT | DELE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Exact section count | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Exact timing | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Exact question types | ✓ | ✓ | ✓ | ✓ | Partial | Partial | ✓ | Partial |
| Audio playback rules | ✓ (plays once) | ✓ | ✓ | ✓ | ✓ | N/A | ✓ | ✓ |
| Writing evaluation | ✓ (AI) | ✓ (AI) | ✓ (AI) | ✓ (AI) | ✓ (AI) | ✓ (AI) | N/A | ✓ (AI) |
| Speaking simulation | ✓ (AI) | ✓ (AI) | ✓ (AI) | ✓ (recorded) | Partial | N/A | N/A | Partial |
| Band/score prediction | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Official-format results | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

END OF SPECIFICATION

Tawjihi Platform Specification v4.1 — 18 Modules — February 2026

STRICTLY CONFIDENTIAL
