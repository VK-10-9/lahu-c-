from fastapi import APIRouter, HTTPException, status
from ..schemas.donation import DonationCreate, DonationInDB
from ..core.database import db
from bson import ObjectId

router = APIRouter()

@router.post("/donations/", response_model=DonationInDB)
async def create_donation(donation: DonationCreate):
    # Verify donor exists
    donor = await db.users.find_one({"_id": ObjectId(donation.donor_id)})
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    donation_dict = donation.dict()
    result = await db.donations.insert_one(donation_dict)
    donation_dict["id"] = str(result.inserted_id)
    return DonationInDB(**donation_dict)

@router.get("/donations/", response_model=list[DonationInDB])
async def read_donations():
    donations = []
    async for donation in db.donations.find():
        donation["id"] = str(donation["_id"])
        donations.append(DonationInDB(**donation))
    return donations

@router.get("/donations/{donation_id}", response_model=DonationInDB)
async def read_donation(donation_id: str):
    donation = await db.donations.find_one({"_id": ObjectId(donation_id)})
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
    donation["id"] = str(donation["_id"])
    return DonationInDB(**donation)

@router.get("/users/{user_id}/donations/", response_model=list[DonationInDB])
async def read_user_donations(user_id: str):
    donations = []
    async for donation in db.donations.find({"donor_id": user_id}):
        donation["id"] = str(donation["_id"])
        donations.append(DonationInDB(**donation))
    return donations 