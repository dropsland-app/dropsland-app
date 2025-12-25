"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { allArtists } from "@/lib/mock-data"

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSelectArtist = (artistId: string) => {
    console.log("Navigating to artist:", artistId)
    router.push(`/profile/${artistId}`)
  }

  const filteredArtists = allArtists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mock data for genres
  const genres = [
    { name: "House", count: 245, image: "/categories/house.jpg" },
    { name: "Techno", count: 189, image: "/categories/techno.jpg" },
    { name: "Trance", count: 156, image: "/categories/trance.jpg" },
    { name: "Drum & Bass", count: 203, image: "/categories/dnb.jpg" },
    { name: "Dubstep", count: 124, image: "/categories/dubstep.jpg" },
    { name: "Ambient", count: 167, image: "/categories/ambient.jpg" },
  ]

  // Mock data for trending topics
  const trendingTopics = [
    "#ElectronicMusic",
    "#HouseBeats",
    "#TechnoNights",
    "#TranceFamily",
    "#DrumAndBass",
    "#DubstepVibes",
  ]

  return (
    <div className="w-full h-full pb-24 overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white p-4 pb-2 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-4">Explore</h1>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search artists..."
            className="pl-9 bg-gray-100 border-gray-200 text-gray-900 focus:bg-white transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {searchQuery === "" && (
          <>
            <div>
              <h2 className="text-lg font-bold mb-3 text-[#1E1E1E]">Popular Genres</h2>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <Card key={genre.name} className="overflow-hidden bg-[#3A3A3A]/5 border-none shadow-sm cursor-pointer hover:shadow-md transition-all">
                    <CardContent className="p-0">
                      <div className="relative h-20">
                        {/* Fallback pattern if image fails */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1FA9D6]/20 to-purple-500/20" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                        <div className="absolute bottom-2 left-3 text-white z-20">
                          <p className="font-bold text-sm tracking-wide">{genre.name}</p>
                          <p className="text-[10px] opacity-80">{genre.count} artists</p>
                        </div>
                        {/* We can use dummy images or patterns */}
                        {/* <img src={genre.image} alt={genre.name} className="w-full h-full object-cover" /> */}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3 text-[#1E1E1E]">Trending</h2>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer px-3 py-1 text-xs"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <h2 className="text-lg font-bold text-[#1E1E1E]">Suggested Artists</h2>
          </>
        )}

        {searchQuery !== "" && (
          <h2 className="text-lg font-bold text-[#1E1E1E]">Results</h2>
        )}

        <div className="grid gap-3">
          {filteredArtists.map((artist) => (
            <Card
              key={artist.id}
              className="overflow-hidden bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-[#1FA9D6]/30 hover:shadow-md transition-all"
              onClick={() => handleSelectArtist(artist.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-gray-50">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-500 font-bold">
                      {artist.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="font-bold text-[#1E1E1E] truncate">{artist.name}</p>
                      {artist.featured && <Star className="h-3 w-3 text-[#1FA9D6] fill-[#1FA9D6]" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{artist.handle}</p>
                    <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600 border-gray-200">
                      {artist.genre}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold text-xs px-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectArtist(artist.id)
                    }}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredArtists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No artists found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
