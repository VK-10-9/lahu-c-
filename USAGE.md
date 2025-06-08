# Blood Donation System - Usage Guide

## 📋 Table of Contents
1. [Starting the System](#starting-the-system)
2. [User Management](#user-management)
3. [Donor Operations](#donor-operations)
4. [Blood Donation Requests](#blood-donation-requests)
5. [Blood Type Compatibility](#blood-type-compatibility)
6. [System Administration](#system-administration)
7. [API Usage](#api-usage)

## 🚀 Starting the System

### 1. Start Backend Server
```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Start the server
uvicorn app:app --reload
```

### 2. Start Frontend Development Server
```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
# or
pnpm dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 👤 User Management

### 1. User Registration
```bash
# Using curl
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "phone": "1234567890",
    "blood_type": "O+",
    "location": "New York",
    "role": "donor"
  }'
```

### 2. User Login
```bash
# Using curl
curl -X POST http://localhost:8000/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john@example.com&password=securepassword"
```

### 3. Get User Profile
```bash
# Using curl with authentication
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🩸 Donor Operations

### 1. Register New Donor
```bash
# Using curl
curl -X POST http://localhost:8000/api/donors/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "John Doe",
    "blood_type": "O+",
    "age": 25,
    "contact": "1234567890",
    "location": "New York",
    "email": "john@example.com"
  }'
```

### 2. List All Donors
```bash
# Using curl
curl http://localhost:8000/api/donors/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Get Specific Donor
```bash
# Using curl
curl http://localhost:8000/api/donors/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🏥 Blood Donation Requests

### 1. Create Donation Request
```bash
# Using curl
curl -X POST http://localhost:8000/api/blood-donation/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "patient_name": "Jane Smith",
    "blood_type": "A+",
    "units_needed": 2,
    "hospital": "City Hospital",
    "contact": "9876543210",
    "urgency": "high",
    "location": "New York",
    "email": "hospital@example.com"
  }'
```

### 2. List All Requests
```bash
# Using curl
curl http://localhost:8000/api/blood-donation/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Update Request Status
```bash
# Using curl
curl -X PUT http://localhost:8000/api/blood-donation/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "fulfilled"
  }'
```

## 🩸 Blood Type Compatibility

### 1. Check Compatibility
```bash
# Using curl
curl -X POST http://localhost:8000/api/compatibility \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "donorType": "O+",
    "recipientType": "A+"
  }'
```

### 2. Get Compatibility Rules
```bash
# Using curl
curl http://localhost:8000/api/compatibility/O+ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 👨‍💼 System Administration

### 1. View System Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# Frontend logs
# Check browser console
```

### 2. Database Management
```bash
# Backup CSV files
cp backend/*.csv backend/backup/

# Restore from backup
cp backend/backup/*.csv backend/
```

### 3. System Status
```bash
# Check backend status
curl http://localhost:8000/health

# Check frontend status
curl http://localhost:3000/api/health
```

## 🔌 API Usage

### 1. Authentication Headers
```bash
# All authenticated requests require:
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Common Response Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

### 3. Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## 📱 Frontend Usage

### 1. Navigation
- Dashboard: `/dashboard`
- Profile: `/profile`
- Donations: `/donations`
- Search: `/search`

### 2. Key Features
- Blood type compatibility checker
- Donor search
- Request management
- Profile settings

### 3. User Interface
- Responsive design
- Dark/Light mode
- Mobile-friendly

## 🔒 Security Best Practices

### 1. Password Management
- Use strong passwords
- Change password regularly
- Enable 2FA if available

### 2. Session Management
- Log out after use
- Clear browser cache
- Use private browsing

### 3. Data Protection
- Don't share access tokens
- Use HTTPS
- Regular backups

## 🆘 Troubleshooting

### 1. Common Issues
```bash
# Server not responding
curl http://localhost:8000/health

# Database issues
cat backend/*.csv

# Frontend errors
# Check browser console
```

### 2. Error Messages
- "Invalid credentials": Check username/password
- "Token expired": Re-login
- "Server error": Check logs

### 3. Support
- Check documentation
- Contact support
- GitHub issues

## 📚 Additional Resources

### 1. Documentation
- API Docs: http://localhost:8000/docs
- User Guide: [REPORT.md](REPORT.md)
- Installation Guide: [INSTALL.md](INSTALL.md)

### 2. Examples
- API Examples: `/examples`
- Code Samples: `/samples`
- Test Cases: `/tests`

### 3. Updates
- Check for updates
- Read changelog
- Follow releases 