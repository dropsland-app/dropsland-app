"use client"
import MainApp from "@/components/main-app"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

export default function BeansApp() {
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      login("juampi") // Uses the iamjuampi profile from USER_DATA
    }
  }, [isAuthenticated, login])

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50 overflow-hidden">
      <MainApp />
    </div>
  )
}
