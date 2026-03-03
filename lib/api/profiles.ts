import { supabase } from "@/lib/supabase/client";

export interface UserProfile {
    wallet_address: string;
    username: string;
    bio: string | null;
    avatar_url: string | null;
    role: "FAN" | "DJ" | "ORGANIZER" | "STAFF";
    created_at?: string;
}

export async function getProfile(walletAddress: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // Ignore "Row not found" errors
            console.error("Error fetching profile:", error);
        }
        return null;
    }

    return data as UserProfile;
}

export async function createProfile(walletAddress: string, username: string) {
    const { data, error } = await supabase
        .from("profiles")
        .insert([
            { wallet_address: walletAddress, username: username, role: "FAN" }
        ])
        .select()
        .single();

    return { data, error };
}
