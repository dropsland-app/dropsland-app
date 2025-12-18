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
import { Home, Search, Upload, Wallet, Bell, User } from "lucide-react";

export default function MainApp() {
  const [activeScreen, setActiveScreen] = useState(0);
  // Kept from main: allows for smooth header transitions
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Logic from main: Dynamic light mode based on precise scroll position
  const isLightMode = scrollProgress > 1.5;
  const transitionOpacity =
    scrollProgress >= 1 && scrollProgress <= 2
      ? scrollProgress - 1
      : scrollProgress < 1
        ? 0
        : 1;

  // Logic from main: Calculates precise scroll progress for UI effects
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const screenWidth = containerRef.current.offsetWidth;
      const progress = scrollLeft / screenWidth;
      setScrollProgress(progress);

      const newScreen = Math.round(progress);
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

  // Logic from main: Audio cleanup (Important bug fix)
  useEffect(() => {
    const allAudio = document.querySelectorAll("audio");
    allAudio.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [activeScreen]);

  // Common wrapper style
  const sectionClass = "min-w-full h-full flex-shrink-0 snap-start";
  const snapStyle = { scrollSnapStop: "always" as const };

  return (
    <div className="h-screen flex flex-col bg-white relative">
      <header
        className="absolute top-0 left-0 right-0 z-50 h-16 pointer-events-none"
        style={{
          background:
            scrollProgress >= 2
              ? `linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8), transparent)`
              : `linear-gradient(to bottom, rgba(0, 0, 0, ${1 - transitionOpacity}), rgba(0, 0, 0, ${0.8 - transitionOpacity * 0.8}), transparent), linear-gradient(to bottom, rgba(255, 255, 255, ${transitionOpacity}), rgba(255, 255, 255, ${transitionOpacity * 0.8}), transparent)`,
        }}
      >
        <div className="flex items-center justify-start h-12 px-2 pointer-events-auto">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className="h-5 w-auto"
            style={{
              filter: `invert(${transitionOpacity})`,
            }}
            priority
          />
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-scroll overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        <div
          data-index="0"
          className={`${sectionClass} dark bg-black text-white`}
          style={snapStyle}
        >
          <HomeView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div data-index="1" className={sectionClass} style={snapStyle}>
          <ExploreScreen onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          data-index="2"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <UploadView />
        </div>

        <div
          data-index="3"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <WalletView />
        </div>

        <div
          data-index="4"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <ActivityView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          data-index="5"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
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
            { index: 4, Icon: Bell },
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
                          : "text-primary scale-105 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" // Kept HEAD style (Yellow)
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
