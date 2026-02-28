"""
Financial Planning router — spec section 10.6
Budget calculation based on country/city cost data.
"""

from fastapi import APIRouter
from app.schemas.financial import (
    BudgetRequest, BudgetResponse, BudgetItem,
    BudgetCompareRequest, BudgetCompareResponse,
)

router = APIRouter(prefix="/api/financial", tags=["Financial"])

# Cost data per country (yearly in MAD) — real averages for Moroccan students
COUNTRY_COSTS = {
    "FR": {
        "name": "France", "currency": "EUR", "rate": 10.8,
        "tuition_public": 2700, "tuition_private": 70000,
        "rent_avg": 48000, "food": 24000, "transport": 4200,
        "insurance": 2500, "visa": 5000, "exam_tcf": 1500,
        "flight": 4000, "misc": 12000,
    },
    "CA": {
        "name": "Canada", "currency": "CAD", "rate": 7.4,
        "tuition_public": 150000, "tuition_private": 200000,
        "rent_avg": 72000, "food": 30000, "transport": 6000,
        "insurance": 6500, "visa": 8000, "exam_ielts": 3200,
        "flight": 8000, "misc": 15000,
    },
    "DE": {
        "name": "Germany", "currency": "EUR", "rate": 10.8,
        "tuition_public": 3000, "tuition_private": 60000,
        "rent_avg": 42000, "food": 24000, "transport": 4500,
        "insurance": 10000, "visa": 5500, "exam_testdaf": 2000,
        "flight": 5000, "misc": 10000,
    },
    "UK": {
        "name": "United Kingdom", "currency": "GBP", "rate": 12.7,
        "tuition_public": 180000, "tuition_private": 250000,
        "rent_avg": 84000, "food": 30000, "transport": 7000,
        "insurance": 5000, "visa": 8500, "exam_ielts": 3200,
        "flight": 5000, "misc": 15000,
    },
    "ES": {
        "name": "Spain", "currency": "EUR", "rate": 10.8,
        "tuition_public": 10000, "tuition_private": 50000,
        "rent_avg": 36000, "food": 20000, "transport": 3600,
        "insurance": 3000, "visa": 4500, "exam_dele": 2000,
        "flight": 3500, "misc": 8000,
    },
    "MA": {
        "name": "Morocco", "currency": "MAD", "rate": 1.0,
        "tuition_public": 0, "tuition_private": 50000,
        "rent_avg": 18000, "food": 12000, "transport": 2400,
        "insurance": 0, "visa": 0, "exam_tcf": 0,
        "flight": 0, "misc": 6000,
    },
}


def _calculate_budget(country_code: str, program_type: str = None, include_visa: bool = True, include_insurance: bool = True, include_exams: bool = True) -> BudgetResponse:
    costs = COUNTRY_COSTS.get(country_code.upper())
    if not costs:
        return BudgetResponse(
            country_code=country_code, items=[], total_yearly_mad=0, total_monthly_mad=0,
        )

    items = []

    # Frais de scolarité
    tuition = costs["tuition_public"]
    items.append(BudgetItem(category="tuition", label="Frais de scolarité (université publique)", amount_mad=tuition))

    # Loyer
    items.append(BudgetItem(category="housing", label="Loyer (moyenne)", amount_mad=costs["rent_avg"]))

    # Alimentation
    items.append(BudgetItem(category="living", label="Alimentation & courses", amount_mad=costs["food"]))

    # Transport
    items.append(BudgetItem(category="living", label="Transport", amount_mad=costs["transport"]))

    # Assurance
    if include_insurance and costs.get("insurance"):
        items.append(BudgetItem(category="admin", label="Assurance santé", amount_mad=costs["insurance"]))

    # Visa
    if include_visa and costs.get("visa"):
        items.append(BudgetItem(category="admin", label="Visa & frais administratifs", amount_mad=costs["visa"]))

    # Examens
    exam_keys = [k for k in costs if k.startswith("exam_")]
    if include_exams and exam_keys:
        for ek in exam_keys:
            exam_name = ek.replace("exam_", "").upper()
            if costs[ek] > 0:
                items.append(BudgetItem(category="exam", label=f"Examen {exam_name}", amount_mad=costs[ek]))

    # Vol aller-retour
    if costs.get("flight"):
        items.append(BudgetItem(category="travel", label="Vol aller-retour (Maroc)", amount_mad=costs["flight"]))

    # Divers
    items.append(BudgetItem(category="misc", label="Divers & imprévus", amount_mad=costs.get("misc", 0)))

    total = sum(i.amount_mad for i in items)

    return BudgetResponse(
        country_code=country_code,
        items=items,
        total_yearly_mad=total,
        total_monthly_mad=total // 12,
        currency_rate=costs["rate"],
        currency_code=costs["currency"],
        total_yearly_foreign=int(total / costs["rate"]) if costs["rate"] > 0 else None,
    )


@router.post("/budget", response_model=BudgetResponse)
async def calculate_budget(data: BudgetRequest):
    """Calculate estimated budget for studying in a country."""
    return _calculate_budget(
        data.country_code,
        data.program_type,
        data.include_visa,
        data.include_insurance,
        data.include_exams,
    )


@router.post("/compare", response_model=BudgetCompareResponse)
async def compare_budgets(data: BudgetCompareRequest):
    """Compare budgets across multiple countries."""
    comparisons = [
        _calculate_budget(c, data.program_type) for c in data.countries
    ]
    return BudgetCompareResponse(comparisons=comparisons)


@router.get("/proof-templates")
async def get_proof_templates():
    """Budget justification templates per country."""
    return {
        "templates": [
            {"country": "FR", "name": "Attestation de ressources financières", "type": "blocked_account", "min_amount_eur": 7380},
            {"country": "CA", "name": "Proof of financial support", "type": "bank_statement", "min_amount_cad": 20635},
            {"country": "DE", "name": "Finanzierungsnachweis", "type": "blocked_account", "min_amount_eur": 11208},
            {"country": "UK", "name": "Financial evidence", "type": "bank_statement", "min_amount_gbp": 12006},
        ]
    }
