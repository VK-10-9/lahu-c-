"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Loader2, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn(email, password)

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        })
        router.push("/search")
      } else {
        setError(result.error || "Sign in failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen medical-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-medical-light rounded-xl flex items-center justify-center">
              <Heart className="h-7 w-7 text-medical-primary" />
            </div>
            <div>
              <span className="text-2xl font-bold text-medical-dark">Lahu</span>
              <p className="text-sm text-medical-secondary">Blood Donation Network</p>
            </div>
          </Link>
        </div>

        <Card className="card-shadow border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-medical-dark heading-secondary">Welcome Back</CardTitle>
            <CardDescription className="text-medical-secondary">
              Sign in to your account to continue helping save lives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="form-label">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="form-label">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input h-12"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full professional-button h-12 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-medical-secondary">
                {"Don't have an account? "}
                <Link href="/signup" className="text-medical-primary hover:text-red-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-700">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Demo Access</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Use any email with password "password123"</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
