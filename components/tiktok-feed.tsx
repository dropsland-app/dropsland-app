"use client";

import type React from "react";
import { Heart, MessageCircle, Share2, Send, Play, Pause } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BanknoteIcon } from "@/components/icons/banknote-icon";
import {
  extractYouTubeVideoId,
  isYouTubeUrl,
  getYouTubeEmbedUrl,
} from "@/lib/youtube-utils";
import { useTikTokFeed } from "@/hooks/use-tiktok-feed";

interface TikTokFeedProps {
  onSelectArtist: (artistId: string) => void;
  posts: any[];
  type?: "home" | "explore";
}

export default function TikTokFeed({
  onSelectArtist,
  posts,
  type = "home",
}: TikTokFeedProps) {
  const {
    currentIndex,
    likedPosts,
    showCommentDialog,
    setShowCommentDialog,
    currentPostKey,
    commentText,
    setCommentText,
    postComments,
    containerRef,
    audioRefs,
    videoRefs,
    youtubeRefs,
    isPlaying,
    setIsPlaying, // Used in callback
    currentTime,
    setCurrentTime, // Used in callback
    duration,
    setDuration, // Used in callback
    isSeeking,
    handleScroll,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleLike,
    handleOpenComments,
    handleSendComment,
    togglePlayPause,
    formatTime,
    seekToTimestamp,
    handleProgressClick,
    handleSeekStart,
    handleSeekEnd,
    scrollToPost,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
  } = useTikTokFeed({
    onSelectArtist,
    posts,
    type,
  });

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-y-scroll snap-y snap-mandatory scrollbar-hide w-full h-[100dvh]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {posts.map((post, index) => {
          const postKey = `${type}-${post.id || index}`;
          const likesCount = post.likes || Math.floor(Math.random() * 50) + 10;
          const commentsCount =
            (postComments[postKey]?.length || 0) +
            (post.comments || Math.floor(Math.random() * 20) + 5);

          const isYouTubeVideo = post.videoUrl && isYouTubeUrl(post.videoUrl);
          const youtubeVideoId = isYouTubeVideo
            ? extractYouTubeVideoId(post.videoUrl)
            : null;
          const isVideo = !!post.videoUrl && !isYouTubeVideo;
          const audioUrl = post.audioUrl || "/placeholder-audio.mp3";
          const videoUrl = post.videoUrl;

          return (
            <div
              key={postKey}
              className="snap-start relative bg-black flex items-center justify-center w-full h-[100dvh]"
            >
              {isYouTubeVideo && youtubeVideoId ? (
                <iframe
                  ref={(el) => {
                    if (el) youtubeRefs[postKey] = el;
                  }}
                  src={getYouTubeEmbedUrl(videoUrl)}
                  className="absolute inset-0 w-full h-full z-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{
                    pointerEvents: "none",
                    border: "none",
                    width: "100%",
                    minWidth: "100%",
                    height: "100%",
                    minHeight: "100vh",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    objectFit: "cover",
                  }}
                />
              ) : isVideo ? (
                <video
                  ref={(el) => {
                    if (el) videoRefs[postKey] = el;
                  }}
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  playsInline
                  loop
                  muted
                  preload="metadata"
                  onLoadedData={(e) => {
                    const video = e.currentTarget;
                    setIsPlaying((prev) => ({ ...prev, [postKey]: false }));
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    setCurrentTime((prev) => ({
                      ...prev,
                      [postKey]: video.currentTime,
                    }));
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    setDuration((prev) => ({
                      ...prev,
                      [postKey]: video.duration,
                    }));
                  }}
                  onEnded={() => {
                    setIsPlaying((prev) => ({ ...prev, [postKey]: false }));
                    if (currentIndex < posts.length - 1) {
                      scrollToPost(currentIndex + 1);
                    }
                  }}
                />
              ) : (
                <audio
                  ref={(el) => {
                    if (el) audioRefs[postKey] = el;
                  }}
                  src={audioUrl}
                  onTimeUpdate={(e) => {
                    const audio = e.currentTarget;
                    setCurrentTime((prev) => ({
                      ...prev,
                      [postKey]: audio.currentTime,
                    }));
                  }}
                  onLoadedMetadata={(e) => {
                    const audio = e.currentTarget;
                    setDuration((prev) => ({
                      ...prev,
                      [postKey]: audio.duration,
                    }));
                  }}
                  onEnded={() => {
                    setIsPlaying((prev) => ({ ...prev, [postKey]: false }));
                    if (currentIndex < posts.length - 1) {
                      scrollToPost(currentIndex + 1);
                    }
                  }}
                />
              )}

              {!isVideo && !isYouTubeVideo && post.image && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt="Post content"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                </div>
              )}

              {(isVideo || isYouTubeVideo) && (
                <div
                  className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-[5] cursor-pointer"
                  onClick={() => togglePlayPause(postKey)}
                />
              )}

              <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 pb-12 pb-[calc(4rem+env(safe-area-inset-bottom))]">
                <div className="flex items-end gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar
                        className="h-10 w-10 border-2 border-white cursor-pointer flex-shrink-0"
                        onClick={() =>
                          post.artistId && onSelectArtist(post.artistId)
                        }
                      >
                        <AvatarImage
                          src={post.avatar || "/placeholder.svg"}
                          alt={post.name}
                        />
                        <AvatarFallback>
                          {post.name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white text-shadow truncate">
                          {post.name}
                        </p>
                        <p className="text-xs text-white/80 text-shadow">
                          {post.time}
                        </p>
                      </div>
                    </div>

                    <p className="text-white text-sm mb-2 text-shadow line-clamp-3">
                      {post.content}
                    </p>

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
                    {!isYouTubeVideo && (
                      <button
                        onClick={() => togglePlayPause(postKey)}
                        className="flex flex-col items-center gap-1 text-white"
                      >
                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                          {isPlaying[postKey] ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </div>
                      </button>
                    )}

                    <button
                      onClick={() => handleLike(postKey)}
                      className="flex flex-col items-center gap-1 text-white"
                    >
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                        <Heart
                          className={`h-6 w-6 ${likedPosts[postKey] ? "fill-red-500 text-red-500" : ""}`}
                        />
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
                      <span className="text-xs font-semibold text-shadow">
                        {commentsCount}
                      </span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-white">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                        <Share2 className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-shadow">
                        Share
                      </span>
                    </button>
                  </div>
                </div>

                {!isYouTubeVideo && (
                  <div className="w-full mb-2">
                    <div
                      className="group relative h-4 w-full flex items-center cursor-pointer touch-none"
                      onClick={(e) => handleProgressClick(e, postKey)}
                      onMouseDown={(e) => handleMouseDown(e, postKey)}
                      onMouseMove={(e) => handleMouseMove(e, postKey)}
                      onMouseUp={() => handleMouseUp(postKey)}
                      onMouseLeave={() => handleMouseUp(postKey)}
                      onTouchStart={() => handleSeekStart(postKey)}
                      onTouchEnd={() => handleSeekEnd(postKey)}
                      onTouchMove={(e) => {
                        if (isSeeking[postKey]) {
                          e.preventDefault();
                          handleProgressClick(e, postKey);
                        }
                      }}
                    >
                      {/* Track Background */}
                      <div className="absolute inset-0 h-0.5 group-hover:h-1 group-active:h-1 my-auto w-full bg-white/20 rounded-full backdrop-blur-sm overflow-hidden transition-all duration-200">
                        {/* Progress Fill */}
                        <div
                          className="bg-white h-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          style={{
                            width: `${((currentTime[postKey] || 0) / (duration[postKey] || 1)) * 100}%`,
                          }}
                        />
                      </div>

                      {/* Playhead Handle */}
                      <div
                        className="absolute h-3 w-3 bg-white rounded-full shadow-md transform -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-active:scale-100 group-active:opacity-100 transition-all duration-200 ease-out"
                        style={{
                          left: `${((currentTime[postKey] || 0) / (duration[postKey] || 1)) * 100}%`,
                        }}
                      />
                    </div>
                    {/* Timestamps - Only visible on interaction */}
                    <div className="flex justify-between text-white text-xs mt-1 px-1 text-shadow opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200">
                      <span>{formatTime(currentTime[postKey] || 0)}</span>
                      <span>{formatTime(duration[postKey] || 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
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
                  onClick={() =>
                    seekToTimestamp(currentPostKey, comment.timestamp)
                  }
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="/avatars/user.jpg" alt={comment.author} />
                    <AvatarFallback>
                      {comment.author.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.author}</p>
                      <span className="text-xs text-bright-yellow">
                        {formatTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}

            {currentPostKey !== null &&
              (!postComments[currentPostKey] ||
                postComments[currentPostKey].length === 0) && (
                <p className="text-center text-gray-400 py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
          </div>

          <div className="text-xs text-gray-400 mb-2">
            Commenting at:{" "}
            {formatTime(currentPostKey ? currentTime[currentPostKey] || 0 : 0)}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              className="bg-gray-700 border-gray-600 text-white flex-1"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
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
    </>
  );
}
