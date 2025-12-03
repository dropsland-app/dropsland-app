"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface LoginScreenProps {
  onLogin: (username: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Modificar la función handleSubmit para permitir iniciar sesión con los nuevos artistas
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
      // Verificar si las credenciales son correctas
      if (password === "1234") {
        // Verificar si es un artista
        if (username === "iamjuampi") {
          onLogin("juampi")
        } else if (username === "banger") {
          onLogin("banger")
        } else if (username === "Nicola Marti" || username === "nicolamarti") {
          onLogin("nicolamarti")
        } else if (username === "AXS" || username === "axs") {
          onLogin("axs")
        } else if (username === "FLUSH" || username === "flush") {
          onLogin("flush")
        } else if (username === "DaniløDR" || username === "daniloDR") {
          onLogin("daniloDR")
        } else if (username === "Spitflux" || username === "spitflux") {
          onLogin("spitflux")
        } else if (username === "Kr4D" || username === "kr4d") {
          onLogin("kr4d")
        } else if (username === "fan" || username === "musicfan") {
          // Login como fan
          onLogin("fan")
        } else {
          toast({
            title: "Login error",
            description: "User not found.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      } else {
        toast({
          title: "Login error",
          description: "Incorrect password.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-64 h-24 flex items-center justify-center mb-2">
              <Image
                src="/images/dropsland-20logo-202025-20ddd.png"
                alt="DROPSLAND"
                width={240}
                height={80}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm">Support artists with music tokens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10 bg-white/5 backdrop-blur-sm border-white/20 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 bg-white/5 backdrop-blur-sm border-white/20 text-white"
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

            <Button
              type="submit"
              className="w-full bg-bright-yellow hover:bg-bright-yellow-700 text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <span className="text-bright-yellow font-medium cursor-pointer" onClick={() => alert("Soon")}>
                Register
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">© 2025 DROPSLAND. All rights reserved.</p>
      </div>
    </div>
  )
}
