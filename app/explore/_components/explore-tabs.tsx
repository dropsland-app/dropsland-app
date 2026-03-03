"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const tabs = [
  { label: "Overview", href: "/explore/overview" },
  { label: "Events", href: "/explore/events" },
  { label: "Artists", href: "/explore/artists" },
  { label: "Music Types", href: "/explore/music-types" },
];

export function ExploreTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-gray-100 bg-white/95 px-5 backdrop-blur-sm">
      <Carousel opts={{ align: "start", dragFree: true }}>
        <CarouselContent className="-mb-px -ml-6">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <CarouselItem key={tab.href} className="basis-auto pl-6">
              <Link
                href={tab.href}
                className={`relative block whitespace-nowrap py-3 text-sm font-medium transition-colors ${
                  isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-t-full bg-[#1FA9D6]" />
                )}
              </Link>
            </CarouselItem>
          );
        })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
