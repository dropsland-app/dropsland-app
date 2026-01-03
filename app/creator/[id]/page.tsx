"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Star, Users, Lock, Music } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MembershipTierCard, type MembershipTier } from "@/components/creator/membership-tier-card";

// --- Mock Data ---
const CREATOR = {
  id: "1",
  name: "DJ Juampi",
  handle: "@iamjuampi",
  avatar: "/images/profile/iamjuampi-avatar.jpg",
  coverImage: "/images/profile/iamjuampi-cover.jpg",
  category: "Techno / House",
  description: "Resident at Club Space. Founder of Dropsland. Join my membership for guestlist spots, exclusive edits, and backstage access.",
  supporters: 2400,
  tiers: [
    {
      id: "t1",
      name: "Guestlist",
      price: 5,
      currency: "$DROPS",
      color: "bg-slate-700",
      benefits: [
        "Priority Guestlist Entry (Before 12AM)",
        "Access to 'The Stash' (Monthly Edits)",
        "Supporter Badge"
      ]
    },
    {
      id: "t2",
      name: "Backstage",
      price: 25,
      currency: "$DROPS",
      color: "bg-[#1FA9D6]", // Dropsland Blue
      isPopular: true,
      benefits: [
        "All 'Guestlist' perks",
        "Guaranteed +1 Entry",
        "Backstage Access (Subject to capacity)",
        "Vote on upcoming gig locations"
      ]
    },
    {
      id: "t3",
      name: "Inner Circle",
      price: 100,
      currency: "$DROPS",
      color: "bg-purple-600",
      benefits: [
        "All 'Backstage' perks",
        "Free Merch Drop (Quarterly)",
        "Private discord channel",
        "Direct DMs"
      ]
    }
  ] as MembershipTier[],
  content: [
    { id: 1, type: "video", title: "Live @ Space Miami", isLocked: false, views: "12K", image: "/posts/space.jpg" },
    { id: 2, type: "audio", title: "Unreleased ID (Juampi Edit)", isLocked: true, views: "Locked", image: "/posts/audio-lock.jpg" },
    { id: 3, type: "video", title: "Studio Tour & Production Tips", isLocked: true, views: "Locked", image: "/posts/studio.jpg" },
  ]
};

export default function CreatorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("membership");

  const handleJoin = (tierId: string) => {
    // In a real app, this would trigger a smart contract transaction or Stripe flow
    alert(`Initiating join flow for Tier ${tierId}`);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 1. Immersive Header */}
      <div className="relative h-64 w-full">
        <Image
          src={CREATOR.coverImage || "/placeholder.svg"}
          alt="Cover"
          fill
          className="object-cover brightness-75"
          priority
        />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center z-10">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Floating Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
            <AvatarImage src={CREATOR.avatar} />
            <AvatarFallback>{CREATOR.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {/* Verified Badge */}
          <div className="absolute bottom-1 right-1 bg-[#1FA9D6] p-1 rounded-full border-2 border-white shadow-sm">
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* 2. Creator Info */}
      <div className="pt-14 px-5 text-center pb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          {CREATOR.name}
        </h1>
        <p className="text-gray-500 font-medium text-sm mb-3">{CREATOR.handle}</p>

        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto mb-4">
          {CREATOR.description}
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 mb-6">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Users className="w-3.5 h-3.5" />
            {CREATOR.supporters} Members
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Music className="w-3.5 h-3.5" />
            {CREATOR.category}
          </div>
        </div>
      </div>

      {/* 3. Main Content Tabs */}
      <Tabs defaultValue="membership" className="w-full" onValueChange={setActiveTab}>
        <div className="px-5 mb-6">
          <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 rounded-xl h-12">
            <TabsTrigger
              value="membership"
              className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              Memberships
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              Exclusive Feed
            </TabsTrigger>
          </TabsList>
        </div>

        {/* -- MEMBERSHIP TAB -- */}
        <TabsContent value="membership" className="px-5 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[#1FA9D6]" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Select a Tier</h2>
          </div>

          <div className="grid gap-5">
            {CREATOR.tiers.map((tier) => (
              <MembershipTierCard
                key={tier.id}
                tier={tier}
                onJoin={handleJoin}
              />
            ))}
          </div>

          <p className="text-xs text-center text-gray-400 mt-4 pb-4">
            Memberships are minted as NFTs on Base/Optimism.<br />You can cancel anytime.
          </p>
        </TabsContent>

        {/* -- EXCLUSIVE FEED TAB -- */}
        <TabsContent value="content" className="px-5 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-2 gap-3">
            {CREATOR.content.map((item) => (
              <div
                key={item.id}
                className={`
                  relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gray-100
                  ${item.isLocked ? 'grayscale opacity-90' : ''}
                `}
              >
                {/* Background Image */}
                <img src={item.image} className="w-full h-full object-cover" alt="Content" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">

                  {/* Lock State */}
                  {item.isLocked ? (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/90 text-black font-bold text-[10px]">
                        MEMBERS ONLY
                      </Badge>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#1FA9D6] border-none text-[10px]">FREE</Badge>
                    </div>
                  )}

                  <h3 className="text-white font-bold text-sm leading-tight mb-0.5 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-[10px] uppercase font-medium">
                    {item.type} • {item.views}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA for Content Tab */}
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
            <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Unlock Full Access</h3>
            <p className="text-sm text-gray-500 mb-4 mt-1">Join a membership tier to access 12+ exclusive sets and edits.</p>
            <Button
              onClick={() => setActiveTab('membership')}
              variant="outline"
              className="bg-white text-black font-bold border-gray-200"
            >
              View Plans
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
