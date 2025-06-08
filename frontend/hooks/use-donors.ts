"use client"

import { useState, useEffect } from "react"
import type { User, BloodGroup } from "@/lib/types"
import { getAllUsers } from "@/lib/auth"
import { getCompatibleBloodGroups, isEligibleToDonate } from "@/lib/database"

interface SearchFilters {
  bloodGroup: BloodGroup | "all"
  location: string
  availability: "all" | "available" | "upcoming"
}

export function useDonors() {
  const [donors, setDonors] = useState<User[]>([])
  const [filteredDonors, setFilteredDonors] = useState<User[]>([])
  const [filters, setFilters] = useState<SearchFilters>({
    bloodGroup: "all",
    location: "",
    availability: "all",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDonors()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [donors, filters])

  const loadDonors = () => {
    setIsLoading(true)
    const allUsers = getAllUsers()
    const donorUsers = allUsers.filter((user) => user.role === "donor")
    setDonors(donorUsers)
    setIsLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...donors]

    // Filter by blood group compatibility
    if (filters.bloodGroup !== "all") {
      const compatibleGroups = getCompatibleBloodGroups(filters.bloodGroup)
      filtered = filtered.filter((donor) => compatibleGroups.includes(donor.bloodGroup))
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((donor) => donor.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    // Filter by availability
    if (filters.availability === "available") {
      filtered = filtered.filter((donor) => donor.isAvailable && isEligibleToDonate(donor.lastDonation))
    } else if (filters.availability === "upcoming") {
      filtered = filtered.filter((donor) => !isEligibleToDonate(donor.lastDonation))
    }

    setFilteredDonors(filtered)
  }

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const searchDonors = (searchFilters: SearchFilters) => {
    setFilters(searchFilters)
  }

  return {
    donors: filteredDonors,
    filters,
    isLoading,
    updateFilters,
    searchDonors,
    refreshDonors: loadDonors,
  }
}
