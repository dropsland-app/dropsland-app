"use client"
import MainApp from "@/components/main-app"
import { useAuth } from "@/hooks/use-auth"

export default function BeansApp() {
  const { login, isAuthenticated } = useAuth()

  // Eliminar este efecto
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     login("juampi")
  //   }
  // }, [isAuthenticated, login])

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 overflow-hidden">
      <MainApp />
    </div>
  )
}

