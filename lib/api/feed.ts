import { createClient } from "@/lib/supabase/server";

// 1. The Single Truth Type
export interface FeedPost {
  id: string;
  type: "video" | "transaction" | "image";
  artistId: string;
  name: string;
  avatar: string;
  content: string;
  // Video specific
  videoUrl?: string;
  // Transaction specific
  action?: string;
  amount?: number;
  tokenName?: string;
  image?: string; // Cover image for transaction
  // Stats
  likes: number;
  comments: number;
  time: string;
  audioUrl?: string;
}

// 2. The Fetcher (Currently Mocks, Ready for DB)
export async function getHomeFeed(): Promise<FeedPost[]> {
  // TODO: Replace this array with a real DB query later
  // const supabase = createClient();
  // const { data } = await supabase...

  // For now, return your mixed Mock Data here
  return [
    {
      id: "video-1",
      type: "video",
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      content: "Check out this video!",
      time: "Just now",
      artistId: "iamjuampi",
      videoUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-ERO6FWXoXDoQHfYli3YRfJW2707gyn.mp4",
      likes: 120,
      comments: 5,
    },
    {
      id: "tx-1",
      type: "transaction",
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      artistId: "banger",
      content: "iamjuampi bought from Banger", // Unified content string
      action: "bought from Banger",
      amount: 15,
      tokenName: "BANGER",
      image: "/crypto-tokens-glowing.jpg",
      likes: 89,
      comments: 12,
      time: "5 hours ago",
    },
    // ... add the rest of your mock data here
  ];
}
