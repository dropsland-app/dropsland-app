"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <div className="relative flex flex-col h-full w-full bg-white overflow-hidden">
      {/* Ambient Lighting Effect - Very subtle brand tint for light mode */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[150%] h-[60%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1FA9D6]/10 via-white/0 to-transparent pointer-events-none blur-3xl" />

      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10 relative">
        {/* Logo Section */}
        <div className="w-48 mb-12 animate-in fade-in zoom-in-95 duration-1000">
          <Image
            src="/images/dropsland-logo.png"
            alt="DROPSLAND"
            width={200}
            height={60}
            // brightness-0 forces the logo to be solid black (perfect for light mode minimalism)
            className="w-full h-auto opacity-90"
            priority
          />
        </div>

        {/* Minimal Typographic Hero - Dark Text */}
        <div className="text-center space-y-4 max-w-xs mb-16 animate-in slide-in-from-bottom-4 duration-1000 delay-100">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 leading-tight">
            Music. <br />
            <span className="text-[#1FA9D6]">Ownership.</span> <br />
            Access.
          </h1>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            The verifiable event layer for the next generation of music
            communities.
          </p>
        </div>

        {/* Primary Action - Solid Black Button for High Contrast */}
        <div className="w-full max-w-xs space-y-8 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Button
            onClick={login}
            className="w-full h-14 bg-zinc-900 text-white hover:bg-black border-none rounded-full font-bold text-base transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-200 group"
          >
            Enter App
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Subtle Footer */}
          <div className="flex justify-center items-center opacity-40 hover:opacity-100 transition-opacity duration-300">
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
              Powered by Privy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
