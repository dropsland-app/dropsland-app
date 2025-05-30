"use client"

import { useState } from "react"
import { Banknote, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Artistas reales
const ARTISTS = [
  {
    id: "1",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    genre: "Tech-House",
    description: "DJ y productor especializado en techno y house. Creador de Best Drops Ever.",
    supporters: 1850,
    blgReceived: 1850,
    featured: true,
  },
  {
    id: "2",
    name: "banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
    description: "Productor de house con influencias de disco y funk. Conocido por sus ritmos enérgicos.",
    supporters: 2100,
    blgReceived: 2100,
    featured: true,
  },
  {
    id: "3",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
    description: "Artista italiano de techno melódico con un estilo único y atmosférico.",
    supporters: 1750,
    blgReceived: 1750,
    featured: true,
  },
  {
    id: "4",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
    description: "Productor de drum & bass con un enfoque en sonidos futuristas y experimentales.",
    supporters: 1320,
    blgReceived: 1320,
    featured: false,
  },
  {
    id: "5",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    genre: "Trap",
    description: "Creador de trance progresivo con elementos de música clásica y ambient.",
    supporters: 980,
    blgReceived: 980,
    featured: false,
  },
  {
    id: "6",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    genre: "Dubstep",
    description: "Innovador en la escena dubstep con un estilo agresivo y detallado.",
    supporters: 1450,
    blgReceived: 1450,
    featured: false,
  },
  {
    id: "7",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
    description: "Productor de techno industrial con influencias de EBM y post-punk.",
    supporters: 1680,
    blgReceived: 1680,
    featured: true,
  },
  {
    id: "8",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    genre: "Electro",
    description: "Artista de ambient y música experimental con enfoque en paisajes sonoros inmersivos.",
    supporters: 890,
    blgReceived: 890,
    featured: false,
  },
]

export default function ArtistsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArtists = ARTISTS.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Search artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div className="space-y-3">
        {filteredArtists.map((artist) => (
          <Card key={artist.id} className="overflow-hidden bg-gray-800 border-gray-700">
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
                  <div className="flex items-center mt-1 text-xs">
                    <Banknote className="h-3 w-3 text-bright-yellow mr-1" />
                    <span>{artist.blgReceived.toLocaleString()} $DROPS</span>
                    <span className="mx-1">•</span>
                    <span>{artist.supporters.toLocaleString()} seguidores</span>
                  </div>
                </div>
                <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                  <Banknote className="h-4 w-4 mr-1" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

