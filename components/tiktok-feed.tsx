"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Share2, Send, Play, Pause } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface TikTokFeedProps {
  onSelectArtist: (artistId: string) => void
  posts: any[]
  type?: "home" | "explore"
}

interface Comment {
  author: string
  text: string
  timestamp: number // in seconds
}

export default function TikTokFeed({ onSelectArtist, posts, type = "home" }: TikTokFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({})
  const [showCommentDialog, setShowCommentDialog] = useState(false)
  const [currentPostKey, setCurrentPostKey] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [postComments, setPostComments] = useState<{ [key: string]: Comment[] }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  const [audioRefs] = useState<{ [key: string]: HTMLAudioElement }>({})
  const [videoRefs] = useState<{ [key: string]: HTMLVideoElement }>({})
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({})
  const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({})
  const [duration, setDuration] = useState<{ [key: string]: number }>({})
  const [isSeeking, setIsSeeking] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const postKey = `${type}-${posts[currentIndex]?.id || currentIndex}`

    Object.keys(audioRefs).forEach((key) => {
      if (key !== postKey && audioRefs[key]) {
        audioRefs[key].pause()
        audioRefs[key].currentTime = 0
        setIsPlaying((prev) => ({ ...prev, [key]: false }))
      }
    })

    Object.keys(videoRefs).forEach((key) => {
      if (key !== postKey && videoRefs[key]) {
        videoRefs[key].pause()
        videoRefs[key].currentTime = 0
        setIsPlaying((prev) => ({ ...prev, [key]: false }))
      }
    })

    const currentPost = posts[currentIndex]
    if (currentPost?.videoUrl && videoRefs[postKey]) {
      videoRefs[postKey].currentTime = 0
      videoRefs[postKey].play().catch(() => {})
      setIsPlaying((prev) => ({ ...prev, [postKey]: true }))
    } else if (audioRefs[postKey]) {
      audioRefs[postKey].currentTime = 0
      audioRefs[postKey].play().catch(() => {})
      setIsPlaying((prev) => ({ ...prev, [postKey]: true }))
    }
  }, [currentIndex, type, posts, audioRefs, videoRefs])

  const handleScroll = () => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scrollTop = container.scrollTop
    const itemHeight = window.innerHeight - 40
    const newIndex = Math.round(scrollTop / itemHeight)
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartY.current - touchEndY.current
    const minSwipeDistance = 50

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && currentIndex < posts.length - 1) {
        scrollToPost(currentIndex + 1)
      } else if (swipeDistance < 0 && currentIndex > 0) {
        scrollToPost(currentIndex - 1)
      }
    }
  }

  const scrollToPost = (index: number) => {
    if (!containerRef.current) return
    const itemHeight = window.innerHeight - 40
    containerRef.current.scrollTo({
      top: index * itemHeight,
      behavior: "smooth",
    })
    setCurrentIndex(index)
  }

  const handleLike = (postKey: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postKey]: !prev[postKey],
    }))
  }

  const handleOpenComments = (postKey: string) => {
    setCurrentPostKey(postKey)
    setShowCommentDialog(true)
  }

  const handleSendComment = () => {
    if (!commentText.trim() || !currentPostKey) return

    const timestamp = currentTime[currentPostKey] || 0

    setPostComments((prev) => {
      const newComments = { ...prev }
      if (!newComments[currentPostKey]) {
        newComments[currentPostKey] = []
      }
      newComments[currentPostKey].push({
        author: "fan",
        text: commentText,
        timestamp,
      })
      return newComments
    })

    setCommentText("")
  }

  const togglePlayPause = (postKey: string) => {
    const audio = audioRefs[postKey]
    const video = videoRefs[postKey]
    const mediaElement = video || audio
    if (!mediaElement) return

    if (isPlaying[postKey]) {
      mediaElement.pause()
      setIsPlaying((prev) => ({ ...prev, [postKey]: false }))
    } else {
      mediaElement.play()
      setIsPlaying((prev) => ({ ...prev, [postKey]: true }))
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const seekToTimestamp = (postKey: string, timestamp: number) => {
    const audio = audioRefs[postKey]
    const video = videoRefs[postKey]
    const mediaElement = video || audio
    if (!mediaElement) return
    mediaElement.currentTime = timestamp
    if (!isPlaying[postKey]) {
      mediaElement.play()
      setIsPlaying((prev) => ({ ...prev, [postKey]: true }))
    }
    setShowCommentDialog(false)
  }

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    postKey: string,
  ) => {
    const audio = audioRefs[postKey]
    const video = videoRefs[postKey]
    const mediaElement = video || audio
    if (!mediaElement || !duration[postKey]) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()

    let clientX: number
    if ("touches" in e) {
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX
    } else {
      clientX = e.clientX
    }

    const clickX = clientX - rect.left
    const width = rect.width
    const percentage = Math.max(0, Math.min(1, clickX / width))
    const newTime = percentage * duration[postKey]

    mediaElement.currentTime = newTime
    setCurrentTime((prev) => ({ ...prev, [postKey]: newTime }))
  }

  const handleSeekStart = (postKey: string) => {
    setIsSeeking((prev) => ({ ...prev, [postKey]: true }))
  }

  const handleSeekEnd = (postKey: string) => {
    setIsSeeking((prev) => ({ ...prev, [postKey]: false }))
  }

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-y-scroll snap-y snap-mandatory scrollbar-hide w-full"
        style={{
          height: "calc(100vh - 2.5rem)",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {posts.map((post, index) => {
          const postKey = `${type}-${post.id || index}`
          const likesCount = post.likes || Math.floor(Math.random() * 50) + 10
          const commentsCount =
            (postComments[postKey]?.length || 0) + (post.comments || Math.floor(Math.random() * 20) + 5)

          const isVideo = !!post.videoUrl
          const audioUrl = post.audioUrl || "/placeholder-audio.mp3"
          const videoUrl = post.videoUrl

          return (
            <div
              key={postKey}
              className="snap-start relative bg-black flex items-center justify-center w-full"
              style={{ height: "calc(100vh - 2.5rem)" }}
            >
              {isVideo ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs[postKey] = el
                  }}
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  playsInline
                  loop
                  onLoadedData={(e) => {
                    const video = e.currentTarget
                    if (currentIndex === index) {
                      video.play().catch((error) => {
                        console.log("[v0] Video autoplay failed:", error)
                      })
                    }
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget
                    setCurrentTime((prev) => ({ ...prev, [postKey]: video.currentTime }))
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget
                    setDuration((prev) => ({ ...prev, [postKey]: video.duration }))
                  }}
                  onEnded={() => {
                    setIsPlaying((prev) => ({ ...prev, [postKey]: false }))
                    if (currentIndex < posts.length - 1) {
                      scrollToPost(currentIndex + 1)
                    }
                  }}
                />
              ) : (
                <audio
                  ref={(el) => {
                    if (el) audioRefs[postKey] = el
                  }}
                  src={audioUrl}
                  onTimeUpdate={(e) => {
                    const audio = e.currentTarget
                    setCurrentTime((prev) => ({ ...prev, [postKey]: audio.currentTime }))
                  }}
                  onLoadedMetadata={(e) => {
                    const audio = e.currentTarget
                    setDuration((prev) => ({ ...prev, [postKey]: audio.duration }))
                  }}
                  onEnded={() => {
                    setIsPlaying((prev) => ({ ...prev, [postKey]: false }))
                    if (currentIndex < posts.length - 1) {
                      scrollToPost(currentIndex + 1)
                    }
                  }}
                />
              )}

              {!isVideo && post.image && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post content"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                </div>
              )}

              {isVideo && (
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-[5]" />
              )}

              <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 pb-3">
                <div className="flex items-end gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar
                        className="h-10 w-10 border-2 border-white cursor-pointer flex-shrink-0"
                        onClick={() => post.artistId && onSelectArtist(post.artistId)}
                      >
                        <AvatarImage src={post.avatar || "/placeholder.svg"} alt={post.name} />
                        <AvatarFallback>{post.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-shadow truncate">{post.name}</p>
                        <p className="text-xs text-white/80 text-shadow">{post.time}</p>
                      </div>
                    </div>

                    <p className="text-white text-sm mb-2 text-shadow line-clamp-3">{post.content}</p>

                    {post.action && (
                      <div className="flex items-center gap-2 text-bright-yellow font-medium">
                        <BanknoteIcon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {post.amount} ${post.tokenName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 flex-shrink-0">
                    <button
                      onClick={() => togglePlayPause(postKey)}
                      className="flex flex-col items-center gap-1 text-white"
                    >
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                        {isPlaying[postKey] ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </div>
                    </button>

                    <button onClick={() => handleLike(postKey)} className="flex flex-col items-center gap-1 text-white">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                        <Heart className={`h-6 w-6 ${likedPosts[postKey] ? "fill-red-500 text-red-500" : ""}`} />
                      </div>
                      <span className="text-xs font-semibold text-shadow">
                        {likesCount + (likedPosts[postKey] ? 1 : 0)}
                      </span>
                    </button>

                    <button
                      onClick={() => handleOpenComments(postKey)}
                      className="flex flex-col items-center gap-1 text-white"
                    >
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-shadow">{commentsCount}</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-white">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                        <Share2 className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-shadow">Share</span>
                    </button>
                  </div>
                </div>

                <div className="w-full mb-2">
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden cursor-pointer relative"
                    onClick={(e) => handleProgressClick(e, postKey)}
                    onTouchStart={() => handleSeekStart(postKey)}
                    onTouchEnd={() => handleSeekEnd(postKey)}
                    onTouchMove={(e) => {
                      if (isSeeking[postKey]) {
                        e.preventDefault()
                        handleProgressClick(e, postKey)
                      }
                    }}
                  >
                    <div
                      className="bg-bright-yellow h-full transition-all duration-100"
                      style={{
                        width: `${((currentTime[postKey] || 0) / (duration[postKey] || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-white text-xs mt-1 px-1 text-shadow">
                    <span>{formatTime(currentTime[postKey] || 0)}</span>
                    <span>{formatTime(duration[postKey] || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-black/40 backdrop-blur-xl text-white border border-white/20 max-w-[90vw]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-3 my-4">
            {currentPostKey !== null &&
              postComments[currentPostKey]?.map((comment, i) => (
                <div
                  key={i}
                  className="flex gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors backdrop-blur-sm"
                  onClick={() => seekToTimestamp(currentPostKey, comment.timestamp)}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/avatars/user.jpg" alt={comment.author} />
                    <AvatarFallback>{comment.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.author}</p>
                      <span className="text-xs text-bright-yellow">{formatTime(comment.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-300 break-words">{comment.text}</p>
                  </div>
                </div>
              ))}

            {currentPostKey !== null &&
              (!postComments[currentPostKey] || postComments[currentPostKey].length === 0) && (
                <p className="text-center text-gray-400 py-4">No comments yet. Be the first to comment!</p>
              )}
          </div>

          <div className="text-xs text-gray-400 mb-2">
            Commenting at: {formatTime(currentPostKey ? currentTime[currentPostKey] || 0 : 0)}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              className="bg-gray-700 border-gray-600 text-white flex-1"
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
              className="bg-bright-yellow hover:bg-bright-yellow-700 text-black flex-shrink-0"
              onClick={handleSendComment}
              disabled={!commentText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </>
  )
}
