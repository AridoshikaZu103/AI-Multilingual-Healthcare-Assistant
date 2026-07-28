import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean
from app.database import Base


class HealthcareScheme(Base):
    """Government healthcare scheme information."""
    __tablename__ = "healthcare_schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    name_local = Column(String(255), nullable=True)
    description = Column(Text, nullable=False)
    eligibility = Column(Text, nullable=True)
    documents_required = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    coverage = Column(String(255), nullable=True)
    website = Column(String(500), nullable=True)
    language = Column(String(10), default="en", index=True)
    category = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class HealthcareFacility(Base):
    """Healthcare facilities - hospitals, PHCs, etc."""
    __tablename__ = "healthcare_facilities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    facility_type = Column(String(100), nullable=False, index=True)  # PHC, District Hospital, etc.
    address = Column(Text, nullable=True)
    district = Column(String(100), nullable=True, index=True)
    state = Column(String(100), nullable=True, index=True)
    pincode = Column(String(10), nullable=True)
    phone = Column(String(20), nullable=True)
    emergency_phone = Column(String(20), nullable=True)
    email = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    services = Column(Text, nullable=True)
    timings = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChatHistory(Base):
    """Chat conversation history."""
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), nullable=False, index=True)
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    language = Column(String(10), default="en")
    response_time_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FAQ(Base):
    """Frequently Asked Questions."""
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=True, index=True)
    language = Column(String(10), default="en", index=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
