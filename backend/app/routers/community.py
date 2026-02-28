"""
Community Hub router — Social feed, groups, and success stories.
Moroccan student community with trending topics and peer support.
Reads from MongoDB with fallback to static content.
"""

from fastapi import APIRouter
from app.core.database import mongo_db

router = APIRouter(prefix="/api/community", tags=["Community"])

# ── Static Fallback Data ─────────────────────────────────

TRENDING_FALLBACK = [
    {"tag": "#BourseMaroc", "posts_count": 2400, "trend": "up"},
    {"tag": "#CampusFrance", "posts_count": 1800, "trend": "up"},
    {"tag": "#ConseilsÉtudes", "posts_count": 956, "trend": "stable"},
    {"tag": "#StressBac", "posts_count": 802, "trend": "up"},
    {"tag": "#IELTS", "posts_count": 650, "trend": "up"},
    {"tag": "#VisaFrance", "posts_count": 520, "trend": "stable"},
]

POSTS_FALLBACK = [
    {
        "id": "p1", "author": "Yassine K.",
        "role_fr": "Étudiant en Licence", "role_en": "Undergraduate Student",
        "avatar_initial": "Y", "time_fr": "Il y a 2h", "time_en": "2 hours ago",
        "title_fr": "Besoin d'aide en Maths ! 🆘", "title_en": "Calculus Help Needed! 🆘",
        "content_fr": "Quelqu'un peut m'expliquer les intégrales doubles ? J'y comprends rien avec le cours du prof.",
        "content_en": "Can someone explain double integrals? I don't understand the professor's lecture at all.",
        "tags": ["#Maths", "#Aide"], "likes": 45, "comments": 12,
    },
    {
        "id": "p2", "author": "Fatima Z.",
        "role_fr": "Acceptée à Sciences Po", "role_en": "Accepted at Sciences Po",
        "avatar_initial": "F", "time_fr": "Il y a 5h", "time_en": "5 hours ago",
        "title_fr": "J'AI ÉTÉ ACCEPTÉE ! 🎉🎉🎉", "title_en": "I GOT ACCEPTED! 🎉🎉🎉",
        "content_fr": "Après 6 mois de préparation, j'ai reçu mon acceptation de Sciences Po Paris ! Hamdolilah !",
        "content_en": "After 6 months of preparation, I received my acceptance from Sciences Po Paris! Alhamdulillah!",
        "tags": ["#Acceptation", "#SciencesPo"], "likes": 156, "comments": 42,
        "image": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
    },
    {
        "id": "p3", "author": "Omar B.",
        "role_fr": "Étudiant en Master (Canada)", "role_en": "Master's Student (Canada)",
        "avatar_initial": "O", "time_fr": "Il y a 1 jour", "time_en": "1 day ago",
        "title_fr": "Guide complet : Comment j'ai eu mon permis d'études canadien 🇨🇦",
        "title_en": "Full Guide: How I Got My Canadian Study Permit 🇨🇦",
        "content_fr": "Voici étape par étape comment j'ai constitué mon dossier. Délai total : 3 mois depuis le Maroc.",
        "content_en": "Here's step by step how I prepared my application. Total timeline: 3 months from Morocco.",
        "tags": ["#Canada", "#PermisÉtudes", "#Guide"], "likes": 234, "comments": 67,
    },
    {
        "id": "p4", "author": "Amina R.",
        "role_fr": "Préparant le BAC Sciences", "role_en": "Preparing Science BAC",
        "avatar_initial": "A", "time_fr": "Il y a 3h", "time_en": "3 hours ago",
        "title_fr": "Groupe d'étude Physique-Chimie à Casa ?",
        "title_en": "Physics-Chemistry Study Group in Casa?",
        "content_fr": "Est-ce que quelqu'un à Casablanca veut former un groupe d'étude pour la physique-chimie du BAC ?",
        "content_en": "Anyone in Casablanca want to form a study group for BAC physics-chemistry?",
        "tags": ["#BAC", "#Casablanca", "#GroupeÉtude"], "likes": 28, "comments": 15,
    },
    {
        "id": "p5", "author": "Karim M.",
        "role_fr": "Ingénieur diplômé (France)", "role_en": "Engineering Graduate (France)",
        "avatar_initial": "K", "time_fr": "Il y a 2 jours", "time_en": "2 days ago",
        "title_fr": "Mon expérience Campus France : les erreurs à éviter 🚨",
        "title_en": "My Campus France Experience: Mistakes to Avoid 🚨",
        "content_fr": "Après 3 tentatives, j'ai enfin compris le système. Voici les 5 erreurs que j'ai faites.",
        "content_en": "After 3 attempts, I finally understood the system. Here are the 5 mistakes I made.",
        "tags": ["#CampusFrance", "#Erreurs", "#Conseils"], "likes": 312, "comments": 89,
    },
]

GROUPS_FALLBACK = [
    {"id": "g1", "name_fr": "Étudiants Marocains en France", "name_en": "Moroccan Students in France", "members": 12500, "icon": "🇫🇷"},
    {"id": "g2", "name_fr": "Prépa BAC Sciences", "name_en": "Science BAC Prep", "members": 8500, "icon": "🔬"},
    {"id": "g3", "name_fr": "Études au Canada", "name_en": "Study in Canada", "members": 6200, "icon": "🇨🇦"},
    {"id": "g4", "name_fr": "IELTS & TOEFL Maroc", "name_en": "IELTS & TOEFL Morocco", "members": 5100, "icon": "📝"},
    {"id": "g5", "name_fr": "Bourses & Financement", "name_en": "Scholarships & Funding", "members": 9800, "icon": "💰"},
    {"id": "g6", "name_fr": "Ingénierie & Tech", "name_en": "Engineering & Tech", "members": 4200, "icon": "⚙️"},
]

STORIES_FALLBACK = [
    {"id": "s1", "name": "Salma E.", "from_fr": "Casablanca", "to_fr": "Sorbonne Université, Paris", "to_en": "Sorbonne University, Paris", "program_fr": "Master Informatique", "program_en": "Computer Science Master's", "quote_fr": "Le TCF m'a stressée, mais la préparation sur FuturDialk a fait la différence.", "quote_en": "The TCF stressed me out, but FuturDialk prep made the difference.", "year": 2025},
    {"id": "s2", "name": "Mehdi A.", "from_fr": "Rabat", "to_fr": "McGill, Montréal", "to_en": "McGill, Montreal", "program_fr": "Génie Civil", "program_en": "Civil Engineering", "quote_fr": "J'ai obtenu la bourse MIFI grâce aux conseils de la communauté.", "quote_en": "I got the MIFI scholarship thanks to community advice.", "year": 2025},
    {"id": "s3", "name": "Nora B.", "from_fr": "Fès", "to_fr": "TU Munich", "to_en": "TU Munich", "program_fr": "Master Data Science", "program_en": "Data Science Master's", "quote_fr": "L'Allemagne est incroyable — frais quasi-nuls et excellent enseignement.", "quote_en": "Germany is incredible — near-zero tuition and excellent teaching.", "year": 2024},
]


# ── Helpers ───────────────────────────────────────────────

async def _get_posts():
    docs = await mongo_db.community_posts.find().sort("created_at", -1).to_list(50)
    if docs:
        for d in docs:
            d["id"] = str(d.pop("_id"))
        return docs
    return POSTS_FALLBACK


async def _get_groups():
    docs = await mongo_db.community_groups.find().to_list(30)
    if docs:
        for d in docs:
            d["id"] = str(d.pop("_id"))
        return docs
    return GROUPS_FALLBACK


async def _get_stories():
    docs = await mongo_db.community_stories.find().to_list(20)
    if docs:
        for d in docs:
            d["id"] = str(d.pop("_id"))
        return docs
    return STORIES_FALLBACK


async def _get_trending():
    docs = await mongo_db.community_trending.find().to_list(10)
    if docs:
        for d in docs:
            d.pop("_id", None)
        return docs
    return TRENDING_FALLBACK


# ── Endpoints ────────────────────────────────────────────

@router.get("/feed")
async def get_feed():
    """Get community feed with posts, trending, and groups."""
    posts = await _get_posts()
    trending = await _get_trending()
    groups = await _get_groups()
    return {"posts": posts, "trending": trending, "groups": groups, "total_posts": len(posts)}


@router.get("/posts")
async def list_posts():
    """List community posts."""
    posts = await _get_posts()
    return {"posts": posts, "total": len(posts)}


@router.get("/groups")
async def list_groups():
    """List community groups."""
    groups = await _get_groups()
    return {"groups": groups, "total": len(groups)}


@router.get("/stories")
async def list_stories():
    """Success stories from Moroccan students."""
    stories = await _get_stories()
    return {"stories": stories, "total": len(stories)}


@router.get("/trending")
async def get_trending():
    """Get trending topics."""
    trending = await _get_trending()
    return {"trending": trending}
