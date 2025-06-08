"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Calendar, Phone, Mail, Filter, Loader2, Search, User, Droplet } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useDonors } from "@/hooks/use-donors"
import { useToast } from "@/hooks/use-toast"
import { calculateNextEligibleDate, isEligibleToDonate } from "@/lib/database"
import { SearchBar } from "@/components/ui/search-bar"
import { BloodCompatibilityChecker } from "@/components/blood-compatibility-checker"

export default function SearchPage() {
  const { user, isAuthenticated, signOut } = useAuth()
  const { donors, filters, isLoading, updateFilters, searchDonors } = useDonors()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin")
    }
  }, [isAuthenticated, router])

  const handleFilterChange = (field: string, value: string) => {
    updateFilters({ [field]: value })
  }

  const handleSearch = () => {
    toast({
      title: "Search updated",
      description: `Found ${donors.length} matching donors.`,
    })
  }

  const handleContactDonor = (donorName: string) => {
    toast({
      title: "Contact information",
      description: `You can now contact ${donorName} using the provided details.`,
    })
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen medical-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-medical-primary mx-auto mb-4" />
          <p className="text-medical-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="professional-header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-medical-light rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-medical-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-medical-dark">Lahu</h1>
              <p className="text-xs text-medical-secondary">Blood Donation Network</p>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-medical-light rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-medical-primary" />
              </div>
              <span className="text-sm text-medical-secondary">Welcome, {user.name}</span>
            </div>
            <Link href="/profile">
              <Button variant="outline" className="border-2 border-gray-200 hover:border-medical-primary">
                Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={signOut}
              className="border-2 border-gray-200 hover:border-red-500 hover:text-red-600"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-medical-dark mb-2 heading-secondary">Find Blood Donors</h2>
          <p className="text-medical-secondary">Search for compatible donors in your area</p>
        </div>

        {/* Blood Compatibility Checker */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Droplet className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-semibold">Blood Type Compatibility Checker</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <BloodCompatibilityChecker />
              <p className="mt-4 text-sm text-medical-secondary">
                Check if a donor's blood type is compatible with a recipient's blood type.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-3">Blood Type Compatibility Guidelines</h4>
              <ul className="space-y-2 text-sm text-medical-secondary">
                <li>• O- is the universal donor (can donate to anyone)</li>
                <li>• AB+ is the universal recipient (can receive from anyone)</li>
                <li>• O+ can donate to A+, B+, AB+, and O+</li>
                <li>• A- can donate to A+, A-, AB+, and AB-</li>
                <li>• B- can donate to B+, B-, AB+, and AB-</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-semibold mb-6">Search for Donors</h3>
        </div>

        {/* Search Filters */}
        <Card className="mb-8 card-shadow border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-medical-dark">
              <Filter className="mr-2 h-5 w-5 text-medical-primary" />
              Search Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="blood-group-filter" className="form-label">
                  Blood Group
                </Label>
                <Select value={filters.bloodGroup} onValueChange={(value) => handleFilterChange("bloodGroup", value)}>
                  <SelectTrigger className="form-input h-12">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blood Groups</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location-filter" className="form-label">
                  Location
                </Label>
                <SearchBar
                  id="location-filter"
                  placeholder="Search location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange("location", e.target.value)}
                  className="form-input h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability" className="form-label">
                  Availability
                </Label>
                <Select
                  value={filters.availability}
                  onValueChange={(value) => handleFilterChange("availability", value)}
                >
                  <SelectTrigger className="form-input h-12">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Donors</SelectItem>
                    <SelectItem value="available">Available Now</SelectItem>
                    <SelectItem value="upcoming">Available Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full professional-button h-12 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                  Search Donors
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-medical-dark">Search Results</h3>
            <span className="text-medical-secondary">{donors.length} donors found</span>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-medical-primary mx-auto mb-4" />
              <p className="text-medical-secondary">Loading donors...</p>
            </div>
          ) : donors.length === 0 ? (
            <Card className="card-shadow border-0">
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-medical-dark mb-2">No donors found</h3>
                <p className="text-medical-secondary">Try adjusting your search filters to find more donors.</p>
              </CardContent>
            </Card>
          ) : (
            donors.map((donor) => {
              const nextEligible = calculateNextEligibleDate(donor.lastDonation)
              const isEligible = isEligibleToDonate(donor.lastDonation)

              return (
                <Card key={donor.id} className="card-shadow card-hover border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-12 h-12 bg-medical-light rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-medical-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-medical-dark">{donor.name}</h4>
                            <Badge
                              className={isEligible && donor.isAvailable ? "status-available" : "status-unavailable"}
                            >
                              {isEligible && donor.isAvailable ? "Available" : "Not Available"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center text-medical-secondary">
                              <Heart className="mr-3 h-4 w-4 text-medical-primary" />
                              <span className="font-medium text-medical-dark">Blood Group: {donor.bloodGroup}</span>
                            </div>
                            <div className="flex items-center text-medical-secondary">
                              <MapPin className="mr-3 h-4 w-4 text-medical-primary" />
                              <span>Location: {donor.location || "Not specified"}</span>
                            </div>
                            <div className="flex items-center text-medical-secondary">
                              <Calendar className="mr-3 h-4 w-4 text-medical-primary" />
                              <span>Next Eligible: {nextEligible}</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {donor.phone && (
                              <div className="flex items-center text-medical-secondary">
                                <Phone className="mr-3 h-4 w-4 text-medical-primary" />
                                <span>{donor.phone}</span>
                              </div>
                            )}
                            <div className="flex items-center text-medical-secondary">
                              <Mail className="mr-3 h-4 w-4 text-medical-primary" />
                              <span>{donor.email}</span>
                            </div>
                            <div className="text-sm text-medical-secondary">
                              <strong>Total donations:</strong> {donor.totalDonations}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 ml-6">
                        <Button
                          size="sm"
                          className="professional-button text-white font-medium px-6"
                          disabled={!isEligible || !donor.isAvailable}
                          onClick={() => handleContactDonor(donor.name)}
                        >
                          Contact Donor
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-gray-200 hover:border-medical-primary px-6"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
