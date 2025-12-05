"use client"

import { useState } from "react"
import { Settings, Banknote, Heart, MessageCircle, Share2, Lock, Send, LogOut, Star, Pencil } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Import the useAuth hook
import { useAuth } from "@/hooks/use-auth"

interface ProfileViewProps {
  username?: string
}

export default function ProfileView({ username = "usuario" }: ProfileViewProps) {
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [editedBio, setEditedBio] = useState("")
  const [commentText, setCommentText] = useState("")
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null)
  const [postComments, setPostComments] = useState<{ [key: string]: { author: string; text: string }[] }>({})
  const { balance, donated, userData, isArtist, logout } = useAuth() // Get user data and check if artist

  const avatarSrc = username === "juampi" ? "/images/profile/iamjuampi-avatar.jpg" : "/avatars/user.jpg"
  const coverSrc = username === "juampi" ? "/images/profile/iamjuampi-cover.jpg" : ""
  const displayName = userData?.username || "musicfan"

  const userProfile = {
    name: displayName,
    handle: `${displayName}`,
    bio: isArtist()
      ? "iamjuampi is a DJ, producer, and founder of Best Drops Ever."
      : "Music enthusiast and electronic music fan. Supporting my favorite artists on DROPSLAND.",
    category: isArtist() ? "Techno / House" : "Fan",
    memberSince: "March 2025",
    isVerified: userData?.isVerified || false,
  }

  const handleEditBio = () => {
    setEditedBio(userProfile.bio)
    setIsEditingBio(true)
  }

  const handleSaveBio = () => {
    alert("Profile updated successfully!")
    setIsEditingBio(false)
  }

  const handleSendComment = () => {
    if (!commentText.trim() || currentPostIndex === null) return
    const postKey = `profile-${currentPostIndex}`
    setPostComments((prev) => ({
      ...prev,
      [postKey]: [...(prev[postKey] || []), { author: displayName, text: commentText }],
    }))
    setCommentText("")
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gray-950">
      <div className="relative h-40">
        {coverSrc && <img src={coverSrc || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/50" />
      </div>

      <div className="px-4 pb-20">
        <div className="flex justify-center -mt-16 mb-4">
          <Avatar className="w-28 h-28 border-4 border-gray-950 ring-2 ring-yellow-400/30">
            <AvatarImage src={avatarSrc || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-950 text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <h1 className="text-2xl font-bold text-white break-words max-w-full">{userProfile.name}</h1>
            {userProfile.isVerified && <Star className="h-5 w-5 text-bright-yellow fill-bright-yellow flex-shrink-0" />}
          </div>
          <p className="text-gray-400 text-base mb-3 break-words">@{userProfile.handle}</p>
          <div className="flex items-center gap-2 justify-center flex-wrap mb-4">
            <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
              {userProfile.category}
            </Badge>
            <span className="text-xs text-gray-500">Member since {userProfile.memberSince}</span>
          </div>

          {isEditingBio ? (
            <div className="space-y-2 max-w-full">
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="bg-black/50 border-gray-700 w-full text-sm"
                rows={3}
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSaveBio}
                  className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-xs hover:bg-white/20"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-xs hover:bg-white/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 text-sm leading-relaxed break-words max-w-full mb-2">{userProfile.bio}</p>
              <button
                onClick={handleEditBio}
                className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white text-xs hover:bg-white/20 inline-flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Edit Bio
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 mb-4 border-y border-white/10">
          <div className="text-center">
            <p className="text-xl font-bold text-white">{balance}</p>
            <p className="text-xs text-gray-400">Balance</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">{donated}</p>
            <p className="text-xs text-gray-400">Purchased</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">8</p>
            <p className="text-xs text-gray-400">Artists</p>
          </div>
        </div>

        <Tabs defaultValue={isArtist() ? "posts" : "artists"} className="w-full">
          <TabsList className="w-full bg-transparent h-auto p-0 gap-4 border-b border-white/10 justify-start">
            {isArtist() ? (
              <>
                <TabsTrigger
                  value="posts"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-bright-yellow rounded-none pb-3 text-gray-400 data-[state=active]:text-white text-sm"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="rewards"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-bright-yellow rounded-none pb-3 text-gray-400 data-[state=active]:text-white text-sm"
                >
                  Rewards
                </TabsTrigger>
                <TabsTrigger
                  value="certs"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-bright-yellow rounded-none pb-3 text-gray-400 data-[state=active]:text-white text-sm"
                >
                  Certs
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger
                  value="artists"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-bright-yellow rounded-none pb-3 text-gray-400 data-[state=active]:text-white text-sm"
                >
                  Following
                </TabsTrigger>
                <TabsTrigger
                  value="rewards"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-bright-yellow rounded-none pb-3 text-gray-400 data-[state=active]:text-white text-sm"
                >
                  Rewards
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <div className="bg-black/40 rounded-lg p-3 border border-white/5">
              <div className="flex items-start gap-2 mb-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={avatarSrc || "/placeholder.svg"} />
                  <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-semibold text-sm text-white truncate">{userProfile.name}</span>
                    {userProfile.isVerified && (
                      <Star className="h-3 w-3 text-bright-yellow fill-bright-yellow flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400">2h ago</p>
                </div>
              </div>
              <p className="text-white text-sm break-words mb-2">New EP out now! #NewRelease</p>
              <div className="flex items-center gap-4 text-gray-400">
                <button className="flex items-center gap-1 hover:text-white text-xs">
                  <Heart className="w-4 h-4" />
                  <span>124</span>
                </button>
                <button className="flex items-center gap-1 hover:text-white text-xs">
                  <MessageCircle className="w-4 h-4" />
                  <span>32</span>
                </button>
                <button className="hover:text-white">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="artists" className="mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300 text-sm">
                  Welcome to your feed. Here you'll see posts from artists you follow.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300 text-sm">Your rewards will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certs" className="mt-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6 text-center">
                <p className="text-gray-300 text-sm">Your certifications will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Settings</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-gray-800 text-white border-gray-700 h-12">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Button variant="outline" className="w-full justify-start bg-gray-700 border-gray-600 h-10">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-gray-700 border-gray-600 h-10">
                  <Banknote className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gray-700 border-gray-600 h-10"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {!isArtist() && (
            <Card className="bg-bright-yellow/10 border-bright-yellow/30 mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock className="h-5 w-5 text-bright-yellow flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-white font-medium text-sm">Become an Artist</h3>
                      <p className="text-xs text-gray-400 truncate">Apply to become verified</p>
                    </div>
                  </div>
                  <Button className="bg-bright-yellow hover:bg-bright-yellow/90 text-black font-medium h-9 px-4 flex-shrink-0 text-sm">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-white/5 backdrop-blur-md text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2 my-4">
            {currentPostIndex !== null && postComments[`profile-${currentPostIndex}`]?.length > 0 ? (
              postComments[`profile-${currentPostIndex}`].map((comment, i) => (
                <div key={i} className="flex gap-2">
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage
                      src={
                        comment.author === "iamjuampi" ? "/images/profile/iamjuampi-avatar.jpg" : "/avatars/user.jpg"
                      }
                    />
                    <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-700 p-2 rounded-lg min-w-0">
                    <p className="text-xs font-medium truncate">{comment.author}</p>
                    <p className="text-xs text-gray-300 break-words">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-6 text-sm">No comments yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              className="bg-gray-700 border-gray-600 text-white text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendComment()
                }
              }}
            />
            <Button
              className="bg-bright-yellow hover:bg-bright-yellow/90 text-black flex-shrink-0"
              onClick={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// User posts
export const userPosts = [
  {
    content: "New EP 'Techno Dimensions' out now! 🎵 #NewRelease",
    time: "2 hours ago",
    likes: 87,
    comments: 14,
    image: "/images/dj-mixer.png",
  },
]

// Certifications with artist achievements
const certifications = [
  {
    id: "c1",
    type: "gold",
    title: "Gold Record",
    description: "Techno Dimensions EP reached 500,000 streams",
    date: "Mar 15, 2025",
  },
  {
    id: "c2",
    type: "platinum",
    title: "Platinum Record",
    description: "Midnight Pulse single reached 1,000,000 streams",
    date: "Feb 20, 2025",
  },
  {
    id: "c3",
    type: "views",
    title: "1M Views",
    description: "Music video for 'Electronic Dreams' reached 1 million views",
    date: "Jan 30, 2025",
  },
  {
    id: "c4",
    type: "soldout",
    title: "Sold Out Event",
    description: "Club Underground performance sold out in 24 hours",
    date: "Jan 15, 2025",
  },
  {
    id: "c5",
    type: "award",
    title: "Best New Artist",
    description: "Electronic Music Awards 2025",
    date: "Jan 5, 2025",
  },
]

// Rewards with real artists
const rewards = [
  {
    id: "r1",
    title: "Exclusive Track - March",
    artistName: "Banger",
    artistAvatar: "/avatars/banger.jpg",
    date: "Mar 15, 2025",
  },
  {
    id: "r2",
    title: "Unreleased Remix - Spring",
    artistName: "Nicola Marti",
    artistAvatar: "/avatars/nicola.jpg",
    date: "Mar 10, 2025",
  },
  {
    id: "r3",
    title: "Advanced Production Tutorial",
    artistName: "AXS",
    artistAvatar: "/avatars/axs.jpg",
    date: "Mar 5, 2025",
  },
]

// Artist rewards (for artist view)
const artistRewards = [
  {
    title: "Exclusive Monthly Track",
    description: "Unreleased track available only to token holders",
    minTokens: 10,
    subscribers: 156,
  },
  {
    title: "Production Masterclass",
    description: "Monthly video tutorial on advanced production techniques",
    minTokens: 25,
    subscribers: 87,
  },
  {
    title: "Stems & Project Files",
    description: "Complete project files for selected tracks",
    minTokens: 50,
    subscribers: 42,
  },
]

// Followed artists (for fan view)
const followedArtists = [
  {
    id: "banger",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
    tokens: 15,
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
    tokens: 10,
  },
  {
    id: "axs",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
    tokens: 25,
  },
  {
    id: "flush",
    name: "FLUSH",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
    tokens: 5,
  },
]
