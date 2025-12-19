import { Ticket, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function WalletEventsPage() {
  // Dummy Data
  const events = [
    {
      id: 1,
      title: "Rooftop Sunset",
      date: "Oct 24",
      type: "VIP Pass",
      bg: "bg-indigo-500",
    },
    {
      id: 2,
      title: "Basement Rave",
      date: "Nov 02",
      type: "Entry",
      bg: "bg-purple-600",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="relative group overflow-hidden rounded-2xl"
        >
          {/* Ticket Visual */}
          <div
            className={`h-32 ${event.bg} p-5 flex flex-col justify-between text-white relative`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold opacity-80 uppercase tracking-widest">
                  {event.type}
                </span>
                <h3 className="text-xl font-bold mt-1">{event.title}</h3>
              </div>
              <Ticket className="w-6 h-6 opacity-50" />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium opacity-90">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>

            {/* Decorative Circles for Ticket Cutout Look */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full" />
          </div>
        </div>
      ))}

      {events.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Ticket className="w-10 h-10 mx-auto mb-2 opacity-20" />
          <p className="text-sm">No tickets found.</p>
        </div>
      )}
    </div>
  );
}
