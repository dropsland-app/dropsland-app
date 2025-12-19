"use client";

import { Home, Search, Upload, Wallet, Bell, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomDockProps {
  theme?: "light" | "dark";
}

export default function BottomDock({ theme }: BottomDockProps) {
  const pathname = usePathname();

  // 1. Define the Routes mapping
  const navItems = [
    { path: "/", Icon: Home, label: "Home" },
    { path: "/explore", Icon: Search, label: "Explore" },
    { path: "/create", Icon: Upload, label: "Create" },
    { path: "/wallet", Icon: Wallet, label: "Wallet" },
    { path: "/activity", Icon: Bell, label: "Activity" },
    { path: "/profile", Icon: User, label: "Profile" },
  ];

  // 2. Logic to determine active state
  const isActiveRoute = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  // 3. Auto-detect theme based on route if not strictly provided
  // Home (Reels) is usually dark mode, others are light mode.
  const currentTheme = theme || (pathname === "/" ? "dark" : "light");
  const isLightMode = currentTheme === "light";

  return (
    // Changed 'absolute' to 'fixed' so it stays on screen while scrolling
    <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none px-4">
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
        {navItems.map(({ path, Icon, label }) => {
          const isActive = isActiveRoute(path);

          return (
            <Link
              key={path}
              href={path}
              aria-label={label}
              className={`
                relative p-2.5 rounded-full transition-all duration-300 group
                flex items-center justify-center
                ${
                  isActive
                    ? isLightMode
                      ? "bg-primary/10" // Make sure 'primary' is defined in your tailwind config, or use 'bg-blue-500/10'
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
                        ? "text-primary scale-110" // Ensure 'text-primary' exists or use specific color
                        : "text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                      : isLightMode
                        ? "text-gray-500 group-hover:text-primary group-hover:scale-105"
                        : "text-white/60 group-hover:text-white group-hover:scale-105"
                  }
                `}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
