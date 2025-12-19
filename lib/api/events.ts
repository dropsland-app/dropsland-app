// lib/api/events.ts
import { createClient } from "../supabase/server";

export interface EventData {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  cover_image_url: string | null;
  is_featured: boolean;
  organizer: {
    username: string;
    avatar_url: string | null;
  } | null;
}

export async function getEvents() {
  const supabase = await createClient();

  // Fetch events and join with profiles to get organizer details
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles!fk_event_organizer (
        username,
        avatar_url
      )
    `,
    )
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data as EventData[];
}
