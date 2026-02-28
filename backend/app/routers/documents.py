"""
Documents router — Document templates and checklists for Moroccan students.
Reads from MongoDB with fallback to static content. AI document generation via OpenRouter.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import get_current_user
from app.core.database import mongo_db
from app.core.ai_service import generate_document, ai_available

router = APIRouter(prefix="/api/documents", tags=["Documents"])

# ── Static Fallback Templates ────────────────────────────

TEMPLATES_FALLBACK = [
    {
        "id": "motivation_letter", "name_fr": "Lettre de Motivation", "name_en": "Motivation Letter",
        "desc_fr": "Génération IA personnalisée pour Campus France, universités étrangères",
        "desc_en": "AI-powered personalized letter for Campus France, foreign universities",
        "icon": "✉️", "fields": ["program_name", "university", "motivation", "background"],
        "countries": ["FR", "CA", "DE", "UK", "ES"],
    },
    {
        "id": "cv_international", "name_fr": "CV International", "name_en": "International CV",
        "desc_fr": "Format international adapté aux candidatures universitaires",
        "desc_en": "International format adapted for university applications",
        "icon": "📄", "fields": ["education", "experience", "skills", "languages"],
        "countries": ["FR", "CA", "DE", "UK", "ES"],
    },
    {
        "id": "recommendation_request", "name_fr": "Demande de Recommandation", "name_en": "Recommendation Request",
        "desc_fr": "Email professionnel pour demander une lettre de recommandation",
        "desc_en": "Professional email to request a recommendation letter",
        "icon": "📬", "fields": ["professor_name", "subject", "relationship"],
        "countries": ["FR", "CA", "DE", "UK", "ES"],
    },
    {
        "id": "personal_statement", "name_fr": "Personal Statement (UCAS)", "name_en": "Personal Statement (UCAS)",
        "desc_fr": "4 000 caractères pour UCAS — format britannique",
        "desc_en": "4,000 characters for UCAS — British format",
        "icon": "🇬🇧", "fields": ["why_subject", "relevant_experience", "future_goals"],
        "countries": ["UK"],
    },
    {
        "id": "study_plan", "name_fr": "Plan d'Études", "name_en": "Study Plan",
        "desc_fr": "Document requis par certaines universités et consulats",
        "desc_en": "Document required by some universities and consulates",
        "icon": "📋", "fields": ["study_objectives", "timeline", "career_goals"],
        "countries": ["FR", "CA", "DE", "TR"],
    },
]

CHECKLISTS_FALLBACK = {
    "FR": {
        "country_fr": "France", "country_en": "France",
        "items": [
            {"name_fr": "Baccalauréat (copie certifiée)", "name_en": "Baccalauréat (certified copy)", "required": True, "cost_mad": 0},
            {"name_fr": "Relevés de notes", "name_en": "Transcripts", "required": True, "cost_mad": 0},
            {"name_fr": "Certificat TCF/DELF", "name_en": "TCF/DELF Certificate", "required": True, "cost_mad": 1500},
            {"name_fr": "Lettre de motivation", "name_en": "Motivation letter", "required": True, "cost_mad": 0},
            {"name_fr": "CV", "name_en": "CV/Resume", "required": True, "cost_mad": 0},
            {"name_fr": "Justificatif de ressources (€7,380)", "name_en": "Proof of funds (€7,380)", "required": True, "cost_mad": 80000},
            {"name_fr": "Photos d'identité", "name_en": "Passport photos", "required": True, "cost_mad": 50},
            {"name_fr": "Passeport valide", "name_en": "Valid passport", "required": True, "cost_mad": 350},
            {"name_fr": "Traductions assermentées", "name_en": "Sworn translations", "required": True, "cost_mad": 500},
            {"name_fr": "Frais Campus France", "name_en": "Campus France fee", "required": True, "cost_mad": 1800},
        ],
    },
    "CA": {
        "country_fr": "Canada", "country_en": "Canada",
        "items": [
            {"name_fr": "Diplômes certifiés", "name_en": "Certified diplomas", "required": True, "cost_mad": 0},
            {"name_fr": "Lettre d'acceptation", "name_en": "Letter of acceptance", "required": True, "cost_mad": 0},
            {"name_fr": "IELTS/TOEFL Score", "name_en": "IELTS/TOEFL Score", "required": True, "cost_mad": 3200},
            {"name_fr": "CAQ (Québec)", "name_en": "CAQ (Quebec)", "required": False, "cost_mad": 1200},
            {"name_fr": "Preuve financière (CAD 20,635/an)", "name_en": "Proof of funds (CAD 20,635/yr)", "required": True, "cost_mad": 150000},
            {"name_fr": "Demande de permis d'études", "name_en": "Study permit application", "required": True, "cost_mad": 1500},
            {"name_fr": "Biométrie VFS", "name_en": "VFS biometrics", "required": True, "cost_mad": 850},
            {"name_fr": "Passeport valide", "name_en": "Valid passport", "required": True, "cost_mad": 350},
        ],
    },
    "DE": {
        "country_fr": "Allemagne", "country_en": "Germany",
        "items": [
            {"name_fr": "Diplômes certifiés", "name_en": "Certified diplomas", "required": True, "cost_mad": 0},
            {"name_fr": "Compte bloqué (€11,208)", "name_en": "Blocked account (€11,208)", "required": True, "cost_mad": 121000},
            {"name_fr": "TestDaF / DSH", "name_en": "TestDaF / DSH certificate", "required": True, "cost_mad": 2000},
            {"name_fr": "Candidature uni-assist", "name_en": "uni-assist application", "required": True, "cost_mad": 750},
            {"name_fr": "Assurance santé", "name_en": "Health insurance", "required": True, "cost_mad": 10000},
            {"name_fr": "Passeport valide", "name_en": "Valid passport", "required": True, "cost_mad": 350},
        ],
    },
    "UK": {
        "country_fr": "Royaume-Uni", "country_en": "United Kingdom",
        "items": [
            {"name_fr": "Baccalauréat certifié", "name_en": "Certified Baccalauréat", "required": True, "cost_mad": 0},
            {"name_fr": "UCAS Application", "name_en": "UCAS Application", "required": True, "cost_mad": 300},
            {"name_fr": "IELTS Academic (6.5+)", "name_en": "IELTS Academic (6.5+)", "required": True, "cost_mad": 3200},
            {"name_fr": "CAS (Confirmation of Acceptance)", "name_en": "CAS (Confirmation of Acceptance)", "required": True, "cost_mad": 0},
            {"name_fr": "Preuve financière (£12,006)", "name_en": "Proof of funds (£12,006)", "required": True, "cost_mad": 152000},
            {"name_fr": "Passeport valide", "name_en": "Valid passport", "required": True, "cost_mad": 350},
        ],
    },
    "ES": {
        "country_fr": "Espagne", "country_en": "Spain",
        "items": [
            {"name_fr": "Diplômes certifiés", "name_en": "Certified diplomas", "required": True, "cost_mad": 0},
            {"name_fr": "Homologation du BAC", "name_en": "BAC homologation", "required": True, "cost_mad": 800},
            {"name_fr": "DELE B2", "name_en": "DELE B2 certificate", "required": True, "cost_mad": 2000},
            {"name_fr": "Preuve financière", "name_en": "Proof of funds", "required": True, "cost_mad": 60000},
            {"name_fr": "Visa étudiant", "name_en": "Student visa", "required": True, "cost_mad": 4500},
            {"name_fr": "Passeport valide", "name_en": "Valid passport", "required": True, "cost_mad": 350},
        ],
    },
}


# ── Helpers ───────────────────────────────────────────────

async def _get_templates():
    docs = await mongo_db.document_templates.find().to_list(30)
    if docs:
        for d in docs:
            d["id"] = str(d.pop("_id"))
        return docs
    return TEMPLATES_FALLBACK


async def _get_checklist(country_code: str):
    doc = await mongo_db.document_checklists.find_one({"country_code": country_code.upper()})
    if doc:
        doc.pop("_id", None)
        return doc
    return CHECKLISTS_FALLBACK.get(country_code.upper())


# ── Endpoints ────────────────────────────────────────────

@router.get("/templates")
async def get_document_templates():
    """Get available document templates for Moroccan students."""
    templates = await _get_templates()
    return {"templates": templates, "total": len(templates)}


@router.get("/checklist/{country_code}")
async def get_document_checklist(country_code: str):
    """Get document checklist for a specific country with costs in MAD."""
    checklist = await _get_checklist(country_code)
    if not checklist:
        raise HTTPException(status_code=404, detail=f"No checklist found for {country_code}")
    total_cost = sum(item.get("cost_mad", 0) for item in checklist.get("items", []))
    return {**checklist, "total_cost_mad": total_cost, "country_code": country_code.upper()}


@router.get("/checklists")
async def get_all_checklists():
    """Get all available country checklists summary."""
    summaries = []
    for code in ["FR", "CA", "DE", "UK", "ES"]:
        checklist = await _get_checklist(code)
        if checklist:
            total = sum(item.get("cost_mad", 0) for item in checklist.get("items", []))
            summaries.append({
                "country_code": code,
                "country_fr": checklist.get("country_fr", code),
                "country_en": checklist.get("country_en", code),
                "items_count": len(checklist.get("items", [])),
                "total_cost_mad": total,
            })
    return {"checklists": summaries}


@router.get("/mine")
async def get_user_documents(current_user: dict = Depends(get_current_user)):
    """Get user's stored documents (MinIO-backed)."""
    return {"documents": [], "message": "Document storage via MinIO"}


class GenerateDocRequest(BaseModel):
    template_id: str
    language: str = "fr"
    student_name: str = ""
    program_name: str = ""
    university_name: str = ""
    country: str = "FR"
    extra_context: str = ""


@router.post("/templates/{template_id}/generate")
async def generate_doc(template_id: str, data: GenerateDocRequest,
                       current_user: dict = Depends(get_current_user)):
    """Generate a document using AI (motivation letter, CV, etc.)."""
    student_name = data.student_name or current_user.get("full_name", "Student")
    document_text = await generate_document(
        template_type=template_id,
        language=data.language,
        student_name=student_name,
        program_name=data.program_name,
        university_name=data.university_name,
        country=data.country,
        extra_context=data.extra_context,
    )
    return {
        "template_id": template_id,
        "document": document_text,
        "language": data.language,
        "ai_generated": ai_available(),
    }
