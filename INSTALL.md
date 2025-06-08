# Lahu Installation Guide

This guide provides detailed instructions for installing the Lahu Blood Donation Management System.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Pre-Installation Steps](#pre-installation-steps)
3. [Installation Process](#installation-process)
4. [Post-Installation Steps](#post-installation-steps)
5. [Verification](#verification)
6. [Common Issues](#common-issues)
7. [Additional Notes](#additional-notes)

## System Requirements

### Hardware Requirements
- CPU: 1.6 GHz or faster
- RAM: 4 GB minimum (8 GB recommended)
- Storage: 1 GB free space
- Network: Broadband internet connection

### Software Requirements

#### Windows
- Windows 10 or later
- Python 3.8 or later
- Node.js 16 or later
- CMake 3.10 or later
- Visual Studio 2019 or later (for C++ build)
- Git

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install -y python3.8 python3.8-venv
sudo apt install -y nodejs npm
sudo apt install -y cmake
sudo apt install -y build-essential
sudo apt install -y git
```

#### macOS
```bash
brew install python@3.8
brew install node
brew install cmake
brew install git
```

## Pre-Installation Steps

1. **Install Python**
   ```bash
   # Verify Python installation
   python --version
   # Should show Python 3.8 or later
   ```

2. **Install Node.js**
   ```bash
   # Verify Node.js installation
   node --version
   # Should show v16 or later
   ```

3. **Install CMake**
   ```bash
   # Verify CMake installation
   cmake --version
   # Should show 3.10 or later
   ```

4. **Install Git**
   ```bash
   # Verify Git installation
   git --version
   ```

## Installation Process

1. **Clone the Repository**
   ```bash
   git clone https://github.com/VK-10-9/lahu-c-.git
   cd lahu
   ```

2. **Backend Installation**
   ```bash
   cd backend
   python -m venv .venv
   
   # On Windows
   .venv\Scripts\activate
   
   # On Linux/macOS
   source .venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **C++ Core Installation**
   ```bash
   cd blood_donation_system
   mkdir build
   cd build
   cmake ..
   cmake --build .
   ```

4. **Frontend Installation**
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

## Post-Installation Steps

1. **Backend Configuration**
   ```bash
   cd backend
   # Create .env file
   echo "SECRET_KEY=your-secret-key" > .env
   echo "DATABASE_URL=your-database-url" >> .env
   ```

2. **Frontend Configuration**
   ```bash
   cd frontend
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
   ```

## Verification

1. **Verify Backend**
   ```bash
   cd backend
   uvicorn app:app --reload
   # Should start server at http://localhost:8000
   ```

2. **Verify C++ Core**
   ```bash
   cd blood_donation_system/build
   ./blood_logic_test
   # Should run tests successfully
   ```

3. **Verify Frontend**
   ```bash
   cd frontend
   npm run dev
   # Should start server at http://localhost:3000
   ```

## Common Issues

### Port Conflicts
If port 8000 or 3000 is already in use:
```bash
# For backend
uvicorn app:app --reload --port 8001

# For frontend
npm run dev -- -p 3001
```

### Virtual Environment Issues
If you encounter virtual environment problems:
```bash
# Remove existing environment
rm -rf .venv

# Create new environment
python -m venv .venv
```

### Node.js Dependencies Issues
If you have npm dependency problems:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall dependencies
npm install
```

### CMake Build Issues
If you encounter CMake build problems:
```bash
# Clean build directory
rm -rf build/*

# Rebuild
cmake ..
cmake --build .
```

## Additional Notes

### Development vs Production
- Development mode includes hot-reloading and debug information
- Production mode should be used for deployment
- Use appropriate environment variables for each mode

### Security Considerations
- Keep your .env files secure
- Don't commit sensitive information
- Use strong passwords and keys

### Support
For additional support:
- Check the [GitHub repository](https://github.com/VK-10-9/lahu-c-)
- Open an issue for bugs
- Contact the development team

## Related Documentation
- [README.md](README.md)
- [USAGE.md](USAGE.md)
- [REPORT.md](REPORT.md) 