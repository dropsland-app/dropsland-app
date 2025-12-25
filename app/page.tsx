import { getHomeFeed } from "@/lib/api/feed";
import HomeFeedWrapper from "@/components/home-feed-wrapper";

export default async function HomePage() {
  const feedPosts = await getHomeFeed();

  return <HomeFeedWrapper initialPosts={feedPosts} />;
}
