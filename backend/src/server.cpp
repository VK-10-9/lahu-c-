#include <httplib.h>
#include <nlohmann/json.hpp>
#include <string>
#include <vector>
#include <memory>
#include <mutex>
#include <chrono>
#include <iomanip>
#include <sstream>

using json = nlohmann::json;
using namespace httplib;

// Blood donation data structures
struct Donation {
    std::string id;
    std::string donorId;
    std::string date;
    std::string location;
    std::string status;
    std::string recipient;
    std::string notes;
};

// Blood donation manager class
class BloodDonationManager {
private:
    std::vector<Donation> donations;
    std::mutex donationsMutex;

    std::string generateId() {
        auto now = std::chrono::system_clock::now();
        auto now_ms = std::chrono::duration_cast<std::chrono::milliseconds>(
            now.time_since_epoch()
        );
        return std::to_string(now_ms.count());
    }

public:
    std::vector<Donation> getAllDonations() {
        std::lock_guard<std::mutex> lock(donationsMutex);
        return donations;
    }

    Donation createDonation(const Donation& donation) {
        std::lock_guard<std::mutex> lock(donationsMutex);
        Donation newDonation = donation;
        newDonation.id = generateId();
        donations.push_back(newDonation);
        return newDonation;
    }

    bool updateDonation(const std::string& id, const Donation& updatedDonation) {
        std::lock_guard<std::mutex> lock(donationsMutex);
        for (auto& donation : donations) {
            if (donation.id == id) {
                donation = updatedDonation;
                donation.id = id; // Preserve the original ID
                return true;
            }
        }
        return false;
    }

    bool deleteDonation(const std::string& id) {
        std::lock_guard<std::mutex> lock(donationsMutex);
        auto it = std::remove_if(donations.begin(), donations.end(),
            [&id](const Donation& d) { return d.id == id; });
        if (it != donations.end()) {
            donations.erase(it, donations.end());
            return true;
        }
        return false;
    }
};

int main() {
    Server server;
    BloodDonationManager donationManager;

    // Enable CORS
    server.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    // GET /api/donations
    server.Get("/api/donations", [&](const Request&, Response& res) {
        auto donations = donationManager.getAllDonations();
        json response = json::array();
        for (const auto& donation : donations) {
            response.push_back({
                {"id", donation.id},
                {"donorId", donation.donorId},
                {"date", donation.date},
                {"location", donation.location},
                {"status", donation.status},
                {"recipient", donation.recipient},
                {"notes", donation.notes}
            });
        }
        res.set_content(response.dump(), "application/json");
    });

    // POST /api/donations
    server.Post("/api/donations", [&](const Request& req, Response& res) {
        try {
            json body = json::parse(req.body);
            Donation newDonation{
                "", // id will be generated
                body["donorId"].get<std::string>(),
                body["date"].get<std::string>(),
                body["location"].get<std::string>(),
                body["status"].get<std::string>(),
                body.value("recipient", ""),
                body.value("notes", "")
            };
            
            auto createdDonation = donationManager.createDonation(newDonation);
            json response = {
                {"id", createdDonation.id},
                {"donorId", createdDonation.donorId},
                {"date", createdDonation.date},
                {"location", createdDonation.location},
                {"status", createdDonation.status},
                {"recipient", createdDonation.recipient},
                {"notes", createdDonation.notes}
            };
            res.set_content(response.dump(), "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // PUT /api/donations/:id
    server.Put("/api/donations/:id", [&](const Request& req, Response& res) {
        try {
            std::string id = req.path_params.at("id");
            json body = json::parse(req.body);
            Donation updatedDonation{
                id,
                body["donorId"].get<std::string>(),
                body["date"].get<std::string>(),
                body["location"].get<std::string>(),
                body["status"].get<std::string>(),
                body.value("recipient", ""),
                body.value("notes", "")
            };
            
            if (donationManager.updateDonation(id, updatedDonation)) {
                res.set_content(json({{"message", "Donation updated successfully"}}).dump(), "application/json");
            } else {
                res.status = 404;
                res.set_content(json({{"error", "Donation not found"}}).dump(), "application/json");
            }
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(json({{"error", e.what()}}).dump(), "application/json");
        }
    });

    // DELETE /api/donations/:id
    server.Delete("/api/donations/:id", [&](const Request& req, Response& res) {
        std::string id = req.path_params.at("id");
        if (donationManager.deleteDonation(id)) {
            res.set_content(json({{"message", "Donation deleted successfully"}}).dump(), "application/json");
        } else {
            res.status = 404;
            res.set_content(json({{"error", "Donation not found"}}).dump(), "application/json");
        }
    });

    // Handle OPTIONS requests for CORS
    server.Options(".*", [](const Request&, Response& res) {
        res.set_content("", "text/plain");
    });

    std::cout << "Server starting on port 3001..." << std::endl;
    server.listen("localhost", 3001);
    return 0;
} 