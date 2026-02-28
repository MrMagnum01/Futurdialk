"""
Tawjihi V4 — AI Service Layer
Unified AI gateway via OpenRouter. Uses OpenAI SDK with custom base_url.
All AI features route through here: copilot, writing eval, study plans, etc.
"""

import json
import logging
from typing import Optional, List

from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

# ── OpenRouter Client ────────────────────────────────────
# OpenRouter is OpenAI-compatible — same SDK, different base_url.

_client: Optional[AsyncOpenAI] = None


def get_ai_client() -> Optional[AsyncOpenAI]:
    """Get or create the OpenRouter client. Returns None if no API key."""
    global _client
    if _client:
        return _client

    key = settings.OPENROUTER_API_KEY
    if not key or key.startswith("sk-or-placeholder") or key == "":
        logger.warning("No OpenRouter API key set — AI features will return mock responses.")
        return None

    _client = AsyncOpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=key,
        default_headers={
            "HTTP-Referer": settings.FRONTEND_URL,
            "X-Title": "Tawjihi",
        },
    )
    return _client


def ai_available() -> bool:
    """Check if AI is configured and available."""
    return get_ai_client() is not None


# ── Model Config ─────────────────────────────────────────
# Best quality/price ratio models via OpenRouter.

MODELS = {
    # Primary workhorse — 95% of GPT-4o quality at 30× cheaper
    "fast": "openai/gpt-4o-mini",
    # For nuanced scoring (IELTS bands, complex eval)
    "smart": "openai/gpt-4o-mini",
    # Audio transcription (direct OpenAI — not routed)
    "whisper": "openai/whisper-large-v3",
}


# ── System Prompts ───────────────────────────────────────

PROMPTS = {
    "copilot": """Tu es Tawjihi Copilot, un assistant IA spécialisé pour les étudiants marocains qui préparent leurs études à l'étranger.

Tu connais parfaitement :
- Le système éducatif marocain (BAC Sciences, Lettres, Économie)
- Campus France, uni-assist, UCAS et les plateformes de candidature
- Les examens : IELTS, TOEFL, TCF, DELF, TestDaF, DELE
- Les bourses : Bourse du Maroc, MIFI, Erasmus, DAAD, Chevening, Türkiye Bursları
- Les visas étudiants pour la France, le Canada, l'Allemagne, le Royaume-Uni, la Turquie, l'Espagne
- Le coût de la vie dans les villes étudiantes majeures
- Les documents requis : lettre de motivation, CV, relevés de notes, attestation financière

Règles :
- Réponds dans la MÊME LANGUE que l'utilisateur (français ou anglais)
- Sois concis, pratique et encourageant
- Donne des conseils spécifiques au contexte marocain
- Cite les montants en MAD quand c'est pertinent
- Si tu ne sais pas, dis-le honnêtement""",

    "writing_eval_ielts": """You are an IELTS Writing examiner. Evaluate the following essay according to the official IELTS band descriptors.

Score each criterion from 0.0 to 9.0 in 0.5 increments:
1. Task Achievement (TA) — Has the task been fully addressed? Are ideas developed?
2. Coherence & Cohesion (CC) — Logical organization? Paragraphing? Linking devices?
3. Lexical Resource (LR) — Vocabulary range? Accuracy? Less common vocabulary?
4. Grammatical Range & Accuracy (GRA) — Sentence variety? Error frequency?

IMPORTANT: Be strict but fair. Most Moroccan students score 5.5-7.0. Don't inflate.

Respond in this exact JSON format:
{
  "overall_score": 6.5,
  "criteria": {
    "task_achievement": 6.0,
    "coherence_cohesion": 7.0,
    "lexical_resource": 6.5,
    "grammatical_range": 6.5
  },
  "feedback": "2-3 sentences of overall feedback",
  "strengths": ["strength 1", "strength 2"],
  "suggestions": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "corrected_sentences": [
    {"original": "original sentence with error", "corrected": "corrected version", "rule": "grammar rule"}
  ]
}""",

    "writing_eval_tcf": """Tu es un correcteur d'expression écrite du TCF (Test de Connaissance du Français).

Évalue le texte selon les niveaux du CECR (A1 à C2) :
1. Respect de la consigne et pertinence du contenu
2. Cohérence et cohésion du texte
3. Compétence lexicale (richesse et précision du vocabulaire)
4. Compétence grammaticale (morphosyntaxe, orthographe)

Réponds en JSON :
{
  "niveau_estime": "B2",
  "score_sur_20": 14,
  "criteres": {
    "respect_consigne": 15,
    "coherence": 14,
    "lexique": 13,
    "grammaire": 14
  },
  "commentaire": "Commentaire général en 2-3 phrases",
  "points_forts": ["point 1", "point 2"],
  "axes_amelioration": ["axe 1", "axe 2", "axe 3"],
  "corrections": [
    {"original": "phrase avec erreur", "corrige": "version corrigée", "regle": "règle de grammaire"}
  ]
}""",

    "writing_eval_toefl": """You are a TOEFL iBT Writing scorer. Score the essay on a scale of 0-5.

Criteria:
1. Development — Well-developed with clear explanations and examples?
2. Organization — Well-organized with clear progression?
3. Language Use — Syntactic variety? Appropriate word choice? Few errors?

Respond in JSON:
{
  "overall_score": 4,
  "max_score": 5,
  "criteria": {
    "development": 4,
    "organization": 4,
    "language_use": 3
  },
  "feedback": "2-3 sentences",
  "strengths": ["strength 1"],
  "suggestions": ["suggestion 1", "suggestion 2"]
}""",

    "study_plan": """You are a study coach for a Moroccan student preparing for the {exam} exam.

Student profile:
- Current estimated score: {current_score}
- Target score: {target_score}
- Weaknesses: {weaknesses}
- Strengths: {strengths}
- Days until exam: {days_remaining}

Create a personalized {weeks}-week study plan. For each week, provide:
- Focus area
- Daily tasks (30-60 min each)
- Practice resources
- Mini-goals

Respond in JSON:
{{
  "plan_title": "Your {exam} Study Plan",
  "total_weeks": {weeks},
  "weekly_hours": 10,
  "weeks": [
    {{
      "week": 1,
      "focus": "Focus area",
      "tasks": ["Task 1", "Task 2", "Task 3"],
      "goal": "End-of-week goal"
    }}
  ],
  "tips": ["General tip 1", "General tip 2"]
}}""",

    "language_chat": """Tu es un tuteur de langue {language} pour un étudiant marocain de niveau {level}.

Règles :
- Parle UNIQUEMENT en {language} (sauf si l'étudiant est débutant, alors mélange avec le français)
- Corrige les erreurs de grammaire en expliquant brièvement la règle
- Utilise un vocabulaire adapté au niveau {level}
- Sois patient et encourageant
- Propose des exercices courts et interactifs
- Intègre des situations de la vie étudiante à l'étranger

Si l'étudiant fait une erreur, corrige-la entre crochets [correction] et continue la conversation.""",

    "document_gen": """Tu es un expert en rédaction de documents pour les candidatures universitaires d'étudiants marocains.

Génère un(e) {document_type} en {language} pour :
- Étudiant : {student_name}
- Programme : {program_name}
- Université : {university_name}
- Pays : {country}

Le document doit être :
- Professionnel et formel
- Adapté aux standards du pays de destination
- Personnalisé avec les informations de l'étudiant
- En {language}

Structure et longueur selon le type de document :
- Lettre de motivation : 300-400 mots, 3 paragraphes (intro, parcours+motivation, projet)
- CV : format tabulaire avec sections (formation, expérience, compétences, langues)
- Email de recommandation : 150-200 mots, ton respectueux""",

    "question_gen": """Generate {count} exam practice questions for {exam_code}, section: {section}.

Each question must have:
- Question text (in the exam's language)
- 4 answer options (A, B, C, D)
- Correct answer key
- Explanation of why the answer is correct
- Difficulty level (easy, medium, hard)

For {exam_code}:
- Match the real exam format exactly
- Use appropriate difficulty distribution (40% easy, 40% medium, 20% hard)
- Include context passages for reading comprehension questions

Respond as a JSON array of questions.""",

    "speaking_eval": """You are evaluating an English/French speaking transcript from a student.

Evaluate for:
1. Fluency — speech rate, hesitations, self-corrections
2. Vocabulary — range, appropriateness, less common words
3. Grammar — accuracy, complexity of structures
4. Pronunciation indicators — from transcript markers like [um], [uh], [pause]

Count filler words: um, uh, euh, ben, genre, like, you know

Respond in JSON:
{
  "overall_score": 6.0,
  "criteria": {
    "fluency": 6.0,
    "lexical_resource": 6.5,
    "grammar": 5.5,
    "pronunciation": 6.0
  },
  "feedback": "2-3 sentences",
  "filler_words_detected": 8,
  "filler_details": {"um": 3, "uh": 2, "like": 3},
  "suggestions": ["suggestion 1", "suggestion 2"]
}""",
}


# ── Core AI Functions ────────────────────────────────────

async def chat_completion(
    messages: List[dict],
    model: str = None,
    temperature: float = 0.7,
    max_tokens: int = 1500,
    json_mode: bool = False,
) -> Optional[str]:
    """Send a chat completion request via OpenRouter.
    Returns the response text, or None if AI is unavailable.
    """
    client = get_ai_client()
    if not client:
        return None

    model = model or MODELS["fast"]

    try:
        kwargs = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = await client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
    except Exception as e:
        logger.error(f"AI call failed: {e}")
        return None


async def chat_completion_json(
    messages: List[dict],
    model: str = None,
    temperature: float = 0.3,
    max_tokens: int = 2000,
) -> Optional[dict]:
    """Chat completion that parses JSON response."""
    text = await chat_completion(messages, model, temperature, max_tokens, json_mode=True)
    if not text:
        return None
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            logger.error(f"Failed to parse AI JSON: {text[:200]}")
            return None


async def transcribe_audio(audio_file) -> Optional[str]:
    """Transcribe audio using Whisper via OpenRouter."""
    client = get_ai_client()
    if not client:
        return None
    try:
        # For audio, we use OpenAI directly as OpenRouter doesn't proxy Whisper
        from openai import AsyncOpenAI as DirectClient
        direct = DirectClient(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        if not direct:
            return None
        transcript = await direct.audio.transcriptions.create(
            model="whisper-1", file=audio_file, language="en",
        )
        return transcript.text
    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        return None


# ── High-Level Feature Functions ─────────────────────────

async def copilot_chat(user_message: str, history: List[dict] = None, language: str = "fr") -> str:
    """AI Copilot conversation for Moroccan students."""
    messages = [{"role": "system", "content": PROMPTS["copilot"]}]
    if history:
        messages.extend(history[-10:])  # Last 10 messages for context
    messages.append({"role": "user", "content": user_message})

    response = await chat_completion(messages, max_tokens=1000)
    if not response:
        if language == "fr":
            return "L'assistant IA n'est pas configuré pour le moment. Veuillez réessayer plus tard ou contacter le support."
        return "The AI assistant is not configured at the moment. Please try again later or contact support."
    return response


async def evaluate_writing(essay: str, exam_type: str = "ielts", task_prompt: str = None) -> dict:
    """Evaluate a writing submission for IELTS/TOEFL/TCF."""
    prompt_key = f"writing_eval_{exam_type.lower()}"
    system_prompt = PROMPTS.get(prompt_key, PROMPTS["writing_eval_ielts"])

    user_msg = f"Essay to evaluate:\n\n{essay}"
    if task_prompt:
        user_msg = f"Task prompt: {task_prompt}\n\n{user_msg}"

    result = await chat_completion_json(
        [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_msg}],
        model=MODELS["smart"],
        temperature=0.2,
        max_tokens=2000,
    )

    if not result:
        # Fallback mock
        return _mock_writing_eval(exam_type)
    return result


async def generate_study_plan(exam: str, current_score: str, target_score: str,
                               weaknesses: list, strengths: list, days_remaining: int = 60) -> dict:
    """Generate a personalized study plan."""
    weeks = max(1, days_remaining // 7)
    prompt = PROMPTS["study_plan"].format(
        exam=exam, current_score=current_score, target_score=target_score,
        weaknesses=", ".join(weaknesses) if weaknesses else "None identified yet",
        strengths=", ".join(strengths) if strengths else "None identified yet",
        days_remaining=days_remaining, weeks=weeks,
    )

    result = await chat_completion_json(
        [{"role": "system", "content": prompt}, {"role": "user", "content": "Generate my study plan."}],
        max_tokens=3000,
    )

    if not result:
        return _mock_study_plan(exam, weeks)
    return result


async def language_chat(user_message: str, language: str, level: str = "A2",
                         history: List[dict] = None) -> str:
    """AI language practice conversation."""
    lang_names = {"fr": "français", "en": "English", "de": "Deutsch", "es": "español", "tr": "Türkçe"}
    lang_name = lang_names.get(language, language)

    system = PROMPTS["language_chat"].format(language=lang_name, level=level)
    messages = [{"role": "system", "content": system}]
    if history:
        messages.extend(history[-8:])
    messages.append({"role": "user", "content": user_message})

    response = await chat_completion(messages, max_tokens=500, temperature=0.8)
    return response or "AI language tutor is not configured."


async def generate_document(template_type: str, language: str, student_name: str,
                             program_name: str, university_name: str, country: str,
                             extra_context: str = "") -> str:
    """Generate a document (motivation letter, CV, etc.)."""
    doc_types = {
        "motivation_letter": "lettre de motivation" if language == "fr" else "motivation letter",
        "cv_international": "CV international",
        "recommendation_request": "email de demande de recommandation" if language == "fr" else "recommendation request email",
        "personal_statement": "personal statement",
        "study_plan": "plan d'études" if language == "fr" else "study plan",
    }
    doc_type_name = doc_types.get(template_type, template_type)

    system = PROMPTS["document_gen"].format(
        document_type=doc_type_name, language="français" if language == "fr" else "English",
        student_name=student_name, program_name=program_name,
        university_name=university_name, country=country,
    )
    user_msg = f"Generate the {doc_type_name}."
    if extra_context:
        user_msg += f"\n\nAdditional context: {extra_context}"

    response = await chat_completion(
        [{"role": "system", "content": system}, {"role": "user", "content": user_msg}],
        max_tokens=2000, temperature=0.6,
    )
    return response or f"Document generation is not configured. Please set up your OpenRouter API key."


async def generate_questions(exam_code: str, section: str, count: int = 10) -> Optional[list]:
    """Generate exam questions (for admin/background use)."""
    system = PROMPTS["question_gen"].format(exam_code=exam_code, section=section, count=count)
    result = await chat_completion_json(
        [{"role": "system", "content": system}, {"role": "user", "content": f"Generate {count} questions."}],
        max_tokens=4000, temperature=0.5,
    )
    if result and isinstance(result, dict) and "questions" in result:
        return result["questions"]
    if result and isinstance(result, list):
        return result
    return None


async def evaluate_speaking(transcript: str, exam_type: str = "ielts") -> dict:
    """Evaluate a speaking transcript."""
    result = await chat_completion_json(
        [{"role": "system", "content": PROMPTS["speaking_eval"]},
         {"role": "user", "content": f"Transcript to evaluate:\n\n{transcript}"}],
        temperature=0.2,
    )
    return result or _mock_speaking_eval()


# ── Mock Fallbacks ───────────────────────────────────────

def _mock_writing_eval(exam_type: str) -> dict:
    if exam_type == "tcf":
        return {
            "niveau_estime": "B1", "score_sur_20": 12,
            "criteres": {"respect_consigne": 12, "coherence": 12, "lexique": 11, "grammaire": 12},
            "commentaire": "L'IA n'est pas configurée. Ceci est une évaluation factice.",
            "points_forts": [], "axes_amelioration": ["Configurez la clé OpenRouter"],
            "corrections": [],
        }
    if exam_type == "toefl":
        return {
            "overall_score": 3, "max_score": 5,
            "criteria": {"development": 3, "organization": 3, "language_use": 3},
            "feedback": "AI not configured. This is a mock evaluation.",
            "strengths": [], "suggestions": ["Set up your OpenRouter API key"],
        }
    return {
        "overall_score": 6.0,
        "criteria": {"task_achievement": 6.0, "coherence_cohesion": 6.0, "lexical_resource": 6.0, "grammatical_range": 6.0},
        "feedback": "AI not configured. This is a mock evaluation. Set your OpenRouter API key for real scoring.",
        "strengths": [], "suggestions": ["Configure OPENROUTER_API_KEY in .env"],
        "corrected_sentences": [],
    }


def _mock_study_plan(exam: str, weeks: int) -> dict:
    return {
        "plan_title": f"Your {exam.upper()} Study Plan",
        "total_weeks": weeks, "weekly_hours": 10,
        "weeks": [{"week": i + 1, "focus": f"Week {i + 1} — Review", "tasks": ["Practice daily"], "goal": "Improve"} for i in range(min(weeks, 4))],
        "tips": ["AI not configured — set OPENROUTER_API_KEY for a personalized plan"],
    }


def _mock_speaking_eval() -> dict:
    return {
        "overall_score": 6.0,
        "criteria": {"fluency": 6.0, "lexical_resource": 6.0, "grammar": 6.0, "pronunciation": 6.0},
        "feedback": "AI not configured. Set OPENROUTER_API_KEY for real evaluation.",
        "filler_words_detected": 0, "filler_details": {},
        "suggestions": ["Configure OPENROUTER_API_KEY in .env"],
    }
