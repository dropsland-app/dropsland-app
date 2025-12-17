"use client";

import { useState, useRef, useEffect } from "react";
import HomeView from "@/components/home-view";
import ExploreScreen from "@/components/explore-screen";
import UploadView from "@/components/upload-view";
import WalletView from "@/components/wallet-view";
import ActivityView from "@/components/activity-view";
import ProfileView from "@/components/profile-view";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import {
  Home,
  Search,
  Upload,
  Wallet,
  Bell,
  User,
  Activity,
} from "lucide-react";

export default function MainApp() {
  const [activeScreen, setActiveScreen] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const isLightMode = activeScreen >= 2;

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const screenWidth = containerRef.current.offsetWidth;
      const newScreen = Math.round(scrollLeft / screenWidth);
      if (newScreen !== activeScreen) {
        setActiveScreen(newScreen);
      }
    }
  };

  const handleNavigate = (screenIndex: number) => {
    if (containerRef.current) {
      const screenWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: screenWidth * screenIndex,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Pause all audio elements whenever the screen changes
    const allAudio = document.querySelectorAll("audio");
    allAudio.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [activeScreen]);

  return (
    <div className="h-screen flex flex-col bg-black relative">
      <header
        className={`absolute top-0 left-0 right-0 z-50 h-16 ${
          isLightMode
            ? "bg-gradient-to-b from-white via-white/80 to-transparent"
            : "bg-gradient-to-b from-black via-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center justify-start h-12 px-2">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className={`h-5 w-auto ${isLightMode ? "invert" : ""}`}
            priority
          />
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-scroll overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        <div className="min-w-full h-full flex-shrink-0 snap-start">
          <HomeView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 snap-start">
          <ExploreScreen onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <UploadView />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <WalletView />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <ActivityView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <ProfileView />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
        <div
          className={`
                  pointer-events-auto
                  flex items-center gap-1 px-2 py-1.5 rounded-full
                  backdrop-blur-xl border shadow-2xl
                  transition-all duration-500 ease-out
                  ${
                    isLightMode
                      ? "bg-white/60 border-white/50 shadow-black/5 text-gray-800"
                      : "bg-black/30 border-white/10 shadow-black/20 text-white"
                  }
                `}
        >
          {[
            { index: 0, Icon: Home },
            { index: 1, Icon: Search },
            { index: 2, Icon: Upload },
            { index: 3, Icon: Wallet },
            { index: 4, Icon: Bell }, // Changed from Activity to Bell to match your imports
            { index: 5, Icon: User },
          ].map(({ index, Icon }) => {
            const isActive = activeScreen === index;

            return (
              <button
                key={index}
                onClick={() => handleNavigate(index)}
                className={`
                        relative p-2 rounded-full transition-all duration-300 group
                        ${
                          isActive
                            ? isLightMode
                              ? "bg-black/5"
                              : "bg-white/10"
                            : "hover:bg-black/5 dark:hover:bg-white/5"
                        }
                      `}
              >
                <Icon
                  className={`
                          h-5 w-5 transition-all duration-300
                          ${
                            isActive
                              ? isLightMode
                                ? "text-black scale-105"
                                : "text-yellow-400 scale-105 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                              : isLightMode
                                ? "text-gray-500 group-hover:text-black"
                                : "text-white/60 group-hover:text-white"
                          }
                        `}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
