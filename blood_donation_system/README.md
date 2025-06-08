# Blood Donation System Core

This directory contains the core C++ implementation of the blood donation system, including blood type compatibility checking and system-level operations.

## 📁 Directory Structure

```
blood_donation_system/
├── cpp_core/          # C++ implementation
│   ├── blood_logic.cpp
│   ├── blood_logic.h
│   └── main.cpp
│
├── python_app/        # Python integration
│   ├── app.py
│   └── requirements.txt
│
├── build/            # Build artifacts
└── CMakeLists.txt    # Build configuration
```

## 🚀 Getting Started

1. **Build Requirements**
   - CMake 3.10+
   - C++ compiler (GCC/Clang/MSVC)
   - Python 3.8+

2. **Build Process**
   ```bash
   # Create build directory
   mkdir build
   cd build

   # Configure
   cmake ..

   # Build
   cmake --build .
   ```

## 📚 Core Components

### Blood Logic (C++)
- **Blood Type Compatibility**
  - Universal donor (O-) rules
  - Rh factor compatibility
  - Blood type matching

- **Compatibility Rules**
  ```cpp
  class BloodCompatibility {
      static bool canDonate(const std::string& donorType, 
                           const std::string& recipientType);
      static std::string getCompatibilityMessage(
          const std::string& donorType, 
          const std::string& recipientType);
  };
  ```

### Python Integration
- **API Endpoints**
  - Blood type compatibility checking
  - Donor management
  - Request handling

## 🔧 Configuration

### CMake Configuration
```cmake
cmake_minimum_required(VERSION 3.10)
project(BloodDonationSystem)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
```

### Build Options
- Debug/Release builds
- Platform-specific settings
- Compiler flags

## 🧪 Testing

### C++ Tests
```bash
# Run C++ tests
cd build
ctest
```

### Python Tests
```bash
# Run Python tests
cd python_app
pytest
```

## 📝 Blood Type Rules

### Universal Donor
- O- can donate to any blood type

### Same Type Compatibility
- A+ → A+
- A- → A-
- B+ → B+
- B- → B-
- AB+ → AB+
- AB- → AB-

### Rh Factor Rules
- Negative can donate to positive
- Positive cannot donate to negative

### Special Cases
- O+ can donate to any positive blood type
- A- can donate to A and AB
- B- can donate to B and AB
- A+ can donate to A+ and AB+
- B+ can donate to B+ and AB+
- AB- can donate to AB- and AB+
- AB+ can only donate to AB+

## 🔒 Security

- Input validation
- Error handling
- Secure data processing

## 🚀 Performance

- Optimized algorithms
- Efficient data structures
- Minimal memory usage

## 📚 Documentation

- Code comments
- API documentation
- Usage examples

## 🔍 C++ Donor Search Feature

You can now search for donors by blood type using the C++ core directly:

```
cd build/bin
./blood_compatibility search <blood_type> <path_to_donors.csv>
```

Example:
```
./blood_compatibility search A+ ../../backend/donors.csv
```

This will print all donors with the specified blood type in CSV format (id,name,blood_type,contact). 