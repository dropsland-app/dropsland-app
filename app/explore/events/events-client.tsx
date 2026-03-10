"use client";

import { useState } from "react";
import { ExploreShell } from "@/app/explore/_components/explore-shell";
import { ExploreEventsSection } from "@/app/explore/_components/explore-content";
import type { EventData } from "@/lib/api/events";

type ExploreEventsClientProps = {
  events: EventData[];
};

export function ExploreEventsClient({ events }: ExploreEventsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ExploreShell searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <ExploreEventsSection events={events} />
    </ExploreShell>
  );
}
