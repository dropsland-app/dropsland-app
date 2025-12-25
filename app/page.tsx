"use client";

import { useState } from "react";
import Image from "next/image";
import TikTokFeed from "@/components/tiktok-feed";
import { userPosts, allActivity } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { isArtist } = useAuth();

  // Navigation handler
  const handleSelectArtist = (artistId: string) => {
    // Navigate via Next.js router - assuming standard route structure
    // Since this is inside a client component, we could use useRouter key
    // but TikTokFeed might expect a callback.
    // For now we just log, or standard router implementation.
    window.location.href = `/profile/${artistId}`;
  };

  const feedPosts = [
    {
      id: "video-1",
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      content: "Check out this video!",
      time: "Just now",
      artistId: "iamjuampi",
      videoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-ERO6FWXoXDoQHfYli3YRfJW2707gyn.mp4",
      likes: 0,
      comments: 0,
    },
    // User posts from mock data
    ...userPosts.map((post, index) => ({
      ...post,
      id: `user-${index}`,
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      artistId: "iamjuampi",
      // Ensure audioUrl exists if needed by feed
      audioUrl: post.audioUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
    })),
    {
      id: "video-3",
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      content: "LABITCONF intro 🔥",
      time: "Just now",
      artistId: "iamjuampi",
      videoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-2-ZTNstzj7Cjh3UkPaugEBVKCVDfQUdJ.mp4",
      likes: 0,
      comments: 0,
    },
    // Filter activity to show interesting items in the feed
    ...allActivity
      .filter((activity) => activity.type === "purchase" || activity.type === "reward")
      .slice(0, 5) // Limit activity posts
      .map((activity) => ({
        id: activity.id,
        name: activity.name,
        avatar: activity.avatar,
        content: activity.message || `${activity.name} ${activity.action}`,
        time: activity.time,
        artistId: activity.artistId,
        // Mock image/media for activity items if missing
        image: activity.type === 'purchase' ? "/images/crypto-tokens-glowing.jpg" : undefined,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 5),
        amount: activity.amount,
        tokenName: activity.tokenName,
        action: activity.type === 'purchase', // flagging as action for UI
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
      })),
  ];

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

      {/* The Reel Feed */}
      <TikTokFeed onSelectArtist={handleSelectArtist} posts={feedPosts} type="home" />
    </div>
  );
}
