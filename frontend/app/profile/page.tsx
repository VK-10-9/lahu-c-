"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Edit, Calendar, MapPin, Phone, Mail, User, Loader2, Plus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { getDonationsByDonor, saveDonation, calculateNextEligibleDate, isEligibleToDonate } from "@/lib/database"
import { generateId } from "@/lib/auth"
import type { Donation, BloodGroup } from "@/lib/types"

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [donations, setDonations] = useState<Donation[]>([])
  const [error, setError] = useState("")

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bloodGroup: "" as BloodGroup,
  })

  const [scheduleData, setScheduleData] = useState({
    date: "",
    location: "",
    notes: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin")
      return
    }

    if (user) {
      setEditData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        bloodGroup: user.bloodGroup,
      })

      // Load donation history
      const userDonations = getDonationsByDonor(user.id)
      setDonations(userDonations)
    }
  }, [isAuthenticated, user, router])

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!editData.name || !editData.email || !editData.bloodGroup) {
      setError("Name, email, and blood group are required")
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      updateUser(editData)
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (err) {
      setError("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!scheduleData.date || !scheduleData.location) {
      setError("Date and location are required")
      setIsLoading(false)
      return
    }

    const selectedDate = new Date(scheduleData.date)
    const today = new Date()

    if (selectedDate <= today) {
      setError("Please select a future date")
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call

      const newDonation: Donation = {
        id: generateId(),
        donorId: user!.id,
        date: scheduleData.date,
        location: scheduleData.location,
        status: "scheduled",
        notes: scheduleData.notes,
      }

      saveDonation(newDonation)
      setDonations((prev) => [newDonation, ...prev])
      setIsScheduling(false)
      setScheduleData({ date: "", location: "", notes: "" })

      toast({
        title: "Donation scheduled",
        description: `Your donation has been scheduled for ${scheduleData.date}.`,
      })
    } catch (err) {
      setError("Failed to schedule donation")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAvailability = () => {
    if (!user) return

    updateUser({ isAvailable: !user.isAvailable })
    toast({
      title: "Availability updated",
      description: `You are now ${!user.isAvailable ? "available" : "unavailable"} for donations.`,
    })
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const nextEligible = calculateNextEligibleDate(user.lastDonation)
  const isEligible = isEligibleToDonate(user.lastDonation)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Lahu</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <Link href="/search">
              <Button variant="outline">Find Donors</Button>
            </Link>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
          <p className="text-gray-600">Manage your donor information and view donation history</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your donor profile details</CardDescription>
                </div>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>Update your personal information and donor details.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid gap-4 py-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Full Name *</Label>
                          <Input
                            id="edit-name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-email">Email *</Label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-phone">Phone</Label>
                          <Input
                            id="edit-phone"
                            value={editData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-location">Location</Label>
                          <Input
                            id="edit-location"
                            value={editData.location}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-blood-group">Blood Group *</Label>
                          <Select
                            value={editData.bloodGroup}
                            onValueChange={(value) => setEditData({ ...editData, bloodGroup: value as BloodGroup })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
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
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{user.location || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <Badge variant="outline" className="font-medium">
                        {user.bloodGroup}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Next Eligible</p>
                      <p className="font-medium">{nextEligible}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation History */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Your past and scheduled blood donations</CardDescription>
                </div>
                <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Donation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Schedule New Donation</DialogTitle>
                      <DialogDescription>Schedule your next blood donation appointment.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleScheduleSubmit}>
                      <div className="grid gap-4 py-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="schedule-date">Donation Date *</Label>
                          <Input
                            id="schedule-date"
                            type="date"
                            value={scheduleData.date}
                            onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule-location">Location *</Label>
                          <Input
                            id="schedule-location"
                            placeholder="e.g., City Hospital, Red Cross Center"
                            value={scheduleData.location}
                            onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule-notes">Notes (Optional)</Label>
                          <Textarea
                            id="schedule-notes"
                            placeholder="Any additional notes..."
                            value={scheduleData.notes}
                            onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsScheduling(false)} type="button">
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            "Schedule Donation"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                      <p className="text-gray-600 mb-4">Schedule your first donation to get started.</p>
                      <Button onClick={() => setIsScheduling(true)} className="bg-red-600 hover:bg-red-700">
                        Schedule First Donation
                      </Button>
                    </div>
                  ) : (
                    donations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{donation.location}</p>
                          <p className="text-sm text-gray-500">{donation.date}</p>
                          {donation.notes && <p className="text-sm text-gray-600 mt-1">{donation.notes}</p>}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            donation.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : donation.status === "scheduled"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-gray-50 text-gray-700"
                          }
                        >
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {typeof user.totalDonations === 'number' ? user.totalDonations : 0}
                  </div>
                  <p className="text-sm text-gray-500">Total Donations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(typeof user.totalDonations === 'number' ? user.totalDonations : 0) * 3}
                  </div>
                  <p className="text-sm text-gray-500">Lives Potentially Saved</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Last Donation</span>
                    <span className="text-sm font-medium">{user.lastDonation || "Never"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Next Eligible</span>
                    <span className="text-sm font-medium">{nextEligible}</span>
                  </div>
                  <Badge
                    className={`w-full justify-center ${
                      isEligible ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {isEligible ? "Eligible to Donate" : "Not Yet Eligible"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => setIsScheduling(true)}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!isEligible}
                >
                  Schedule Donation
                </Button>
                <Button onClick={toggleAvailability} variant="outline" className="w-full">
                  {user.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </Button>
                <Button variant="outline" className="w-full">
                  Download Certificate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Currently Available</span>
                  <Badge
                    variant={user.isAvailable ? "default" : "secondary"}
                    className={user.isAvailable ? "bg-green-100 text-green-800" : ""}
                  >
                    {user.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Toggle your availability to let others know if you can donate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
