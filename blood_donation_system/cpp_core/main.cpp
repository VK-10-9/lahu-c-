#include <iostream>
#include <string>
#include "blood_logic.h"

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <donor_blood_type> <recipient_blood_type>" << std::endl;
        return 1;
    }

    std::string donorType = argv[1];
    std::string recipientType = argv[2];
    
    try {
        bool canDonate = BloodCompatibility::canDonate(donorType, recipientType);
        std::string message = BloodCompatibility::getCompatibilityMessage(donorType, recipientType);
        
        // Output format: <compatible:true/false>:<message>
        std::cout << (canDonate ? "true" : "false") << ":" << message << std::endl;
        return 0;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}
