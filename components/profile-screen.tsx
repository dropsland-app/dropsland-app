"use client"

import { ArrowLeft, Banknote, Heart, MessageCircle, Share2 } from "lucide-react"
import Image from "next/image"

export default function ProfileScreen({ creator = null, onBack, onDonate, isCurrentUser = false }) {
  // Default creator data for current user profile if no creator is provided
  const profileData = creator || {
    id: "current-user",
    name: "Your Profile",
    handle: "@yourhandle",
    avatar: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=150&width=400",
    bio: "This is your profile. You can edit your details and see your activity here.",
    blgReceived: 0,
    supporters: 0,
    posts: [],
  }

  const defaultPosts = [
    {
      id: "p1",
      content: "Just released a new digital art collection! Check it out and let me know what you think.",
      image: "/placeholder.svg?height=200&width=300",
      likes: 42,
      comments: 7,
      time: "2h ago",
    },
    {
      id: "p2",
      content: "Working on something special for my supporters. Stay tuned!",
      image: null,
      likes: 28,
      comments: 5,
      time: "1d ago",
    },
  ]

  const posts = profileData.posts || defaultPosts

  return (
    <div className="h-full overflow-auto pb-4">
      {/* Header */}
      <div className="relative h-36">
        <Image
          src={profileData.coverImage || "/placeholder.svg?height=150&width=400"}
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <button
          className="absolute top-4 left-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <button className="absolute top-4 right-4 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center">
          <Share2 className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 relative">
        <div className="flex justify-between items-end mt-[-40px]">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-white">
            <Image
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          {!isCurrentUser && (
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium" onClick={onDonate}>
              <Banknote className="h-5 w-5 inline mr-1" />
              Donate BLG
            </button>
          )}
          {isCurrentUser && (
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-3">
          <h1 className="font-bold text-xl">{profileData.name}</h1>
          <p className="text-gray-500 text-sm">{profileData.handle}</p>

          <p className="mt-2 text-sm">{profileData.bio}</p>

          <div className="flex mt-3 space-x-4 text-sm">
            <div>
              <span className="font-bold">{profileData.supporters || 0}</span>
              <span className="text-gray-500 ml-1">supporters</span>
            </div>
            <div>
              <span className="font-bold">{profileData.blgReceived || 0}</span>
              <span className="text-gray-500 ml-1">BLG received</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mt-4">
          <button className="flex-1 py-2 font-medium text-primary border-b-2 border-primary">Posts</button>
          <button className="flex-1 py-2 font-medium text-gray-500">Rewards</button>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 mt-4 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{profileData.name}</p>
                <p className="text-gray-500 text-xs">{post.time}</p>
              </div>
            </div>

            <p className="text-sm mb-3">{post.content}</p>

            {post.image && (
              <div className="rounded-lg overflow-hidden mb-3 h-48 relative">
                <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between text-gray-500 text-sm">
              <button className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {post.likes}
              </button>
              <button className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.comments}
              </button>
              <button className="flex items-center">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

