"use client";

import { useRouter } from "next/navigation";
import { Music, Ticket, Gift, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateDashboardPage() {
  const router = useRouter();

  const createOptions = [
    {
      title: "New Track",
      description: "Upload music, set royalty splits, and publish to the network.",
      icon: Music,
      href: "/create/music",
      color: "bg-blue-500",
    },
    {
      title: "New Item / Reward",
      description: "Create merchandise, tickets, or exclusive perks for your fans.",
      icon: Gift,
      href: "/create/reward",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-manrope">
      <div className="px-5 pt-12 pb-6 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-extrabold text-[#1b1c23] mb-1">Create</h1>
        <p className="text-gray-500 text-sm">Manage your drops and rewards</p>
      </div>

      <div className="p-5 space-y-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
          Start Creating
        </h2>
        {createOptions.map((option) => (
          <Card
            key={option.title}
            className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white overflow-hidden group"
            onClick={() => router.push(option.href)}
          >
            <CardContent className="p-0 flex items-stretch">
              <div className={`w-3 ${option.color}`} />
              <div className="p-5 flex-1 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${option.color} bg-opacity-10 text-${option.color.replace('bg-', 'text-')}`}>
                    <option.icon className={`w-6 h-6 ${option.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1b1c23] text-lg">{option.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-[200px]">
                      {option.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for "Your Creations" or "Recent Activity" */}
        <div className="pt-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Recent Activity
          </h2>
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100 border-dashed">
            <p className="text-gray-400 font-medium">No recent uploads</p>
            <p className="text-xs text-gray-300 mt-1">Your created items will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
