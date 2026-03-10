"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExploreShell } from "@/app/explore/_components/explore-shell";
import {
  ExploreArtistsSection,
  ExploreMusicTypesSection,
} from "@/app/explore/_components/explore-content";
import { getDJs, type DJProfile } from "@/lib/api/explore";

export default function ExploreMusicTypesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<DJProfile[]>([]);
  const [selectedMusicType, setSelectedMusicType] = useState<string | null>(
    searchParams.get("genre") || "House"
  );

  useEffect(() => {
    const fetchDJs = async () => {
      const djs = await getDJs();
      setArtists(djs);
    };
    fetchDJs();
  }, []);

  return (
    <ExploreShell searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      <ExploreMusicTypesSection
        selectedMusicType={selectedMusicType}
        setSelectedMusicType={setSelectedMusicType}
      />

      <ExploreArtistsSection
        artists={artists}
        searchQuery={searchQuery}
        selectedMusicType={selectedMusicType}
        title={selectedMusicType ? `${selectedMusicType} Artists` : "Artists"}
        onSelectArtist={(artistId) => router.push(`/profile/${artistId}`)}
      />
    </ExploreShell>
  );
}
