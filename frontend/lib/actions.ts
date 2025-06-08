"use server"

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you'd verify the password hash
  // For demo purposes, we'll just check if user exists
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  if (password.length < 6) {
    return { error: "Invalid credentials" }
  }

  return { success: true, email }
}

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const bloodGroup = formData.get("bloodGroup") as string
  const lastDonation = formData.get("lastDonation") as string
  const role = formData.get("role") as string

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Validation
  if (!name || !email || !password || !bloodGroup || !role) {
    return { error: "All required fields must be filled" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  return {
    success: true,
    user: {
      name,
      email,
      bloodGroup,
      lastDonation: lastDonation || null,
      role,
    },
  }
}

export async function updateProfileAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const location = formData.get("location") as string
  const bloodGroup = formData.get("bloodGroup") as string

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!name || !email || !phone || !location || !bloodGroup) {
    return { error: "All fields are required" }
  }

  return {
    success: true,
    user: { name, email, phone, location, bloodGroup },
  }
}

export async function scheduleDonationAction(formData: FormData) {
  const date = formData.get("date") as string
  const location = formData.get("location") as string
  const notes = formData.get("notes") as string

  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!date || !location) {
    return { error: "Date and location are required" }
  }

  const selectedDate = new Date(date)
  const today = new Date()

  if (selectedDate <= today) {
    return { error: "Please select a future date" }
  }

  return {
    success: true,
    donation: { date, location, notes },
  }
}
