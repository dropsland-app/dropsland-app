"use client"

import { Search, Filter } from "lucide-react"
import Image from "next/image"

// Mock data for categories and creators
const CATEGORIES = ["All", "Art", "Music", "Tech", "Gaming", "Writing", "Cooking"]

const CREATORS = [
  {
    id: "1",
    name: "Elena Rodriguez",
    handle: "@elenadraws",
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Art",
    description: "Digital artist creating vibrant illustrations",
    blgReceived: 8750,
    featured: true,
  },
  {
    id: "2",
    name: "Marcus Chen",
    handle: "@marcusmusic",
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Music",
    description: "Independent musician sharing original compositions",
    blgReceived: 6320,
    featured: false,
  },
  {
    id: "3",
    name: "Sophia Williams",
    handle: "@sophiatech",
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Tech",
    description: "Tutorials and insights on blockchain development",
    blgReceived: 12450,
    featured: true,
  },
  {
    id: "4",
    name: "Jamal Thompson",
    handle: "@jamalgaming",
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Gaming",
    description: "Game reviews and live streaming of indie games",
    blgReceived: 4890,
    featured: false,
  },
  {
    id: "5",
    name: "Aisha Patel",
    handle: "@aishawriter",
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Writing",
    description: "Short stories and poetry from around the world",
    blgReceived: 3750,
    featured: false,
  },
  {
    id: "6",
    name: "Leo Kim",
    handle: "@leocooks",
    avatar: "/placeholder.svg?height=60&width=60",
    category: "Cooking",
    description: "Fusion recipes and culinary adventures",
    blgReceived: 7120,
    featured: true,
  },
]

export default function ExploreScreen({ onSelectCreator }) {
  return (
    <div className="h-full overflow-auto pb-20">
      <div className="bg-primary p-4">
        <h1 className="text-white font-bold text-xl mb-4">Explore Creators</h1>
        <div className="bg-white/20 rounded-full p-2 flex items-center mb-4">
          <Search className="h-4 w-4 text-white mr-2" />
          <input
            type="text"
            placeholder="Search creators..."
            className="bg-transparent text-white placeholder-white/70 outline-none w-full text-sm"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-1 scrollbar-hide">
          {CATEGORIES.map((category, index) => (
            <button
              key={index}
              className={`mx-1 px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
                index === 0 ? "bg-white text-primary" : "bg-white/20 text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Featured Creators</h2>
          <button className="flex items-center text-gray-600 text-sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CREATORS.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
              onClick={() => onSelectCreator(creator)}
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <Image
                      src={creator.avatar || "/placeholder.svg"}
                      alt={creator.name}
                      width={60}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{creator.name}</h3>
                      {creator.featured && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Featured</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">{creator.handle}</p>
                  </div>
                </div>
                <p className="text-sm mt-2">{creator.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{creator.category}</span>
                  <span className="text-xs text-gray-600 flex items-center">
                    <Image src="/beans-logo.svg" alt="BLG" width={12} height={12} className="mr-1" />
                    {creator.blgReceived.toLocaleString()} BLG received
                  </span>
                </div>
              </div>
              <div className="border-t px-4 py-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">View profile</span>
                <button className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-full">Support</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

