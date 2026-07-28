from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import HealthcareScheme
from app.schemas import SchemeResponse, SchemeListResponse

router = APIRouter(prefix="/api/schemes", tags=["Healthcare Schemes"])


@router.get("", response_model=SchemeListResponse)
async def list_schemes(
    language: str = Query(default=None, description="Filter by language code"),
    category: str = Query(default=None, description="Filter by category"),
    search: str = Query(default=None, description="Search term"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all healthcare schemes with optional filtering."""
    query = select(HealthcareScheme).where(HealthcareScheme.is_active == True)
    count_query = select(func.count(HealthcareScheme.id)).where(HealthcareScheme.is_active == True)

    if language:
        query = query.where(HealthcareScheme.language == language)
        count_query = count_query.where(HealthcareScheme.language == language)

    if category:
        query = query.where(HealthcareScheme.category == category)
        count_query = count_query.where(HealthcareScheme.category == category)

    if search:
        search_filter = HealthcareScheme.name.ilike(f"%{search}%") | HealthcareScheme.description.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Get paginated results
    result = await db.execute(query.offset(skip).limit(limit))
    schemes = result.scalars().all()

    return SchemeListResponse(schemes=schemes, total=total)


@router.get("/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: int, db: AsyncSession = Depends(get_db)):
    """Get details of a specific healthcare scheme."""
    result = await db.execute(
        select(HealthcareScheme).where(HealthcareScheme.id == scheme_id)
    )
    scheme = result.scalar_one_or_none()

    if not scheme:
        raise HTTPException(status_code=404, detail="Healthcare scheme not found")

    return scheme
