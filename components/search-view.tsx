"use client"

import { useState } from "react"
import { Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface SearchViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function SearchView({ onSelectArtist }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Function to handle artist selection with debugging
  const handleSelectArtist = (artistId: string) => {
    console.log("Search view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-4 pb-6 bg-gray-50 dark:bg-gray-950">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search artists..."
          className="pl-9 bg-gray-800 border-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery === "" ? (
        <>
          <h2 className="text-lg font-semibold mb-3 text-white">Popular Genres</h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {genres.map((genre) => (
              <Card key={genre.name} className="overflow-hidden bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="relative h-24">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <div className="absolute bottom-2 left-2 text-white z-20">
                      <p className="font-medium">{genre.name}</p>
                      <p className="text-xs">{genre.count} artists</p>
                    </div>
                    <img src="/images/dj-mixer.png" alt={genre.name} className="w-full h-full object-cover" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-3 text-white">Suggested Artists</h2>
        </>
      ) : (
        <h2 className="text-lg font-semibold mb-3 text-white">Results</h2>
      )}

      <div className="space-y-3 mb-6">
        {filteredArtists.map((artist) => (
          <Card
            key={artist.id}
            className="overflow-hidden bg-gray-800 border-gray-700 cursor-pointer"
            onClick={() => handleSelectArtist(artist.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-white">{artist.name}</p>
                    {artist.featured && <Star className="h-3 w-3 text-bright-yellow ml-1" />}
                  </div>
                  <p className="text-xs text-gray-400">{artist.handle}</p>
                  <Badge variant="outline" className="mt-1 text-xs bg-gray-700 text-gray-300 border-gray-600">
                    {artist.genre}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectArtist(artist.id)
                  }}
                >
                  <BanknoteIcon className="h-6 w-6 mr-0.5" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Topics - Ahora después de los artistas sugeridos */}
      {searchQuery === "" && (
        <>
          <h2 className="text-lg font-semibold mb-3 text-white">Trending</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Badge key={topic} variant="outline" className="bg-gray-800 border-gray-700 text-gray-300">
                {topic}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Electronic music genre data
const genres = [
  { name: "House", count: 245, image: "/categories/house.jpg" },
  { name: "Techno", count: 189, image: "/categories/techno.jpg" },
  { name: "Trance", count: 156, image: "/categories/trance.jpg" },
  { name: "Drum & Bass", count: 203, image: "/categories/dnb.jpg" },
  { name: "Dubstep", count: 124, image: "/categories/dubstep.jpg" },
  { name: "Ambient", count: 167, image: "/categories/ambient.jpg" },
]

// Real artists
const artists = [
  {
    id: "iamjuampi",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    genre: "Tech-House",
    description: "DJ, producer, and founder of the record label Best Drops Ever.",
    featured: true,
    blgReceived: 1850,
  },
  {
    id: "banger",
    name: "Banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
    description: "House producer with disco and funk influences. Known for energetic rhythms.",
    featured: true,
    blgReceived: 2100,
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
    description: "Italian melodic techno artist with a unique and atmospheric style.",
    featured: true,
    blgReceived: 1750,
  },
  {
    id: "flush",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
    description: "Drum & bass producer with a focus on futuristic and experimental sounds.",
    featured: false,
    blgReceived: 1320,
  },
  {
    id: "daniloDR",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    genre: "Trap",
    description: "Creator of progressive trance with elements of classical music and ambient.",
    featured: false,
    blgReceived: 980,
  },
  {
    id: "spitflux",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    genre: "Dubstep",
    description: "Innovator in the dubstep scene with an aggressive and detailed style.",
    featured: false,
    blgReceived: 1450,
  },
  {
    id: "axs",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
    description: "Producer of industrial techno with influences from EBM and post-punk.",
    featured: true,
    blgReceived: 1680,
  },
  {
    id: "kr4d",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    genre: "Electro",
    description: "Ambient and experimental music artist focusing on immersive soundscapes.",
    featured: false,
    blgReceived: 890,
  },
]

// Trending topics
const trendingTopics = [
  "#ElectronicMusic",
  "#HouseBeats",
  "#TechnoNights",
  "#TranceFamily",
  "#DrumAndBass",
  "#DubstepVibes",
]

