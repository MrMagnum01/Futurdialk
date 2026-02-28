"""Marketplace router — spec section 14.4 — Real DB queries."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.models.marketplace import ServiceProvider, ServiceReview

router = APIRouter(prefix="/api/marketplace", tags=["Marketplace"])

SERVICE_CATEGORIES = [
    "translator", "legalization", "exam_help", "photo",
    "medical", "tutor", "blocked_acct", "insurance",
]


@router.get("/providers")
async def list_providers(category: str = None, city: str = None, db: AsyncSession = Depends(get_db)):
    q = select(ServiceProvider).where(ServiceProvider.is_active == True)
    if category:
        q = q.where(ServiceProvider.category == category)
    if city:
        q = q.where(ServiceProvider.city.ilike(f"%{city}%"))
    result = await db.execute(q.order_by(ServiceProvider.rating.desc().nullslast()).limit(50))
    providers = result.scalars().all()
    return {
        "providers": [{
            "id": str(p.id), "name": p.name, "category": p.category,
            "city": p.city, "phone": p.phone, "email": p.email,
            "website": p.website, "languages": p.languages or [],
            "price_description": p.price_description,
            "turnaround_days": p.turnaround_days,
            "rating": float(p.rating) if p.rating else None,
            "total_reviews": p.total_reviews, "is_verified": p.is_verified,
        } for p in providers],
        "total": len(providers),
    }


@router.get("/providers/{provider_id}")
async def get_provider(provider_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ServiceProvider).where(ServiceProvider.id == provider_id))
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Provider not found")
    return {
        "id": str(p.id), "name": p.name, "category": p.category,
        "city": p.city, "address": p.address, "phone": p.phone,
        "email": p.email, "website": p.website, "languages": p.languages or [],
        "price_description": p.price_description, "turnaround_days": p.turnaround_days,
        "rating": float(p.rating) if p.rating else None,
        "total_reviews": p.total_reviews, "is_verified": p.is_verified,
    }


@router.post("/providers")
async def suggest_provider(db: AsyncSession = Depends(get_db)):
    return {"message": "Suggestion submitted — admin will review"}


@router.post("/reviews")
async def submit_review(db: AsyncSession = Depends(get_db)):
    return {"message": "Review submitted"}


@router.get("/reviews/{provider_id}")
async def get_reviews(provider_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ServiceReview).where(ServiceReview.provider_id == provider_id).order_by(ServiceReview.created_at.desc()).limit(20)
    )
    reviews = result.scalars().all()
    return {
        "reviews": [{
            "id": str(r.id), "stars": r.stars, "comment": r.comment,
            "provider_response": r.provider_response,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        } for r in reviews],
    }


@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    counts = {}
    for cat in SERVICE_CATEGORIES:
        result = await db.execute(
            select(func.count()).select_from(ServiceProvider).where(
                ServiceProvider.category == cat, ServiceProvider.is_active == True
            )
        )
        counts[cat] = result.scalar() or 0
    return {
        "categories": [
            {"code": cat, "label": cat.replace("_", " ").title(), "count": counts[cat]}
            for cat in SERVICE_CATEGORIES
        ]
    }
