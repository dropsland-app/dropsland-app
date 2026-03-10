import { getEvents } from "@/lib/api/events";
import { ExploreEventsClient } from "./events-client";

export default async function ExploreEventsPage() {
  const events = await getEvents();

  return <ExploreEventsClient events={events} />;
}
