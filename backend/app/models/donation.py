from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, DateTime, func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum

class DonationStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, nullable=False)
    location = Column(String, nullable=False)
    status = Column(Enum(DonationStatus), default=DonationStatus.SCHEDULED)
    recipient = Column(String)
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    donor = relationship("User", back_populates="donations") 