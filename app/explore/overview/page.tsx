"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExploreShell } from "@/app/explore/_components/explore-shell";
import {
  ExploreArtistsSection,
  ExploreCategoriesSection,
  ExploreEventsSection,
  ExploreMusicTypesSection,
} from "@/app/explore/_components/explore-content";
import { getDJs, type DJProfile } from "@/lib/api/explore";

export default function ExploreOverviewPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<DJProfile[]>([]);
  const [selectedMusicType, setSelectedMusicType] = useState<string | null>(null);

  useEffect(() => {
    const fetchDJs = async () => {
      const djs = await getDJs();
      setArtists(djs);
    };
    fetchDJs();
  }, []);

  return (
    <ExploreShell searchQuery={searchQuery} onSearchChange={setSearchQuery}>
      {searchQuery === "" && (
        <>
          <ExploreCategoriesSection />
          <ExploreMusicTypesSection
            selectedMusicType={selectedMusicType}
            setSelectedMusicType={setSelectedMusicType}
            onGenreClick={(genre) => router.push(`/explore/music-types?genre=${encodeURIComponent(genre)}`)}
          />
          <ExploreEventsSection />
        </>
      )}

      <ExploreArtistsSection
        artists={artists}
        searchQuery={searchQuery}
        selectedMusicType={selectedMusicType}
        title={searchQuery !== "" ? "Search Results" : "Trending Artists"}
        onSelectArtist={(artistId) => router.push(`/profile/${artistId}`)}
      />
    </ExploreShell>
  );
}
