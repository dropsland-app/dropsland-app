"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Star, Music, TrendingUp, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getDJs, type DJProfile } from "@/lib/api/explore"

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [artists, setArtists] = useState<DJProfile[]>([])

  useEffect(() => {
    const fetchDJs = async () => {
      const djs = await getDJs();
      setArtists(djs);
    }
    fetchDJs();
  }, []);

  const handleSelectArtist = (artistId: string) => {
    router.push(`/profile/${artistId}`)
  }

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Using static classes for backgrounds and text colors so Tailwind detects them.
  // Switched to Pastel Backgrounds + Dark Text for better visibility.
  const genres = [
    { name: "House", count: 245, bg: "bg-blue-100", text: "text-blue-700" },
    { name: "Techno", count: 189, bg: "bg-zinc-200", text: "text-zinc-800" },
    { name: "Trance", count: 156, bg: "bg-purple-100", text: "text-purple-700" },
    { name: "DnB", count: 203, bg: "bg-orange-100", text: "text-orange-800" },
    { name: "Dubstep", count: 124, bg: "bg-pink-100", text: "text-pink-700" },
    { name: "Ambient", count: 167, bg: "bg-teal-100", text: "text-teal-800" },
  ]

  const trendingTopics = [
    "#ElectronicMusic",
    "#HouseBeats",
    "#TechnoNights",
    "#TranceFamily",
    "#DrumAndBass",
    "#DubstepVibes",
  ]

  return (
    <div className="w-full h-full pb-24 overflow-y-auto bg-white">
      {/* Header - Crisp White with strong border */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-neutral-200 px-5 pt-12 pb-4">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-4 tracking-tight">Explore</h1>

        {/* Search Bar - High Contrast */}
        <div className="relative group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#1FA9D6] transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <Input
            placeholder="Search artists, genres..."
            className="pl-11 h-12 rounded-xl bg-neutral-100 border-transparent text-neutral-900 placeholder:text-neutral-500 font-medium focus:bg-white focus:border-[#1FA9D6] focus:ring-4 focus:ring-[#1FA9D6]/10 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-5 space-y-8 animate-in fade-in duration-500">
        {searchQuery === "" && (
          <>
            {/* Genres Section - Pastel Cards */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#1FA9D6]" />
                  <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Popular Genres</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {genres.map((genre) => (
                  <Card
                    key={genre.name}
                    className={`border-none shadow-none hover:brightness-95 transition-all cursor-pointer rounded-2xl ${genre.bg}`}
                  >
                    <CardContent className="p-4 h-24 flex flex-col justify-between relative overflow-hidden">
                      {/* Decorative Circle for subtle detail */}
                      <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full blur-2xl" />

                      <p className={`font-bold text-lg ${genre.text}`}>{genre.name}</p>
                      <div className="flex justify-between items-end">
                        <span className={`text-[11px] font-bold px-2 py-1 bg-white/60 rounded-lg ${genre.text}`}>
                          {genre.count} artists
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Trending Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#1FA9D6]" />
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Trending Now</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="bg-neutral-100 text-neutral-600 border border-neutral-200 px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-neutral-200 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </section>

            <h2 className="text-xl font-bold text-neutral-900 pt-2">Suggested Artists</h2>
          </>
        )}

        {searchQuery !== "" && (
          <h2 className="text-lg font-bold text-neutral-900">Results</h2>
        )}

        {/* Artist List - Clean Minimal Cards */}
        <div className="space-y-3">
          {filteredArtists.map((artist) => (
            <Card
              key={artist.id}
              className="bg-white border border-neutral-100 shadow-sm hover:border-[#1FA9D6]/40 hover:shadow-md transition-all duration-300 rounded-2xl overflow-visible"
              onClick={() => handleSelectArtist(artist.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 ring-2 ring-neutral-50">
                      <AvatarImage src={artist.avatar} alt={artist.name} />
                      <AvatarFallback className="bg-neutral-100 text-neutral-600 font-bold">
                        {artist.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {artist.featured && (
                      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm ring-1 ring-neutral-100">
                        <Star className="h-3.5 w-3.5 text-[#1FA9D6] fill-[#1FA9D6]" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 text-sm truncate">{artist.name}</h3>
                    <p className="text-xs text-neutral-500 truncate mb-1">{artist.handle}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] font-medium bg-neutral-50 text-neutral-600 border-neutral-200 px-1.5 py-0 h-5">
                        {artist.genre}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Icon */}
                  <div className="h-8 w-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 group-hover:bg-[#1FA9D6] group-hover:text-white transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredArtists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
              <Search className="h-12 w-12 text-neutral-300 mb-2" />
              <p className="text-neutral-900 font-medium">No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

