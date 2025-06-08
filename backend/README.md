# Backend Directory

This directory contains the Python FastAPI backend implementation of the Blood Donation System.

## 📁 Directory Structure

```
backend/
├── app.py              # Main FastAPI application
├── requirements.txt    # Python dependencies
├── users.csv          # User data storage
├── donors.csv         # Donor information
├── donation_requests.csv # Blood donation requests
├── scripts/           # Utility scripts
└── src/              # C++ integration
```

## 🚀 Getting Started

1. **Setup Virtual Environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**
   ```bash
   uvicorn app:app --reload
   ```

## 📚 API Endpoints

### Authentication
- `POST /token` - Login endpoint
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user info

### Donor Management
- `POST /api/donors/` - Create donor profile
- `GET /api/donors/` - List all donors
- `GET /api/donors/{donor_id}` - Get specific donor

### Blood Donation
- `POST /api/blood-donation/` - Create donation request
- `GET /api/blood-donation/` - List all requests
- `GET /api/blood-donation/{request_id}` - Get specific request
- `PUT /api/blood-donation/{request_id}` - Update request status

### Blood Compatibility
- `GET /api/compatibility/{blood_type}` - Get compatibility info
- `POST /api/compatibility` - Check compatibility between types

## 🔧 Configuration

Create a `.env` file with:
```env
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📝 Data Models

### User
- id: int
- name: str
- email: str
- password: str
- phone: str
- blood_type: str
- location: str
- last_donation: str
- role: str

### Donor
- id: int
- name: str
- blood_type: str
- age: int
- contact: str
- last_donation: str
- location: str
- email: str

### DonationRequest
- id: int
- patient_name: str
- blood_type: str
- units_needed: int
- hospital: str
- contact: str
- urgency: str
- status: str
- location: str
- email: str 