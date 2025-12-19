import { getEvents } from "@/lib/api/events";
import { MapPin, CalendarDays, Ticket } from "lucide-react";

export default async function WalletEventsPage() {
  const events = await getEvents();

  return (
    <div className="p-4 space-y-5 pb-24">
      {events.map((event) => (
        <div
          key={event.id}
          className="group relative w-full h-44 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 isolate"
        >
          {/* 1. Full Background Image */}
          {event.cover_image_url ? (
            <img
              src={event.cover_image_url}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}

          {/* 2. Minimalist Gradient Overlay */}
          {/* Light gradient only at the bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* 3. Content Layout */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            {/* Top Row: Type Badge & Date */}
            <div className="flex justify-between items-start">
              {/* Glassmorphic Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white shadow-sm">
                <Ticket className="w-3 h-3 text-[#1FA9D6]" />
                <span className="text-[10px] font-semibold tracking-wide uppercase">
                  VIP Access
                </span>
              </div>

              {/* Clean Date Display */}
              <div className="flex flex-col items-end text-white">
                <span className="text-xs font-medium opacity-80 uppercase">
                  {new Date(event.start_time).toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </span>
                <span className="text-xl font-bold leading-none tracking-tight">
                  {new Date(event.start_time).getDate()}
                </span>
              </div>
            </div>

            {/* Bottom Row: Title & Location */}
            <div>
              <h3 className="text-xl font-bold text-white mb-1.5 tracking-tight group-hover:text-[#1FA9D6] transition-colors">
                {event.title}
              </h3>

              <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1FA9D6]" />
                  <span className="truncate max-w-[150px]">
                    {event.location}
                  </span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>10:00 PM</span>
              </div>
            </div>
          </div>

          {/* 4. Ticket Cutouts (Notches) */}
          {/* These circles match the background color (white) to create the 'cut' effect */}
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-20 shadow-inner" />
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-white rounded-full z-20 shadow-inner" />

          {/* Dashed Line Connector (Optional detail between notches) */}
          <div className="absolute top-1/2 left-3 right-3 h-[1px] -translate-y-1/2 border-t border-dashed border-white/20 z-10 pointer-events-none" />
        </div>
      ))}

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Ticket className="w-6 h-6 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-medium text-sm">
            No tickets found
          </h3>
          <p className="text-gray-500 text-xs mt-1">
            Upcoming events will appear here
          </p>
        </div>
      )}
    </div>
  );
}
