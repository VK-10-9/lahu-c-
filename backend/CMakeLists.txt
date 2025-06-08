cmake_minimum_required(VERSION 3.10)
project(blood_donation_server)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add httplib and nlohmann_json
include(FetchContent)

FetchContent_Declare(
    httplib
    GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
    GIT_TAG v0.14.1
)

FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.3
)

FetchContent_MakeAvailable(httplib json)

# Add executable
add_executable(server src/server.cpp)

# Link libraries
target_link_libraries(server
    PRIVATE
    httplib::httplib
    nlohmann_json::nlohmann_json
) 