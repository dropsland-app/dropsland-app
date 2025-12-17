"use client";

import { useAuth } from "@/hooks/use-auth"; // Use the hook directly
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Remove props, we use the hook
export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-64 h-24 flex items-center justify-center mb-2">
              <Image
                src="/images/dropsland-logo.png" // Ensure this path is correct
                alt="DROPSLAND"
                width={240}
                height={80}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm text-center">
              Event access & music collectibles
            </p>
          </div>

          <div className="space-y-4">
            {/* The Login Button now just calls Privy's login */}
            <Button
              onClick={login}
              className="w-full bg-bright-yellow hover:bg-bright-yellow-700 text-black font-medium h-12 text-lg"
            >
              Sign In / Register
            </Button>
            <p className="text-xs text-center text-gray-500">
              Powered by Privy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
