"use client";

import { useState, useRef, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/lib/supabase/client";
import {
    extractYouTubeVideoId,
    isYouTubeUrl,
    getYouTubeEmbedUrl,
} from "@/lib/youtube-utils";

export interface Comment {
    id: string;
    author: string;
    avatar?: string;
    text: string;
    timestamp: number | null; // in seconds for timestamped comments
    createdAt?: string;
}

interface UseTikTokFeedProps {
    posts: any[];
    type: "home" | "explore";
    onSelectArtist: (artistId: string) => void;
}

export function useTikTokFeed({
    posts,
    type = "home",
    onSelectArtist,
}: UseTikTokFeedProps) {
    const { user } = usePrivy();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
    const [showCommentDialog, setShowCommentDialog] = useState(false);
    const [currentPostKey, setCurrentPostKey] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const [postComments, setPostComments] = useState<{
        [key: string]: Comment[];
    }>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

    const [audioRefs] = useState<{ [key: string]: HTMLAudioElement }>({});
    const [videoRefs] = useState<{ [key: string]: HTMLVideoElement }>({});
    const [youtubeRefs] = useState<{ [key: string]: HTMLIFrameElement }>({});
    const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
    const [currentTime, setCurrentTime] = useState<{ [key: string]: number }>({});
    const [duration, setDuration] = useState<{ [key: string]: number }>({});
    const [isSeeking, setIsSeeking] = useState<{ [key: string]: boolean }>({});

    const getPostIdFromKey = (postKey: string) => {
        const prefix = `${type}-`;
        if (!postKey.startsWith(prefix)) return null;
        const candidate = postKey.slice(prefix.length);
        return candidate || null;
    };

    const loadCommentsForPost = async (postKey: string) => {
        const postId = getPostIdFromKey(postKey);
        if (!postId) return;

        const { data, error } = await supabase
            .from("comments")
            .select(
                `
                id,
                content,
                created_at,
                user_wallet,
                profile:profiles!fk_comment_user (
                  username,
                  avatar_url
                )
              `,
            )
            .eq("post_id", postId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error loading comments:", error);
            return;
        }

        const mapped: Comment[] = (data || []).map((comment: any) => ({
            id: comment.id,
            author:
                comment.profile?.username ||
                `${comment.user_wallet?.slice(0, 4)}...${comment.user_wallet?.slice(-4)}`,
            avatar: comment.profile?.avatar_url || "/placeholder.svg",
            text: comment.content,
            timestamp: null,
            createdAt: comment.created_at,
        }));

        setPostComments((prev) => ({
            ...prev,
            [postKey]: mapped,
        }));
    };

    useEffect(() => {
        const postKey = `${type}-${posts[currentIndex]?.id || currentIndex}`;

        // First, pause and reset ALL audio and video elements
        Object.keys(audioRefs).forEach((key) => {
            if (audioRefs[key]) {
                audioRefs[key].pause();
                audioRefs[key].currentTime = 0;
                setIsPlaying((prev) => ({ ...prev, [key]: false }));
            }
        });

        Object.keys(videoRefs).forEach((key) => {
            if (videoRefs[key]) {
                videoRefs[key].pause();
                videoRefs[key].currentTime = 0;
                setIsPlaying((prev) => ({ ...prev, [key]: false }));
            }
        });

        Object.keys(youtubeRefs).forEach((key) => {
            if (youtubeRefs[key]) {
                try {
                    youtubeRefs[key].contentWindow?.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        "*"
                    );
                } catch (error) {
                    console.error("YouTube pause error:", error);
                }
            }
        });

        const playTimeout = setTimeout(() => {
            const currentPost = posts[currentIndex];
            if (currentPost?.videoUrl && isYouTubeUrl(currentPost.videoUrl)) {
                const iframe = youtubeRefs[postKey];
                if (iframe) {
                    try {
                        iframe.contentWindow?.postMessage(
                            '{"event":"command","func":"playVideo","args":""}',
                            "*"
                        );
                        setIsPlaying((prev) => ({ ...prev, [postKey]: true }));
                    } catch (error) {
                        console.error("YouTube play error:", error);
                    }
                }
            } else if (currentPost?.videoUrl && videoRefs[postKey]) {
                const video = videoRefs[postKey];
                video.muted = true;

                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying((prev) => ({ ...prev, [postKey]: true }));
                        })
                        .catch((error) => {
                            if (
                                error.name !== "AbortError" &&
                                error.name !== "NotAllowedError"
                            ) {
                                console.error("Video play error:", error);
                            }
                            // Silently handle NotAllowedError as it's expected when autoplay is blocked
                            setIsPlaying((prev) => ({ ...prev, [postKey]: false }));
                        });
                }
            }
            // Audio files (mp3) are NOT autoplayed - user must press play button
        }, 100);

        return () => clearTimeout(playTimeout);
    }, [currentIndex, type, posts, audioRefs, videoRefs, youtubeRefs]);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const scrollTop = container.scrollTop;
        const itemHeight = window.innerHeight - 40;
        const newIndex = Math.round(scrollTop / itemHeight);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartY.current - touchEndY.current;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0 && currentIndex < posts.length - 1) {
                scrollToPost(currentIndex + 1);
            } else if (swipeDistance < 0 && currentIndex > 0) {
                scrollToPost(currentIndex - 1);
            }
        }
    };

    const scrollToPost = (index: number) => {
        if (!containerRef.current) return;
        const itemHeight = window.innerHeight - 40;
        containerRef.current.scrollTo({
            top: index * itemHeight,
            behavior: "smooth",
        });
        setCurrentIndex(index);
    };

    const handleLike = (postKey: string) => {
        setLikedPosts((prev) => ({
            ...prev,
            [postKey]: !prev[postKey],
        }));
    };

    const handleOpenComments = async (postKey: string) => {
        setCurrentPostKey(postKey);
        setShowCommentDialog(true);
        await loadCommentsForPost(postKey);
    };

    const handleSendComment = async () => {
        if (!commentText.trim() || !currentPostKey) return;
        const walletAddress = user?.wallet?.address;
        const postId = getPostIdFromKey(currentPostKey);

        if (!walletAddress || !postId) {
            return;
        }

        const { error } = await supabase.from("comments").insert({
            post_id: postId,
            user_wallet: walletAddress,
            content: commentText.trim(),
        });

        if (error) {
            console.error("Error sending comment:", error);
            return;
        }

        setCommentText("");

        await loadCommentsForPost(currentPostKey);
    };

    const togglePlayPause = (postKey: string) => {
        const audio = audioRefs[postKey];
        const video = videoRefs[postKey];
        const youtubeIframe = youtubeRefs[postKey];
        const mediaElement = video || audio;

        if (youtubeIframe) {
            try {
                if (isPlaying[postKey]) {
                    youtubeIframe.contentWindow?.postMessage(
                        '{"event":"command","func":"pauseVideo","args":""}',
                        "*"
                    );
                    setIsPlaying((prev) => ({ ...prev, [postKey]: false }));
                } else {
                    youtubeIframe.contentWindow?.postMessage(
                        '{"event":"command","func":"playVideo","args":""}',
                        "*"
                    );
                    setIsPlaying((prev) => ({ ...prev, [postKey]: true }));
                }
            } catch (error) {
                console.error("YouTube toggle error:", error);
            }
            return;
        }

        if (!mediaElement) return;

        if (isPlaying[postKey]) {
            mediaElement.pause();
            setIsPlaying((prev) => ({ ...prev, [postKey]: false }));
        } else {
            if (video) {
                video.muted = true;
            }

            const playPromise = mediaElement.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying((prev) => ({ ...prev, [postKey]: true }));
                    })
                    .catch((error) => {
                        if (
                            error.name !== "AbortError" &&
                            error.name !== "NotAllowedError"
                        ) {
                            console.error("Media play error:", error);
                        }
                    });
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const seekToTimestamp = (postKey: string, timestamp: number) => {
        const audio = audioRefs[postKey];
        const video = videoRefs[postKey];
        const mediaElement = video || audio;
        if (!mediaElement) return;
        mediaElement.currentTime = timestamp;
        if (!isPlaying[postKey]) {
            const playPromise = mediaElement.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying((prev) => ({ ...prev, [postKey]: true }));
                    })
                    .catch((error) => {
                        if (error.name !== "AbortError") {
                            console.error("Media play error:", error);
                        }
                    });
            }
        }
        setShowCommentDialog(false);
    };

    const handleProgressClick = (
        e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
        postKey: string
    ) => {
        const audio = audioRefs[postKey];
        const video = videoRefs[postKey];
        const mediaElement = video || audio;
        if (!mediaElement || !duration[postKey]) return;

        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();

        let clientX: number;
        if ("touches" in e) {
            clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
        } else {
            clientX = e.clientX;
        }

        const clickX = clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));
        const newTime = percentage * duration[postKey];

        mediaElement.currentTime = newTime;
        setCurrentTime((prev) => ({ ...prev, [postKey]: newTime }));
    };

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>,
        postKey: string
    ) => {
        // Only process move if we are currently seeking (mouseDown)
        if (isSeeking[postKey]) {
            handleProgressClick(e, postKey);
        }
    };

    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement>,
        postKey: string
    ) => {
        handleSeekStart(postKey);
        handleProgressClick(e, postKey);
    };

    const handleMouseUp = (
        postKey: string
    ) => {
        handleSeekEnd(postKey);
    };

    const handleSeekStart = (postKey: string) => {
        setIsSeeking((prev) => ({ ...prev, [postKey]: true }));
    };

    const handleSeekEnd = (postKey: string) => {
        setIsSeeking((prev) => ({ ...prev, [postKey]: false }));
    };

    return {
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
        setIsPlaying,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
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
    };
}
