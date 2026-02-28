"""
Tawjih V4 — Content Seed Script (MongoDB)
Seeds question bank, language courses, and community content.
Run: docker compose exec backend python -m seed_content
"""
import asyncio
from datetime import datetime, timezone
from app.core.database import mongo_db

# ── IELTS Reading Questions ──────────────────────────────

IELTS_READING = [
    {
        "exam_code": "ielts_academic", "section": "reading", "difficulty": "medium",
        "passage": "The development of renewable energy has accelerated rapidly in the past decade. Solar power, in particular, has seen costs drop by over 80% since 2010, making it competitive with fossil fuels in many markets. Wind energy has similarly become more affordable, with offshore wind farms now producing electricity at costs comparable to natural gas.",
        "question_text": "By what percentage have solar power costs dropped since 2010?",
        "options": ["A) 50%", "B) 60%", "C) 80%", "D) 90%"],
        "correct_answer": "C", "explanation": "The passage states solar power costs dropped 'by over 80% since 2010'.",
    },
    {
        "exam_code": "ielts_academic", "section": "reading", "difficulty": "easy",
        "passage": "The development of renewable energy has accelerated rapidly in the past decade. Solar power, in particular, has seen costs drop by over 80% since 2010, making it competitive with fossil fuels in many markets.",
        "question_text": "What has made solar power competitive with fossil fuels?",
        "options": ["A) Government subsidies", "B) Cost reduction", "C) New technology", "D) Consumer demand"],
        "correct_answer": "B", "explanation": "The passage says costs dropping made it 'competitive with fossil fuels'.",
    },
    {
        "exam_code": "ielts_academic", "section": "reading", "difficulty": "hard",
        "passage": "Migration patterns of monarch butterflies have puzzled scientists for decades. These insects travel up to 4,800 kilometers from Canada to central Mexico each year, navigating using a combination of the sun's position and the Earth's magnetic field. Recent research suggests that a molecular compass in their antennae may play a crucial role in this navigation.",
        "question_text": "According to the passage, which of the following helps monarch butterflies navigate?",
        "options": ["A) Star patterns only", "B) Sun position and magnetic field", "C) Wind currents", "D) Temperature changes"],
        "correct_answer": "B", "explanation": "The passage states they navigate 'using a combination of the sun's position and the Earth's magnetic field'.",
    },
]

IELTS_LISTENING = [
    {
        "exam_code": "ielts_academic", "section": "listening", "difficulty": "easy",
        "question_text": "What time does the library open on weekdays?",
        "context": "Transcript: 'The university library opens at 8:30 AM on weekdays and 10 AM on weekends.'",
        "options": ["A) 8:00 AM", "B) 8:30 AM", "C) 9:00 AM", "D) 10:00 AM"],
        "correct_answer": "B", "explanation": "The speaker clearly states 'opens at 8:30 AM on weekdays'.",
    },
    {
        "exam_code": "ielts_academic", "section": "listening", "difficulty": "medium",
        "question_text": "Which floor is the science department located on?",
        "context": "Transcript: 'The science department has recently moved from the second floor to the fourth floor of the main building.'",
        "options": ["A) First floor", "B) Second floor", "C) Third floor", "D) Fourth floor"],
        "correct_answer": "D", "explanation": "The department 'moved from the second floor to the fourth floor'.",
    },
]

IELTS_WRITING = [
    {
        "exam_code": "ielts_academic", "section": "writing", "difficulty": "medium",
        "question_text": "Task 2: Some people believe that universities should focus on providing academic skills. Others think they should prepare students for employment. Discuss both views and give your opinion. Write at least 250 words.",
        "options": [], "correct_answer": "", "explanation": "Model answer evaluates both perspectives with clear thesis.",
    },
    {
        "exam_code": "ielts_academic", "section": "writing", "difficulty": "medium",
        "question_text": "Task 2: In many countries, the gap between rich and poor is increasing. What problems does this cause? What solutions can be proposed? Write at least 250 words.",
        "options": [], "correct_answer": "", "explanation": "Problem-solution essay format expected.",
    },
]

# ── TOEFL Questions ──────────────────────────────────────

TOEFL_READING = [
    {
        "exam_code": "toefl_ibt", "section": "reading", "difficulty": "medium",
        "passage": "The Industrial Revolution, which began in Britain in the late 18th century, transformed manufacturing processes. The introduction of steam power and mechanized equipment led to unprecedented increases in production efficiency. However, these changes also brought significant social upheaval, including the displacement of skilled artisans.",
        "question_text": "According to the passage, what was one negative consequence of the Industrial Revolution?",
        "options": ["A) Reduced trade", "B) Displacement of artisans", "C) Lower production", "D) Environmental laws"],
        "correct_answer": "B", "explanation": "The passage mentions 'displacement of skilled artisans' as social upheaval.",
    },
    {
        "exam_code": "toefl_ibt", "section": "reading", "difficulty": "hard",
        "passage": "Photosynthesis is the process by which green plants convert sunlight into chemical energy. This process occurs primarily in the chloroplasts of plant cells, where chlorophyll absorbs light energy. The light-dependent reactions produce ATP and NADPH, which are then used in the Calvin cycle to fix carbon dioxide into glucose.",
        "question_text": "Where do the light-dependent reactions of photosynthesis primarily occur?",
        "options": ["A) Mitochondria", "B) Cell membrane", "C) Chloroplasts", "D) Nucleus"],
        "correct_answer": "C", "explanation": "The passage states the process 'occurs primarily in the chloroplasts'.",
    },
]

# ── TCF Questions ────────────────────────────────────────

TCF_QUESTIONS = [
    {
        "exam_code": "tcf", "section": "comprehension_orale", "difficulty": "easy",
        "question_text": "Écoutez le dialogue. Où se passe la conversation ?",
        "context": "Transcription : 'Bonjour, je voudrais réserver une table pour deux personnes ce soir, s'il vous plaît.'",
        "options": ["A) À la gare", "B) Au restaurant", "C) À l'hôpital", "D) Au cinéma"],
        "correct_answer": "B", "explanation": "'Réserver une table' indique clairement un restaurant.",
    },
    {
        "exam_code": "tcf", "section": "comprehension_orale", "difficulty": "medium",
        "question_text": "Quel est le problème du locuteur ?",
        "context": "Transcription : 'Excusez-moi, mon vol a été annulé et je dois arriver à Lyon avant demain matin. Est-ce qu'il y a un train ce soir ?'",
        "options": ["A) Il a perdu ses bagages", "B) Son vol est annulé", "C) Il est malade", "D) Il a raté son train"],
        "correct_answer": "B", "explanation": "Le locuteur dit clairement 'mon vol a été annulé'.",
    },
    {
        "exam_code": "tcf", "section": "structures_langue", "difficulty": "easy",
        "question_text": "Complétez : 'Si j'avais plus de temps, je ___ plus souvent.'",
        "options": ["A) voyage", "B) voyagerais", "C) voyagerai", "D) ai voyagé"],
        "correct_answer": "B", "explanation": "Conditionnel présent avec 'si + imparfait' → voyagerais.",
    },
    {
        "exam_code": "tcf", "section": "structures_langue", "difficulty": "medium",
        "question_text": "Choisissez la forme correcte : 'Il faut que tu ___ à l'heure.'",
        "options": ["A) viens", "B) viennes", "C) viendras", "D) venais"],
        "correct_answer": "B", "explanation": "'Il faut que' exige le subjonctif → viennes.",
    },
    {
        "exam_code": "tcf", "section": "comprehension_ecrite", "difficulty": "medium",
        "question_text": "D'après le texte, quelle est la principale cause de pollution dans les villes ?",
        "context": "Texte : 'Les transports représentent la première source de pollution atmosphérique en milieu urbain, devant l'industrie et le chauffage résidentiel.'",
        "options": ["A) L'industrie", "B) Le chauffage", "C) Les transports", "D) L'agriculture"],
        "correct_answer": "C", "explanation": "'Les transports représentent la première source de pollution'.",
    },
]

# ── Language Course Content ──────────────────────────────

FRENCH_COURSES = {
    "language": "fr",
    "units": [
        {"unit": 1, "title": "Les Bases — Basics", "lessons": [
            {"lesson": 1, "title": "Salutations", "type": "vocabulary", "xp": 10},
            {"lesson": 2, "title": "Se présenter", "type": "vocabulary", "xp": 10},
            {"lesson": 3, "title": "Les nombres (1-20)", "type": "vocabulary", "xp": 10},
            {"lesson": 4, "title": "Les jours et mois", "type": "vocabulary", "xp": 15},
        ]},
        {"unit": 2, "title": "La vie quotidienne — Daily Life", "lessons": [
            {"lesson": 1, "title": "À l'université", "type": "vocabulary", "xp": 15},
            {"lesson": 2, "title": "Au café", "type": "conversation", "xp": 15},
            {"lesson": 3, "title": "Faire les courses", "type": "vocabulary", "xp": 15},
            {"lesson": 4, "title": "Les transports", "type": "vocabulary", "xp": 20},
        ]},
        {"unit": 3, "title": "Administration — Paperwork", "lessons": [
            {"lesson": 1, "title": "À la préfecture", "type": "conversation", "xp": 20},
            {"lesson": 2, "title": "Ouvrir un compte bancaire", "type": "vocabulary", "xp": 20},
            {"lesson": 3, "title": "La sécurité sociale", "type": "vocabulary", "xp": 20},
        ]},
        {"unit": 4, "title": "Logement — Housing", "lessons": [
            {"lesson": 1, "title": "Chercher un appartement", "type": "vocabulary", "xp": 25},
            {"lesson": 2, "title": "Le contrat de bail", "type": "vocabulary", "xp": 25},
            {"lesson": 3, "title": "Les voisins", "type": "conversation", "xp": 25},
        ]},
    ],
}

ENGLISH_COURSES = {
    "language": "en",
    "units": [
        {"unit": 1, "title": "Academic English — Basics", "lessons": [
            {"lesson": 1, "title": "Academic vocabulary", "type": "vocabulary", "xp": 10},
            {"lesson": 2, "title": "Essay structure", "type": "grammar", "xp": 15},
            {"lesson": 3, "title": "Formal vs informal", "type": "vocabulary", "xp": 10},
        ]},
        {"unit": 2, "title": "IELTS Preparation", "lessons": [
            {"lesson": 1, "title": "Reading strategies", "type": "skill", "xp": 20},
            {"lesson": 2, "title": "Listening techniques", "type": "skill", "xp": 20},
            {"lesson": 3, "title": "Writing Task 2 templates", "type": "grammar", "xp": 25},
            {"lesson": 4, "title": "Speaking Part 2 practice", "type": "conversation", "xp": 25},
        ]},
        {"unit": 3, "title": "University Life", "lessons": [
            {"lesson": 1, "title": "Campus vocabulary", "type": "vocabulary", "xp": 15},
            {"lesson": 2, "title": "Academic presentations", "type": "conversation", "xp": 20},
            {"lesson": 3, "title": "Email etiquette", "type": "writing", "xp": 20},
        ]},
    ],
}

FRENCH_LESSONS = [
    {"language": "fr", "unit": 1, "lesson": 1, "exercises": [
        {"type": "match", "instruction": "Match the French greeting with its meaning",
         "pairs": [["Bonjour", "Hello/Good day"], ["Bonsoir", "Good evening"], ["Salut", "Hi (informal)"], ["Au revoir", "Goodbye"]]},
        {"type": "fill", "instruction": "Complete: ___, je m'appelle Ahmed.", "answer": "Bonjour", "hint": "Formal greeting"},
        {"type": "translate", "instruction": "Translate to French: 'How are you?'", "answer": "Comment allez-vous ?", "alt": ["Comment ça va ?"]},
        {"type": "choice", "instruction": "What does 'Enchanté' mean?",
         "options": ["Nice to meet you", "Goodbye", "Thank you", "Excuse me"], "answer": 0},
    ]},
    {"language": "fr", "unit": 1, "lesson": 2, "exercises": [
        {"type": "fill", "instruction": "Complete: Je ___ marocain(e).", "answer": "suis", "hint": "Verb 'être'"},
        {"type": "translate", "instruction": "Translate: 'I am a student'", "answer": "Je suis étudiant(e)"},
        {"type": "choice", "instruction": "'J'ai vingt ans' means:",
         "options": ["I am twenty years old", "I have twenty friends", "I live in twenty cities", "I study twenty subjects"], "answer": 0},
    ]},
    {"language": "fr", "unit": 1, "lesson": 3, "exercises": [
        {"type": "match", "instruction": "Match the numbers",
         "pairs": [["un", "1"], ["cinq", "5"], ["dix", "10"], ["quinze", "15"], ["vingt", "20"]]},
        {"type": "fill", "instruction": "Write the number: 12 = ___", "answer": "douze"},
        {"type": "choice", "instruction": "What is 'seize'?",
         "options": ["14", "15", "16", "17"], "answer": 2},
    ]},
]

FRENCH_VOCAB = [
    {"language": "fr", "word": "université", "translation": "university", "example": "Je vais à l'université."},
    {"language": "fr", "word": "bibliothèque", "translation": "library", "example": "La bibliothèque est ouverte."},
    {"language": "fr", "word": "cours", "translation": "class/course", "example": "J'ai un cours de maths."},
    {"language": "fr", "word": "examen", "translation": "exam", "example": "L'examen est demain."},
    {"language": "fr", "word": "bourse", "translation": "scholarship", "example": "J'ai obtenu une bourse."},
    {"language": "fr", "word": "logement", "translation": "housing", "example": "Je cherche un logement."},
    {"language": "fr", "word": "visa", "translation": "visa", "example": "Mon visa est valide."},
    {"language": "fr", "word": "inscription", "translation": "registration", "example": "L'inscription est en ligne."},
    {"language": "fr", "word": "dossier", "translation": "file/application", "example": "Mon dossier est complet."},
    {"language": "fr", "word": "relevé de notes", "translation": "transcript", "example": "J'ai besoin de mon relevé de notes."},
    {"language": "fr", "word": "lettre de motivation", "translation": "motivation letter", "example": "J'écris ma lettre de motivation."},
    {"language": "fr", "word": "titre de séjour", "translation": "residence permit", "example": "Mon titre de séjour expire en juin."},
]

# ── Community Content ────────────────────────────────────

COMMUNITY_POSTS = [
    {
        "type": "story", "author": "Yasmine B.", "country": "FR", "university": "Sorbonne Université",
        "title": "Mon parcours Campus France depuis Casablanca",
        "content": "Après 6 mois de préparation, j'ai réussi à obtenir mon visa étudiant pour la France. Voici mes conseils : commencez tôt avec Campus France, préparez votre TCF au moins 3 mois à l'avance, et ne négligez pas la lettre de motivation. Le plus important c'est de bien choisir votre formation et de montrer un projet cohérent.",
        "likes": 47, "comments": 12, "tags": ["campus_france", "visa", "tcf"],
    },
    {
        "type": "story", "author": "Omar K.", "country": "CA", "university": "Université de Montréal",
        "title": "Étudier au Canada : guide complet pour les Marocains",
        "content": "Je suis arrivé à Montréal il y a 2 ans. Le processus est long mais faisable. Le CAQ prend environ 8 semaines, puis le permis d'études encore 12 semaines. Prévoyez un budget de 15,000 CAD pour la première année (frais + vie). La communauté marocaine à Montréal est très active et solidaire.",
        "likes": 63, "comments": 21, "tags": ["canada", "montreal", "permis_etudes"],
    },
    {
        "type": "tip", "author": "Fatima Z.", "country": "DE",
        "title": "Comment ouvrir un compte bloqué en Allemagne",
        "content": "Pour le visa étudiant allemand, vous devez déposer 11,208€ sur un compte bloqué (Sperrkonto). J'ai utilisé Expatrio, c'est le plus rapide. Le processus prend environ 3 jours ouvrables. Attention : certaines banques refusent les transferts depuis le Maroc, utilisez Western Union ou Wise.",
        "likes": 35, "comments": 8, "tags": ["allemagne", "sperrkonto", "visa"],
    },
    {
        "type": "question", "author": "Mehdi A.",
        "title": "IELTS ou TOEFL pour le Royaume-Uni ?",
        "content": "Je veux postuler à UCL et Edinburgh. Les deux acceptent IELTS et TOEFL, mais lequel est mieux pour les universités britanniques ? J'ai un niveau B2+ en anglais.",
        "likes": 12, "comments": 15, "tags": ["ielts", "toefl", "uk"],
    },
    {
        "type": "story", "author": "Khadija M.", "country": "TR", "university": "Istanbul Technical University",
        "title": "Türkiye Bursları : la bourse turque étape par étape",
        "content": "J'ai obtenu la bourse Türkiye Bursları en 2024. La candidature est 100% en ligne. Les critères : bon dossier académique (>70%), lettre de motivation convaincante, et un bon entretien. La bourse couvre tout : frais de scolarité, logement, 800-1100 TRY/mois, assurance santé, et billet d'avion.",
        "likes": 89, "comments": 34, "tags": ["turquie", "bourse", "turkiye_burslari"],
    },
]


async def seed_content():
    """Seed MongoDB with questions, language courses, vocabulary, and community content."""
    print("📚 Seeding content to MongoDB...")

    # Questions
    all_questions = IELTS_READING + IELTS_LISTENING + IELTS_WRITING + TOEFL_READING + TCF_QUESTIONS
    for q in all_questions:
        q["created_at"] = datetime.now(timezone.utc)
        q["status"] = "active"
        q["ai_generated"] = False

    existing = await mongo_db.questions.count_documents({})
    if existing < 5:
        await mongo_db.questions.insert_many(all_questions)
        print(f"  ✅ {len(all_questions)} exam questions inserted")
    else:
        print(f"  ⚠️ Questions already exist ({existing}), skipping")

    # Language courses
    for course in [FRENCH_COURSES, ENGLISH_COURSES]:
        exists = await mongo_db.language_courses.find_one({"language": course["language"]})
        if not exists:
            await mongo_db.language_courses.insert_one(course)
            print(f"  ✅ {course['language'].upper()} language course inserted")

    # Language lessons
    lesson_count = await mongo_db.language_lessons.count_documents({})
    if lesson_count < 3:
        await mongo_db.language_lessons.insert_many(FRENCH_LESSONS)
        print(f"  ✅ {len(FRENCH_LESSONS)} French lessons inserted")
    else:
        print(f"  ⚠️ Lessons already exist ({lesson_count}), skipping")

    # Vocabulary
    vocab_count = await mongo_db.vocabulary.count_documents({})
    if vocab_count < 5:
        await mongo_db.vocabulary.insert_many(FRENCH_VOCAB)
        print(f"  ✅ {len(FRENCH_VOCAB)} vocabulary cards inserted")

    # Community
    community_count = await mongo_db.community_posts.count_documents({})
    if community_count < 3:
        for p in COMMUNITY_POSTS:
            p["created_at"] = datetime.now(timezone.utc)
        await mongo_db.community_posts.insert_many(COMMUNITY_POSTS)
        print(f"  ✅ {len(COMMUNITY_POSTS)} community posts inserted")

    print("🟢 Content seed complete!")


if __name__ == "__main__":
    asyncio.run(seed_content())
