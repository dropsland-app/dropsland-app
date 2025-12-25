import { createClient } from "@/lib/supabase/client";

export interface DJProfile {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    genre: string;
    description: string | null;
    featured: boolean;
}

export async function getDJs(): Promise<DJProfile[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "DJ");

    if (error) {
        console.error("Error fetching DJs:", error);
        return [];
    }

    return data.map((dj: any) => ({
        id: dj.wallet_address,
        name: dj.username || "Unknown",
        handle: `@${dj.username || "user"}`,
        avatar: dj.avatar_url || "/avatars/user.jpg",
        genre: "Multi-Genre", // Placeholder as 'genre' col might not exist yet
        description: dj.bio,
        featured: false // Logic for featured artists can be added later
    }));
}
