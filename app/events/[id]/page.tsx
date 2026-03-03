import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Sparkles } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const DJ_PLACEHOLDERS = [
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
  "/placeholder.svg",
];

function formatDateParts(isoDate?: string | null) {
  if (!isoDate) {
    return { month: "TBD", day: "--", full: "Date TBA" };
  }

  const date = new Date(isoDate);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: String(date.getDate()),
    full: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles!fk_event_organizer (
        username,
        avatar_url
      )
    `,
    )
    .eq("id", params.id)
    .single();

  if (!event) {
    notFound();
  }

  const startTime = (event.start_time ?? event.event_date) as string | undefined;
  const coverImage =
    (event.cover_image_url ?? event.image_url ?? "/placeholder.jpg") as string;
  const price = Number(event.ticket_price || 0);
  const location = event.location || "Location TBA";
  const date = formatDateParts(startTime);
  const organizerName = event.organizer?.username || "Dropsland Artist";

  return (
    <div className="relative min-h-screen bg-[#F7FAFC] pb-32">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img src={coverImage} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

        <AppHeader
          title="Event"
          showBack
          className="absolute top-0 z-50 w-full border-none bg-transparent backdrop-blur-0 [&_h1]:text-white [&_button]:text-white [&_button]:bg-black/30 [&_button]:hover:bg-black/45"
        />

        <div className="absolute bottom-4 left-4 rounded-full bg-white/85 px-4 py-2 shadow-lg shadow-blue-900/10 backdrop-blur-md">
          <p className="text-xs font-semibold text-gray-500">{date.month}</p>
          <p className="text-lg font-extrabold leading-none text-gray-900">{date.day}</p>
        </div>
      </div>

      <section className="relative -mt-6 rounded-t-[2rem] bg-white px-5 pb-8 pt-6 shadow-xl shadow-blue-900/5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{event.title}</h1>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1FA9D6]/10 text-[#1FA9D6]">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="font-medium">{location}</span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1FA9D6]/10 text-[#1FA9D6]">
            <CalendarDays className="h-4 w-4" />
          </div>
          <span className="font-medium">{date.full}</span>
        </div>

        <div className="mt-6 rounded-3xl bg-[#F7FAFC] p-4 shadow-inner shadow-blue-900/5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#1FA9D6]" />
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              DJs Playing
            </p>
          </div>

          <div className="flex items-center">
            {[event.organizer?.avatar_url, ...DJ_PLACEHOLDERS].map((avatar, index) => (
              <Avatar
                key={`dj-${index}`}
                className="-ml-2 h-10 w-10 border-2 border-white first:ml-0"
              >
                <AvatarImage src={avatar || undefined} />
                <AvatarFallback className="bg-gray-100 text-xs font-bold text-gray-600">
                  DJ
                </AvatarFallback>
              </Avatar>
            ))}
            <div className="ml-3 rounded-full bg-[#1FA9D6]/10 px-3 py-1 text-xs font-bold text-[#1FA9D6]">
              +3
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-gray-500">Including {organizerName}</p>
        </div>

        {event.description && (
          <div className="mt-6 rounded-3xl bg-[#F9FBFD] p-4 text-sm leading-relaxed text-gray-600 shadow-xl shadow-blue-900/5">
            {event.description}
          </div>
        )}
      </section>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white/95 px-4 pb-6 pt-3 backdrop-blur-md safe-bottom">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Entry</p>
            <p className="text-xl font-extrabold text-gray-900">
              {price > 0 ? `$${price.toFixed(2)}` : "Free"}
            </p>
          </div>
          <Button className="h-12 rounded-2xl bg-[#1FA9D6] px-8 text-base font-bold text-white hover:bg-[#1FA9D6]/90">
            Reserve Spot
          </Button>
        </div>
      </div>
    </div>
  );
}
