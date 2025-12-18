// components/login-screen.tsx

"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Music2 } from "lucide-react";

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-black">
      {/* 1. Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/electronic-music-stage-lights.jpg" // Using asset from REPO list
          alt="Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
      </div>

      {/* 2. Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-12 px-6">
        {/* Brand Section */}
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="relative w-full max-w-[280px] h-24 mb-2">
            {/* Using the logo from repo assets */}
            <Image
              src="/images/dropsland-logo.png"
              alt="DROPSLAND"
              fill
              className="object-contain filter brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
            <Music2 className="w-3 h-3 text-[#1FA9D6]" />
            <span className="text-[#1FA9D6] text-xs font-bold tracking-widest uppercase">
              Web3 Music Events
            </span>
          </div>

          <p className="text-gray-300 text-sm text-center mt-6 max-w-xs leading-relaxed">
            Connect with DJs, collect event access NFTs, and redeem real-world
            perks.
          </p>
        </div>

        {/* Action Section */}
        <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Button
            onClick={login}
            className="w-full bg-[#1FA9D6] hover:bg-[#1F89B9] text-black font-bold h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(249,191,21,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] border-none group"
          >
            Enter Dropsland
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Powered by
            </p>
            <div className="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-4 h-4 rounded-sm bg-white/20" />{" "}
              {/* Abstract Privy Logo placeholder */}
              <span className="text-xs font-semibold text-white">Privy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
