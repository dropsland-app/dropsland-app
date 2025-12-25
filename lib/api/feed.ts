import { createClient } from "@/lib/supabase/server";

export interface FeedPost {
  id: string;
  type: "video" | "image"; // Simplified for feed
  artistId: string;
  name: string;
  avatar: string;
  content: string;
  videoUrl?: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  amount?: number;     // Optional: for transaction posts
  tokenName?: string;  // Optional: for transaction posts
  action?: string;     // Optional: for transaction posts
  audioUrl?: string;   // Keeping this optional as it might be used by the component
}

export async function getHomeFeed(): Promise<FeedPost[]> {
  const supabase = await createClient();

  // 1. Fetch posts and join with the author's profile
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles!fk_post_author (
        username,
        avatar_url,
        role
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error("Error loading feed:", error);
    }
    return [];
  }

  // 2. Map Database Columns -> Component Props
  return data.map((post: any) => {
    // Determine if the media_url is a video or image based on extension or logic
    // For this seed data, we treat generic URLs as images unless they end in .mp4
    const isVideo = post.media_url?.endsWith(".mp4") || post.media_url?.includes("youtube") || post.type === 'video';

    return {
      id: post.id,
      type: isVideo ? "video" : "image",

      // Author Details (Joined from profiles table)
      name: post.author?.username || "Unknown Artist",
      avatar: post.author?.avatar_url || "/avatars/user.jpg",
      artistId: post.author_wallet,

      // Content
      content: post.content,
      time: new Date(post.created_at).toLocaleDateString(),

      // Media Mapping
      videoUrl: isVideo ? post.media_url : undefined,
      image: !isVideo ? post.media_url : undefined, // Fallback for images

      // Engagement Stats
      likes: post.likes_count || 0,
      comments: post.comments_count || 0,
      audioUrl: post.audio_url
    };
  });
}
