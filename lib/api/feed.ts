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

// 2. The Fetcher
export async function getRealFeed(supabase: any): Promise<FeedPost[]> {
  // Note: 'author' is an alias for the relation to 'profiles'.
  // Depending on how your FK is named, you might need to adjust `friends!fk_post_author` or similar.
  // Assuming 'profiles' is linked via 'author_wallet' -> 'wallet_address'
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles!posts_author_wallet_fkey (
        username,
        avatar_url,
        role
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading feed:", error);
    return [];
  }

  // Map DB structure to App UI structure
  return data.map((post: any) => ({
    id: post.id,
    type: post.type || 'video', // default to video if undefined
    name: post.author?.username || "Unknown",
    avatar: post.author?.avatar_url || "/placeholder.svg",
    content: post.content,
    time: new Date(post.created_at).toLocaleDateString(),
    artistId: post.author_wallet,
    videoUrl: post.media_url,
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    // Add extra mappings if needed
    audioUrl: post.audio_url,
  }));
}
