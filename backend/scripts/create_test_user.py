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

async def create_test_user():
    try:
        # Test user data
        test_user = {
            "email": "test@example.com",
            "name": "Test User",
            "phone": "1234567890",
            "blood_group": "O+",
            "location": "Test City",
            "role": "donor",
            "is_active": True,
            "total_donations": 0,
            "hashed_password": pwd_context.hash("password123")
        }
        
        # Check if user already exists
        existing_user = await db.users.find_one({"email": test_user["email"]})
        if existing_user:
            print("Test user already exists!")
            return
        
        # Insert test user
        result = await db.users.insert_one(test_user)
        print(f"Test user created successfully! ID: {result.inserted_id}")
        print("\nTest credentials:")
        print("Email: test@example.com")
        print("Password: password123")
        
    except Exception as e:
        print(f"Error creating test user: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(create_test_user()) 