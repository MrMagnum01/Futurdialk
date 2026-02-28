"""
Tawjih V4 — Complete Seed Script
Seeds ALL remaining empty data into PostgreSQL + MongoDB.
Run: docker compose exec backend python -m seed_all
"""
import asyncio
import uuid
from datetime import datetime, timezone
from decimal import Decimal

from app.core.database import engine, Base, AsyncSessionLocal, mongo_db
from app.models.marketplace import ServiceProvider
from app.models.mentor import Mentor
from app.models.user import User
from sqlalchemy import select, func

# ══════════════════════════════════════════════════════════
# MONGODB: Career Paths
# ══════════════════════════════════════════════════════════

CAREER_PATHS = [
    {
        "name": "Software Engineer", "name_fr": "Ingénieur Logiciel",
        "category": "engineering", "riasec_codes": ["I", "R", "C"],
        "required_education": "licence", "job_titles": ["Développeur Full-Stack", "Backend Engineer", "DevOps Engineer"],
        "description_fr": "Conception et développement de logiciels, applications web et systèmes informatiques.",
        "description_en": "Design and develop software, web applications and computer systems.",
        "automation_risk": 0.04, "demand_level": "very_high",
        "skills": ["Python", "JavaScript", "SQL", "Git", "Docker", "Algorithmes"],
        "market_data": {
            "MA": {"avg_salary_mad": 180000, "growth_pct": 12, "top_employers": ["OCP", "Capgemini", "CGI", "Atos"]},
            "FR": {"avg_salary_mad": 480000, "growth_pct": 8, "top_employers": ["Thales", "Dassault", "Capgemini", "Sopra"]},
            "CA": {"avg_salary_mad": 720000, "growth_pct": 10, "top_employers": ["Shopify", "CGI", "Deloitte", "Google"]},
            "DE": {"avg_salary_mad": 600000, "growth_pct": 9, "top_employers": ["SAP", "Siemens", "BMW", "Bosch"]},
        },
    },
    {
        "name": "Civil Engineer", "name_fr": "Ingénieur Génie Civil",
        "category": "engineering", "riasec_codes": ["R", "I", "C"],
        "required_education": "master", "job_titles": ["Ingénieur BTP", "Chef de Chantier", "Ingénieur Structures"],
        "description_fr": "Conception et supervision de projets d'infrastructure : routes, ponts, bâtiments.",
        "description_en": "Design and supervise infrastructure projects: roads, bridges, buildings.",
        "automation_risk": 0.15, "demand_level": "high",
        "skills": ["AutoCAD", "BIM", "Résistance des matériaux", "Gestion de projet"],
        "market_data": {
            "MA": {"avg_salary_mad": 150000, "growth_pct": 6, "top_employers": ["ONCF", "ADM", "Somagec", "TGCC"]},
            "FR": {"avg_salary_mad": 420000, "growth_pct": 4, "top_employers": ["Vinci", "Bouygues", "Eiffage"]},
        },
    },
    {
        "name": "Data Scientist", "name_fr": "Data Scientist",
        "category": "engineering", "riasec_codes": ["I", "C", "A"],
        "required_education": "master", "job_titles": ["ML Engineer", "Data Analyst", "AI Researcher"],
        "description_fr": "Analyse de données massives et création de modèles prédictifs avec l'IA.",
        "description_en": "Analyze massive datasets and create predictive models using AI.",
        "automation_risk": 0.06, "demand_level": "very_high",
        "skills": ["Python", "Machine Learning", "Statistics", "TensorFlow", "SQL"],
        "market_data": {
            "MA": {"avg_salary_mad": 200000, "growth_pct": 18, "top_employers": ["OCP", "INWI", "Attijariwafa", "CDG"]},
            "FR": {"avg_salary_mad": 550000, "growth_pct": 15, "top_employers": ["Dataiku", "Criteo", "AXA", "BNP"]},
            "CA": {"avg_salary_mad": 800000, "growth_pct": 20, "top_employers": ["Mila", "Element AI", "Shopify"]},
        },
    },
    {
        "name": "Finance Analyst", "name_fr": "Analyste Financier",
        "category": "business", "riasec_codes": ["C", "E", "I"],
        "required_education": "master", "job_titles": ["Analyste M&A", "Contrôleur de Gestion", "Risk Manager"],
        "description_fr": "Analyse financière, évaluation d'entreprises et gestion des risques.",
        "description_en": "Financial analysis, business valuation and risk management.",
        "automation_risk": 0.23, "demand_level": "high",
        "skills": ["Excel", "Financial Modeling", "Bloomberg", "Python", "Comptabilité"],
        "market_data": {
            "MA": {"avg_salary_mad": 160000, "growth_pct": 5, "top_employers": ["Attijariwafa", "BMCE", "CDG Capital"]},
            "FR": {"avg_salary_mad": 500000, "growth_pct": 3, "top_employers": ["BNP Paribas", "Société Générale", "Lazard"]},
        },
    },
    {
        "name": "Marketing Manager", "name_fr": "Responsable Marketing",
        "category": "business", "riasec_codes": ["E", "A", "S"],
        "required_education": "master", "job_titles": ["Brand Manager", "Growth Hacker", "CMO"],
        "description_fr": "Stratégies marketing, branding et acquisition de clients.",
        "description_en": "Marketing strategies, branding and customer acquisition.",
        "automation_risk": 0.18, "demand_level": "medium",
        "skills": ["SEO/SEM", "Analytics", "Content Strategy", "Social Media"],
        "market_data": {
            "MA": {"avg_salary_mad": 140000, "growth_pct": 7, "top_employers": ["P&G Maroc", "Coca-Cola", "Marjane"]},
            "FR": {"avg_salary_mad": 450000, "growth_pct": 5, "top_employers": ["L'Oréal", "LVMH", "Publicis"]},
        },
    },
    {
        "name": "General Practitioner", "name_fr": "Médecin Généraliste",
        "category": "medicine", "riasec_codes": ["I", "S", "R"],
        "required_education": "doctorat", "job_titles": ["Médecin de Famille", "Urgentiste"],
        "description_fr": "Diagnostic et traitement des maladies courantes, suivi médical des patients.",
        "description_en": "Diagnose and treat common illnesses, patient medical follow-up.",
        "automation_risk": 0.02, "demand_level": "very_high",
        "skills": ["Diagnostic clinique", "Pharmacologie", "Communication", "Urgences"],
        "market_data": {
            "MA": {"avg_salary_mad": 250000, "growth_pct": 4, "top_employers": ["CHU", "Cliniques privées"]},
            "FR": {"avg_salary_mad": 650000, "growth_pct": 3, "top_employers": ["AP-HP", "Cliniques privées"]},
        },
    },
    {
        "name": "Pharmacist", "name_fr": "Pharmacien",
        "category": "medicine", "riasec_codes": ["I", "C", "S"],
        "required_education": "doctorat", "job_titles": ["Pharmacien d'officine", "Pharmacien hospitalier"],
        "description_fr": "Dispensation de médicaments, conseil pharmaceutique et suivi thérapeutique.",
        "description_en": "Dispense medication, pharmaceutical advice and therapeutic monitoring.",
        "automation_risk": 0.05, "demand_level": "high",
        "skills": ["Pharmacologie", "Chimie", "Conseil patient", "Gestion de stock"],
        "market_data": {
            "MA": {"avg_salary_mad": 200000, "growth_pct": 3, "top_employers": ["Officines", "Sothema", "Pharma 5"]},
            "FR": {"avg_salary_mad": 500000, "growth_pct": 2, "top_employers": ["Sanofi", "Officines", "AP-HP"]},
        },
    },
    {
        "name": "Research Scientist", "name_fr": "Chercheur Scientifique",
        "category": "sciences", "riasec_codes": ["I", "A", "R"],
        "required_education": "doctorat", "job_titles": ["Chercheur CNRS", "Postdoc", "R&D Scientist"],
        "description_fr": "Recherche fondamentale ou appliquée en laboratoire.",
        "description_en": "Fundamental or applied research in laboratory settings.",
        "automation_risk": 0.10, "demand_level": "medium",
        "skills": ["Méthodologie scientifique", "Rédaction académique", "Statistiques", "Programmation"],
        "market_data": {
            "MA": {"avg_salary_mad": 120000, "growth_pct": 4, "top_employers": ["CNRST", "UM6P", "Universités"]},
            "FR": {"avg_salary_mad": 380000, "growth_pct": 3, "top_employers": ["CNRS", "INSERM", "CEA"]},
        },
    },
    {
        "name": "AI/ML Engineer", "name_fr": "Ingénieur IA/ML",
        "category": "tech", "riasec_codes": ["I", "R", "C"],
        "required_education": "master", "job_titles": ["AI Engineer", "NLP Engineer", "Computer Vision Engineer"],
        "description_fr": "Développement et déploiement de modèles d'intelligence artificielle.",
        "description_en": "Develop and deploy artificial intelligence models.",
        "automation_risk": 0.02, "demand_level": "very_high",
        "skills": ["PyTorch", "TensorFlow", "NLP", "Computer Vision", "MLOps"],
        "market_data": {
            "MA": {"avg_salary_mad": 250000, "growth_pct": 25, "top_employers": ["OCP", "UM6P", "INWI"]},
            "FR": {"avg_salary_mad": 650000, "growth_pct": 22, "top_employers": ["Hugging Face", "Mistral AI", "Dataiku"]},
            "CA": {"avg_salary_mad": 950000, "growth_pct": 28, "top_employers": ["Mila", "Google DeepMind", "OpenAI"]},
        },
    },
    {
        "name": "Cybersecurity Analyst", "name_fr": "Analyste Cybersécurité",
        "category": "tech", "riasec_codes": ["I", "C", "R"],
        "required_education": "licence", "job_titles": ["Security Engineer", "Pentester", "SOC Analyst"],
        "description_fr": "Protection des systèmes informatiques contre les cybermenaces.",
        "description_en": "Protect computer systems against cyber threats.",
        "automation_risk": 0.08, "demand_level": "very_high",
        "skills": ["Networking", "Linux", "Ethical Hacking", "SIEM", "ISO 27001"],
        "market_data": {
            "MA": {"avg_salary_mad": 170000, "growth_pct": 15, "top_employers": ["DGSN", "Banques", "Telcos"]},
            "FR": {"avg_salary_mad": 520000, "growth_pct": 12, "top_employers": ["Thales", "Orange CyberDefense", "Airbus"]},
        },
    },
    {
        "name": "Lawyer", "name_fr": "Avocat",
        "category": "humanities", "riasec_codes": ["E", "I", "S"],
        "required_education": "master", "job_titles": ["Avocat d'affaires", "Juriste", "Conseiller juridique"],
        "description_fr": "Conseil juridique, défense en justice et rédaction de contrats.",
        "description_en": "Legal advice, court defense and contract drafting.",
        "automation_risk": 0.15, "demand_level": "medium",
        "skills": ["Droit des affaires", "Rédaction juridique", "Plaidoirie", "Droit international"],
        "market_data": {
            "MA": {"avg_salary_mad": 180000, "growth_pct": 3, "top_employers": ["Cabinets d'avocats", "Entreprises"]},
            "FR": {"avg_salary_mad": 550000, "growth_pct": 2, "top_employers": ["Gide", "Bredin Prat", "Clifford Chance"]},
        },
    },
    {
        "name": "Journalist", "name_fr": "Journaliste",
        "category": "humanities", "riasec_codes": ["A", "E", "S"],
        "required_education": "licence", "job_titles": ["Rédacteur", "Reporter", "Journaliste Web"],
        "description_fr": "Rédaction d'articles, reportages et couverture de l'actualité.",
        "description_en": "Write articles, reports and cover current events.",
        "automation_risk": 0.30, "demand_level": "low",
        "skills": ["Rédaction", "Investigation", "Réseaux sociaux", "Vidéo", "SEO"],
        "market_data": {
            "MA": {"avg_salary_mad": 80000, "growth_pct": -2, "top_employers": ["Le360", "Hespress", "TelQuel"]},
            "FR": {"avg_salary_mad": 350000, "growth_pct": -1, "top_employers": ["Le Monde", "AFP", "France TV"]},
        },
    },
    {
        "name": "Architect", "name_fr": "Architecte",
        "category": "arts", "riasec_codes": ["A", "R", "I"],
        "required_education": "master", "job_titles": ["Architecte DPLG", "Urbaniste", "Designer d'intérieur"],
        "description_fr": "Conception de bâtiments, espaces urbains et projets architecturaux.",
        "description_en": "Design buildings, urban spaces and architectural projects.",
        "automation_risk": 0.12, "demand_level": "medium",
        "skills": ["AutoCAD", "Revit", "SketchUp", "BIM", "Dessin technique"],
        "market_data": {
            "MA": {"avg_salary_mad": 150000, "growth_pct": 5, "top_employers": ["Cabinets d'architecture", "Promoteurs"]},
            "FR": {"avg_salary_mad": 400000, "growth_pct": 3, "top_employers": ["RPBW", "Jean Nouvel", "BIG"]},
        },
    },
    {
        "name": "Environmental Analyst", "name_fr": "Analyste Environnement",
        "category": "sciences", "riasec_codes": ["I", "R", "S"],
        "required_education": "master", "job_titles": ["Ingénieur Environnement", "Consultant RSE", "Écologue"],
        "description_fr": "Études d'impact, gestion des ressources naturelles et développement durable.",
        "description_en": "Impact studies, natural resource management and sustainable development.",
        "automation_risk": 0.10, "demand_level": "high",
        "skills": ["SIG/GIS", "Écologie", "Réglementation", "Data Analysis"],
        "market_data": {
            "MA": {"avg_salary_mad": 130000, "growth_pct": 8, "top_employers": ["ONEE", "OCP", "MASEN"]},
            "FR": {"avg_salary_mad": 400000, "growth_pct": 7, "top_employers": ["Veolia", "Suez", "EDF"]},
        },
    },
    {
        "name": "Teacher", "name_fr": "Enseignant",
        "category": "humanities", "riasec_codes": ["S", "I", "A"],
        "required_education": "master", "job_titles": ["Professeur", "Formateur", "Enseignant Chercheur"],
        "description_fr": "Enseignement et formation dans le primaire, secondaire ou supérieur.",
        "description_en": "Teaching and training in primary, secondary or higher education.",
        "automation_risk": 0.08, "demand_level": "high",
        "skills": ["Pédagogie", "Communication", "Gestion de classe", "Technologie éducative"],
        "market_data": {
            "MA": {"avg_salary_mad": 100000, "growth_pct": 3, "top_employers": ["MEN", "AREF", "Écoles privées"]},
            "FR": {"avg_salary_mad": 350000, "growth_pct": 2, "top_employers": ["Éducation Nationale", "CNRS"]},
        },
    },
]

# ══════════════════════════════════════════════════════════
# MONGODB: Additional Questions (BAC + DELF + TestDaF)
# ══════════════════════════════════════════════════════════

EXTRA_QUESTIONS = [
    # BAC Maths
    {"exam_code": "bac_sciences", "section": "math", "difficulty": "medium",
     "question_text": "Résoudre l'équation : 2x² - 5x + 3 = 0",
     "options": ["A) x = 1 ou x = 3/2", "B) x = -1 ou x = -3/2", "C) x = 1 ou x = -3/2", "D) x = 2 ou x = 3"],
     "correct_answer": "A", "explanation": "Discriminant = 25-24 = 1. x = (5±1)/4 → x=3/2 ou x=1."},
    {"exam_code": "bac_sciences", "section": "math", "difficulty": "hard",
     "question_text": "Calculer la limite : lim(x→0) (sin(3x)/x)",
     "options": ["A) 0", "B) 1", "C) 3", "D) ∞"],
     "correct_answer": "C", "explanation": "lim(sin(3x)/x) = lim(3·sin(3x)/(3x)) = 3·1 = 3."},
    {"exam_code": "bac_sciences", "section": "math", "difficulty": "easy",
     "question_text": "Quelle est la dérivée de f(x) = 3x² + 2x ?",
     "options": ["A) 6x + 2", "B) 3x + 2", "C) 6x² + 2", "D) 3x² + 2x"],
     "correct_answer": "A", "explanation": "f'(x) = 6x + 2 par les règles de dérivation."},
    # BAC Physique
    {"exam_code": "bac_sciences", "section": "physique_chimie", "difficulty": "medium",
     "question_text": "Un objet de masse 2 kg tombe en chute libre. Quelle est sa vitesse après 3 secondes ? (g=10m/s²)",
     "options": ["A) 20 m/s", "B) 30 m/s", "C) 15 m/s", "D) 60 m/s"],
     "correct_answer": "B", "explanation": "v = g·t = 10×3 = 30 m/s."},
    {"exam_code": "bac_sciences", "section": "physique_chimie", "difficulty": "hard",
     "question_text": "Calculer la longueur d'onde d'un photon d'énergie E = 3,3 eV. (h=6,6×10⁻³⁴ J·s, c=3×10⁸ m/s)",
     "options": ["A) 376 nm", "B) 450 nm", "C) 550 nm", "D) 650 nm"],
     "correct_answer": "A", "explanation": "λ = hc/E = (6,6e-34 × 3e8) / (3,3 × 1,6e-19) ≈ 376 nm."},
    # BAC SVT
    {"exam_code": "bac_sciences", "section": "svt", "difficulty": "medium",
     "question_text": "Quel est le rôle principal des mitochondries dans la cellule ?",
     "options": ["A) Synthèse des protéines", "B) Production d'énergie (ATP)", "C) Stockage de l'ADN", "D) Division cellulaire"],
     "correct_answer": "B", "explanation": "Les mitochondries sont le siège de la respiration cellulaire produisant l'ATP."},
    # DELF B2
    {"exam_code": "delf_b2", "section": "comprehension_orale", "difficulty": "medium",
     "question_text": "Écoutez l'interview. Quel est le sujet principal de la discussion ?",
     "context": "Transcription : 'Le télétravail a transformé nos habitudes de travail. 40% des salariés français travaillent désormais au moins un jour par semaine depuis chez eux.'",
     "options": ["A) Les vacances", "B) Le télétravail", "C) La santé", "D) L'éducation"],
     "correct_answer": "B", "explanation": "'Le télétravail a transformé nos habitudes de travail'."},
    {"exam_code": "delf_b2", "section": "comprehension_ecrite", "difficulty": "hard",
     "question_text": "D'après le texte, quelle est la conséquence du vieillissement de la population ?",
     "context": "Le vieillissement de la population pose des défis majeurs pour le système de retraite. Le ratio actifs/retraités est passé de 4/1 en 1960 à 1,7/1 aujourd'hui.",
     "options": ["A) Plus d'emplois", "B) Pression sur les retraites", "C) Moins de naissances", "D) Croissance économique"],
     "correct_answer": "B", "explanation": "La baisse du ratio actifs/retraités crée une pression sur le système de retraite."},
    # TestDaF
    {"exam_code": "testdaf", "section": "leseverstehen", "difficulty": "medium",
     "question_text": "Lesen Sie den Text. Warum studieren immer mehr Marokkaner in Deutschland?",
     "context": "Die Zahl der marokkanischen Studierenden in Deutschland ist in den letzten fünf Jahren um 45% gestiegen. Der Hauptgrund: keine Studiengebühren an öffentlichen Universitäten.",
     "options": ["A) Besseres Wetter", "B) Keine Studiengebühren", "C) Mehr Feiertage", "D) Kürzere Studienzeit"],
     "correct_answer": "B", "explanation": "'Keine Studiengebühren an öffentlichen Universitäten' ist der Hauptgrund."},
    {"exam_code": "testdaf", "section": "hoerverstehen", "difficulty": "easy",
     "question_text": "Was möchte der Student im Studentenwerk?",
     "context": "Transkript: 'Guten Tag, ich möchte mich für einen Platz im Studentenwohnheim bewerben. Gibt es noch freie Zimmer?'",
     "options": ["A) Ein Buch kaufen", "B) Ein Zimmer im Wohnheim", "C) Ein Praktikum finden", "D) Einen Kurs belegen"],
     "correct_answer": "B", "explanation": "'Platz im Studentenwohnheim bewerben' = apply for student housing."},
]

# ══════════════════════════════════════════════════════════
# POSTGRESQL: Marketplace Service Providers
# ══════════════════════════════════════════════════════════

SERVICE_PROVIDERS = [
    # Translators
    {"name": "Cabinet Benani Traductions", "category": "translator", "city": "Casablanca", "phone": "+212 522-987654",
     "email": "contact@benani-trad.ma", "languages": ["ar", "fr", "en"], "price_description": "350-500 MAD/page",
     "turnaround_days": 3, "rating": Decimal("4.80"), "total_reviews": 203, "is_verified": True},
    {"name": "Traductions El Fassi", "category": "translator", "city": "Rabat", "phone": "+212 537-123456",
     "email": "elfassi.trad@gmail.com", "languages": ["ar", "fr"], "price_description": "300-450 MAD/page",
     "turnaround_days": 2, "rating": Decimal("4.70"), "total_reviews": 156, "is_verified": True},
    {"name": "Quick Translate Marrakech", "category": "translator", "city": "Marrakech", "phone": "+212 524-567890",
     "email": "quicktrad@outlook.com", "languages": ["ar", "fr", "en", "es"], "price_description": "400-600 MAD/page",
     "turnaround_days": 1, "rating": Decimal("4.60"), "total_reviews": 89, "is_verified": True},
    {"name": "Assermenté Express", "category": "translator", "city": "Casablanca", "phone": "+212 522-111222",
     "email": "express@trad.ma", "languages": ["ar", "fr", "en", "de"], "price_description": "500-700 MAD/page",
     "turnaround_days": 1, "rating": Decimal("4.90"), "total_reviews": 312, "is_verified": True},
    # Legalization
    {"name": "MAE Apostille Service", "category": "legalization", "city": "Rabat", "phone": "+212 537-654321",
     "email": "apostille@maeservice.ma", "languages": ["ar", "fr"], "price_description": "200-400 MAD/document",
     "turnaround_days": 5, "rating": Decimal("4.50"), "total_reviews": 98, "is_verified": True},
    {"name": "Legal Docs Express", "category": "legalization", "city": "Casablanca", "phone": "+212 522-333444",
     "email": "legaldocs@gmail.com", "languages": ["ar", "fr", "en"], "price_description": "300-500 MAD",
     "turnaround_days": 3, "rating": Decimal("4.40"), "total_reviews": 67, "is_verified": False},
    {"name": "Consulat Assist", "category": "legalization", "city": "Rabat", "phone": "+212 537-999888",
     "email": "assist@consulat.ma", "languages": ["ar", "fr"], "price_description": "500-1000 MAD",
     "turnaround_days": 7, "rating": Decimal("4.30"), "total_reviews": 45, "is_verified": True},
    # Exam Help
    {"name": "British Council Casablanca", "category": "exam_help", "city": "Casablanca", "phone": "+212 522-221133",
     "email": "info@britishcouncil.ma", "languages": ["en", "fr"], "price_description": "5000-8000 MAD/session",
     "turnaround_days": None, "rating": Decimal("4.90"), "total_reviews": 445, "is_verified": True},
    {"name": "Institut Français Rabat", "category": "exam_help", "city": "Rabat", "phone": "+212 537-445566",
     "email": "contact@if-rabat.ma", "languages": ["fr"], "price_description": "3000-6000 MAD/trimestre",
     "turnaround_days": None, "rating": Decimal("4.80"), "total_reviews": 567, "is_verified": True},
    {"name": "IELTS Prep Academy", "category": "exam_help", "city": "Marrakech", "phone": "+212 524-778899",
     "email": "prep@ieltsmarrakech.com", "languages": ["en", "fr", "ar"], "price_description": "4000 MAD/mois",
     "turnaround_days": None, "rating": Decimal("4.60"), "total_reviews": 123, "is_verified": False},
    # Photo
    {"name": "Photo Studio Visa", "category": "photo", "city": "Casablanca", "phone": "+212 522-556677",
     "email": "visa@photostudio.ma", "languages": ["ar", "fr"], "price_description": "50-100 MAD",
     "turnaround_days": 0, "rating": Decimal("4.70"), "total_reviews": 890, "is_verified": True},
    {"name": "Express Photos Rabat", "category": "photo", "city": "Rabat", "phone": "+212 537-112233",
     "email": "photos@express.ma", "languages": ["ar", "fr"], "price_description": "60-80 MAD",
     "turnaround_days": 0, "rating": Decimal("4.50"), "total_reviews": 456, "is_verified": True},
    {"name": "Photo OFII Format", "category": "photo", "city": "Casablanca", "phone": "+212 522-998877",
     "email": "ofii@photoformat.ma", "languages": ["ar", "fr", "en"], "price_description": "80-120 MAD (OFII spec)",
     "turnaround_days": 0, "rating": Decimal("4.80"), "total_reviews": 234, "is_verified": True},
    # Medical
    {"name": "Centre Médical Voyage", "category": "medical", "city": "Casablanca", "phone": "+212 522-445566",
     "email": "voyage@centremedical.ma", "languages": ["ar", "fr", "en"], "price_description": "500-1500 MAD",
     "turnaround_days": 1, "rating": Decimal("4.60"), "total_reviews": 178, "is_verified": True},
    {"name": "Clinique Vaccination Rabat", "category": "medical", "city": "Rabat", "phone": "+212 537-667788",
     "email": "vaccin@clinique.ma", "languages": ["ar", "fr"], "price_description": "300-800 MAD",
     "turnaround_days": 1, "rating": Decimal("4.40"), "total_reviews": 89, "is_verified": True},
    {"name": "Dr. Amrani — Certificats Médicaux", "category": "medical", "city": "Marrakech", "phone": "+212 524-112233",
     "email": "dr.amrani@gmail.com", "languages": ["ar", "fr", "en"], "price_description": "400 MAD/consultation",
     "turnaround_days": 1, "rating": Decimal("4.70"), "total_reviews": 56, "is_verified": False},
    # Tutors
    {"name": "Cours Particuliers Excellence", "category": "tutor", "city": "Casablanca", "phone": "+212 661-223344",
     "email": "excellence@cours.ma", "languages": ["ar", "fr", "en"], "price_description": "200-350 MAD/heure",
     "turnaround_days": None, "rating": Decimal("4.80"), "total_reviews": 342, "is_verified": True},
    {"name": "Prof Maths BAC", "category": "tutor", "city": "Rabat", "phone": "+212 662-334455",
     "email": "mathsbac@tuteur.ma", "languages": ["ar", "fr"], "price_description": "150-250 MAD/heure",
     "turnaround_days": None, "rating": Decimal("4.90"), "total_reviews": 567, "is_verified": True},
    {"name": "Soutien Scolaire Plus", "category": "tutor", "city": "Marrakech", "phone": "+212 663-445566",
     "email": "soutien@plus.ma", "languages": ["ar", "fr"], "price_description": "100-200 MAD/heure",
     "turnaround_days": None, "rating": Decimal("4.50"), "total_reviews": 123, "is_verified": False},
    # Blocked Account
    {"name": "Fintiba Maroc Agent", "category": "blocked_acct", "city": "Casablanca", "phone": "+212 661-556677",
     "email": "maroc@fintiba-agent.com", "languages": ["ar", "fr", "en", "de"], "price_description": "500 MAD (aide ouverture)",
     "turnaround_days": 3, "rating": Decimal("4.70"), "total_reviews": 189, "is_verified": True},
    {"name": "Expatrio Helper MA", "category": "blocked_acct", "city": "Rabat", "phone": "+212 662-667788",
     "email": "helper@expatrio-ma.com", "languages": ["ar", "fr", "en", "de"], "price_description": "400 MAD",
     "turnaround_days": 5, "rating": Decimal("4.50"), "total_reviews": 67, "is_verified": False},
    {"name": "Sperrkonto Express", "category": "blocked_acct", "city": "Casablanca", "phone": "+212 661-778899",
     "email": "express@sperrkonto.ma", "languages": ["ar", "fr", "de"], "price_description": "600 MAD (fast track)",
     "turnaround_days": 2, "rating": Decimal("4.80"), "total_reviews": 98, "is_verified": True},
    # Insurance
    {"name": "Globe Partner Maroc", "category": "insurance", "city": "Casablanca", "phone": "+212 522-889900",
     "email": "maroc@globepartner.com", "languages": ["fr", "en"], "price_description": "2400-4800 MAD/an",
     "turnaround_days": 1, "rating": Decimal("4.60"), "total_reviews": 234, "is_verified": True},
    {"name": "ACS Assurance Étudiante", "category": "insurance", "city": "Rabat", "phone": "+212 537-990011",
     "email": "etudiant@acs.ma", "languages": ["fr", "en", "ar"], "price_description": "2000-3600 MAD/an",
     "turnaround_days": 1, "rating": Decimal("4.50"), "total_reviews": 156, "is_verified": True},
    {"name": "LMDE Info Maroc", "category": "insurance", "city": "Casablanca", "phone": "+212 661-001122",
     "email": "info@lmde-maroc.com", "languages": ["fr"], "price_description": "Gratuit (étudiant en France)",
     "turnaround_days": 0, "rating": Decimal("4.30"), "total_reviews": 89, "is_verified": False},
]

# ══════════════════════════════════════════════════════════
# POSTGRESQL: Mentors (need user_ids)
# ══════════════════════════════════════════════════════════

MENTOR_DATA = [
    # France
    {"full_name": "Youssef Bennani", "email": "youssef.b@mentor.fd", "country_code": "FR", "city": "Lyon",
     "university": "INSA Lyon", "field": "Engineering", "arrival_year": 2022,
     "specialties": ["Campus France", "Visa", "Housing"], "bio": "Étudiant en 3ème année génie civil. Prêt à aider!",
     "rating": Decimal("4.80"), "total_mentees": 12},
    {"full_name": "Salma Rahmani", "email": "salma.r@mentor.fd", "country_code": "FR", "city": "Paris",
     "university": "Sorbonne Université", "field": "Sciences", "arrival_year": 2021,
     "specialties": ["TCF Prep", "Scholarship", "Student Life"], "bio": "Master 2 en biochimie. La France est accessible!",
     "rating": Decimal("4.90"), "total_mentees": 18},
    {"full_name": "Amine Lahlou", "email": "amine.l@mentor.fd", "country_code": "FR", "city": "Toulouse",
     "university": "INSA Toulouse", "field": "Aerospace", "arrival_year": 2023,
     "specialties": ["Engineering Schools", "CROUS", "Part-time Jobs"], "bio": "Ingénieur en aéronautique. Posez vos questions!",
     "rating": Decimal("4.70"), "total_mentees": 8},
    {"full_name": "Fatima Zahra El Alami", "email": "fatima.z@mentor.fd", "country_code": "FR", "city": "Paris",
     "university": "HEC Paris", "field": "Business", "arrival_year": 2022,
     "specialties": ["Business School", "Internships", "Networking"], "bio": "MBA candidate. Le réseau fait tout!",
     "rating": Decimal("4.90"), "total_mentees": 15},
    {"full_name": "Karim Idrissi", "email": "karim.i@mentor.fd", "country_code": "FR", "city": "Lyon",
     "university": "Université Lyon 1", "field": "Computer Science", "arrival_year": 2021,
     "specialties": ["Tech Jobs", "French CV", "Coding Bootcamps"], "bio": "Dev fullstack freelance + étudiant. Ask me anything!",
     "rating": Decimal("4.60"), "total_mentees": 22},
    # Canada
    {"full_name": "Omar Mansouri", "email": "omar.m@mentor.fd", "country_code": "CA", "city": "Montréal",
     "university": "Université de Montréal", "field": "Computer Science", "arrival_year": 2022,
     "specialties": ["CAQ", "Study Permit", "COL Montréal"], "bio": "MSc Info à UdeM. Le Québec, c'est chez nous!",
     "rating": Decimal("4.80"), "total_mentees": 14},
    {"full_name": "Nadia Hajji", "email": "nadia.h@mentor.fd", "country_code": "CA", "city": "Toronto",
     "university": "University of Toronto", "field": "Engineering", "arrival_year": 2021,
     "specialties": ["Ontario Universities", "Scholarships", "Co-op"], "bio": "PhD candidate in Electrical Engineering.",
     "rating": Decimal("4.70"), "total_mentees": 9},
    {"full_name": "Hamza Tazi", "email": "hamza.t@mentor.fd", "country_code": "CA", "city": "Montréal",
     "university": "McGill University", "field": "Medicine", "arrival_year": 2020,
     "specialties": ["Medical Studies Abroad", "MCAT", "Residency"], "bio": "Résident en médecine à McGill.",
     "rating": Decimal("4.90"), "total_mentees": 6},
    # Germany
    {"full_name": "Rachid Benali", "email": "rachid.b@mentor.fd", "country_code": "DE", "city": "Munich",
     "university": "TU München", "field": "Engineering", "arrival_year": 2022,
     "specialties": ["Sperrkonto", "Studienkolleg", "German Basics"], "bio": "Master Data Science à TUM. Willkommen!",
     "rating": Decimal("4.70"), "total_mentees": 11},
    {"full_name": "Meryem Alaoui", "email": "meryem.a@mentor.fd", "country_code": "DE", "city": "Berlin",
     "university": "Freie Universität Berlin", "field": "Data Science", "arrival_year": 2023,
     "specialties": ["Berlin Life", "Anmeldung", "Health Insurance"], "bio": "Étudiante en Master informatique. Berlin is amazing!",
     "rating": Decimal("4.60"), "total_mentees": 7},
    {"full_name": "Zakaria Moussaoui", "email": "zakaria.m@mentor.fd", "country_code": "DE", "city": "Munich",
     "university": "LMU München", "field": "Engineering", "arrival_year": 2021,
     "specialties": ["DAAD Scholarship", "TestDaF", "Working Student"], "bio": "Ingénieur mécanique chez BMW + étudiant.",
     "rating": Decimal("4.80"), "total_mentees": 13},
    # UK
    {"full_name": "Layla Chraibi", "email": "layla.c@mentor.fd", "country_code": "GB", "city": "London",
     "university": "King's College London", "field": "Law", "arrival_year": 2022,
     "specialties": ["UCAS", "Student Visa UK", "London Life"], "bio": "LLM International Law. London calling!",
     "rating": Decimal("4.80"), "total_mentees": 10},
    {"full_name": "Mehdi Bouazza", "email": "mehdi.b@mentor.fd", "country_code": "GB", "city": "Manchester",
     "university": "University of Manchester", "field": "Business", "arrival_year": 2023,
     "specialties": ["MBA", "IELTS", "Part-time Work"], "bio": "MSc Finance. Manchester is underrated!",
     "rating": Decimal("4.50"), "total_mentees": 5},
    # Turkey
    {"full_name": "Sara Kettani", "email": "sara.k@mentor.fd", "country_code": "TR", "city": "Istanbul",
     "university": "Istanbul Technical University", "field": "Engineering", "arrival_year": 2022,
     "specialties": ["Türkiye Bursları", "TÖMER", "Istanbul Life"], "bio": "Boursière turque en génie civil. Hoş geldiniz!",
     "rating": Decimal("4.90"), "total_mentees": 16},
    {"full_name": "Imane Berrada", "email": "imane.b@mentor.fd", "country_code": "TR", "city": "Ankara",
     "university": "METU", "field": "Medicine", "arrival_year": 2021,
     "specialties": ["Turkish Scholarship", "Medical Studies", "Ankara Tips"], "bio": "Étudiante en médecine à METU.",
     "rating": Decimal("4.70"), "total_mentees": 8},
]


# ══════════════════════════════════════════════════════════
# MAIN SEED FUNCTION
# ══════════════════════════════════════════════════════════

async def seed_all():
    print("🚀 Starting complete data seed...\n")

    # ── 1. MongoDB: Career Paths ──
    career_count = await mongo_db.career_paths.count_documents({})
    if career_count < 5:
        for cp in CAREER_PATHS:
            cp["created_at"] = datetime.now(timezone.utc)
        await mongo_db.career_paths.insert_many(CAREER_PATHS)
        print(f"  ✅ {len(CAREER_PATHS)} career paths inserted to MongoDB")
    else:
        print(f"  ⚠️  Career paths already exist ({career_count}), skipping")

    # ── 2. MongoDB: Extra Questions ──
    q_count = await mongo_db.questions.count_documents({"exam_code": "bac_sciences"})
    if q_count < 2:
        for q in EXTRA_QUESTIONS:
            q["created_at"] = datetime.now(timezone.utc)
            q["status"] = "active"
            q["ai_generated"] = False
        await mongo_db.questions.insert_many(EXTRA_QUESTIONS)
        print(f"  ✅ {len(EXTRA_QUESTIONS)} extra questions inserted (BAC, DELF, TestDaF)")
    else:
        print(f"  ⚠️  Extra questions already exist ({q_count}), skipping")

    # ── 3. PostgreSQL: Marketplace Providers ──
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(func.count()).select_from(ServiceProvider))
        provider_count = result.scalar() or 0
        if provider_count < 5:
            for sp_data in SERVICE_PROVIDERS:
                sp = ServiceProvider(**sp_data)
                session.add(sp)
            await session.commit()
            print(f"  ✅ {len(SERVICE_PROVIDERS)} marketplace providers inserted to PostgreSQL")
        else:
            print(f"  ⚠️  Providers already exist ({provider_count}), skipping")

    # ── 4. PostgreSQL: Mentors ──
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(func.count()).select_from(Mentor))
        mentor_count = result.scalar() or 0
        if mentor_count < 5:
            for md in MENTOR_DATA:
                # Create user first
                user = User(
                    full_name=md["full_name"],
                    email=md["email"],
                    hashed_password="$2b$12$placeholder_hash_unused",
                    role="student",
                )
                session.add(user)
                await session.flush()  # Get user.id

                mentor = Mentor(
                    user_id=user.id,
                    country_code=md["country_code"],
                    city=md["city"],
                    university=md["university"],
                    field=md["field"],
                    arrival_year=md["arrival_year"],
                    specialties=md["specialties"],
                    bio=md["bio"],
                    is_verified=True,
                    rating=md["rating"],
                    total_mentees=md["total_mentees"],
                    is_active=True,
                )
                session.add(mentor)
            await session.commit()
            print(f"  ✅ {len(MENTOR_DATA)} mentors + users inserted to PostgreSQL")
        else:
            print(f"  ⚠️  Mentors already exist ({mentor_count}), skipping")

    # ── 5. Run existing content seed ──
    from seed_content import seed_content
    await seed_content()

    print("\n🟢 All data seeded successfully!")
    total_q = await mongo_db.questions.count_documents({})
    total_c = await mongo_db.career_paths.count_documents({})
    print(f"   MongoDB: {total_q} questions, {total_c} career paths")
    async with AsyncSessionLocal() as session:
        sp_c = (await session.execute(select(func.count()).select_from(ServiceProvider))).scalar()
        m_c = (await session.execute(select(func.count()).select_from(Mentor))).scalar()
        print(f"   PostgreSQL: {sp_c} providers, {m_c} mentors")


if __name__ == "__main__":
    asyncio.run(seed_all())
