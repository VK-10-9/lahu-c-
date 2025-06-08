import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bloodGroup = searchParams.get("bloodGroup")
    const location = searchParams.get("location")
    const availability = searchParams.get("availability")

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, you'd query your database with these filters
    const mockDonors = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        bloodGroup: "O+",
        location: "Downtown",
        lastDonation: "2024-01-15",
        totalDonations: 12,
        isAvailable: true,
      },
      {
        id: "2",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 987-6543",
        bloodGroup: "A+",
        location: "Uptown",
        lastDonation: "2024-02-20",
        totalDonations: 8,
        isAvailable: true,
      },
    ]

    // Apply filters (simplified for demo)
    let filteredDonors = mockDonors

    if (bloodGroup && bloodGroup !== "all") {
      filteredDonors = filteredDonors.filter((donor) => donor.bloodGroup === bloodGroup)
    }

    if (location) {
      filteredDonors = filteredDonors.filter((donor) => donor.location.toLowerCase().includes(location.toLowerCase()))
    }

    if (availability === "available") {
      filteredDonors = filteredDonors.filter((donor) => donor.isAvailable)
    }

    return NextResponse.json({
      donors: filteredDonors,
      total: filteredDonors.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch donors" }, { status: 500 })
  }
}
