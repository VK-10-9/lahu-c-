from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client.lahu  # 'lahu' is your database name

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 