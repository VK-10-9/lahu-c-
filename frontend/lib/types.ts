export interface User {
  id: string
  name: string
  email: string
  phone: string
  bloodGroup: BloodGroup
  location: string
  lastDonation: string | null
  totalDonations: number
  role: "donor" | "admin"
  isAvailable: boolean
  createdAt: string
}

export interface Donation {
  id: string
  donorId: string
  date: string
  location: string
  status: "completed" | "scheduled" | "cancelled"
  recipient?: string
  notes?: string
}

export interface DonationRequest {
  id: string
  requesterId: string
  bloodGroup: BloodGroup
  urgency: "low" | "medium" | "high" | "critical"
  location: string
  requiredBy: string
  status: "open" | "fulfilled" | "expired"
  createdAt: string
}

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
