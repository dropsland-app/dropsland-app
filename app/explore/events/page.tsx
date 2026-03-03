"use client";

import { useState } from "react";
import { ExploreShell } from "@/app/explore/_components/explore-shell";
import { ExploreEventsSection } from "@/app/explore/_components/explore-content";

export default function ExploreEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ExploreShell searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <ExploreEventsSection />
    </ExploreShell>
  );
}
