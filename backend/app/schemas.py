from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ── Chat ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User's chat message")
    language: str = Field(default="en", description="Language code (en, hi, te)")
    session_id: Optional[str] = Field(default=None, description="Chat session identifier")


class ChatResponse(BaseModel):
    reply: str
    language: str
    session_id: str
    response_time_ms: Optional[int] = None


class ChatHistoryItem(BaseModel):
    id: int
    session_id: str
    user_message: str
    bot_response: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True


# ── Healthcare Schemes ────────────────────────────────

class SchemeResponse(BaseModel):
    id: int
    name: str
    name_local: Optional[str] = None
    description: str
    eligibility: Optional[str] = None
    documents_required: Optional[str] = None
    benefits: Optional[str] = None
    coverage: Optional[str] = None
    website: Optional[str] = None
    language: str
    category: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class SchemeListResponse(BaseModel):
    schemes: list[SchemeResponse]
    total: int


# ── Healthcare Facilities ─────────────────────────────

class FacilityResponse(BaseModel):
    id: int
    name: str
    facility_type: str
    address: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    emergency_phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    services: Optional[str] = None
    timings: Optional[str] = None

    class Config:
        from_attributes = True


class FacilityListResponse(BaseModel):
    facilities: list[FacilityResponse]
    total: int


# ── FAQ ───────────────────────────────────────────────

class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    category: Optional[str] = None
    language: str

    class Config:
        from_attributes = True


class FAQListResponse(BaseModel):
    faqs: list[FAQResponse]
    total: int


# ── Languages ─────────────────────────────────────────

class LanguageInfo(BaseModel):
    code: str
    name: str
    native_name: str


class LanguageListResponse(BaseModel):
    languages: list[LanguageInfo]


# ── Health Check ──────────────────────────────────────

class HealthCheckResponse(BaseModel):
    status: str
    version: str
    database: str
    ollama: str
