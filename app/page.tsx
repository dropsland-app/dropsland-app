"use client";

import { useEffect, useState } from "react";
import MainApp from "@/components/main-app";
import LoginScreen from "@/components/login-screen";
import { useAuth } from "@/hooks/use-auth";

export default function BeansApp() {
  const { isAuthenticated, user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch by waiting for client load
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Or a loading spinner

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-950 overflow-hidden">
      {/* THE GATEKEEPER LOGIC */}
      {/*{isAuthenticated ? <MainApp /> : <LoginScreen />}*/}
      <MainApp />
    </div>
  );
}
