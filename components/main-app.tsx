"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  // Refs for each section to observe them
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { user } = useAuth();

  const isLightMode = activeScreen >= 2;

  // 1. REPLACED handleScroll with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the index from the data-index attribute we will add
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveScreen(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.6, // Trigger when 60% of the screen is visible
      },
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleNavigate = (screenIndex: number) => {
    if (containerRef.current) {
      const screenWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: screenWidth * screenIndex,
        behavior: "smooth",
      });
    }
  };

  // Helper to collect refs
  const setSectionRef = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  // Common wrapper style for "snap-stop" behavior
  const sectionClass = "min-w-full h-full flex-shrink-0 snap-start";
  const snapStyle = { scrollSnapStop: "always" as const };

  return (
    <div className="h-screen flex flex-col bg-black relative">
      <header
        className={`absolute top-0 left-0 right-0 z-50 h-16 pointer-events-none ${
          isLightMode
            ? "bg-gradient-to-b from-white via-white/80 to-transparent"
            : "bg-gradient-to-b from-black via-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center justify-start h-12 px-2 pointer-events-auto">
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
      >
        {/* Added data-index, ref, and scrollSnapStop style to all sections */}

        <div
          ref={(el) => setSectionRef(el, 0)}
          data-index="0"
          className={sectionClass}
          style={snapStyle}
        >
          <HomeView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          ref={(el) => setSectionRef(el, 1)}
          data-index="1"
          className={sectionClass}
          style={snapStyle}
        >
          <ExploreScreen onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          ref={(el) => setSectionRef(el, 2)}
          data-index="2"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <UploadView />
        </div>

        <div
          ref={(el) => setSectionRef(el, 3)}
          data-index="3"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <WalletView />
        </div>

        <div
          ref={(el) => setSectionRef(el, 4)}
          data-index="4"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <ActivityView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          ref={(el) => setSectionRef(el, 5)}
          data-index="5"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <ProfileView />
        </div>
      </div>

      {/* COMPACT GLASS DOCK (No changes needed here from previous step) */}
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
                          : "text-yellow-400 scale-105 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                        : isLightMode
                          ? "text-gray-500 group-hover:text-black"
                          : "text-white/60 group-hover:text-white"
                    }
                  `}
                />

                {isActive && (
                  <span
                    className={`
                    absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full
                    ${isLightMode ? "bg-black" : "bg-yellow-400"}
                  `}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
