import type { User, Donation, BloodGroup } from "./types"

const DONATIONS_KEY = "blood_tracker_donations"
const REQUESTS_KEY = "blood_tracker_requests"

// Initialize with sample data
export function initializeSampleData() {
  if (typeof window === "undefined") return

  const existingUsers = localStorage.getItem("blood_tracker_users")
  if (!existingUsers) {
    const sampleUsers: User[] = [
      {
        id: "1",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 123-4567",
        bloodGroup: "O+",
        location: "Downtown",
        lastDonation: "2024-01-15",
        totalDonations: 12,
        role: "donor",
        isAvailable: true,
        createdAt: "2024-01-01",
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
        role: "donor",
        isAvailable: true,
        createdAt: "2024-01-01",
      },
      {
        id: "3",
        name: "Mike Davis",
        email: "mike.davis@email.com",
        phone: "+1 (555) 456-7890",
        bloodGroup: "B-",
        location: "Midtown",
        lastDonation: "2024-03-10",
        totalDonations: 15,
        role: "donor",
        isAvailable: false,
        createdAt: "2024-01-01",
      },
    ]
    localStorage.setItem("blood_tracker_users", JSON.stringify(sampleUsers))
  }

  const existingDonations = localStorage.getItem(DONATIONS_KEY)
  if (!existingDonations) {
    const sampleDonations: Donation[] = [
      {
        id: "1",
        donorId: "1",
        date: "2024-01-15",
        location: "City Hospital",
        status: "completed",
        recipient: "Emergency Patient",
      },
      {
        id: "2",
        donorId: "1",
        date: "2023-10-10",
        location: "Red Cross Center",
        status: "completed",
      },
    ]
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(sampleDonations))
  }
}

export function getDonations(): Donation[] {
  if (typeof window === "undefined") return []

  const donations = localStorage.getItem(DONATIONS_KEY)
  return donations ? JSON.parse(donations) : []
}

export function saveDonation(donation: Donation) {
  if (typeof window === "undefined") return

  const donations = getDonations()
  const existingIndex = donations.findIndex((d) => d.id === donation.id)

  if (existingIndex >= 0) {
    donations[existingIndex] = donation
  } else {
    donations.push(donation)
  }

  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations))
}

export function getDonationsByDonor(donorId: string): Donation[] {
  return getDonations().filter((d) => d.donorId === donorId)
}

export function getCompatibleBloodGroups(requestedGroup: BloodGroup): BloodGroup[] {
  const compatibility: Record<BloodGroup, BloodGroup[]> = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"],
  }

  return compatibility[requestedGroup] || []
}

export function calculateNextEligibleDate(lastDonation: string | null): string {
  if (!lastDonation) return new Date().toISOString().split("T")[0]

  const lastDate = new Date(lastDonation)
  const nextDate = new Date(lastDate)
  nextDate.setDate(nextDate.getDate() + 90) // 90 days between donations

  return nextDate.toISOString().split("T")[0]
}

export function isEligibleToDonate(lastDonation: string | null): boolean {
  if (!lastDonation) return true

  const nextEligible = calculateNextEligibleDate(lastDonation)
  const today = new Date().toISOString().split("T")[0]

  return today >= nextEligible
}
