from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models import HealthcareFacility
from app.schemas import FacilityResponse, FacilityListResponse

router = APIRouter(prefix="/api/facilities", tags=["Healthcare Facilities"])


@router.get("", response_model=FacilityListResponse)
async def list_facilities(
    facility_type: str = Query(default=None, description="Filter by type (PHC, District Hospital, etc.)"),
    district: str = Query(default=None, description="Filter by district"),
    state: str = Query(default=None, description="Filter by state"),
    search: str = Query(default=None, description="Search term"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List healthcare facilities with optional filtering."""
    query = select(HealthcareFacility).where(HealthcareFacility.is_active == True)
    count_query = select(func.count(HealthcareFacility.id)).where(HealthcareFacility.is_active == True)

    if facility_type:
        query = query.where(HealthcareFacility.facility_type == facility_type)
        count_query = count_query.where(HealthcareFacility.facility_type == facility_type)

    if district:
        query = query.where(HealthcareFacility.district.ilike(f"%{district}%"))
        count_query = count_query.where(HealthcareFacility.district.ilike(f"%{district}%"))

    if state:
        query = query.where(HealthcareFacility.state.ilike(f"%{state}%"))
        count_query = count_query.where(HealthcareFacility.state.ilike(f"%{state}%"))

    if search:
        search_filter = HealthcareFacility.name.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    total_result = await db.execute(count_query)
    total = total_result.scalar()

    result = await db.execute(query.offset(skip).limit(limit))
    facilities = result.scalars().all()

    return FacilityListResponse(facilities=facilities, total=total)


@router.get("/{facility_id}", response_model=FacilityResponse)
async def get_facility(facility_id: int, db: AsyncSession = Depends(get_db)):
    """Get details of a specific healthcare facility."""
    result = await db.execute(
        select(HealthcareFacility).where(HealthcareFacility.id == facility_id)
    )
    facility = result.scalar_one_or_none()

    if not facility:
        raise HTTPException(status_code=404, detail="Healthcare facility not found")

    return facility
