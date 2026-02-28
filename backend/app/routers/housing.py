"""
Housing router — City guides, cost of living, and housing tips.
Moroccan-focused advice for student housing. MongoDB-backed with static fallback.
"""

from fastapi import APIRouter, HTTPException
from app.core.database import mongo_db

router = APIRouter(prefix="/api/housing", tags=["Housing"])

# ── Static Fallback City Guides ──────────────────────────

CITY_GUIDES_FALLBACK = {
    "FR": [
        {
            "city": "Paris", "country_code": "FR",
            "rent_avg_mad": 7500, "rent_range_fr": "5 000 – 12 000 MAD/mois", "rent_range_en": "5,000 – 12,000 MAD/month",
            "transport_mad": 380, "food_mad": 3000,
            "tips_fr": "Demandez le CROUS et la CAF dès l'arrivée. Cherchez sur LeBonCoin et Studapart.",
            "tips_en": "Apply for CROUS and CAF upon arrival. Search on LeBonCoin and Studapart.",
            "neighborhoods_fr": ["5ème (Quartier Latin)", "13ème (bon rapport qualité-prix)", "Banlieue sud (Ivry, Cachan)"],
            "neighborhoods_en": ["5th (Latin Quarter)", "13th (good value)", "Southern suburbs (Ivry, Cachan)"],
        },
        {
            "city": "Lyon", "country_code": "FR",
            "rent_avg_mad": 5500, "rent_range_fr": "3 500 – 7 500 MAD/mois", "rent_range_en": "3,500 – 7,500 MAD/month",
            "transport_mad": 300, "food_mad": 2500,
            "tips_fr": "Lyon est très abordable. Le TCL (transport) est excellent. Beaucoup de Marocains.",
            "tips_en": "Lyon is very affordable. TCL (transit) is excellent. Large Moroccan community.",
            "neighborhoods_fr": ["Presqu'île", "7ème", "Villeurbanne"],
            "neighborhoods_en": ["Presqu'île", "7th", "Villeurbanne"],
        },
        {
            "city": "Toulouse", "country_code": "FR",
            "rent_avg_mad": 4800, "rent_range_fr": "3 000 – 6 500 MAD/mois", "rent_range_en": "3,000 – 6,500 MAD/month",
            "transport_mad": 250, "food_mad": 2200,
            "tips_fr": "Ville étudiante par excellence. Métro + bus couvrent tout. Chercher autour des campus.",
            "tips_en": "Student city par excellence. Metro + bus cover everything. Search around campuses.",
            "neighborhoods_fr": ["Capitole", "Saint-Cyprien", "Rangueil"],
            "neighborhoods_en": ["Capitole", "Saint-Cyprien", "Rangueil"],
        },
    ],
    "CA": [
        {
            "city": "Montréal", "country_code": "CA",
            "rent_avg_mad": 7000, "rent_range_fr": "5 000 – 10 000 MAD/mois", "rent_range_en": "5,000 – 10,000 MAD/month",
            "transport_mad": 500, "food_mad": 3500,
            "tips_fr": "Francophone, grande communauté marocaine. Cherchez sur Kijiji et Facebook Marketplace.",
            "tips_en": "Francophone, large Moroccan community. Search on Kijiji and Facebook Marketplace.",
            "neighborhoods_fr": ["Plateau Mont-Royal", "Côte-des-Neiges", "Villeray"],
            "neighborhoods_en": ["Plateau Mont-Royal", "Côte-des-Neiges", "Villeray"],
        },
        {
            "city": "Toronto", "country_code": "CA",
            "rent_avg_mad": 12000, "rent_range_fr": "8 000 – 18 000 MAD/mois", "rent_range_en": "8,000 – 18,000 MAD/month",
            "transport_mad": 700, "food_mad": 4000,
            "tips_fr": "Cher mais multiculturel. Colocation recommandée. TTC pass étudiant disponible.",
            "tips_en": "Expensive but multicultural. Roommates recommended. TTC student pass available.",
            "neighborhoods_fr": ["Downtown", "North York", "Scarborough"],
            "neighborhoods_en": ["Downtown", "North York", "Scarborough"],
        },
    ],
    "DE": [
        {
            "city": "Munich", "country_code": "DE",
            "rent_avg_mad": 8000, "rent_range_fr": "5 500 – 12 000 MAD/mois", "rent_range_en": "5,500 – 12,000 MAD/month",
            "transport_mad": 450, "food_mad": 3000,
            "tips_fr": "Cherchez tôt ! Studentenwerk pour résidences. WG-Gesucht pour colocations.",
            "tips_en": "Search early! Studentenwerk for dorms. WG-Gesucht for shared apartments.",
            "neighborhoods_fr": ["Schwabing", "Maxvorstadt", "Sendling"],
            "neighborhoods_en": ["Schwabing", "Maxvorstadt", "Sendling"],
        },
        {
            "city": "Berlin", "country_code": "DE",
            "rent_avg_mad": 6000, "rent_range_fr": "4 000 – 9 000 MAD/mois", "rent_range_en": "4,000 – 9,000 MAD/month",
            "transport_mad": 350, "food_mad": 2500,
            "tips_fr": "Ville la plus abordable d'Allemagne. WG-Gesucht est indispensable.",
            "tips_en": "Most affordable German city. WG-Gesucht is essential.",
            "neighborhoods_fr": ["Kreuzberg", "Neukölln", "Wedding"],
            "neighborhoods_en": ["Kreuzberg", "Neukölln", "Wedding"],
        },
    ],
    "UK": [
        {
            "city": "London", "country_code": "UK",
            "rent_avg_mad": 14000, "rent_range_fr": "10 000 – 20 000 MAD/mois", "rent_range_en": "10,000 – 20,000 MAD/month",
            "transport_mad": 800, "food_mad": 4000,
            "tips_fr": "Très cher. Zone 3-4 recommandée. Oyster card avec réduction étudiante.",
            "tips_en": "Very expensive. Zone 3-4 recommended. Oyster card with student discount.",
            "neighborhoods_fr": ["Zone 1-2 (cher)", "Zone 3-4 (modéré)", "Est de Londres (value)"],
            "neighborhoods_en": ["Zone 1-2 (expensive)", "Zone 3-4 (moderate)", "East London (value)"],
        },
    ],
    "TR": [
        {
            "city": "Istanbul", "country_code": "TR",
            "rent_avg_mad": 4000, "rent_range_fr": "2 500 – 6 000 MAD/mois", "rent_range_en": "2,500 – 6,000 MAD/month",
            "transport_mad": 200, "food_mad": 1500,
            "tips_fr": "Très abordable. Communauté marocaine croissante. Chercher sur sahibinden.com.",
            "tips_en": "Very affordable. Growing Moroccan community. Search on sahibinden.com.",
            "neighborhoods_fr": ["Fatih", "Beyazıt", "Kadıköy"],
            "neighborhoods_en": ["Fatih", "Beyazıt", "Kadıköy"],
        },
    ],
}


# ── Helpers ───────────────────────────────────────────────

async def _get_guides(country_code: str = None):
    query = {"country_code": country_code.upper()} if country_code else {}
    docs = await mongo_db.housing_guides.find(query).to_list(50)
    if docs:
        for d in docs:
            d.pop("_id", None)
        return docs
    if country_code:
        return CITY_GUIDES_FALLBACK.get(country_code.upper(), [])
    # Return all
    all_guides = []
    for guides in CITY_GUIDES_FALLBACK.values():
        all_guides.extend(guides)
    return all_guides


# ── Endpoints ────────────────────────────────────────────

@router.get("/cities")
async def list_cities():
    """List all city guides grouped by country."""
    all_guides = await _get_guides()
    grouped = {}
    for g in all_guides:
        cc = g.get("country_code", "??")
        grouped.setdefault(cc, []).append(g)
    return {"countries": grouped, "total_cities": len(all_guides)}


@router.get("/cities/{country_code}")
async def get_country_cities(country_code: str):
    """Get city guides for a specific country."""
    guides = await _get_guides(country_code)
    if not guides:
        raise HTTPException(404, f"No housing guides for {country_code}")
    return {"country_code": country_code.upper(), "cities": guides, "total": len(guides)}


@router.get("/cities/{country_code}/{city_name}")
async def get_city_guide(country_code: str, city_name: str):
    """Get detailed city guide."""
    guides = await _get_guides(country_code)
    for g in guides:
        if g.get("city", "").lower() == city_name.lower():
            return g
    raise HTTPException(404, f"City guide not found for {city_name}")
