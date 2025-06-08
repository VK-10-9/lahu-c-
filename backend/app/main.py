from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import users, donations, auth

app = FastAPI(title="Lahu Blood Donation API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(donations.router, prefix="/api", tags=["donations"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Lahu Blood Donation API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 