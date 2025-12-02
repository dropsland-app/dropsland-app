"use client"

import { useState } from "react"
import {
  Settings,
  Banknote,
  Edit,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Lock,
  Award,
  Disc,
  Users,
  Video,
  ImageIcon,
  MapPin,
  Hash,
  BarChart2,
  Paperclip,
  Send,
  LogOut,
  Star,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Import the useAuth hook
import { useAuth } from "@/hooks/use-auth"

interface ProfileViewProps {
  username?: string
}

export default function ProfileView({ username = "usuario" }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [editedBio, setEditedBio] = useState("")
  const { balance, donated, userData, isArtist, logout } = useAuth() // Get user data and check if artist

  // Nuevos estados para likes y comentarios
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({})
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null)
  const [commentText, setCommentText] = useState("")
  const [postComments, setPostComments] = useState<{ [key: string]: { author: string; text: string }[] }>({})

  // Determine avatar image based on username
  const avatarSrc = username === "juampi" ? "/avatars/juampi.jpg" : "/avatars/user.jpg"

  // Use the new cover image
  const coverSrc = isArtist() ? "/images/bdeeeee.jpg" : "bg-gradient-to-r from-gray-800 to-black"
  const hasCoverImage = isArtist()

  // Find the userProfile object and update the bio for artists
  const userProfile = {
    name: userData?.username || "musicfan",
    handle: `@${userData?.username || "musicfan"}`,
    bio: isArtist()
      ? "iamjuampi is a DJ, producer, and founder of Best Drops Ever."
      : "Music enthusiast and electronic music fan. Supporting my favorite artists on DROPSLAND.",
    category: isArtist() ? "Techno / House" : "Fan",
    memberSince: "March 2025",
    isVerified: userData?.isVerified || false,
  }

  // Modificar la función para dar like a un post
  const handleLike = (postIndex: number) => {
    const postKey = `profile-${postIndex}`
    setLikedPosts((prev) => {
      const newLikedPosts = { ...prev }
      newLikedPosts[postKey] = !prev[postKey]
      return newLikedPosts
    })
  }

  // Función para abrir el diálogo de comentarios
  const handleOpenComments = (postIndex: number) => {
    setCurrentPostIndex(postIndex)
    setShowCommentDialog(true)
  }

  // Función para enviar un comentario
  const handleSendComment = () => {
    if (!commentText.trim() || currentPostIndex === null) return

    const postKey = `profile-${currentPostIndex}`
    setPostComments((prev) => {
      const newComments = { ...prev }
      if (!newComments[postKey]) {
        newComments[postKey] = []
      }
      newComments[postKey].push({
        author: userData?.username || "user",
        text: commentText,
      })
      return newComments
    })

    setCommentText("")
  }

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      // In a real app, this would send the post to a server
      alert("Post submitted: " + postContent)
      setPostContent("")
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      alert("Profile updated successfully!")
    } else {
      // Start editing - initialize with current bio
      setEditedBio(userProfile.bio)
    }
    setIsEditing(!isEditing)
  }

  return (
    <div className="w-full max-w-full pb-6 bg-gray-950 h-full overflow-y-auto overflow-x-hidden">
      {/* Profile Header */}
      <div className="relative">
        {hasCoverImage ? (
          <div className="h-32 relative overflow-hidden">
            <Image
              src={coverSrc || "/placeholder.svg"}
              alt="Profile cover"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-r from-gray-800 to-black"></div>
        )}
        <div className="absolute top-20 left-0 w-full px-4">
          <div className="flex justify-between max-w-full">
            <Avatar className="h-24 w-24 flex-shrink-0">
              <AvatarImage src={avatarSrc || "/placeholder.svg"} alt="Your profile" />
              <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 text-white border-gray-700"
              onClick={handleEditToggle}
            >
              {isEditing ? (
                <>
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-16 px-4 max-w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white truncate">{userProfile.name}</h2>
          {userProfile.isVerified && <Star className="h-5 w-5 text-bright-yellow fill-bright-yellow" />}
        </div>
        <p className="text-gray-400 break-words">@{userProfile.handle}</p>

        <div className="flex items-center mt-2">
          <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
            {userProfile.category}
          </Badge>
          <span className="text-sm text-gray-400 ml-2">Member since {userProfile.memberSince}</span>
        </div>

        {isEditing ? (
          <div className="space-y-3 mt-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Bio</label>
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="text-sm text-gray-300 border border-gray-700 p-2 rounded-md bg-gray-800 w-full"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Category</label>
              <Input
                defaultValue={userProfile.category}
                className="text-sm text-gray-300 border border-gray-700 p-2 rounded-md bg-gray-800 w-full"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm mt-3 text-gray-300 break-words">{userProfile.bio}</p>
        )}

        {/* Update the section showing balance and purchased value */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-400">Balance</p>
            <div className="flex items-center">
              <span className="font-bold text-white">{balance} $DROPS</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Purchased</p>
            <div className="flex items-center">
              <span className="font-bold text-white">{donated} $DROPS</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Artists</p>
            <p className="font-bold text-white">8</p>
          </div>
        </div>
      </div>

      {/* Tabs - Reordered as requested */}
      <div className="mt-6 w-full max-w-full">
        <Tabs defaultValue={isArtist() ? "posts" : "artists"}>
          <TabsList className={`grid w-full px-4 bg-gray-800 ${isArtist() ? "grid-cols-3" : "grid-cols-2"}`}>
            {isArtist() ? (
              <>
                <TabsTrigger value="posts" className="data-[state=active]:bg-gray-700">
                  Posts
                </TabsTrigger>
                <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700">
                  Rewards
                </TabsTrigger>
                <TabsTrigger value="certifications" className="data-[state=active]:bg-gray-700">
                  Certifications
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="artists" className="data-[state=active]:bg-gray-700">
                  Following
                </TabsTrigger>
                <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700">
                  My Rewards
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Posts Tab - For All Users */}
          <TabsContent value="posts" className="px-4 mt-4 space-y-4 max-w-full">
            {/* New Post Creation Area - Only for Artists */}
            {isArtist() && (
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="What's on your USB?"
                        className="bg-gray-700 border-gray-600 text-white resize-none mb-3"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-4 mb-3 justify-start">
                        <ImageIcon className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                        <MapPin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                        <Hash className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                        <BarChart2 className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                        <Paperclip className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
                      </div>
                      <Button
                        className="w-full bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                        onClick={handlePostSubmit}
                        disabled={!postContent.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* For fans, show a message about their activity */}
            {!isArtist() && (
              <Card className="bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-300">Welcome to your feed. Here you'll see posts from artists you follow.</p>
                  <p className="text-gray-400 text-sm mt-2">
                    You can like and comment on posts, but only artists can create content.
                  </p>
                </CardContent>
              </Card>
            )}

            {userPosts.map((post, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={avatarSrc || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{userProfile.name}</p>
                      <p className="text-gray-400 text-xs">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{post.content}</p>
                  {post.image && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-auto" />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <button className="flex items-center" onClick={() => handleLike(index)}>
                      <Heart
                        className={`h-4 w-4 mr-1 ${likedPosts[`profile-${index}`] ? "fill-red-500 text-red-500" : ""}`}
                      />
                      {post.likes + (likedPosts[`profile-${index}`] ? 1 : 0)}
                    </button>
                    <button className="flex items-center" onClick={() => handleOpenComments(index)}>
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments + (postComments[`profile-${index}`]?.length || 0)}
                    </button>
                    <button className="flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Rewards Tab - For Artists */}
          {isArtist() && (
            <TabsContent value="rewards" className="px-4 mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-white font-medium">Manage Rewards</h3>
                <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                  Add Reward
                </Button>
              </div>

              {artistRewards.map((reward, index) => (
                <Card key={index} className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{reward.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                            {reward.minTokens} $DROPS required
                          </Badge>
                          <p className="text-xs text-gray-500 ml-2">{reward.subscribers} subscribers</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 bg-gray-700 text-white border-gray-600">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )}

          {/* Certifications Tab - For Artists */}
          <TabsContent value="certifications" className="px-4 mt-4 space-y-3">
            {certifications.map((cert) => (
              <Card key={cert.id} className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-bright-yellow/20 flex items-center justify-center">
                      {cert.type === "gold" && <Disc className="h-6 w-6 text-bright-yellow" />}
                      {cert.type === "platinum" && <Disc className="h-6 w-6 text-gray-300" />}
                      {cert.type === "views" && <Video className="h-6 w-6 text-bright-yellow" />}
                      {cert.type === "soldout" && <Users className="h-6 w-6 text-bright-yellow" />}
                      {cert.type === "award" && <Award className="h-6 w-6 text-bright-yellow" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-white font-medium">{cert.title}</p>
                        {/* Change this part where the button styling is determined based on certification type */}
                        <Button
                          size="sm"
                          className={`${
                            cert.type === "gold"
                              ? "bg-[#F9BF15] hover:bg-[#e0ab13] text-black" // Changed from #082479 to #F9BF15 with black text
                              : cert.type === "platinum"
                                ? "bg-gray-400 hover:bg-gray-500"
                                : cert.type === "views"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : cert.type === "soldout"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                          } text-white rounded-full`}
                          onClick={() => {
                            if (cert.type === "gold" || cert.type === "platinum") {
                              window.open("https://open.spotify.com/artist/iamjuampi", "_blank")
                            } else if (cert.type === "views") {
                              window.open("https://youtube.com", "_blank")
                            } else if (cert.type === "soldout") {
                              alert("Tour dates coming soon!")
                            } else {
                              alert("Award details coming soon!")
                            }
                          }}
                        >
                          {cert.type === "gold"
                            ? "Stream"
                            : cert.type === "platinum"
                              ? "Stream"
                              : cert.type === "views"
                                ? "Watch"
                                : cert.type === "soldout"
                                  ? "Tour Dates"
                                  : "Award"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400">{cert.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Rewards Tab - For Fans */}
          {!isArtist() && (
            <TabsContent value="rewards" className="px-4 mt-4 space-y-3">
              <div className="mb-4">
                <h3 className="text-white font-medium mb-2">My Rewards</h3>
                <p className="text-sm text-gray-400">Exclusive rewards from artists you support</p>
              </div>

              {rewards.map((reward) => (
                <Card key={reward.id} className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={reward.artistAvatar || "/placeholder.svg"} alt={reward.artistName} />
                        <AvatarFallback>{reward.artistName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-medium">{reward.title}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">From {reward.artistName}</p>
                        <p className="text-xs text-gray-500 mt-1">{reward.date}</p>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 bg-gray-700 text-white border-gray-600">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        <span className="text-xs">View</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {rewards.length === 0 && (
                <div className="text-center py-8 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                  <Banknote className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">You don't have any rewards yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Buy tokens from your favorite artists to receive exclusive rewards
                  </p>
                  <Button className="mt-4 bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                    Explore Artists
                  </Button>
                </div>
              )}
            </TabsContent>
          )}

          {/* Following Tab - For Fans */}
          {!isArtist() && (
            <TabsContent value="artists" className="px-4 mt-4 space-y-3">
              {followedArtists.map((artist) => (
                <Card
                  key={artist.id}
                  className="overflow-hidden bg-white/5 backdrop-blur-md border-white/10 cursor-pointer"
                  onClick={() => window.open("/artist/iamjuampi", "_self")}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={artist.avatar || "/placeholder.svg"} alt={artist.name} />
                        <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-medium">{artist.name}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{artist.genre}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-400">{artist.tokens} $DROPS purchased</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-bright-yellow hover:bg-bright-yellow-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open("/artist/iamjuampi", "_self")
                        }}
                      >
                        <Banknote className="h-4 w-4 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Settings */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-semibold mb-3 text-white">Settings</h2>
        <div className="space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-gray-800 text-white border-gray-700">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Button variant="outline" className="w-full justify-start bg-gray-700 text-white border-gray-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-gray-700 text-white border-gray-600">
                  <Banknote className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-gray-700 text-white border-gray-600"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {!isArtist() && (
            <Card className="bg-white/5 backdrop-blur-md border-white/10 mt-4">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-bright-yellow mr-2" />
                  <div>
                    <h3 className="text-white font-medium">Become an Artist</h3>
                    <p className="text-sm text-gray-400">Apply to become a verified artist on DROPSLAND</p>
                  </div>
                  <Button className="ml-auto bg-bright-yellow hover:bg-bright-yellow-700 text-black">Apply</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Diálogo de comentarios */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-white/5 backdrop-blur-md text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-3 my-4">
            {currentPostIndex !== null &&
              postComments[`profile-${currentPostIndex}`]?.map((comment, i) => (
                <div key={i} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author === "iamjuampi" ? "/avatars/juampi.jpg" : "/avatars/user.jpg"}
                      alt={comment.author}
                    />
                    <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-700 p-2 rounded-lg">
                    <p className="text-sm font-medium">{comment.author}</p>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                  </div>
                </div>
              ))}

            {currentPostIndex !== null &&
              (!postComments[`profile-${currentPostIndex}`] ||
                postComments[`profile-${currentPostIndex}`].length === 0) && (
                <p className="text-center text-gray-400 py-4">No comments yet. Be the first to comment!</p>
              )}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              className="bg-gray-700 border-gray-600 text-white"
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
              className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
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
    content:
      "Just released my new EP 'Techno Dimensions'. Available now on all platforms! #TechnoDimensions #NewRelease",
    time: "2 hours ago",
    likes: 87,
    comments: 14,
    image: "/images/dj-mixer.png",
  },
  {
    content:
      "Preparing my set for this weekend at Club Underground. It's going to be an epic night of techno and house. Who's coming? 🎧",
    time: "1 day ago",
    likes: 65,
    comments: 23,
  },
  {
    content:
      "Happy to announce I'll be playing at the Electronic Dreams festival next month. See you there! #ElectronicDreams #Festival",
    time: "3 days ago",
    likes: 112,
    comments: 31,
    image: "/images/dj-mixer.png",
  },
  {
    content:
      "Working on new sounds for my upcoming release. I'm experimenting with analog synthesizers and 90s samples.",
    time: "1 week ago",
    likes: 94,
    comments: 17,
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
