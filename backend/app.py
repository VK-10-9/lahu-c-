from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import csv
import os
from typing import List, Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
SECRET_KEY = "your-secret-key-here"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Data Models
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    password: Optional[str] = None
    phone: Optional[str] = None
    blood_type: Optional[str] = None
    location: Optional[str] = None
    last_donation: Optional[str] = None
    role: str = "donor"

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Donor(BaseModel):
    id: Optional[int] = None
    name: str
    blood_type: str
    age: int
    contact: str
    last_donation: Optional[str] = None
    location: Optional[str] = None
    email: Optional[str] = None

class DonationRequest(BaseModel):
    id: Optional[int] = None
    patient_name: str
    blood_type: str
    units_needed: int
    hospital: str
    contact: str
    urgency: str
    status: str = "pending"
    location: Optional[str] = None
    email: Optional[str] = None

class BloodCompatibility(BaseModel):
    blood_type: str
    can_donate_to: List[str]
    can_receive_from: List[str]

class CompatibilityRequest(BaseModel):
    donorType: str
    recipientType: str

class CompatibilityResponse(BaseModel):
    compatible: bool
    message: str
    using_python_fallback: bool = False

# CSV file paths
USERS_FILE = "users.csv"
DONORS_FILE = "donors.csv"
REQUESTS_FILE = "donation_requests.csv"

# Initialize CSV files if they don't exist
def init_csv_files():
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'name', 'email', 'hashed_password', 'phone', 'blood_type', 'location', 'last_donation', 'role'])
    
    if not os.path.exists(DONORS_FILE):
        with open(DONORS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'name', 'blood_type', 'age', 'contact', 'last_donation', 'location', 'email'])
    
    if not os.path.exists(REQUESTS_FILE):
        with open(REQUESTS_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'patient_name', 'blood_type', 'units_needed', 'hospital', 'contact', 'urgency', 'status', 'location', 'email'])

# Initialize CSV files on startup
init_csv_files()

# Helper functions
def get_next_id(filename):
    with open(filename, 'r') as f:
        reader = csv.reader(f)
        next(reader)  # Skip header
        ids = [int(row[0]) for row in reader if row[0].isdigit()]
        return max(ids) + 1 if ids else 1

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(email: str):
    with open(USERS_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['email'] == email:
                return UserInDB(**row)
    return None

def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/signup", response_model=User)
async def signup(user: User):
    # Check if user already exists
    if get_user(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_id = get_next_id(USERS_FILE)
    hashed_password = get_password_hash(user.password)
    
    with open(USERS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            user_id,
            user.name,
            user.email,
            hashed_password,
            user.phone,
            user.blood_type,
            user.location,
            user.last_donation,
            user.role
        ])
    
    # Return user without password
    user.id = user_id
    user.password = None
    return user

@app.get("/api/auth/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Donor endpoints
@app.post("/api/donors/", response_model=Donor)
def create_donor(donor: Donor):
    donor_id = get_next_id(DONORS_FILE)
    donor.id = donor_id
    
    with open(DONORS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            donor.id,
            donor.name,
            donor.blood_type,
            donor.age,
            donor.contact,
            donor.last_donation,
            donor.location,
            donor.email
        ])
    return donor

@app.get("/api/donors/", response_model=List[Donor])
def get_donors():
    donors = []
    with open(DONORS_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            donors.append(Donor(**row))
    return donors

@app.get("/api/donors/{donor_id}", response_model=Donor)
def get_donor(donor_id: int):
    with open(DONORS_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row['id']) == donor_id:
                return Donor(**row)
    raise HTTPException(status_code=404, detail="Donor not found")

# Request endpoints
@app.post("/api/blood-donation/", response_model=DonationRequest)
def create_request(request: DonationRequest):
    request_id = get_next_id(REQUESTS_FILE)
    request.id = request_id
    
    with open(REQUESTS_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            request.id,
            request.patient_name,
            request.blood_type,
            request.units_needed,
            request.hospital,
            request.contact,
            request.urgency,
            request.status,
            request.location,
            request.email
        ])
    return request

@app.get("/api/blood-donation/", response_model=List[DonationRequest])
def get_requests():
    requests = []
    with open(REQUESTS_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            requests.append(DonationRequest(**row))
    return requests

@app.get("/api/blood-donation/{request_id}", response_model=DonationRequest)
def get_request(request_id: int):
    with open(REQUESTS_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row['id']) == request_id:
                return DonationRequest(**row)
    raise HTTPException(status_code=404, detail="Request not found")

@app.put("/api/blood-donation/{request_id}")
def update_request_status(request_id: int, status: str):
    requests = []
    updated = False
    
    with open(REQUESTS_FILE, 'r') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if int(row[0]) == request_id:
                row[7] = status  # Update status
                updated = True
            requests.append(row)
    
    if not updated:
        raise HTTPException(status_code=404, detail="Request not found")
    
    with open(REQUESTS_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(requests)
    
    return {"message": "Request updated successfully"}

# Blood compatibility endpoint
@app.get("/api/compatibility/{blood_type}", response_model=BloodCompatibility)
def get_blood_compatibility(blood_type: str):
    compatibility_map = {
        "A+": {
            "can_donate_to": ["A+", "AB+"],
            "can_receive_from": ["A+", "A-", "O+", "O-"]
        },
        "A-": {
            "can_donate_to": ["A+", "A-", "AB+", "AB-"],
            "can_receive_from": ["A-", "O-"]
        },
        "B+": {
            "can_donate_to": ["B+", "AB+"],
            "can_receive_from": ["B+", "B-", "O+", "O-"]
        },
        "B-": {
            "can_donate_to": ["B+", "B-", "AB+", "AB-"],
            "can_receive_from": ["B-", "O-"]
        },
        "AB+": {
            "can_donate_to": ["AB+"],
            "can_receive_from": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        },
        "AB-": {
            "can_donate_to": ["AB+", "AB-"],
            "can_receive_from": ["A-", "B-", "AB-", "O-"]
        },
        "O+": {
            "can_donate_to": ["A+", "B+", "AB+", "O+"],
            "can_receive_from": ["O+", "O-"]
        },
        "O-": {
            "can_donate_to": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            "can_receive_from": ["O-"]
        }
    }
    
    if blood_type not in compatibility_map:
        raise HTTPException(status_code=404, detail="Blood type not found")
    
    return BloodCompatibility(
        blood_type=blood_type,
        can_donate_to=compatibility_map[blood_type]["can_donate_to"],
        can_receive_from=compatibility_map[blood_type]["can_receive_from"]
    )

def check_blood_compatibility(donor_type: str, recipient_type: str) -> tuple[bool, str]:
    # Universal donor and recipient rules
    if donor_type == "O-":
        return True, f"O- is a universal donor and can donate to {recipient_type}"
    if recipient_type == "AB+":
        return True, f"AB+ is a universal recipient and can receive from {donor_type}"
    
    # Rh factor compatibility
    donor_rh = donor_type[-1]
    recipient_rh = recipient_type[-1]
    
    # If recipient is Rh-, donor must also be Rh-
    if recipient_rh == "-" and donor_rh == "+":
        return False, f"{donor_type} cannot donate to {recipient_type} due to Rh factor incompatibility"
    
    # Blood type compatibility
    donor_abo = donor_type[:-1]
    recipient_abo = recipient_type[:-1]
    
    if donor_abo == "O":
        return True, f"{donor_type} can donate to {recipient_type}"
    elif donor_abo == "A" and recipient_abo in ["A", "AB"]:
        return True, f"{donor_type} can donate to {recipient_type}"
    elif donor_abo == "B" and recipient_abo in ["B", "AB"]:
        return True, f"{donor_type} can donate to {recipient_type}"
    elif donor_abo == "AB" and recipient_abo == "AB":
        return True, f"{donor_type} can donate to {recipient_type}"
    
    return False, f"{donor_type} cannot donate to {recipient_type} due to blood type incompatibility"

@app.post("/api/compatibility", response_model=CompatibilityResponse)
async def check_compatibility(request: CompatibilityRequest):
    try:
        compatible, message = check_blood_compatibility(request.donorType, request.recipientType)
        return CompatibilityResponse(
            compatible=compatible,
            message=message,
            using_python_fallback=True
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 