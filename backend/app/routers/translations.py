"""
Translation Manager API — Admin endpoint for managing i18n translations.
Stores translations in MongoDB for dynamic updates without redeployment.
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.core.database import get_mongo
from app.core.security import require_role

router = APIRouter(prefix="/api/admin/translations", tags=["Admin - Translations"])


class TranslationUpdate(BaseModel):
    lang: str
    key: str
    value: str


class BulkTranslationUpdate(BaseModel):
    lang: str
    translations: dict  # full translation object for a language


@router.get("")
async def list_languages(current_user: dict = Depends(require_role("admin"))):
    """List all available languages and their translation counts."""
    db = get_mongo()
    languages = []
    async for doc in db.translations.find({}, {"_id": 0, "lang": 1}):
        languages.append(doc["lang"])
    return {"languages": languages}


@router.get("/{lang}")
async def get_translations(lang: str, current_user: dict = Depends(require_role("admin"))):
    """Get all translations for a specific language."""
    db = get_mongo()
    doc = await db.translations.find_one({"lang": lang}, {"_id": 0})
    if not doc:
        return {"lang": lang, "translations": {}}
    return doc


@router.put("/{lang}")
async def update_translations(
    lang: str,
    body: BulkTranslationUpdate,
    current_user: dict = Depends(require_role("admin")),
):
    """Update all translations for a language (bulk upsert)."""
    db = get_mongo()
    await db.translations.update_one(
        {"lang": lang},
        {"$set": {"lang": lang, "translations": body.translations}},
        upsert=True,
    )
    return {"message": f"Translations for '{lang}' updated successfully"}


@router.patch("/single")
async def update_single_translation(
    body: TranslationUpdate,
    current_user: dict = Depends(require_role("admin")),
):
    """Update a single translation key for a language."""
    db = get_mongo()
    await db.translations.update_one(
        {"lang": body.lang},
        {"$set": {f"translations.{body.key}": body.value}},
        upsert=True,
    )
    return {"message": f"Translation '{body.key}' updated for '{body.lang}'"}


@router.delete("/{lang}/{key}")
async def delete_translation_key(
    lang: str,
    key: str,
    current_user: dict = Depends(require_role("admin")),
):
    """Delete a translation key from a language."""
    db = get_mongo()
    await db.translations.update_one(
        {"lang": lang},
        {"$unset": {f"translations.{key}": ""}},
    )
    return {"message": f"Key '{key}' removed from '{lang}'"}


# ── Public endpoint for frontend to fetch latest translations ──

@router.get("/public/{lang}", tags=["Public"])
async def get_public_translations(lang: str):
    """Public endpoint — frontend fetches translations at runtime."""
    db = get_mongo()
    doc = await db.translations.find_one({"lang": lang}, {"_id": 0})
    if not doc:
        return {"lang": lang, "translations": {}}
    return doc
