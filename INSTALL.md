# Blood Donation System - Installation Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Pre-Installation Steps](#pre-installation-steps)
3. [Installation Process](#installation-process)
4. [Post-Installation Steps](#post-installation-steps)
5. [Verification](#verification)
6. [Common Issues](#common-issues)

## 💻 System Requirements

### Hardware Requirements
- CPU: 1.6 GHz or faster
- RAM: 4GB minimum (8GB recommended)
- Storage: 1GB free space
- Network: Internet connection

### Software Requirements

#### Windows
- Windows 10/11 (64-bit)
- Python 3.8 or higher
- Node.js 16 or higher
- Visual Studio 2019 or higher with C++ workload
- CMake 3.10 or higher
- Git

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install required packages
sudo apt install -y \
    python3.8 \
    python3.8-venv \
    nodejs \
    npm \
    build-essential \
    cmake \
    git
```

#### macOS
- macOS 10.15 or higher
- Python 3.8 or higher
- Node.js 16 or higher
- Xcode Command Line Tools
- CMake 3.10 or higher
- Git

## 🔧 Pre-Installation Steps

1. **Install Python**
   ```bash
   # Check Python version
   python --version
   # Should be 3.8 or higher
   ```

2. **Install Node.js**
   ```bash
   # Check Node.js version
   node --version
   # Should be 16 or higher
   ```

3. **Install CMake**
   ```bash
   # Check CMake version
   cmake --version
   # Should be 3.10 or higher
   ```

4. **Install Git**
   ```bash
   # Check Git version
   git --version
   ```

## 🚀 Installation Process

### 1. Clone the Repository
```bash
# Clone the repository
git clone [repository-url]
cd blood-donation-system
```

### 2. Backend Installation

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

### 3. C++ Core Installation

```bash
# Navigate to blood_donation_system directory
cd blood_donation_system

# Create build directory
mkdir build
cd build

# Configure with CMake
cmake ..

# Build the project
cmake --build .
```

### 4. Frontend Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
pnpm install
```

## ⚙️ Post-Installation Steps

### 1. Backend Configuration

1. **Create Environment File**
   ```bash
   # In backend directory
   touch .env
   ```

2. **Add Environment Variables**
   ```env
   SECRET_KEY=your-secret-key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### 2. Frontend Configuration

1. **Create Environment File**
   ```bash
   # In frontend directory
   touch .env.local
   ```

2. **Add Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### 3. Database Setup

The system uses CSV files for data storage. They will be created automatically on first run:
- `users.csv`
- `donors.csv`
- `donation_requests.csv`

## ✅ Verification

### 1. Verify Backend Installation

```bash
# Navigate to backend directory
cd backend

# Start the server
uvicorn app:app --reload

# Check if server is running
curl http://localhost:8000/docs
```

### 2. Verify C++ Core Installation

```bash
# Navigate to build directory
cd blood_donation_system/build

# Run the executable
./blood_compatibility
```

### 3. Verify Frontend Installation

```bash
# Navigate to frontend directory
cd frontend

# Start development server
npm run dev
# or
pnpm dev

# Open browser and navigate to
# http://localhost:3000
```

## 🔍 Common Issues

### 1. Port Conflicts

If port 8000 is already in use:
```bash
# Find the process
netstat -ano | findstr :8000
# Kill the process
taskkill /PID <PID> /F
```

If port 3000 is already in use:
```bash
# Find the process
netstat -ano | findstr :3000
# Kill the process
taskkill /PID <PID> /F
```

### 2. Python Virtual Environment Issues

If virtual environment activation fails:
```bash
# Remove existing environment
rm -rf .venv
# Create new environment
python -m venv .venv
# Activate
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/macOS
```

### 3. Node.js Dependencies Issues

If npm install fails:
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules
rm -rf node_modules
# Reinstall dependencies
npm install
```

### 4. CMake Build Issues

If build fails:
```bash
# Clean build directory
rm -rf build/*
# Reconfigure
cmake ..
# Rebuild
cmake --build .
```

## 📝 Additional Notes

1. **Development Mode**
   - Backend runs in debug mode
   - Frontend has hot reloading enabled
   - C++ core includes debug symbols

2. **Production Mode**
   - Set appropriate environment variables
   - Build frontend for production
   - Use release build for C++ core

3. **Security**
   - Change default secret keys
   - Use strong passwords
   - Enable HTTPS in production

## 🆘 Support

If you encounter any issues:
1. Check the [Troubleshooting Guide](REPORT.md#troubleshooting)
2. Search [GitHub Issues](https://github.com/your-repo/issues)
3. Contact support team

## 📚 Related Documentation

- [User Guide](REPORT.md)
- [API Documentation](http://localhost:8000/docs)
- [Architecture Overview](docs/architecture.md) 