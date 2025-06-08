from sqlalchemy import Boolean, Column, Integer, String, Date, Enum, DateTime, func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum

class BloodGroup(str, enum.Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class UserRole(str, enum.Enum):
    DONOR = "donor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    blood_group = Column(Enum(BloodGroup), nullable=False)
    location = Column(String)
    last_donation = Column(Date)
    total_donations = Column(Integer, default=0)
    role = Column(Enum(UserRole), default=UserRole.DONOR)
    is_available = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    donations = relationship("Donation", back_populates="donor") 