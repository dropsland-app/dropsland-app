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
      // If a custom handler exists (MainApp scroll logic), use it
      onNavigate(index);
    } else {
      // Otherwise, assume standard routing behavior
      // For this app, everything is on root '/', so we push there.
      // In a full multi-page app, you'd route to '/explore', '/wallet', etc.
      router.push("/");
    }
  };

  const isLightMode = theme === "light";

  return (
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
          const isActive = activeIndex === index;

          return (
            <button
              key={index}
              onClick={() => handleClick(index)}
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
                          ? "text-primary scale-105"
                          : "text-primary scale-105 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
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
  );
}
