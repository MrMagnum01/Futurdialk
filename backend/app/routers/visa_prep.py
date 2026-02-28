"""
Visa Interview Prep router — AI-powered visa interview simulator.
Real interview questions per country, tips, and scoring for Moroccan students.
MongoDB-backed with static fallback.
"""

from fastapi import APIRouter, HTTPException
from app.core.database import mongo_db

router = APIRouter(prefix="/api/visa-prep", tags=["Visa Prep"])

# ── Static Fallback ──────────────────────────────────────

VISA_QUESTIONS_FALLBACK = {
    "FR": {
        "country_fr": "France", "country_en": "France",
        "visa_type": "Campus France + Visa Étudiant",
        "difficulty_fr": "Modéré", "difficulty_en": "Moderate", "avg_duration_min": 15,
        "questions": [
            {"q_fr": "Pourquoi avez-vous choisi la France ?", "q_en": "Why did you choose France?", "category": "motivation", "tip_fr": "Citez le système éducatif, la recherche, et la culture. Évitez de dire 'c'est proche du Maroc'.", "tip_en": "Mention education system, research, and culture. Avoid saying 'it's close to Morocco'."},
            {"q_fr": "Comment allez-vous financer vos études ?", "q_en": "How will you fund your studies?", "category": "financial", "tip_fr": "Montrez le justificatif bancaire (€7,380+). Mentionnez la bourse si applicable.", "tip_en": "Show bank proof (€7,380+). Mention scholarship if applicable."},
            {"q_fr": "Quel est votre projet professionnel après les études ?", "q_en": "What is your career plan after studies?", "category": "career", "tip_fr": "Soyez précis. Montrez que vous comptez utiliser votre diplôme pour contribuer au Maroc.", "tip_en": "Be specific. Show you plan to use your degree to contribute to Morocco."},
            {"q_fr": "Où allez-vous habiter en France ?", "q_en": "Where will you live in France?", "category": "logistics", "tip_fr": "Ayez une adresse provisoire. Mentionnez le CROUS ou la résidence étudiante.", "tip_en": "Have a provisional address. Mention CROUS or student residence."},
        ],
    },
    "CA": {
        "country_fr": "Canada", "country_en": "Canada",
        "visa_type": "Study Permit / CAQ",
        "difficulty_fr": "Élevé", "difficulty_en": "Hard", "avg_duration_min": 20,
        "questions": [
            {"q_fr": "Pourquoi le Canada et pas la France ou un autre pays ?", "q_en": "Why Canada and not France or another country?", "category": "motivation", "tip_fr": "Qualité de l'éducation, bilinguisme, perspectives d'immigration.", "tip_en": "Education quality, bilingualism, immigration prospects."},
            {"q_fr": "Comment allez-vous financer votre séjour (CAD 20,635/an) ?", "q_en": "How will you fund your stay (CAD 20,635/yr)?", "category": "financial", "tip_fr": "Préparez les relevés bancaires, attestation de ressources, et lettre de garant.", "tip_en": "Prepare bank statements, proof of funds, and sponsor letter."},
            {"q_fr": "Comptez-vous rester au Canada après vos études ?", "q_en": "Do you plan to stay in Canada after your studies?", "category": "career", "tip_fr": "Réponse nuancée : PGWP est une option mais montrez des liens avec le Maroc.", "tip_en": "Nuanced answer: PGWP is an option but show ties to Morocco."},
        ],
    },
    "UK": {
        "country_fr": "Royaume-Uni", "country_en": "United Kingdom",
        "visa_type": "Student Visa (Tier 4)",
        "difficulty_fr": "Très Élevé", "difficulty_en": "Very Hard", "avg_duration_min": 25,
        "questions": [
            {"q_fr": "Pourquoi cette université spécifiquement ?", "q_en": "Why this university specifically?", "category": "motivation", "tip_fr": "Recherchez le programme en détail. Citez des professeurs, des recherches spécifiques.", "tip_en": "Research the program in detail. Cite specific professors, research."},
            {"q_fr": "Quand comptez-vous retourner au Maroc ?", "q_en": "When do you plan to return to Morocco?", "category": "intent", "tip_fr": "Soyez clair sur vos liens au Maroc — famille, emploi, propriété.", "tip_en": "Be clear about Morocco ties — family, employment, property."},
            {"q_fr": "Avez-vous un garant financier ?", "q_en": "Do you have a financial sponsor?", "category": "financial", "tip_fr": "Lettre du garant, relevés bancaires, preuve de revenus.", "tip_en": "Sponsor's letter, bank statements, proof of income."},
        ],
    },
    "US": {
        "country_fr": "États-Unis", "country_en": "United States",
        "visa_type": "F-1 Student Visa",
        "difficulty_fr": "Très Élevé", "difficulty_en": "Very Hard", "avg_duration_min": 25,
        "questions": [
            {"q_fr": "Quel programme étudiez-vous et pourquoi ?", "q_en": "What program are you studying and why?", "category": "motivation", "tip_fr": "Soyez passionné et spécifique. Ne dites pas 'pour trouver un emploi aux USA'.", "tip_en": "Be passionate and specific. Don't say 'to find a job in the US'."},
            {"q_fr": "Qui finance vos études ?", "q_en": "Who is funding your studies?", "category": "financial", "tip_fr": "I-20, relevés bancaires, attestation de bourse si applicable.", "tip_en": "I-20, bank statements, scholarship letter if applicable."},
            {"q_fr": "Que ferez-vous si votre visa est refusé ?", "q_en": "What will you do if your visa is denied?", "category": "motivation", "tip_fr": "Montrez de la résilience : alternatives au Maroc, pas de désespoir.", "tip_en": "Show resilience: alternatives in Morocco, no desperation."},
        ],
    },
    "DE": {
        "country_fr": "Allemagne", "country_en": "Germany",
        "visa_type": "Student Visa",
        "difficulty_fr": "Facile", "difficulty_en": "Easy", "avg_duration_min": 10,
        "questions": [
            {"q_fr": "Avez-vous un compte bloqué ?", "q_en": "Do you have a blocked account?", "category": "financial", "tip_fr": "€11,208 sur un Sperrkonto. Montrez le certificat.", "tip_en": "€11,208 in a Sperrkonto. Show the certificate."},
            {"q_fr": "Parlez-vous allemand ?", "q_en": "Do you speak German?", "category": "language", "tip_fr": "TestDaF ou DSH selon le programme. Anglais OK pour programmes internationaux.", "tip_en": "TestDaF or DSH depending on program. English OK for international programs."},
        ],
    },
    "TR": {
        "country_fr": "Turquie", "country_en": "Turkey",
        "visa_type": "Student Visa",
        "difficulty_fr": "Facile", "difficulty_en": "Easy", "avg_duration_min": 8,
        "questions": [
            {"q_fr": "Avez-vous la lettre d'acceptation de l'université ?", "q_en": "Do you have the university acceptance letter?", "category": "documentation", "tip_fr": "Original + copie. Vérifiez que le cachet est lisible.", "tip_en": "Original + copy. Verify the stamp is readable."},
            {"q_fr": "Comment allez-vous financer vos études ?", "q_en": "How will you fund your studies?", "category": "financial", "tip_fr": "Relevé bancaire parental ou bourse Türkiye Bursları.", "tip_en": "Parental bank statement or Türkiye Bursları scholarship."},
        ],
    },
}


# ── Helpers ───────────────────────────────────────────────

async def _get_visa_data(country_code: str = None):
    if country_code:
        doc = await mongo_db.visa_data.find_one({"country_code": country_code.upper()})
        if doc:
            doc.pop("_id", None)
            return doc
        return VISA_QUESTIONS_FALLBACK.get(country_code.upper())
    # All countries
    docs = await mongo_db.visa_data.find().to_list(20)
    if docs:
        for d in docs:
            d.pop("_id", None)
        return {d.get("country_code", d.get("country_en", "?")): d for d in docs}
    return VISA_QUESTIONS_FALLBACK


# ── Endpoints ────────────────────────────────────────────

@router.get("/countries")
async def list_visa_countries():
    """List all countries with visa interview prep available."""
    data = await _get_visa_data()
    countries = []
    for code, info in data.items():
        countries.append({
            "country_code": code,
            "country_fr": info.get("country_fr", code),
            "country_en": info.get("country_en", code),
            "visa_type": info.get("visa_type", ""),
            "difficulty_fr": info.get("difficulty_fr", ""),
            "difficulty_en": info.get("difficulty_en", ""),
            "question_count": len(info.get("questions", [])),
        })
    return {"countries": countries, "total": len(countries)}


@router.get("/questions/{country_code}")
async def get_questions(country_code: str):
    """Get interview questions for a specific country."""
    data = await _get_visa_data(country_code)
    if not data:
        raise HTTPException(404, f"No visa prep data for {country_code}")
    return data


@router.get("/tips")
async def get_general_tips():
    """General visa interview tips for Moroccan students."""
    return {
        "tips": [
            {"title_fr": "Soyez honnête", "title_en": "Be honest", "desc_fr": "Ne mentez jamais. Les incohérences sont détectées.", "desc_en": "Never lie. Inconsistencies are detected."},
            {"title_fr": "Préparez vos documents", "title_en": "Prepare your documents", "desc_fr": "Organisez tous les documents dans un dossier clair.", "desc_en": "Organize all documents in a clear folder."},
            {"title_fr": "Montrez vos liens au Maroc", "title_en": "Show ties to Morocco", "desc_fr": "Famille, emploi potentiel, propriété — montrez que vous reviendrez.", "desc_en": "Family, potential employment, property — show you'll return."},
            {"title_fr": "Habillez-vous bien", "title_en": "Dress well", "desc_fr": "Tenue formelle. Première impression compte.", "desc_en": "Formal attire. First impression matters."},
            {"title_fr": "Parlez clairement", "title_en": "Speak clearly", "desc_fr": "Pas trop vite, pas de jargon. Réponses courtes et précises.", "desc_en": "Not too fast, no jargon. Short and precise answers."},
        ]
    }
