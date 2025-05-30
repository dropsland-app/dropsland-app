"use client"

import type React from "react"

import { useState } from "react"
import { Coffee, Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface LoginViewProps {
  onLogin: (username: string, password: string) => boolean
  onNavigateToSignup: () => void
}

export default function LoginView({ onLogin, onNavigateToSignup }: LoginViewProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Modificar la función handleSubmit para manejar correctamente el login

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Required fields",
        description: "Please enter your username and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const success = onLogin(username, password)

      if (!success) {
        toast({
          title: "Login error",
          description: "Incorrect username or password.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Beans</h1>
            <p className="text-gray-500 text-sm">Support creators with coffee tokens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">Use "juampi" for this demo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button onClick={onNavigateToSignup} className="text-amber-600 font-medium">
                Register
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

