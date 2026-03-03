"use client";

import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Music,
  Star,
  Ticket,
  Search,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { DJProfile } from "@/lib/api/explore";

const categories = [
  {
    name: "Live shows",
    icon: <Music className="h-4 w-4" />,
    classes: "bg-[#1FA9D6] text-white",
  },
  {
    name: "Festivals",
    icon: <Ticket className="h-4 w-4" />,
    classes: "bg-white text-gray-800",
  },
  {
    name: "Dropsland Originals",
    icon: <Star className="h-4 w-4" />,
    classes: "bg-white text-gray-800",
  },
];

const featuredEvents = [
  {
    id: "demo-skrillex",
    title: "Skrillex Concert",
    location: "123 Main Street, New York",
    date: { month: "May", day: "20" },
    price: "$40.23",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    attendees: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    likes: "1.2K",
  },
  {
    id: "demo-afterlife",
    title: "Afterlife Tulum",
    location: "Zamna, Tulum",
    date: { month: "Jan", day: "14" },
    price: "From $120",
    image:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800&auto=format&fit=crop",
    attendees: ["/placeholder.svg", "/placeholder.svg"],
    likes: "3K+",
  },
  {
    id: "demo-midnight-harbor",
    title: "Midnight Harbor Sessions",
    location: "Pier 17, Brooklyn",
    date: { month: "Jun", day: "08" },
    price: "From $65",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    attendees: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    likes: "980",
  },
];

export const musicTypes = [
  { id: "house", name: "House", hint: "Groovy sets" },
  { id: "techno", name: "Techno", hint: "Dark energy" },
  { id: "trance", name: "Trance", hint: "Peak moments" },
  { id: "dnb", name: "DnB", hint: "Fast breaks" },
  { id: "dubstep", name: "Dubstep", hint: "Heavy bass" },
  { id: "ambient", name: "Ambient", hint: "Chill vibes" },
];

const musicTypeTones: Record<string, string> = {
  house: "from-cyan-100 to-sky-50",
  techno: "from-indigo-100 to-blue-50",
  trance: "from-violet-100 to-purple-50",
  dnb: "from-emerald-100 to-teal-50",
  dubstep: "from-amber-100 to-yellow-50",
  ambient: "from-rose-100 to-pink-50",
};

export function ExploreCategoriesSection() {
  return (
    <section className="pl-5 pt-1">
      <div className="mb-4 flex items-center justify-between pr-5">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">Categories</h2>
      </div>

      <div className="-mr-5 overflow-hidden">
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 pr-5 touch-pan-x">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`snap-start whitespace-nowrap rounded-full px-4 py-2.5 shadow-sm transition-transform active:scale-95 ${category.classes} flex items-center gap-2`}
            >
              <span className="rounded-full bg-white/40 p-1">{category.icon}</span>
              <span className="text-sm font-bold">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

type MusicTypesProps = {
  selectedMusicType: string | null;
  setSelectedMusicType: (value: string | null) => void;
};

export function ExploreMusicTypesSection({
  selectedMusicType,
  setSelectedMusicType,
}: MusicTypesProps) {
  const musicTypesCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollMusicTypes = (direction: "left" | "right") => {
    if (!musicTypesCarouselRef.current) return;
    musicTypesCarouselRef.current.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  return (
    <section className="pl-5">
      <div className="mb-3 flex items-center justify-between pr-5">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">Music Types</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollMusicTypes("left")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll music types left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollMusicTypes("right")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll music types right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="-mr-5 overflow-hidden">
        <div
          ref={musicTypesCarouselRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 pr-5 touch-pan-x"
        >
                  {musicTypes.map((type) => {
                    const isActive = selectedMusicType === type.name;
                    const tone = musicTypeTones[type.id] || "from-slate-100 to-slate-50";
                    return (
                      <button
                        key={type.id}
                type="button"
                onClick={() =>
                  setSelectedMusicType(
                    selectedMusicType === type.name ? null : type.name,
                  )
                }
                        className={`group relative h-[104px] w-[166px] shrink-0 snap-start overflow-hidden rounded-2xl border p-4 text-left shadow-sm shadow-blue-900/5 transition-all active:scale-95 ${
                          isActive
                            ? "border-[#1FA9D6]/35 bg-white ring-1 ring-[#1FA9D6]/20"
                            : "border-gray-100 bg-white hover:border-gray-200"
                        }`}
                      >
                        <div className={`absolute inset-x-0 top-0 h-12 bg-gradient-to-r ${tone} opacity-90`} />

                        <div className="relative z-10 mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1FA9D6] shadow-sm">
                          <Music className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </div>
                        <p
                          className={`relative z-10 truncate text-sm font-bold ${
                            isActive ? "text-[#1FA9D6]" : "text-gray-900"
                          }`}
                        >
                          {type.name}
                        </p>
                        <p className="relative z-10 mt-1 text-xs font-medium text-gray-500">
                          {type.hint}
                        </p>

                        {isActive && (
                          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-[#1FA9D6]" />
                        )}
                      </button>
                    );
                  })}
                </div>
      </div>
    </section>
  );
}

export function ExploreEventsSection() {
  const eventsCarouselRef = useRef<HTMLDivElement | null>(null);

  const scrollEvents = (direction: "left" | "right") => {
    if (!eventsCarouselRef.current) return;
    eventsCarouselRef.current.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="pl-5">
      <div className="mb-4 flex items-center justify-between pr-5">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Top Dropsland Events
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollEvents("left")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll events left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollEvents("right")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll events right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="-mr-5 overflow-hidden">
        <div
          ref={eventsCarouselRef}
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-6 pr-5 touch-pan-x"
        >
          {featuredEvents.map((event) => (
            <article
              key={event.id}
              className="group relative h-[360px] w-[300px] shrink-0 snap-start overflow-hidden rounded-[2rem] shadow-xl shadow-blue-900/10"
            >
              <img
                src={event.image}
                alt={event.title}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                  {event.date.month}
                </span>
                <span className="text-lg font-extrabold leading-none">{event.date.day}</span>
              </div>

              <button className="absolute right-4 top-4 rounded-full bg-black/20 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20">
                <Heart className="h-5 w-5" />
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="mb-1 text-2xl font-bold tracking-tight text-white">{event.title}</h3>
                <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-gray-300">
                  <MapPin className="h-4 w-4 text-[#1FA9D6]" />
                  <span className="truncate">{event.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="border-none bg-white/20 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20">
                      {event.likes}
                    </Badge>
                    <div className="flex -space-x-2">
                      {event.attendees.map((avatar, index) => (
                        <Avatar
                          key={`${event.id}-${index}`}
                          className="h-7 w-7 border-2 border-gray-900"
                        >
                          <AvatarImage src={avatar} />
                          <AvatarFallback className="bg-[#1FA9D6] text-[10px] text-white">
                            U
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{event.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type ArtistsProps = {
  artists: DJProfile[];
  searchQuery: string;
  selectedMusicType: string | null;
  title: string;
  onSelectArtist: (artistId: string) => void;
};

export function ExploreArtistsSection({
  artists,
  searchQuery,
  selectedMusicType,
  title,
  onSelectArtist,
}: ArtistsProps) {
  const filteredArtists = artists.filter(
    (artist) =>
      (artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedMusicType ||
        artist.genre.toLowerCase().includes(selectedMusicType.toLowerCase())),
  );

  return (
    <section className="px-5">
      <h2 className="mb-4 text-lg font-bold tracking-tight text-gray-900">{title}</h2>

      <div className="space-y-3">
        {filteredArtists.map((artist) => (
          <Card
            key={artist.id}
            className="group cursor-pointer rounded-[1.5rem] border-none bg-white shadow-sm transition-all duration-300 hover:shadow-md"
            onClick={() => onSelectArtist(artist.id)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="relative shrink-0">
                <Avatar className="h-14 w-14 ring-2 ring-gray-50">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback className="bg-[#1FA9D6]/10 text-lg font-bold text-[#1FA9D6]">
                    {artist.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {artist.featured && (
                  <div className="absolute -right-1 -top-1 rounded-full bg-white p-0.5 shadow-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-extrabold text-gray-900">{artist.name}</h3>
                <p className="mb-1.5 truncate text-sm text-gray-500">{artist.handle}</p>
                <Badge
                  variant="outline"
                  className="border-gray-200 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-600"
                >
                  {artist.genre}
                </Badge>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-[#1FA9D6] group-hover:text-white">
                <ChevronRight className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredArtists.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-bold text-gray-900">No results found</p>
            <p className="mt-1 text-sm text-gray-500">
              Try searching for a different genre or artist.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
