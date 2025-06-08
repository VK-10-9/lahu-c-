#include "blood_logic.h"
#include <algorithm>
#include <stdexcept>

bool BloodCompatibility::canDonate(const std::string& donorType, const std::string& recipientType) {
    std::string donor = donorType;
    std::string recipient = recipientType;
    
    // Convert to uppercase for case-insensitive comparison
    std::transform(donor.begin(), donor.end(), donor.begin(), ::toupper);
    std::transform(recipient.begin(), recipient.end(), recipient.begin(), ::toupper);
    
    // Universal donor
    if (donor == "O-") return true;
    
    // Same blood type
    if (donor == recipient) return true;
    
    // O+ can donate to any positive blood type
    if (donor == "O+" && (recipient == "A+" || recipient == "B+" || recipient == "AB+" || recipient == "O+")) {
        return true;
    }
    
    // A- can donate to A and AB
    if (donor == "A-" && (recipient == "A+" || recipient == "A-" || recipient == "AB+" || recipient == "AB-")) {
        return true;
    }
    
    // B- can donate to B and AB
    if (donor == "B-" && (recipient == "B+" || recipient == "B-" || recipient == "AB+" || recipient == "AB-")) {
        return true;
    }
    
    // A+ can donate to A+ and AB+
    if (donor == "A+" && (recipient == "A+" || recipient == "AB+")) {
        return true;
    }
    
    // B+ can donate to B+ and AB+
    if (donor == "B+" && (recipient == "B+" || recipient == "AB+")) {
        return true;
    }
    
    // AB- can donate to AB- and AB+
    if (donor == "AB-" && (recipient == "AB-" || recipient == "AB+")) {
        return true;
    }
    
    // AB+ can only donate to AB+
    return (donor == "AB+" && recipient == "AB+");
}

std::string BloodCompatibility::getCompatibilityMessage(const std::string& donorType, const std::string& recipientType) {
    bool compatible = canDonate(donorType, recipientType);
    std::string message = "Donor (" + donorType + ") can" + (compatible ? "" : "not") + 
                         " donate to recipient (" + recipientType + ").";
    return message;
}
