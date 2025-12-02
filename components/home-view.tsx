"use client"

import TikTokFeed from "./tiktok-feed"
import { userPosts } from "./profile-view"
import { useAuth } from "@/hooks/use-auth"

interface HomeViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function HomeView({ onSelectArtist }: HomeViewProps) {
  const { isArtist } = useAuth()

  const feedPosts = [
    {
      id: "video-1",
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      content: "Check out this video!",
      time: "Just now",
      artistId: "iamjuampi",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-ERO6FWXoXDoQHfYli3YRfJW2707gyn.mp4",
      likes: 0,
      comments: 0,
    },
    // User posts
    ...userPosts.map((post, index) => ({
      ...post,
      id: `user-${index}`,
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      artistId: "iamjuampi",
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dropsland%20intro%20-zLJ8jWsSzQtpbfyFxg7ZRU5O6DnNec.mp3",
    })),
    {
      id: "video-3",
      name: "iamjuampi",
      avatar: "/avatars/juampi.jpg",
      content: "LABITCONF intro 🔥",
      time: "Just now",
      artistId: "iamjuampi",
      videoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/test-2-ZTNstzj7Cjh3UkPaugEBVKCVDfQUdJ.mp4",
      likes: 0,
      comments: 0,
    },
    // Activity posts
    ...recentActivity
      .filter((activity) => activity.type === "post")
      .map((activity) => ({
        ...activity,
        content: activity.content,
      })),
    // Transaction posts
    ...recentActivity
      .filter((activity) => activity.type === "transaction")
      .map((activity) => ({
        ...activity,
        content: `${activity.name} ${activity.action}`,
      })),
  ]

  return <TikTokFeed onSelectArtist={onSelectArtist} posts={feedPosts} type="home" />
}

// Featured artists (using real artists)
const featuredArtists = [
  {
    id: "banger",
    name: "Banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
  },
  {
    id: "axs",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
  },
  {
    id: "flush",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
  },
  {
    id: "daniloDR",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    genre: "Trap",
  },
  {
    id: "spitflux",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    genre: "Dubstep",
  },
  {
    id: "kr4d",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    genre: "Electro",
  },
  {
    id: "iamjuampi",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    genre: "Tech-House",
  },
]

// Recent activity combining transactions and posts
const recentActivity = [
  {
    id: "a1",
    type: "transaction",
    name: "iamjuampi",
    avatar: "/avatars/juampi.jpg",
    action: "bought from Banger",
    amount: 15,
    time: "5 hours ago",
    artistId: "banger",
    tokenName: "BANGER",
    image: "/crypto-tokens-glowing.jpg",
    likes: 89,
    comments: 12,
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dropsland%20intro%20-zLJ8jWsSzQtpbfyFxg7ZRU5O6DnNec.mp3",
  },
  {
    id: "a2",
    type: "transaction",
    name: "DaniløDR",
    avatar: "/avatars/danilo.jpg",
    action: "bought from Nicola Marti",
    amount: 10,
    time: "1 day ago",
    artistId: "nicolamarti",
    tokenName: "NICOLA",
    image: "/music-producer-studio.png",
    likes: 123,
    comments: 23,
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dropsland%20intro%20-zLJ8jWsSzQtpbfyFxg7ZRU5O6DnNec.mp3",
  },
  {
    id: "a3",
    type: "transaction",
    name: "Spitflux",
    avatar: "/avatars/spitflux.jpg",
    action: "bought from AXS",
    amount: 25,
    time: "3 days ago",
    artistId: "axs",
    tokenName: "AXS",
    image: "/neon-crypto-visualization.jpg",
    likes: 198,
    comments: 34,
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dropsland%20intro%20-zLJ8jWsSzQtpbfyFxg7ZRU5O6DnNec.mp3",
  },
]
