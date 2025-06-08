from pydantic import BaseModel
from typing import Optional
from datetime import date
from enum import Enum

class DonationStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DonationBase(BaseModel):
    date: date
    location: str
    status: DonationStatus = DonationStatus.SCHEDULED
    recipient: Optional[str] = None
    notes: Optional[str] = None

class DonationCreate(DonationBase):
    donor_id: str

class DonationInDB(DonationBase):
    id: str
    donor_id: str

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True 