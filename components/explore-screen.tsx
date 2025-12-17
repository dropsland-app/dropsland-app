"use client"

import TikTokFeed from "./tiktok-feed"

interface ExploreScreenProps {
  onSelectArtist: (artistId: string) => void
}

const featuredArtists = [
  {
    id: "banger",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
  },
  {
    id: "axs",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
  },
  {
    id: "flush",
    name: "FLUSH",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
  },
  {
    id: "daniloDR",
    name: "DaniløDR",
    avatar: "/avatars/danilo.jpg",
    genre: "Trap",
  },
  {
    id: "spitflux",
    name: "Spitflux",
    avatar: "/avatars/spitflux.jpg",
    genre: "Dubstep",
  },
  {
    id: "kr4d",
    name: "Kr4D",
    avatar: "/avatars/kr4d.jpg",
    genre: "Electro",
  },
  {
    id: "iamjuampi",
    name: "iamjuampi",
    avatar: "/avatars/juampi.jpg",
    genre: "Tech-House",
  },
]

const artistImages = [
  "/images/explore/dnb-tech-house.jpg",
  "/images/explore/tech-house.jpg",
  "/images/explore/riddim.jpg",
  "/images/explore/dubstep.jpg",
  "/images/explore/trap.jpg",
  "/images/explore/dubstep-2.jpg",
  "/images/explore/electro.jpg",
  "/images/explore/tech-house-2.jpg",
]

export default function ExploreScreen({ onSelectArtist }: ExploreScreenProps) {
  const explorePosts = featuredArtists.map((artist, index) => ({
    id: artist.id,
    name: artist.name,
    avatar: artist.avatar,
    content: `${artist.genre} artist with amazing tracks. Follow for exclusive content!`,
    time: "Featured",
    artistId: artist.id,
    image: artistImages[index],
    likes: Math.floor(Math.random() * 500) + 100,
    comments: Math.floor(Math.random() * 80) + 20,
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
  }))

  return <TikTokFeed onSelectArtist={onSelectArtist} posts={explorePosts} type="explore" />
}
