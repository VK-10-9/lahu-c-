import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
db = client.lahu

# Dummy users data
users_data = [
    {
        "email": "alice@example.com",
        "name": "Alice Johnson",
        "phone": "1234567890",
        "blood_group": "A+",
        "location": "New York",
        "role": "donor",
        "is_active": True,
        "total_donations": 1
    },
    {
        "email": "bob@example.com",
        "name": "Bob Smith",
        "phone": "2345678901",
        "blood_group": "O-",
        "location": "Los Angeles",
        "role": "donor",
        "is_active": True,
        "total_donations": 0
    },
    {
        "email": "carol@example.com",
        "name": "Carol White",
        "phone": "3456789012",
        "blood_group": "B+",
        "location": "Chicago",
        "role": "admin",
        "is_active": True,
        "total_donations": 0
    }
]

# Dummy donations data
donations_data = [
    {
        "donor_email": "alice@example.com",
        "date": "2024-05-01",
        "location": "New York",
        "status": "completed",
        "recipient": "John Doe",
        "notes": "First donation"
    },
    {
        "donor_email": "bob@example.com",
        "date": "2024-05-10",
        "location": "Los Angeles",
        "status": "scheduled",
        "recipient": "Jane Roe",
        "notes": "Urgent need"
    }
]

async def seed_database():
    try:
        # Clear existing data
        await db.users.delete_many({})
        await db.donations.delete_many({})
        
        # Insert users
        for user in users_data:
            # Add hashed password
            user["hashed_password"] = pwd_context.hash("password123")
            await db.users.insert_one(user)
        
        # Insert donations
        for donation in donations_data:
            # Get donor ID from email
            donor = await db.users.find_one({"email": donation["donor_email"]})
            if donor:
                donation["donor_id"] = str(donor["_id"])
                del donation["donor_email"]
                await db.donations.insert_one(donation)
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_database()) 