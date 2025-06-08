#ifndef BLOOD_LOGIC_H
#define BLOOD_LOGIC_H

#include <string>

class BloodCompatibility {
public:
    static bool canDonate(const std::string& donorType, const std::string& recipientType);
    static std::string getCompatibilityMessage(const std::string& donorType, const std::string& recipientType);
};

#endif // BLOOD_LOGIC_H
