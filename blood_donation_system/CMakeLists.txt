cmake_minimum_required(VERSION 3.10)
project(BloodDonationSystem)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Create the executable
add_executable(blood_compatibility 
    cpp_core/blood_logic.cpp
    cpp_core/main.cpp
)

# Set output directory
set(EXECUTABLE_OUTPUT_PATH ${CMAKE_BINARY_DIR}/bin)

# For Windows
if(WIN32)
    set_target_properties(blood_compatibility PROPERTIES SUFFIX ".exe")
endif()
