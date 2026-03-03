"use client";

import { useRouter } from "next/navigation";
import {
  Music,
  Gift,
  ArrowRight,
  Sparkles,
  Plus,
  Layers,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AppHeader from "@/components/layout/app-header";

export default function CreateDashboardPage() {
  const router = useRouter();

  const createOptions = [
    {
      title: "New Track",
      description:
        "Upload music, set royalty splits, and publish to the network.",
      icon: Music,
      href: "/create/music",
      // Theme: Blue (Dropsland Primary)
      text: "text-blue-600",
      iconBg: "bg-blue-50",
      borderHover: "hover:border-blue-200",
    },
    {
      title: "New Item / Reward",
      description:
        "Create merchandise, tickets, or exclusive perks for your fans.",
      icon: Gift,
      href: "/create/reward",
      // Theme: Purple (Secondary)
      text: "text-purple-600",
      iconBg: "bg-purple-50",
      borderHover: "hover:border-purple-200",
    },
    {
      title: "New Membership",
      description:
        "Create tiered memberships with recurring perks for your superfans.",
      icon: Users,
      href: "/create/membership",
      // Theme: Teal/Cyan
      text: "text-teal-600",
      iconBg: "bg-teal-50",
      borderHover: "hover:border-teal-200",
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <AppHeader title="Create" subtitle="Manage your drops and rewards" />

      <div className="p-5 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Main Actions Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#1FA9D6]" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Start Creating
            </h2>
          </div>

          <div className="space-y-4">
            {createOptions.map((option) => (
              <Card
                key={option.title}
                className={`
                  relative overflow-hidden border border-neutral-100 shadow-sm
                  transition-all duration-300 cursor-pointer group rounded-3xl bg-white
                  hover:shadow-md hover:scale-[1.01] ${option.borderHover}
                `}
                onClick={() => router.push(option.href)}
              >
                <CardContent className="p-5 flex items-center gap-5">
                  {/* Icon Container - Big & Soft */}
                  <div
                    className={`
                    h-16 w-16 rounded-2xl flex items-center justify-center shrink-0
                    ${option.iconBg} ${option.text} transition-transform group-hover:scale-110 duration-300
                  `}
                  >
                    <option.icon className="w-8 h-8" strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 text-lg mb-1">
                      {option.title}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                      {option.description}
                    </p>
                  </div>

                  {/* Arrow Action */}
                  <div className="h-10 w-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-300 group-hover:bg-[#1FA9D6] group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              Recent Activity
            </h2>
          </div>

          {/* Empty State Card */}
          <div className="bg-neutral-50 rounded-3xl border border-dashed border-neutral-200 p-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Plus className="w-6 h-6 text-neutral-300" />
            </div>
            <p className="text-neutral-900 font-bold text-lg mb-1">
              No recent uploads
            </p>
            <p className="text-sm text-neutral-500 font-medium max-w-[220px] leading-relaxed">
              Your newly created tracks and rewards will appear here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
