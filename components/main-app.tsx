"use client";

import HomeView from "@/components/home-view";
import Image from "next/image";

export default function MainApp() {
  // This component now ONLY renders the Home/Reels feed.
  // The other sections (Profile, Wallet) are now handled by their own page.tsx files.

  return (
    <div className="h-screen w-full bg-black text-white relative">
      {/* Transparent Header for Reels */}
      <header className="absolute top-0 left-0 right-0 z-50 h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center justify-start h-12 px-4 pointer-events-auto">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className="h-6 w-auto"
            priority
          />
        </div>
      </header>

      {/* The Reel Feed */}
      <HomeView onSelectArtist={(id) => console.log("Navigating to", id)} />
    </div>
  );
}
