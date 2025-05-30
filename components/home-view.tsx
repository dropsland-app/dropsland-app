"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

// Importar los datos de userPosts desde el perfil
import { userPosts } from "./profile-view"
import { useAuth } from "@/hooks/use-auth"

interface HomeViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function HomeView({ onSelectArtist }: HomeViewProps) {
  // Estados para likes y comentarios
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({})
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [currentPostKey, setCurrentPostKey] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [postComments, setPostComments] = useState<{ [key: string]: { author: string; text: string }[] }>({})
  const { userData, isArtist } = useAuth() // Obtenemos isArtist directamente del hook

  // Modificar la función handleSelectArtist para pasar el ID correcto del artista
  // Update the function that handles artist selection
  const handleSelectArtist = (artistId: string) => {
    console.log("Home view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  // Función para dar like a un post
  const handleLike = (postKey: string) => {
    setLikedPosts((prev) => {
      const newLikedPosts = { ...prev }
      newLikedPosts[postKey] = !prev[postKey]
      return newLikedPosts
    })
  }

  // Función para abrir el diálogo de comentarios
  const handleOpenComments = (postKey: string) => {
    setCurrentPostKey(postKey)
    setShowCommentDialog(true)
  }

  // Función para enviar un comentario
  const handleSendComment = () => {
    if (!commentText.trim() || !currentPostKey) return

    setPostComments((prev) => {
      const newComments = { ...prev }
      if (!newComments[currentPostKey]) {
        newComments[currentPostKey] = []
      }
      newComments[currentPostKey].push({
        author: userData?.username || "user",
        text: commentText,
      })
      return newComments
    })

    setCommentText("")
  }

  return (
    <div className="pb-6 overflow-auto bg-gray-50 dark:bg-gray-950">
      {/* Featured Artists */}
      <div className="px-4 pt-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Featured Artists</h2>
        <div className="flex overflow-x-auto gap-1 pb-2 -mx-4 px-4">
          {featuredArtists.map((artist) => (
            <div
              key={artist.id}
              className="flex-shrink-0 w-28"
              onClick={() => handleSelectArtist(artist.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="font-medium text-sm mt-2 text-center text-white">{artist.name}</p>
                <p className="text-xs text-gray-400">{artist.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message for fans */}
      {!isArtist() && (
        <div className="px-4 mt-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">Welcome to DROPSLAND</h3>
              <p className="text-sm text-gray-300">
                Here you can discover artists, buy their tokens and receive exclusive rewards.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                  <BanknoteIcon className="h-5 w-5 mr-1" />
                  Buy Tokens
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-700 text-white border-gray-600">
                  Explore Artists
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feed (formerly Recent Activity) */}
      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-3 text-white">Feed</h2>
        <div className="space-y-3">
          {/* Primero mostrar las publicaciones del usuario */}
          {userPosts.map((post, index) => (
            <Card key={`user-post-${index}`} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/avatars/juampi.jpg" alt="iamjuampi" />
                    <AvatarFallback>IA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">iamjuampi</p>
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
                  <button className="flex items-center" onClick={() => handleLike(`home-user-${index}`)}>
                    <Heart
                      className={`h-4 w-4 mr-1 ${likedPosts[`home-user-${index}`] ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {post.likes + (likedPosts[`home-user-${index}`] ? 1 : 0)}
                  </button>
                  <button className="flex items-center" onClick={() => handleOpenComments(`home-user-${index}`)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments + (postComments[`home-user-${index}`]?.length || 0)}
                  </button>
                  <button className="flex items-center">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Luego mostrar el resto de la actividad */}
          {recentActivity
            .filter((activity) => activity.type === "post")
            .map((activity) => (
              <Card key={activity.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={activity.avatar} alt={activity.name} />
                      <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{activity.name}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{activity.content}</p>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <button className="flex items-center" onClick={() => handleLike(`home-activity-${activity.id}`)}>
                      <Heart
                        className={`h-4 w-4 mr-1 ${likedPosts[`home-activity-${activity.id}`] ? "fill-red-500 text-red-500" : ""}`}
                      />
                      {Math.floor(Math.random() * 50) + 10 + (likedPosts[`home-activity-${activity.id}`] ? 1 : 0)}
                    </button>
                    <button
                      className="flex items-center"
                      onClick={() => handleOpenComments(`home-activity-${activity.id}`)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {Math.floor(Math.random() * 20) + 5 + (postComments[`home-activity-${activity.id}`]?.length || 0)}
                    </button>
                    <button className="flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {recentActivity
            .filter((activity) => activity.type === "transaction")
            .map((activity) => (
              <Card key={activity.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleSelectArtist(activity.artistId)}>
                      <AvatarImage src={activity.avatar} alt={activity.name} />
                      <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-medium">{activity.name}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                    <div className="flex items-center text-bright-yellow font-medium">
                      <BanknoteIcon className="h-5 w-5 mr-1" />
                      <span>
                        {activity.amount} ${activity.tokenName}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Diálogo de comentarios */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-3 my-4">
            {currentPostKey !== null &&
              postComments[currentPostKey]?.map((comment, i) => (
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

            {currentPostKey !== null &&
              (!postComments[currentPostKey] || postComments[currentPostKey].length === 0) && (
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
    id: "p1",
    type: "post",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    content: "New collaboration with @nicolamarti coming soon. Get ready to dance!",
    time: "2 hours ago",
    artistId: "banger",
  },
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
  },
  {
    id: "p2",
    type: "post",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    content: "My set at Techno Revolution festival is now available for listening.",
    time: "1 day ago",
    artistId: "axs",
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
  },
  {
    id: "p3",
    type: "post",
    name: "FLUSH",
    avatar: "/avatars/flush.jpg",
    content: "Just finished a remix for @kr4d. Coming out next week!",
    time: "2 days ago",
    artistId: "flush",
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
  },
]

