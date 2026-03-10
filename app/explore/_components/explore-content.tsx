"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { EventData } from "@/lib/api/events";
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

function formatEventDateParts(isoDate?: string | null) {
  if (!isoDate) {
    return { month: "TBD", day: "--" };
  }

  const date = new Date(isoDate);

  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: String(date.getDate()).padStart(2, "0"),
  };
}

function formatEventPrice(price?: number | string | null) {
  const numericPrice =
    typeof price === "number"
      ? price
      : typeof price === "string"
        ? Number(price)
        : 0;

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Free";
  }

  return `From $${numericPrice.toFixed(0)}`;
}

function formatEventLikes(isFeatured?: boolean) {
  return isFeatured ? "Featured" : "Live";
}

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
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Categories
        </h2>
      </div>

      <Carousel opts={{ align: "start", dragFree: true }}>
        <CarouselContent className="-ml-3 pb-4 pr-5">
          {categories.map((category) => (
            <CarouselItem key={category.name} className="basis-auto pl-3">
              <button
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 shadow-sm transition-transform active:scale-95 ${category.classes}`}
              >
                <span className="rounded-full bg-white/40 p-1">
                  {category.icon}
                </span>
                <span className="text-sm font-bold">{category.name}</span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

type MusicTypesProps = {
  selectedMusicType: string | null;
  setSelectedMusicType: (value: string | null) => void;
  onGenreClick?: (genreName: string) => void;
};

type ExploreEventsSectionProps = {
  events: EventData[];
};

export function ExploreMusicTypesSection({
  selectedMusicType,
  setSelectedMusicType,
  onGenreClick,
}: MusicTypesProps) {
  const [musicTypesApi, setMusicTypesApi] = useState<CarouselApi>();

  return (
    <section className="pl-5">
      <div className="mb-3 flex items-center justify-between pr-5">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Music Types
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => musicTypesApi?.scrollPrev()}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll music types left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => musicTypesApi?.scrollNext()}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll music types right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setMusicTypesApi}
        opts={{ align: "start", dragFree: true }}
      >
        <CarouselContent className="-ml-4 pb-5 pr-5">
          {musicTypes.map((type) => {
            const isActive = selectedMusicType === type.name;
            const tone =
              musicTypeTones[type.id] || "from-slate-100 to-slate-50";
            return (
              <CarouselItem
                key={type.id}
                className="basis-[calc(166px+1rem)] pl-4"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (onGenreClick) {
                      onGenreClick(type.name);
                    } else {
                      setSelectedMusicType(
                        selectedMusicType === type.name ? null : type.name,
                      );
                    }
                  }}
                  className={`group relative h-[104px] w-full overflow-hidden rounded-2xl border p-4 text-left shadow-sm shadow-blue-900/5 transition-all active:scale-95 ${
                    isActive
                      ? "border-[#1FA9D6]/35 bg-white ring-1 ring-[#1FA9D6]/20"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-12 bg-gradient-to-r ${tone} opacity-90`}
                  />

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
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

export function ExploreEventsSection({ events }: ExploreEventsSectionProps) {
  const [eventsApi, setEventsApi] = useState<CarouselApi>();
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const featuredEvents = events.slice(0, 8);

  return (
    <section className="pl-5">
      <div className="mb-4 flex items-center justify-between pr-5">
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          Top Dropsland Events
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => eventsApi?.scrollPrev()}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll events left"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => eventsApi?.scrollNext()}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:border-[#1FA9D6]/40 hover:text-[#1FA9D6]"
            aria-label="Scroll events right"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {featuredEvents.length > 0 ? (
        <Carousel
          setApi={setEventsApi}
          opts={{ align: "start", dragFree: true }}
        >
          <CarouselContent className="-ml-4 pb-6 pr-5">
            {featuredEvents.map((event) => {
              const date = formatEventDateParts(event.start_time);
              const price = formatEventPrice(
                (event as EventData & { ticket_price?: number | string | null })
                  .ticket_price,
              );
              const coverImage = event.cover_image_url || "/placeholder.jpg";
              const likesLabel = formatEventLikes(event.is_featured);
              const attendees = [
                event.organizer?.avatar_url || "/placeholder.svg",
                "/placeholder.svg",
                "/placeholder.svg",
              ];

              return (
                <CarouselItem
                  key={event.id}
                  className="basis-[calc(300px+1rem)] pl-4"
                >
                  <article
                    className="group relative h-[360px] w-full cursor-pointer overflow-hidden rounded-[2rem] shadow-xl shadow-blue-900/10"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <img
                      src={coverImage}
                      alt={event.title}
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-white backdrop-blur-md">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                        {date.month}
                      </span>
                      <span className="text-lg font-extrabold leading-none">
                        {date.day}
                      </span>
                    </div>

                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-4 top-4 rounded-full bg-black/20 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/20"
                    >
                      <Heart className="h-5 w-5" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="mb-1 text-2xl font-bold tracking-tight text-white">
                        {event.title}
                      </h3>
                      <div className="mb-4 flex items-center gap-1.5 text-sm font-medium text-gray-300">
                        <MapPin className="h-4 w-4 text-[#1FA9D6]" />
                        <span className="truncate">
                          {event.location || "Location TBA"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="border-none bg-white/20 text-xs font-bold text-white backdrop-blur-md hover:bg-white/20">
                            {likesLabel}
                          </Badge>
                          <div className="flex -space-x-2">
                            {attendees.map((avatar, index) => (
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
                        <span className="text-lg font-bold text-white">
                          {price}
                        </span>
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="pr-5 pb-6">
          <div className="flex h-[220px] items-center justify-center rounded-[2rem] border border-dashed border-gray-200 bg-white text-center shadow-sm">
            <div>
              <p className="font-bold text-gray-900">No events available</p>
              <p className="mt-1 text-sm text-gray-500">
                Check back soon for upcoming Dropsland events.
              </p>
            </div>
          </div>
        </div>
      )}
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
      <h2 className="mb-4 text-lg font-bold tracking-tight text-gray-900">
        {title}
      </h2>

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
                <h3 className="truncate text-base font-extrabold text-gray-900">
                  {artist.name}
                </h3>
                <p className="mb-1.5 truncate text-sm text-gray-500">
                  {artist.handle}
                </p>
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
