import { createClient } from "@/lib/supabase/server";
import { getRealFeed } from "@/lib/api/feed";
import HomeFeedWrapper from "@/components/home-feed-wrapper";

export default async function HomePage() {
  const supabase = await createClient();
  const dbPosts = await getRealFeed(supabase);

  return <HomeFeedWrapper posts={dbPosts} />;
}

