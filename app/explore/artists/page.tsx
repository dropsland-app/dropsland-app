"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExploreShell } from "@/app/explore/_components/explore-shell";
import { ExploreArtistsSection } from "@/app/explore/_components/explore-content";
import { getDJs, type DJProfile } from "@/lib/api/explore";

export default function ExploreArtistsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<DJProfile[]>([]);

  useEffect(() => {
    const fetchDJs = async () => {
      const djs = await getDJs();
      setArtists(djs);
    };
    fetchDJs();
  }, []);

  return (
    <ExploreShell searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <ExploreArtistsSection
        artists={artists}
        searchQuery={searchQuery}
        selectedMusicType={null}
        title={searchQuery !== "" ? "Search Results" : "Trending Artists"}
        onSelectArtist={(artistId) => router.push(`/profile/${artistId}`)}
      />
    </ExploreShell>
  );
}
