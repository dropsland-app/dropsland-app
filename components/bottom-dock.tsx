"use client";

import { Home, Search, Upload, Wallet, Bell, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface BottomDockProps {
  activeIndex?: number;
  theme?: "light" | "dark";
  onNavigate?: (index: number) => void;
}

export default function BottomDock({
  activeIndex = 0,
  theme = "light",
  onNavigate,
}: BottomDockProps) {
  const router = useRouter();

  const handleClick = (index: number) => {
    if (onNavigate) {
      onNavigate(index);
    } else {
      router.push("/");
    }
  };

  const isLightMode = theme === "light";

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none px-4">
      <div
        className={`
          pointer-events-auto
          flex items-center gap-2.5 sm:gap-4 px-4 py-2 rounded-full
          backdrop-blur-2xl border shadow-2xl
          transition-all duration-500 ease-out
          ${
            isLightMode
              ? "bg-white/80 border-white/40 shadow-black/10 text-gray-800"
              : "bg-black/40 border-white/10 shadow-black/40 text-white"
          }
        `}
      >
        {[
          { index: 0, Icon: Home, label: "Home" },
          { index: 1, Icon: Search, label: "Explore" },
          { index: 2, Icon: Upload, label: "Create" },
          { index: 3, Icon: Wallet, label: "Wallet" },
          { index: 4, Icon: Bell, label: "Activity" },
          { index: 5, Icon: User, label: "Profile" },
        ].map(({ index, Icon, label }) => {
          const isActive = activeIndex === index;

          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
              aria-label={label}
              className={`
                relative p-2.5 rounded-full transition-all duration-300 group
                flex items-center justify-center
                ${
                  isActive
                    ? isLightMode
                      ? "bg-black/10"
                      : "bg-white/15"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }
              `}
            >
              <Icon
                strokeWidth={isActive ? 2 : 1.75}
                className={`
                  w-6 h-6 transition-all duration-300
                  ${
                    isActive
                      ? isLightMode
                        ? "text-primary scale-110"
                        : "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      : isLightMode
                        ? "text-gray-500 group-hover:text-primary group-hover:scale-105"
                        : "text-white/60 group-hover:text-white group-hover:scale-105"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
