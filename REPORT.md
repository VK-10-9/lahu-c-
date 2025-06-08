# Blood Donation System - Installation and Usage Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Installation Guide](#installation-guide)
3. [Configuration](#configuration)
4. [Usage Guide](#usage-guide)
5. [Troubleshooting](#troubleshooting)
6. [Security Considerations](#security-considerations)
7. [Performance Optimization](#performance-optimization)

## 🏗️ System Overview

The Blood Donation System is a comprehensive platform that combines:
- Python FastAPI backend
- C++ core for blood compatibility
- Next.js frontend
- CSV-based data storage

### Key Features
- Blood type compatibility checking
- Donor management
- Donation request handling
- User authentication
- Real-time updates

## 🚀 Installation Guide

### Prerequisites

1. **System Requirements**
   - Windows 10/11, Linux, or macOS
   - 4GB RAM minimum
   - 1GB free disk space
   - Internet connection

2. **Required Software**
   - Python 3.8 or higher
   - Node.js 16 or higher
   - C++ compiler (GCC/Clang/MSVC)
   - CMake 3.10 or higher
   - Git

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd blood-donation-system
   ```

2. **Backend Setup**
   ```bash
   # Navigate to backend directory
   cd backend

   # Create virtual environment
   python -m venv .venv
   
   # Activate virtual environment
   # On Windows:
   .venv\Scripts\activate
   # On Linux/macOS:
   source .venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   ```

3. **C++ Core Setup**
   ```bash
   # Navigate to blood_donation_system directory
   cd blood_donation_system

   # Create build directory
   mkdir build
   cd build

   # Configure and build
   cmake ..
   cmake --build .
   ```

4. **Frontend Setup**
   ```bash
   # Navigate to frontend directory
   cd frontend

   # Install dependencies
   npm install
   # or
   pnpm install
   ```

## 🔧 Configuration

### Backend Configuration

1. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   SECRET_KEY=your-secret-key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

2. **Database Setup**
   - CSV files are automatically created
   - No additional database setup required

### Frontend Configuration

1. **Environment Variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

## 📱 Usage Guide

### Starting the System

1. **Start Backend Server**
   ```bash
   cd backend
   uvicorn app:app --reload
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # or
   pnpm dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### User Roles and Permissions

1. **Admin**
   - Full system access
   - User management
   - System configuration

2. **Donor**
   - Profile management
   - Donation history
   - Blood type information

3. **Hospital Staff**
   - Create donation requests
   - Manage requests
   - View donor information

### Key Features Usage

1. **Blood Type Compatibility**
   - Access the compatibility checker
   - Enter donor and recipient blood types
   - View compatibility results

2. **Donor Management**
   - Register new donors
   - Update donor information
   - Track donation history

3. **Donation Requests**
   - Create new requests
   - Update request status
   - Match with donors

## 🔍 Troubleshooting

### Common Issues

1. **Backend Issues**
   - Port 8000 already in use
   ```bash
   # Find and kill the process
   netstat -ano | findstr :8000
   taskkill /PID <PID> /F
   ```

2. **Frontend Issues**
   - Port 3000 already in use
   ```bash
   # Find and kill the process
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

3. **Build Issues**
   - CMake configuration errors
   ```bash
   # Clean build directory
   rm -rf build/*
   # Rebuild
   cmake ..
   cmake --build .
   ```

### Error Logs
- Backend logs: `backend/logs/`
- Frontend logs: Browser console
- C++ logs: `blood_donation_system/build/logs/`

## 🔒 Security Considerations

1. **Authentication**
   - Use strong passwords
   - Enable 2FA if available
   - Regular password updates

2. **Data Protection**
   - Regular backups
   - Secure file permissions
   - Data encryption

3. **API Security**
   - Use HTTPS
   - Validate all inputs
   - Rate limiting

## ⚡ Performance Optimization

1. **Backend Optimization**
   - Enable caching
   - Optimize database queries
   - Use connection pooling

2. **Frontend Optimization**
   - Enable code splitting
   - Use lazy loading
   - Optimize images

3. **C++ Core Optimization**
   - Use release builds
   - Enable compiler optimizations
   - Profile performance

## 📚 Additional Resources

1. **Documentation**
   - API Documentation: http://localhost:8000/docs
   - Component Documentation: `/docs/components`
   - Architecture Overview: `/docs/architecture`

2. **Support**
   - GitHub Issues
   - Documentation
   - Community Forums

3. **Updates**
   - Regular security updates
   - Feature updates
   - Bug fixes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🙏 Acknowledgments

- FastAPI documentation
- Next.js team
- vcpkg contributors
- Open source community 