"use client";

import { Search } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import { Input } from "@/components/ui/input";
import { ExploreTabs } from "./explore-tabs";

type ExploreShellProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  children: React.ReactNode;
};

export function ExploreShell({
  searchQuery,
  onSearchChange,
  children,
}: ExploreShellProps) {
  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50/60 pb-28">
      <AppHeader title="Listening" className="border-none bg-white/95 pb-2">
        <div className="group relative mt-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#1FA9D6]">
            <Search className="h-5 w-5" />
          </div>
          <Input
            placeholder="Search music, events, artists..."
            className="h-12 rounded-full border-none bg-white pl-12 font-medium text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#1FA9D6]/25"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </AppHeader>

      <ExploreTabs />

      <div className="animate-in space-y-8 pt-4 fade-in duration-500">{children}</div>
    </div>
  );
}
