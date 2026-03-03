"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightSlot?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightSlot,
  children,
  className,
}: AppHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-gray-200 bg-white/90 px-4 pt-8 pb-3 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="-ml-2 h-9 w-9 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="truncate text-xl font-bold text-neutral-900">{title}</h1>
          </div>
          {subtitle && (
            <p className="mt-1 text-sm font-medium text-neutral-500">{subtitle}</p>
          )}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}
