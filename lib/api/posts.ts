import { supabase } from "@/lib/supabase/client";

export interface Post {
    id: string;
    content: string;
    media_url: string;
    likes_count: number;
    comments_count: number;
    created_at: string;
    type: string;
    author_wallet: string;
}

export async function getUserPosts(walletAddress: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_wallet", walletAddress)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }

    return data as Post[];
}
