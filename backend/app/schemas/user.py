from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum

class BloodGroup(str, Enum):
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"

class UserRole(str, Enum):
    DONOR = "donor"
    ADMIN = "admin"

class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    blood_group: BloodGroup
    location: Optional[str] = None
    role: UserRole = UserRole.DONOR

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    is_available: Optional[bool] = None

class UserInDB(UserBase):
    id: str
    is_active: bool = True

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True 