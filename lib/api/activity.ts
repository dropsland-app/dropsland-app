import { supabase } from "@/lib/supabase/client";

export interface ActivityItem {
  id: string;
  type: "purchase" | "mention" | "reward" | "follow";
  name: string;
  avatar: string;
  action: string;
  message: string | null;
  amount: number | null;
  tokenName: string | null;
  time: string;
  artistId: string;
  relatedTo: "artist" | "fan";
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function getActivityFeed(
  walletAddress: string,
  role: string,
): Promise<ActivityItem[]> {
  const relatedTo = role === "DJ" ? "artist" : "fan";

  const { data, error } = await supabase
    .from("activity")
    .select(
      `
      *,
      actor:profiles!activity_actor_wallet_fkey (
        username,
        avatar_url,
        wallet_address
      )
    `,
    )
    .eq("target_wallet", walletAddress)
    .eq("related_to", relatedTo)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching activity feed:", error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    type: item.type,
    name: item.actor?.username || "Unknown",
    avatar: item.actor?.avatar_url || "/placeholder.svg",
    action: item.action,
    message: item.message,
    amount: item.amount,
    tokenName: item.token_name,
    time: formatTimeAgo(item.created_at),
    artistId: item.actor?.wallet_address || "",
    relatedTo: item.related_to,
  }));
}
