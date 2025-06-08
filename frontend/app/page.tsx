"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Search, Calendar, Loader2, Shield, Award, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/search")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen medical-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-medical-primary mx-auto mb-4" />
          <p className="text-medical-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="professional-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-medical-light rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-medical-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-medical-dark">Lahu</h1>
              <p className="text-xs text-medical-secondary">Blood Donation Network</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link href="/signin">
              <Button
                variant="outline"
                className="border-2 border-gray-200 hover:border-medical-primary hover:text-medical-primary"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="professional-button text-white">Register Now</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          <div className="container mx-auto px-4 py-20 text-center relative">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Trusted Healthcare Platform
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 heading-primary">
                Save Lives with
                <span className="block text-red-100">Lahu</span>
              </h2>
              <p className="text-xl text-red-50 mb-10 max-w-2xl mx-auto leading-relaxed">
                Connect with verified blood donors in your community. Our secure platform ensures safe, reliable blood
                donation coordination when every second counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-4 h-auto font-semibold"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Find Donors Now
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4 h-auto font-semibold"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Become a Donor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-medical-primary" />
              </div>
              <h3 className="text-3xl font-bold text-medical-dark mb-2">10,000+</h3>
              <p className="text-medical-secondary">Registered Donors</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-medical-primary" />
              </div>
              <h3 className="text-3xl font-bold text-medical-dark mb-2">25,000+</h3>
              <p className="text-medical-secondary">Lives Saved</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-medical-primary" />
              </div>
              <h3 className="text-3xl font-bold text-medical-dark mb-2">24/7</h3>
              <p className="text-medical-secondary">Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 medical-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-medical-dark mb-4 heading-secondary">How Lahu Works</h3>
            <p className="text-xl text-medical-secondary max-w-2xl mx-auto">
              Our streamlined process ensures quick, safe, and reliable blood donation coordination
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center card-shadow card-hover border-0">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-medical-primary" />
                </div>
                <CardTitle className="text-xl text-medical-dark heading-secondary">Register Securely</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-medical-secondary text-base leading-relaxed">
                  Create your verified donor profile with medical history, blood type, and availability. All data is
                  encrypted and HIPAA compliant.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center card-shadow card-hover border-0">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-medical-primary" />
                </div>
                <CardTitle className="text-xl text-medical-dark heading-secondary">Smart Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-medical-secondary text-base leading-relaxed">
                  Our AI-powered system instantly matches compatible donors based on blood type, location, and
                  availability for emergency needs.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center card-shadow card-hover border-0">
              <CardHeader className="pb-4">
                <div className="w-20 h-20 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-medical-primary" />
                </div>
                <CardTitle className="text-xl text-medical-dark heading-secondary">Track & Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-medical-secondary text-base leading-relaxed">
                  Monitor donation history, schedule appointments, and receive reminders. Track your impact and
                  contribution to saving lives.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-medical-primary" />
                <span className="text-medical-secondary font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-medical-primary" />
                <span className="text-medical-secondary font-medium">Medical Grade Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-medical-primary" />
                <span className="text-medical-secondary font-medium">Verified Donors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* College/University Credits */}
      <section className="py-16 medical-gradient">
        <div className="container mx-auto px-4 text-center">
          <h4 className="text-2xl font-semibold text-medical-dark mb-8">Academic Excellence</h4>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-medical-secondary mb-2">
              <strong>State University of Technology</strong>
            </p>
            <p className="text-lg text-medical-secondary mb-6">College of Computer Science & Engineering</p>
            <Card className="stats-card p-6 card-shadow">
              <h5 className="text-lg font-semibold text-medical-dark mb-3">Project Team</h5>
              <p className="text-medical-secondary">
                <strong className="text-medical-dark">Alex Johnson</strong>
                <br />
                Department of Computer Science
                <br />
                Final Year Capstone Project - 2024
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Lahu</span>
                <p className="text-sm text-gray-400">Blood Donation Network</p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              Connecting donors and recipients to save lives, one donation at a time. Building healthier communities
              through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
