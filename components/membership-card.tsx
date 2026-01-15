"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Sparkles, Crown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Elegant "Deep Glass" Themes (Minimalist & Premium)
const CARD_THEMES = [
  "from-zinc-800 via-zinc-900 to-black", // Graphite (The "Black Card" look)
  "from-slate-900 via-indigo-950 to-slate-900", // Midnight Navy
  "from-stone-800 via-stone-900 to-neutral-950", // Architectural Concrete
  "from-purple-900 via-slate-900 to-black", // Deep Velvet
  "from-emerald-900 via-teal-950 to-slate-900", // Dark Forest
  "from-rose-950 via-slate-900 to-black", // Crimson Noir
];

interface MembershipCardProps {
  // Core Data
  id: string | number;
  name: string;
  image?: string | null;
  index: number;

  // Variant
  variant?: "wallet" | "shop";

  // Wallet Mode Props
  balance?: number;

  // Shop Mode Props
  price?: string | number;
  currency?: string;

  // Actions
  onClick?: () => void;
  actionLabel?: string;
}

export function MembershipCard({
  id,
  name,
  image,
  index,
  variant = "wallet",
  balance,
  price,
  currency = "ETH",
  onClick,
  actionLabel,
}: MembershipCardProps) {
  const themeGradient = CARD_THEMES[index % CARD_THEMES.length];
  const initials = name ? name.substring(0, 2).toUpperCase() : "M";

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-3xl cursor-pointer transition-all duration-500",
        "hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/40",
        // Added a subtle border for that "premium glass" edge definition
        "border border-white/10",
      )}
    >
      {/* Background & Effects */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-100 transition-transform duration-700 group-hover:scale-110",
          themeGradient,
        )}
      />

      {/* Reduced noise opacity for a cleaner, more minimalist texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

      {/* Subtle ambient light blob (Darkened for elegance) */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all duration-700" />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col justify-between min-h-[180px] h-full">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/5">
              <Crown className="w-3.5 h-3.5 text-white/80" />
            </div>
            <Badge
              variant="outline"
              className="border-white/10 text-white/90 bg-black/20 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px]"
            >
              #{id}
            </Badge>
          </div>
          <Avatar className="h-10 w-10 border border-white/10 shadow-xl">
            <AvatarImage src={image || ""} className="object-cover" />
            <AvatarFallback className="bg-zinc-800 text-white text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Title */}
        <div className="mt-4 mb-6">
          <h3 className="text-2xl font-bold text-white leading-tight tracking-tight drop-shadow-lg truncate">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="w-3 h-3 text-white/40" />
            <p className="text-[11px] font-medium text-white/60 uppercase tracking-[0.2em]">
              {variant === "wallet" ? "Official Access" : "Exclusive Tier"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[9px] text-white/40 uppercase font-bold tracking-widest">
              {variant === "wallet" ? "Balance" : "Price"}
            </p>
            <p className="text-lg font-medium text-white tabular-nums">
              {variant === "wallet" ? (
                <>
                  {balance}{" "}
                  <span className="text-xs text-white/40 font-normal ml-1">
                    Passes
                  </span>
                </>
              ) : (
                <>
                  {price}{" "}
                  <span className="text-xs text-white/40 font-normal ml-1">
                    {currency}
                  </span>
                </>
              )}
            </p>
          </div>

          <Button
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/5 rounded-full px-5 h-9 font-medium shadow-lg transition-all active:scale-95 group-hover:bg-white group-hover:text-black group-hover:border-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            {variant === "wallet" ? (
              <QrCode className="w-3.5 h-3.5 mr-2" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 mr-2" />
            )}
            {actionLabel || (variant === "wallet" ? "Use" : "Join")}
          </Button>
        </div>
      </div>

      {/* Hover Shine (Refined to be sharper) */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </div>
    </div>
  );
}
