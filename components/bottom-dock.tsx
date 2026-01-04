"use client";

import { Home, Search, Upload, Wallet, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dock, DockIcon, DockItem, DockLabel } from "@/components/core/dock";
import { cn } from "@/lib/utils";

interface BottomDockProps {
  theme?: "light" | "dark";
}

export default function BottomDock({ theme }: BottomDockProps) {
  const pathname = usePathname();

  const navItems = [
    { path: "/", Icon: Home, label: "Home" },
    { path: "/explore", Icon: Search, label: "Explore" },
    { path: "/create", Icon: Upload, label: "Create" },
    { path: "/wallet", Icon: Wallet, label: "Wallet" },
    { path: "/profile", Icon: User, label: "Profile" },
  ];

  const isActiveRoute = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  const currentTheme = theme || (pathname === "/" ? "dark" : "light");
  const isLightMode = currentTheme === "light";

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-full">
      <Dock
        className={cn(
          "rounded-full border backdrop-blur-3xl shadow-xl px-6 pb-3 pt-3 gap-3 transition-colors duration-300",
          isLightMode
            ? "bg-white/40 border-white/40 shadow-black/5 ring-1 ring-white/30"
            : "bg-black/30 border-white/5 shadow-black/20 ring-1 ring-white/5",
        )}
        magnification={60}
        distance={100}
        panelHeight={68}
      >
        {navItems.map(({ path, Icon, label }) => {
          const isActive = isActiveRoute(path);

          return (
            <DockItem key={path} className="aspect-square rounded-full">
              <DockLabel
                className={cn(
                  "font-medium text-[10px]",
                  isLightMode
                    ? "text-gray-900 bg-white/90 border-gray-200"
                    : "text-white bg-black/90 border-white/10",
                )}
              >
                {label}
              </DockLabel>
              <DockIcon>
                <Link
                  href={path}
                  aria-label={label}
                  className="h-full w-full flex items-center justify-center"
                >
                  <Icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={cn(
                      "h-full w-full transition-all duration-200",
                      isActive
                        ? isLightMode
                          ? "text-[#1FA9D6] fill-[#1FA9D6]/10"
                          : "text-white fill-white/20 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        : isLightMode
                          ? "text-gray-300 hover:text-gray-600"
                          : "text-white/80 hover:text-white",
                    )}
                  />
                </Link>
              </DockIcon>
            </DockItem>
          );
        })}
      </Dock>
    </div>
  );
}
