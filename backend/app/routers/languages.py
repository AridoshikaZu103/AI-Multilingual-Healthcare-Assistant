from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import FAQ
from app.schemas import LanguageInfo, LanguageListResponse, FAQListResponse, FAQResponse
from app.services.translation import get_all_languages, detect_language

router = APIRouter(tags=["Languages & FAQ"])


# ── Languages ─────────────────────────────────────────

@router.get("/api/languages", response_model=LanguageListResponse)
async def list_languages():
    """List all supported languages."""
    languages = get_all_languages()
    return LanguageListResponse(
        languages=[LanguageInfo(**lang) for lang in languages]
    )


@router.post("/api/languages/detect")
async def detect_language_endpoint(text: str = Query(..., description="Text to detect language of")):
    """Detect the language of a given text."""
    detected = detect_language(text)
    return {"language": detected}


# ── FAQs ──────────────────────────────────────────────

@router.get("/api/faqs", response_model=FAQListResponse)
async def list_faqs(
    language: str = Query(default="en", description="Language code"),
    category: str = Query(default=None, description="Filter by category"),
    db: AsyncSession = Depends(get_db),
):
    """List frequently asked questions."""
    query = select(FAQ).where(FAQ.is_active == True, FAQ.language == language)

    if category:
        query = query.where(FAQ.category == category)

    query = query.order_by(FAQ.order_index)

    result = await db.execute(query)
    faqs = result.scalars().all()

    return FAQListResponse(faqs=faqs, total=len(faqs))
