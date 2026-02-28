"""
Career Advisor router — spec section 4.6
Full MongoDB-backed implementation with career paths, market data, comparison, and ROI.
"""

from fastapi import APIRouter, HTTPException, Body
from bson import ObjectId

from app.core.database import get_mongo
from app.schemas.career import (
    CareerPathResponse, MarketSnapshotResponse,
    CompareRequest, ROIRequest, ROIResponse, DiscoverRequest,
)

router = APIRouter(prefix="/api/career", tags=["Career"])


def _career_doc_to_response(doc: dict, match_score=None, match_reason=None) -> CareerPathResponse:
    return CareerPathResponse(
        id=str(doc["_id"]),
        name=doc.get("name", ""),
        category=doc.get("category", ""),
        riasec_codes=doc.get("riasec_codes", []),
        required_education=doc.get("required_education", []),
        job_titles=doc.get("job_titles", []),
        automation_risk=doc.get("automation_risk", "medium"),
        market_data=doc.get("market_data", {}),
        match_score=match_score,
        match_reason=match_reason,
    )


@router.post("/discover")
async def discover_careers(data: DiscoverRequest = Body(default=DiscoverRequest())):
    """Generate career path suggestions based on interests, RIASEC codes, or fields."""
    db = get_mongo()
    query = {}

    # Filter by RIASEC codes if provided
    if data.riasec:
        query["riasec_codes"] = {"$in": [c.upper() for c in data.riasec]}

    # Filter by category/field if provided
    if data.preferred_fields:
        query["category"] = {"$in": data.preferred_fields}

    cursor = db.career_paths.find(query)
    careers = await cursor.to_list(length=20)

    # Score careers based on match criteria
    results = []
    for career in careers:
        score = 0.5  # base score
        reasons = []

        if data.riasec:
            overlap = set(data.riasec) & set(career.get("riasec_codes", []))
            if overlap:
                score += 0.2 * len(overlap)
                reasons.append(f"RIASEC match: {', '.join(overlap)}")

        if data.preferred_fields and career.get("category") in data.preferred_fields:
            score += 0.2
            reasons.append(f"Field match: {career['category']}")

        if data.interests:
            job_titles_lower = [t.lower() for t in career.get("job_titles", [])]
            for interest in data.interests:
                if any(interest.lower() in title for title in job_titles_lower):
                    score += 0.1
                    reasons.append(f"Interest match: {interest}")

        score = min(score, 1.0)
        results.append(_career_doc_to_response(
            career,
            match_score=round(score, 2),
            match_reason="; ".join(reasons) if reasons else "General recommendation",
        ))

    # Sort by match score descending
    results.sort(key=lambda c: c.match_score or 0, reverse=True)

    return {"careers": [r.model_dump() for r in results], "total": len(results)}


@router.get("/paths")
async def list_career_paths():
    """List all available career paths."""
    db = get_mongo()
    cursor = db.career_paths.find()
    careers = await cursor.to_list(length=50)
    return {
        "paths": [_career_doc_to_response(c).model_dump() for c in careers],
        "total": len(careers),
    }


@router.get("/paths/{path_id}")
async def get_career_path(path_id: str):
    """Get detailed career path with market data."""
    db = get_mongo()
    try:
        career = await db.career_paths.find_one({"_id": ObjectId(path_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid career path ID")

    if not career:
        raise HTTPException(status_code=404, detail="Career path not found")

    # Also fetch market snapshots for this career
    snapshots_cursor = db.market_snapshots.find({"career_name": career["name"]})
    snapshots = await snapshots_cursor.to_list(length=10)

    response = _career_doc_to_response(career).model_dump()
    response["market_snapshots"] = [
        {
            "country": s.get("country", ""),
            "job_postings_count": s.get("job_postings_count", 0),
            "avg_salary": s.get("avg_salary", 0),
            "salary_growth_yoy": s.get("salary_growth_yoy", 0),
            "unemployment_rate_field": s.get("unemployment_rate_field", 0),
            "top_employers": s.get("top_employers", []),
            "required_skills": s.get("required_skills", []),
        }
        for s in snapshots
    ]

    return response


@router.get("/market/{career}/{country}")
async def get_market_data(career: str, country: str):
    """Get market data for a specific career in a specific country."""
    db = get_mongo()

    snapshot = await db.market_snapshots.find_one({
        "career_name": {"$regex": career.replace("_", " "), "$options": "i"},
        "country": country.upper(),
    })

    if not snapshot:
        # Try to get from career_paths embedded data
        career_doc = await db.career_paths.find_one({
            "name": {"$regex": career.replace("_", " "), "$options": "i"},
        })
        if career_doc and country.lower() in career_doc.get("market_data", {}):
            data = career_doc["market_data"][country.lower()]
            return MarketSnapshotResponse(
                career=career_doc["name"],
                country=country.upper(),
                avg_salary=data.get("avg_salary_mad", data.get("avg_salary", 0)),
                salary_growth_yoy=data.get("growth_pct", 0),
            ).model_dump()
        raise HTTPException(status_code=404, detail="Market data not found")

    return MarketSnapshotResponse(
        career=snapshot.get("career_name", career),
        country=snapshot.get("country", country),
        job_postings_count=snapshot.get("job_postings_count", 0),
        avg_salary=snapshot.get("avg_salary", 0),
        salary_growth_yoy=snapshot.get("salary_growth_yoy", 0),
        unemployment_rate_field=snapshot.get("unemployment_rate_field", 0),
        top_employers=snapshot.get("top_employers", []),
        required_skills=snapshot.get("required_skills", []),
    ).model_dump()


@router.post("/compare")
async def compare_careers(data: CompareRequest = Body(...)):
    """Compare 2-3 career paths side-by-side."""
    if len(data.career_ids) < 2 or len(data.career_ids) > 3:
        raise HTTPException(status_code=400, detail="Provide 2-3 career IDs to compare")

    db = get_mongo()
    careers = []
    for cid in data.career_ids:
        try:
            doc = await db.career_paths.find_one({"_id": ObjectId(cid)})
        except Exception:
            raise HTTPException(status_code=400, detail=f"Invalid career ID: {cid}")
        if not doc:
            raise HTTPException(status_code=404, detail=f"Career {cid} not found")
        careers.append(_career_doc_to_response(doc).model_dump())

    return {"comparison": careers, "count": len(careers)}


@router.post("/roi")
async def calculate_roi(data: ROIRequest = Body(...)):
    """Calculate ROI for a career given program cost."""
    db = get_mongo()
    try:
        career = await db.career_paths.find_one({"_id": ObjectId(data.career_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid career ID")

    if not career:
        raise HTTPException(status_code=404, detail="Career not found")

    # Get Morocco salary as baseline
    morocco_data = career.get("market_data", {}).get("morocco", {})
    avg_salary = morocco_data.get("avg_salary_mad", 120000)

    total_earnings = avg_salary * data.years
    net_roi = total_earnings - data.program_cost_mad
    roi_pct = ((total_earnings - data.program_cost_mad) / data.program_cost_mad * 100) if data.program_cost_mad > 0 else 0
    payback = data.program_cost_mad / avg_salary if avg_salary > 0 else 0

    return ROIResponse(
        career_name=career["name"],
        program_cost_mad=data.program_cost_mad,
        avg_salary_mad=avg_salary,
        total_earnings_10yr=total_earnings,
        net_roi=net_roi,
        roi_percentage=round(roi_pct, 1),
        payback_years=round(payback, 1),
    ).model_dump()


@router.get("/trending")
async def get_trending():
    """Get trending/growing careers sorted by growth percentage."""
    db = get_mongo()
    cursor = db.career_paths.find()
    careers = await cursor.to_list(length=50)

    # Sort by average growth across all markets
    def avg_growth(c):
        market = c.get("market_data", {})
        if not market:
            return 0
        growths = [v.get("growth_pct", 0) for v in market.values()]
        return sum(growths) / len(growths) if growths else 0

    careers.sort(key=avg_growth, reverse=True)

    return {
        "trending": [
            {
                **_career_doc_to_response(c).model_dump(),
                "avg_growth_pct": round(avg_growth(c), 1),
            }
            for c in careers[:10]
        ],
    }
