"use client";

import TikTokFeed from "@/components/tiktok-feed";
import { FeedPost } from "@/lib/api/feed";
import Image from "next/image";
import { useEffect } from "react";
import sdk from "@farcaster/miniapp-sdk";

interface HomeFeedWrapperProps {
  initialPosts: FeedPost[];
}

export default function HomeFeedWrapper({
  initialPosts,
}: HomeFeedWrapperProps) {
  useEffect(() => {
    // Debug log to confirm this component mounted
    console.log("Page mounted. Attempting to call ready()...");

    // Force the ready call using the raw SDK
    // This bypasses any Context/Provider issues in OnchainKit
    sdk.actions.ready();

    console.log("Ready command sent.");
  }, []);

  const handleSelectArtist = (artistId: string) => {
    // Navigate via Next.js router
    // Checking if it's a valid ID before navigating could be added here
    window.location.href = `/profile/${artistId}`;
  };

  return (
    <div className="h-full w-full bg-black text-white relative">
      {/* Transparent Header for Reels */}
      <header className="absolute top-0 left-0 right-0 z-50 h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center justify-start h-12 px-4 pointer-events-auto">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className="h-6 w-auto"
            priority
          />
        </div>
      </header>

      <TikTokFeed
        onSelectArtist={handleSelectArtist}
        posts={initialPosts}
        type="home"
      />
    </div>
  );
}
