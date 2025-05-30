"use client"

import type React from "react"

import { useState } from "react"
import { Coffee, Eye, EyeOff, Lock, Mail, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface SignupViewProps {
  onSignup: (username: string, email: string, password: string) => boolean
  onNavigateToLogin: () => void
}

export default function SignupView({ onSignup, onNavigateToLogin }: SignupViewProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Required fields",
        description: "Please complete all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please verify that passwords are the same",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const success = onSignup(username, email, password)

      if (!success) {
        toast({
          title: "Registration error",
          description: "Could not complete registration. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 flex items-center">
        <button onClick={onNavigateToLogin} className="flex items-center text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500 text-sm">Join the Beans community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Choose a username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button onClick={onNavigateToLogin} className="text-amber-600 font-medium">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">© 2025 Beans. All rights reserved.</p>
      </div>
    </div>
  )
}

