import { getEvents } from "@/lib/api/events";
import ExploreOverviewClientPage from "./overview-client";

export default async function ExploreOverviewPage() {
  const events = await getEvents();

  return <ExploreOverviewClientPage events={events} />;
}
