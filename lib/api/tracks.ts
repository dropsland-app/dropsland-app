import { supabase } from "@/lib/supabase/client";
import type { Track } from "@/types";

export async function getTracksByArtist(
  walletAddress: string,
): Promise<Track[]> {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .ilike("artist_wallet", walletAddress)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }

  return data as Track[];
}
