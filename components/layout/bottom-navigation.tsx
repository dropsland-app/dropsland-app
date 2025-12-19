"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Upload, Wallet, Bell, User } from "lucide-react";

interface BottomDockProps {
  theme?: "light" | "dark";
}

export default function BottomDock({ theme = "light" }: BottomDockProps) {
  const pathname = usePathname();
  const isLightMode = theme === "light";

  // Map your existing 6 icons to the new structure
  const navItems = [
    { index: 0, Icon: Home, href: "/" }, // Reels
    { index: 1, Icon: Search, href: "/explore" }, // Explore
    { index: 2, Icon: Upload, href: "/create" }, // Create
    { index: 3, Icon: Wallet, href: "/wallet/events" }, // Wallet (default tab)
    { index: 4, Icon: Bell, href: "/activity" }, // Activity
    { index: 5, Icon: User, href: "/profile" }, // Profile
  ];

  const checkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // Check if we are inside a section (e.g. /wallet/rewards keeps Wallet active)
    if (href.startsWith("/wallet")) return pathname?.startsWith("/wallet");
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
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
        {navItems.map(({ index, Icon, href }) => {
          const isActive = checkActive(href);

          return (
            <Link
              key={index}
              href={href}
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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
