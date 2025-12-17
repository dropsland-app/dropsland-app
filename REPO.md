This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  creator/
    [id]/
      page.tsx
  globals.css
  layout.tsx
  loading.tsx
  page.tsx
components/
  auth/
    login-view.tsx
    signup-view.tsx
  icons/
    banknote-icon.tsx
    banknote-svg.tsx
  ui/
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
    label.tsx
    select.tsx
    slider.tsx
    tabs.tsx
    textarea.tsx
    toast.tsx
    toaster.tsx
    tooltip.tsx
  activity-screen.tsx
  activity-view.tsx
  artist-dashboard.tsx
  artist-profile.tsx
  buy-view.tsx
  creators-list.tsx
  donate-form.tsx
  donate-screen.tsx
  explore-screen.tsx
  home-view.tsx
  loading-creators.tsx
  login-screen.tsx
  main-app.tsx
  profile-screen.tsx
  profile-view.tsx
  receive-view.tsx
  search-view.tsx
  send-view.tsx
  stats-card.tsx
  theme-provider.tsx
  tiktok-feed.tsx
  upload-view.tsx
  wallet-view.tsx
contracts/
  Counter.sol
  Counter.t.sol
hooks/
  use-auth.tsx
  use-tiktok-feed.ts
  use-toast.ts
ignition/
  modules/
    Counter.ts
lib/
  blockchain.ts
  utils.ts
  youtube-utils.ts
public/
  avatars/
    axs.jpg
    banger.jpg
    danilo.jpg
    dropsland-logo-square.png
    flush.jpg
    juampi.jpg
    kr4d.jpg
    nicola.jpg
    spitflux.jpg
  images/
    explore/
      dnb-tech-house.jpg
      dubstep-2.jpg
      dubstep.jpg
      electro.jpg
      riddim.jpg
      tech-house-2.jpg
      tech-house.jpg
      trap.jpg
    profile/
      iamjuampi-avatar.jpg
      iamjuampi-cover.jpg
    banknote-custom.svg
    bdeeeee.jpg
    best-drops-ever-logo.png
    dj-mixer.png
    dropsland-20logo-202025-20ddd.png
    dropsland-logo.png
    dropsland-logo.svg
    verified-badge.svg
  apple-icon.png
  crypto-tokens-glowing.jpg
  dj-performing-at-a-festival.jpg
  dubstep-concert-crowd.jpg
  electronic-music-stage-lights.jpg
  icon-dark-32x32.png
  icon-light-32x32.png
  icon.svg
  music-producer-studio.png
  neon-crypto-visualization.jpg
  placeholder-logo.png
  placeholder-logo.svg
  placeholder-user.jpg
  placeholder.jpg
  placeholder.svg
scripts/
  send-op-tx.ts
styles/
  globals.css
test/
  Counter.ts
.gitignore
components.json
hardhat.config.ts
next.config.mjs
package.json
postcss.config.mjs
README.md
tsconfig.json
```

# Files

## File: contracts/Counter.sol
````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  uint public x;

  event Increment(uint by);

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }
}
````

## File: contracts/Counter.t.sol
````solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Counter} from "./Counter.sol";
import {Test} from "forge-std/Test.sol";

contract CounterTest is Test {
  Counter counter;

  function setUp() public {
    counter = new Counter();
  }

  function test_InitialValue() public view {
    require(counter.x() == 0, "Initial value should be 0");
  }

  function testFuzz_Inc(uint8 x) public {
    for (uint8 i = 0; i < x; i++) {
      counter.inc();
    }
    require(counter.x() == x, "Value after calling inc x times should be x");
  }

  function test_IncByZero() public {
    vm.expectRevert();
    counter.incBy(0);
  }
}
````

## File: ignition/modules/Counter.ts
````typescript
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterModule", (m) => {
  const counter = m.contract("Counter");

  m.call(counter, "incBy", [5n]);

  return { counter };
});
````

## File: scripts/send-op-tx.ts
````typescript
import { network } from "hardhat";

const { viem } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

console.log("Sending transaction using the OP chain type");

const publicClient = await viem.getPublicClient();
const [senderClient] = await viem.getWalletClients();

console.log("Sending 1 wei from", senderClient.account.address, "to itself");

const l1Gas = await publicClient.estimateL1Gas({
  account: senderClient.account.address,
  to: senderClient.account.address,
  value: 1n,
});

console.log("Estimated L1 gas:", l1Gas);

console.log("Sending L2 transaction");
const tx = await senderClient.sendTransaction({
  to: senderClient.account.address,
  value: 1n,
});

await publicClient.waitForTransactionReceipt({ hash: tx });

console.log("Transaction sent successfully");
````

## File: test/Counter.ts
````typescript
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("Counter", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();

  it("Should emit the Increment event when calling the inc() function", async function () {
    const counter = await viem.deployContract("Counter");

    await viem.assertions.emitWithArgs(
      counter.write.inc(),
      counter,
      "Increment",
      [1n],
    );
  });

  it("The sum of the Increment events should match the current value", async function () {
    const counter = await viem.deployContract("Counter");
    const deploymentBlockNumber = await publicClient.getBlockNumber();

    // run a series of increments
    for (let i = 1n; i <= 10n; i++) {
      await counter.write.incBy([i]);
    }

    const events = await publicClient.getContractEvents({
      address: counter.address,
      abi: counter.abi,
      eventName: "Increment",
      fromBlock: deploymentBlockNumber,
      strict: true,
    });

    // check that the aggregated events match the current value
    let total = 0n;
    for (const event of events) {
      total += event.args.by;
    }

    assert.equal(total, await counter.read.x());
  });
});
````

## File: hardhat.config.ts
````typescript
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
````

## File: hooks/use-tiktok-feed.ts
````typescript
"use client";

import { useState, useRef, useEffect } from "react";
import {
    extractYouTubeVideoId,
    isYouTubeUrl,
    getYouTubeEmbedUrl,
} from "@/lib/youtube-utils";

export interface Comment {
    author: string;
    text: string;
    timestamp: number; // in seconds
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

    const handleOpenComments = (postKey: string) => {
        setCurrentPostKey(postKey);
        setShowCommentDialog(true);
    };

    const handleSendComment = () => {
        if (!commentText.trim() || !currentPostKey) return;

        const timestamp = currentTime[currentPostKey] || 0;

        setPostComments((prev) => {
            const newComments = { ...prev };
            if (!newComments[currentPostKey]) {
                newComments[currentPostKey] = [];
            }
            newComments[currentPostKey].push({
                author: "fan",
                text: commentText,
                timestamp,
            });
            return newComments;
        });

        setCommentText("");
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
````

## File: lib/youtube-utils.ts
````typescript
export function extractYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be")
}

export function getYouTubeEmbedUrl(url: string): string {
  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return url

  // Parameters to hide YouTube UI elements and enable API control
  const params = new URLSearchParams({
    autoplay: "1",
    loop: "1",
    playlist: videoId, // Required for loop to work
    controls: "0",
    modestbranding: "1",
    showinfo: "0",
    rel: "0",
    fs: "0",
    disablekb: "1",
    iv_load_policy: "3",
    enablejsapi: "1", // Enable JavaScript API for play/pause control
  })

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
````

## File: public/icon.svg
````xml
<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    @media (prefers-color-scheme: light) {
      .background { fill: black; }
      .foreground { fill: white; }
    }
    @media (prefers-color-scheme: dark) {
      .background { fill: white; }
      .foreground { fill: black; }
    }
  </style>
  <g clip-path="url(#clip0_7960_43945)">
    <rect class="background" width="180" height="180" rx="37" />
    <g style="transform: scale(95%); transform-origin: center">
      <path class="foreground"
        d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z" />
      <path class="foreground"
        d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z" />
    </g>
  </g>
  <defs>
    <clipPath id="clip0_7960_43945">
      <rect width="180" height="180" fill="white" />
    </clipPath>
  </defs>
</svg>
````

## File: public/placeholder-logo.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="215" height="48" fill="none"><path fill="#000" d="M57.588 9.6h6L73.828 38h-5.2l-2.36-6.88h-11.36L52.548 38h-5.2l10.24-28.4Zm7.16 17.16-4.16-12.16-4.16 12.16h8.32Zm23.694-2.24c-.186-1.307-.706-2.32-1.56-3.04-.853-.72-1.866-1.08-3.04-1.08-1.68 0-2.986.613-3.92 1.84-.906 1.227-1.36 2.947-1.36 5.16s.454 3.933 1.36 5.16c.934 1.227 2.24 1.84 3.92 1.84 1.254 0 2.307-.373 3.16-1.12.854-.773 1.387-1.867 1.6-3.28l5.12.24c-.186 1.68-.733 3.147-1.64 4.4-.906 1.227-2.08 2.173-3.52 2.84-1.413.667-2.986 1-4.72 1-2.08 0-3.906-.453-5.48-1.36-1.546-.907-2.76-2.2-3.64-3.88-.853-1.68-1.28-3.627-1.28-5.84 0-2.24.427-4.187 1.28-5.84.88-1.68 2.094-2.973 3.64-3.88 1.574-.907 3.4-1.36 5.48-1.36 1.68 0 3.227.32 4.64.96 1.414.64 2.56 1.56 3.44 2.76.907 1.2 1.454 2.6 1.64 4.2l-5.12.28Zm11.486-7.72.12 3.4c.534-1.227 1.307-2.173 2.32-2.84 1.04-.693 2.267-1.04 3.68-1.04 1.494 0 2.76.387 3.8 1.16 1.067.747 1.827 1.813 2.28 3.2.507-1.44 1.294-2.52 2.36-3.24 1.094-.747 2.414-1.12 3.96-1.12 1.414 0 2.64.307 3.68.92s1.84 1.52 2.4 2.72c.56 1.2.84 2.667.84 4.4V38h-4.96V25.92c0-1.813-.293-3.187-.88-4.12-.56-.96-1.413-1.44-2.56-1.44-.906 0-1.68.213-2.32.64-.64.427-1.133 1.053-1.48 1.88-.32.827-.48 1.84-.48 3.04V38h-4.56V25.92c0-1.2-.133-2.213-.4-3.04-.24-.827-.626-1.453-1.16-1.88-.506-.427-1.133-.64-1.88-.64-.906 0-1.68.227-2.32.68-.64.427-1.133 1.053-1.48 1.88-.32.827-.48 1.827-.48 3V38h-4.96V16.8h4.48Zm26.723 10.6c0-2.24.427-4.187 1.28-5.84.854-1.68 2.067-2.973 3.64-3.88 1.574-.907 3.4-1.36 5.48-1.36 1.84 0 3.494.413 4.96 1.24 1.467.827 2.64 2.08 3.52 3.76.88 1.653 1.347 3.693 1.4 6.12v1.32h-15.08c.107 1.813.614 3.227 1.52 4.24.907.987 2.134 1.48 3.68 1.48.987 0 1.88-.253 2.68-.76a4.803 4.803 0 0 0 1.84-2.2l5.08.36c-.64 2.027-1.84 3.64-3.6 4.84-1.733 1.173-3.733 1.76-6 1.76-2.08 0-3.906-.453-5.48-1.36-1.573-.907-2.786-2.2-3.64-3.88-.853-1.68-1.28-3.627-1.28-5.84Zm15.16-2.04c-.213-1.733-.76-3.013-1.64-3.84-.853-.827-1.893-1.24-3.12-1.24-1.44 0-2.6.453-3.48 1.36-.88.88-1.44 2.12-1.68 3.72h9.92ZM163.139 9.6V38h-5.04V9.6h5.04Zm8.322 7.2.24 5.88-.64-.36c.32-2.053 1.094-3.56 2.32-4.52 1.254-.987 2.787-1.48 4.6-1.48 2.32 0 4.107.733 5.36 2.2 1.254 1.44 1.88 3.387 1.88 5.84V38h-4.96V25.92c0-1.253-.12-2.28-.36-3.08-.24-.8-.64-1.413-1.2-1.84-.533-.427-1.253-.64-2.16-.64-1.44 0-2.573.48-3.4 1.44-.8.933-1.2 2.307-1.2 4.12V38h-4.96V16.8h4.48Zm30.003 7.72c-.186-1.307-.706-2.32-1.56-3.04-.853-.72-1.866-1.08-3.04-1.08-1.68 0-2.986.613-3.92 1.84-.906 1.227-1.36 2.947-1.36 5.16s.454 3.933 1.36 5.16c.934 1.227 2.24 1.84 3.92 1.84 1.254 0 2.307-.373 3.16-1.12.854-.773 1.387-1.867 1.6-3.28l5.12.24c-.186 1.68-.733 3.147-1.64 4.4-.906 1.227-2.08 2.173-3.52 2.84-1.413.667-2.986 1-4.72 1-2.08 0-3.906-.453-5.48-1.36-1.546-.907-2.76-2.2-3.64-3.88-.853-1.68-1.28-3.627-1.28-5.84 0-2.24.427-4.187 1.28-5.84.88-1.68 2.094-2.973 3.64-3.88 1.574-.907 3.4-1.36 5.48-1.36 1.68 0 3.227.32 4.64.96 1.414.64 2.56 1.56 3.44 2.76.907 1.2 1.454 2.6 1.64 4.2l-5.12.28Zm11.443 8.16V38h-5.6v-5.32h5.6Z"/><path fill="#171717" fill-rule="evenodd" d="m7.839 40.783 16.03-28.054L20 6 0 40.783h7.839Zm8.214 0H40L27.99 19.894l-4.02 7.032 3.976 6.914H20.02l-3.967 6.943Z" clip-rule="evenodd"/></svg>
````

## File: public/placeholder.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" fill="none"><rect width="1200" height="1200" fill="#EAEAEA" rx="3"/><g opacity=".5"><g opacity=".5"><path fill="#FAFAFA" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/></g><path stroke="url(#a)" stroke-width="2.418" d="M0-1.209h553.581" transform="scale(1 -1) rotate(45 1163.11 91.165)"/><path stroke="url(#b)" stroke-width="2.418" d="M404.846 598.671h391.726"/><path stroke="url(#c)" stroke-width="2.418" d="M599.5 795.742V404.017"/><path stroke="url(#d)" stroke-width="2.418" d="m795.717 796.597-391.441-391.44"/><path fill="#fff" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/><g clip-path="url(#e)"><path fill="#666" fill-rule="evenodd" d="M616.426 586.58h-31.434v16.176l3.553-3.554.531-.531h9.068l.074-.074 8.463-8.463h2.565l7.18 7.181V586.58Zm-15.715 14.654 3.698 3.699 1.283 1.282-2.565 2.565-1.282-1.283-5.2-5.199h-6.066l-5.514 5.514-.073.073v2.876a2.418 2.418 0 0 0 2.418 2.418h26.598a2.418 2.418 0 0 0 2.418-2.418v-8.317l-8.463-8.463-7.181 7.181-.071.072Zm-19.347 5.442v4.085a6.045 6.045 0 0 0 6.046 6.045h26.598a6.044 6.044 0 0 0 6.045-6.045v-7.108l1.356-1.355-1.282-1.283-.074-.073v-17.989h-38.689v23.43l-.146.146.146.147Z" clip-rule="evenodd"/></g><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/></g><defs><linearGradient id="a" x1="554.061" x2="-.48" y1=".083" y2=".087" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="796.912" x2="404.507" y1="599.963" y2="599.965" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="c" x1="600.792" x2="600.794" y1="403.677" y2="796.082" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="d" x1="404.85" x2="796.972" y1="403.903" y2="796.02" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><clipPath id="e"><path fill="#fff" d="M581.364 580.535h38.689v38.689h-38.689z"/></clipPath></defs></svg>
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "target": "ES6",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: app/creator/[id]/page.tsx
````typescript
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Banknote, Share2, Star, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DonateForm from "@/components/donate-form"

// Mock data for a single creator
const CREATOR = {
  id: "1",
  name: "Elena Rodriguez",
  handle: "@elenadraws",
  avatar: "/avatars/elena.jpg",
  coverImage: "/covers/elena-cover.jpg",
  category: "Digital Art",
  description:
    "I create vibrant digital illustrations and animations inspired by nature and fantasy worlds. Each piece tells a story and brings a little magic into everyday life.",
  supporters: 1245,
  blgReceived: 8750,
  featured: true,
  socialLinks: {
    twitter: "https://twitter.com/elenadraws",
    instagram: "https://instagram.com/elenadraws",
    website: "https://elenadraws.art",
  },
  rewards: [
    {
      level: "Bean Sprout",
      amount: 5,
      benefits: ["Access to exclusive posts", "Monthly wallpaper download"],
    },
    {
      level: "Coffee Bean",
      amount: 20,
      benefits: ["All previous rewards", "Name in credits", "Early access to new art"],
    },
    {
      level: "Coffee Cup",
      amount: 50,
      benefits: ["All previous rewards", "Digital art print (monthly)", "Vote on future projects"],
    },
    {
      level: "Coffee Pot",
      amount: 100,
      benefits: ["All previous rewards", "Custom digital portrait", "1-on-1 virtual coffee chat"],
    },
  ],
  recentPosts: [
    {
      id: "p1",
      title: "New Fantasy Series Preview",
      preview: "I'm excited to share a sneak peek of my upcoming fantasy series...",
      date: "2 days ago",
      image: "/posts/elena-post1.jpg",
    },
    {
      id: "p2",
      title: "Behind the Scenes: Digital Painting Process",
      preview: "Many of you have asked about my digital painting workflow...",
      date: "1 week ago",
      image: "/posts/elena-post2.jpg",
    },
    {
      id: "p3",
      title: "Thank You for 1000+ Supporters!",
      preview: "I'm incredibly grateful to have reached this milestone...",
      date: "2 weeks ago",
      image: "/posts/elena-post3.jpg",
    },
  ],
}

export default function CreatorPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the creator data based on the ID
  // const creator = await getCreator(params.id)
  const creator = CREATOR

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 md:h-64 lg:h-80 w-full">
        <Image
          src={creator.coverImage || "/placeholder.svg?height=300&width=1200"}
          alt={`${creator.name}'s cover image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Button asChild variant="outline" size="sm" className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="container px-4 md:px-6">
        <div className="relative -mt-20 mb-6 flex flex-col items-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-3xl font-bold">{creator.name}</h1>
          <p className="text-muted-foreground">{creator.handle}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{creator.category}</Badge>
            {creator.featured && (
              <Badge variant="secondary">
                <Star className="mr-1 h-3 w-3" /> Featured Creator
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center">
              <Banknote className="mr-1 h-4 w-4 text-primary" />
              <span>{creator.blgReceived.toLocaleString()} $DROPS received</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{creator.supporters.toLocaleString()} supporters</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button size="lg" className="gap-2">
              <Banknote className="h-4 w-4" />
              Donate $DROPS
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 py-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{creator.description}</p>
                <div className="mt-4 flex gap-2">
                  {Object.entries(creator.socialLinks).map(([platform, url]) => (
                    <Button key={platform} variant="outline" size="sm" asChild>
                      <Link href={url} target="_blank" rel="noopener noreferrer">
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Recent Posts</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-4 space-y-4">
                {creator.recentPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>{post.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
                        <p className="text-sm">{post.preview}</p>
                        <div className="relative h-24 sm:h-full rounded-md overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg?height=150&width=200"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <Button variant="link" className="mt-2 px-0">
                        Read more
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="rewards" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {creator.rewards.map((reward, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{reward.level}</CardTitle>
                          <div className="flex items-center text-primary font-bold">
                            <Banknote className="mr-1 h-4 w-4" />
                            {reward.amount} $DROPS
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {reward.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                        <Button className="mt-4 w-full">Select</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <DonateForm creatorId={creator.id} creatorName={creator.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
````

## File: app/globals.css
````css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --foreground: 222.2 84% 4.9%;
  --background: oklch(1 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: 60 100% 45%; /* Updated primary color */
  --primary-foreground: 0 0% 0%; /* Updated primary foreground color */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: oklch(0.205 0 0);
  --muted: 210 40% 96.1%;
  --muted-foreground: oklch(0.556 0 0);
  --accent: 210 40% 96.1%;
  --accent-foreground: oklch(0.205 0 0);
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.625rem;
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --foreground: 210 40% 98%;
  --background: oklch(0.145 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: oklch(0.269 0 0);
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: oklch(0.708 0 0);
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: oklch(0.269 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  /* optional: --font-sans, --font-serif, --font-mono if they are applied in the layout.tsx */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

body {
  -webkit-tap-highlight-color: transparent;
}

/* iPhone notch safe area */
@supports (padding-top: env(safe-area-inset-top)) {
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Mejoras de visibilidad para botones */
.btn-primary {
  background-color: #ffff00;
  color: #000000;
  border: 2px solid #000000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #ffed00;
  border-color: #000000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  background-color: #e6e600;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Adding TikTok-style feed styles */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6);
}

/* Smooth scrolling for TikTok feed */
.snap-y {
  scroll-snap-type: y mandatory;
}

.snap-start {
  scroll-snap-align: start;
}

.snap-center {
  scroll-snap-align: center;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}
````

## File: app/layout.tsx
````typescript
import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DROPSLAND - Support Artists with Music-Backed Tokens",
  description: "Buy $DROPS tokens for your favorite artists on World Chain",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="flex justify-center items-start min-h-screen bg-gray-900">
            <div className="w-full max-w-md min-h-screen bg-black relative">
              <AuthProvider>{children}</AuthProvider>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"
````

## File: app/loading.tsx
````typescript
export default function Loading() {
  return null
}
````

## File: components/auth/login-view.tsx
````typescript
"use client"

import type React from "react"

import { useState } from "react"
import { Coffee, Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface LoginViewProps {
  onLogin: (username: string, password: string) => boolean
  onNavigateToSignup: () => void
}

export default function LoginView({ onLogin, onNavigateToSignup }: LoginViewProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Modificar la función handleSubmit para manejar correctamente el login

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Required fields",
        description: "Please enter your username and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const success = onLogin(username, password)

      if (!success) {
        toast({
          title: "Login error",
          description: "Incorrect username or password.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Beans</h1>
            <p className="text-gray-500 text-sm">Support creators with coffee tokens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500">Use "juampi" for this demo</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <button onClick={onNavigateToSignup} className="text-amber-600 font-medium">
                Register
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">© 2025 Beans. All rights reserved.</p>
      </div>
    </div>
  )
}
````

## File: components/auth/signup-view.tsx
````typescript
"use client"

import type React from "react"

import { useState } from "react"
import { Coffee, Eye, EyeOff, Lock, Mail, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface SignupViewProps {
  onSignup: (username: string, email: string, password: string) => boolean
  onNavigateToLogin: () => void
}

export default function SignupView({ onSignup, onNavigateToLogin }: SignupViewProps) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Required fields",
        description: "Please complete all fields",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please verify that passwords are the same",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const success = onSignup(username, email, password)

      if (!success) {
        toast({
          title: "Registration error",
          description: "Could not complete registration. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 flex items-center">
        <button onClick={onNavigateToLogin} className="flex items-center text-gray-600">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mb-4">
              <Coffee className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500 text-sm">Join the Beans community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Choose a username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button onClick={onNavigateToLogin} className="text-amber-600 font-medium">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">© 2025 Beans. All rights reserved.</p>
      </div>
    </div>
  )
}
````

## File: components/icons/banknote-icon.tsx
````typescript
interface BanknoteIconProps {
  className?: string
  size?: number
}

export function BanknoteIcon({ className = "", size = 24 }: BanknoteIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <path d="M6 12h.01M18 12h.01" />
      <g transform="translate(0,-0.04747867)">
        <path
          d="m 8.0269266,15.374299 h 2.8848884 c 1.537341,0 2.685603,-0.427038 3.482743,-1.224179 0.711732,-0.711731 1.091322,-1.622749 1.091322,-2.619174 0,-0.80663 -0.227754,-1.451935 -0.721221,-1.9454026 C 14.261701,9.0825864 13.455071,8.7314647 12.164463,8.7314647 H 9.8110023 Z"
          style={{
            fontFamily: "'Gotham Ultra'",
            fontSpecification: "'Gotham Ultra'",
            strokeWidth: 1.77933,
          }}
        />
      </g>
    </svg>
  )
}
````

## File: components/icons/banknote-svg.tsx
````typescript
interface BanknoteSvgProps {
  className?: string
}

export function BanknoteSvg({ className = "" }: BanknoteSvgProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <path d="M6 12h.01M18 12h.01" />
      <g transform="translate(0,-0.04747867)">
        <path
          d="m 8.0269266,15.374299 h 2.8848884 c 1.537341,0 2.685603,-0.427038 3.482743,-1.224179 0.711732,-0.711731 1.091322,-1.622749 1.091322,-2.619174 0,-0.80663 -0.227754,-1.451935 -0.721221,-1.9454026 C 14.261701,9.0825864 13.455071,8.7314647 12.164463,8.7314647 H 9.8110023 Z"
          style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra';stroke-width:1.77933"
        />
      </g>
    </svg>
  )
}
````

## File: components/ui/avatar.tsx
````typescript
'use client'

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

import { cn } from '@/lib/utils'

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        'relative flex size-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'bg-muted flex size-full items-center justify-center rounded-full',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
````

## File: components/ui/badge.tsx
````typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
````

## File: components/ui/card.tsx
````typescript
import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
````

## File: components/ui/dialog.tsx
````typescript
'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
````

## File: components/ui/input.tsx
````typescript
import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
````

## File: components/ui/label.tsx
````typescript
'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/lib/utils'

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
````

## File: components/ui/slider.tsx
````typescript
'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
        }
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
          }
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
````

## File: components/ui/tabs.tsx
````typescript
'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
````

## File: components/ui/textarea.tsx
````typescript
import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
````

## File: components/ui/toast.tsx
````typescript
'use client'

import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
````

## File: components/ui/toaster.tsx
````typescript
'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
````

## File: components/ui/tooltip.tsx
````typescript
'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
````

## File: components/activity-screen.tsx
````typescript
"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

// Importar el hook useAuth
import { useAuth } from "@/hooks/use-auth"

// Mock data for activity
const ACTIVITIES = [
  {
    id: "a1",
    type: "donation_sent",
    user: {
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 5,
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "purchase",
    amount: 50,
    wldAmount: 0.5,
    time: "1 day ago",
  },
  {
    id: "a3",
    type: "donation_received",
    user: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 10,
    time: "3 days ago",
  },
  {
    id: "a4",
    type: "donation_sent",
    user: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 20,
    time: "1 week ago",
  },
  {
    id: "a5",
    type: "purchase",
    amount: 100,
    wldAmount: 1,
    time: "2 weeks ago",
  },
]

// Modificar la función ActivityScreen para mostrar el balance actual
export default function ActivityScreen() {
  const { balance } = useAuth() // Obtener el balance del contexto

  return (
    <div className="h-full overflow-auto pb-20">
      <div className="bg-primary p-4">
        <h1 className="text-white font-bold text-xl mb-4">Activity</h1>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available Balance</p>
              <div className="flex items-center mt-1">
                <BanknoteIcon className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold">{balance} DROPS</span>
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Buy More</button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Transaction History</h2>
          <button className="text-primary text-sm font-medium">Filter</button>
        </div>

        <div className="space-y-3">
          {ACTIVITIES.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm">
              {activity.type === "donation_sent" && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
                    <ArrowUp className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Donation to {activity.user.name}</p>
                      <p className="text-red-500 font-medium">-{activity.amount} DROPS</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )}

              {activity.type === "donation_received" && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                    <ArrowDown className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Donation from {activity.user.name}</p>
                      <p className="text-green-500 font-medium">+{activity.amount} DROPS</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )}

              {activity.type === "purchase" && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <BanknoteIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Purchased BEANS</p>
                      <p className="text-green-500 font-medium">+{activity.amount} BEANS</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <p className="text-xs text-gray-500">-{activity.wldAmount} WLD</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
````

## File: components/artist-dashboard.tsx
````typescript
"use client"

import { useState } from "react"
import { ArrowLeft, PlusCircle, Users, Music, Calendar, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ArtistDashboardProps {
  onBack: () => void
}

export default function ArtistDashboard({ onBack }: ArtistDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { userData } = useAuth()

  // Artist data would come from the backend in a real app
  const artistData = {
    name: userData?.username || "iamjuampi",
    supporters: 1850,
    totalReceived: 1850,
    growth: "+12%",
    newSupporters: 24,
    posts: 42,
    rewards: 3,
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Artist Dashboard</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Artist Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-400">Total Supporters</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">{artistData.supporters}</p>
                  <Users className="h-5 w-5 text-bright-yellow" />
                </div>
                <p className="text-xs text-green-500 mt-1">{artistData.growth} this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-400">Total Received</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">{artistData.totalReceived}</p>
                  <BanknoteIcon className="h-5 w-5 text-bright-yellow" />
                </div>
                <p className="text-xs text-green-500 mt-1">+{artistData.newSupporters} new supporters</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button className="h-auto py-3 bg-bright-yellow hover:bg-bright-yellow-700 text-black">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" className="h-auto py-3 bg-gray-700 text-white border-gray-600">
            <Music className="h-4 w-4 mr-2" />
            Add Reward
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
              Content
            </TabsTrigger>
            <TabsTrigger value="supporters" className="data-[state=active]:bg-gray-700">
              Supporters
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{artistData.posts}</p>
                    <p className="text-xs text-gray-400">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{artistData.rewards}</p>
                    <p className="text-xs text-gray-400">Rewards</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">$0.45</p>
                    <p className="text-xs text-gray-400">Token Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-bright-yellow" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{event.title}</p>
                        <p className="text-xs text-gray-400">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">Your Posts</h3>
              <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                New Post
              </Button>
            </div>

            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{post.content.substring(0, 60)}...</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                          {post.likes} likes
                        </Badge>
                        <p className="text-xs text-gray-500 ml-2">{post.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 bg-gray-700 text-white border-gray-600">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-white font-medium">Your Rewards</h3>
              <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                Add Reward
              </Button>
            </div>

            {rewards.map((reward) => (
              <Card key={reward.id} className="bg-gray-800 border-gray-700">
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

          {/* Supporters Tab */}
          <TabsContent value="supporters" className="mt-4 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Top Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supporters.map((supporter) => (
                    <div key={supporter.id} className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={supporter.avatar} alt={supporter.name} />
                        <AvatarFallback>{supporter.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{supporter.name}</p>
                        <p className="text-xs text-gray-400">{supporter.since}</p>
                      </div>
                      <div className="flex items-center text-bright-yellow font-medium">
                        <BanknoteIcon className="h-3 w-3 mr-1" />
                        <span>{supporter.tokens} $DROPS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings */}
        <div className="mt-6">
          <Button variant="outline" className="w-full justify-start bg-gray-800 text-white border-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Artist Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

// Sample data
const events = [
  { id: "1", title: "Release new track", date: "Mar 25, 2025" },
  { id: "2", title: "Live stream session", date: "Apr 2, 2025" },
  { id: "3", title: "Club Underground performance", date: "Apr 10, 2025" },
]

const posts = [
  {
    id: "1",
    content: 'Just released my new track "Midnight Pulse". Listen to it now on my profile!',
    time: "2 hours ago",
    likes: 42,
    comments: 8,
  },
  {
    id: "2",
    content: "Thanks everyone for the support on my last set. I'll be sharing more music with you soon.",
    time: "2 days ago",
    likes: 76,
    comments: 12,
  },
  {
    id: "3",
    content:
      "Working on a new project that combines techno with elements of classical music. What do you think about this fusion?",
    time: "4 days ago",
    likes: 93,
    comments: 28,
  },
]

const rewards = [
  {
    id: "1",
    title: "Exclusive Monthly Track",
    description: "Unreleased track available only to token holders",
    minTokens: 10,
    subscribers: 156,
  },
  {
    id: "2",
    title: "Production Masterclass",
    description: "Monthly video tutorial on advanced production techniques",
    minTokens: 25,
    subscribers: 87,
  },
  {
    id: "3",
    title: "Stems & Project Files",
    description: "Complete project files for selected tracks",
    minTokens: 50,
    subscribers: 42,
  },
]

const supporters = [
  {
    id: "1",
    name: "musicfan",
    avatar: "/avatars/user.jpg",
    tokens: 120,
    since: "Supporting since Jan 2025",
  },
  {
    id: "2",
    name: "technoLover",
    avatar: "/avatars/user.jpg",
    tokens: 85,
    since: "Supporting since Feb 2025",
  },
  {
    id: "3",
    name: "beatMaster",
    avatar: "/avatars/user.jpg",
    tokens: 65,
    since: "Supporting since Feb 2025",
  },
  {
    id: "4",
    name: "rhythmQueen",
    avatar: "/avatars/user.jpg",
    tokens: 50,
    since: "Supporting since Mar 2025",
  },
]
````

## File: components/artist-profile.tsx
````typescript
"use client"

import { useState } from "react"
import { ArrowLeft, Heart, MessageCircle, Share2, Lock, Disc, Video, Users, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ArtistProfileProps {
  artistId: string
  onBack: () => void
}

export default function ArtistProfile({ artistId, onBack }: ArtistProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addToBalance, isArtist } = useAuth()

  // Find artist by ID with better error handling
  const artist = artists.find((a) => a.id === artistId)

  console.log("Artist Profile - ID received:", artistId)
  console.log("Artist Profile - Artist found:", artist)

  // If artist not found, show an error message
  if (!artist) {
    return (
      <div className="p-4 text-center">
        <Button variant="outline" size="sm" className="mb-4 bg-gray-800 text-white border-gray-700" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <p className="text-white">Artist not found. Please try again.</p>
      </div>
    )
  }

  // Simulate network delay
  const handleBuyToken = () => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      addToBalance(-10) // Subtract DROPS

      toast({
        title: "Purchase successful!",
        description: `You've bought 10 $${artist.tokenName} from ${artist.name}`,
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="pb-6 bg-gray-950">
      {/* Back button at the top */}

      {/* Cover Image */}
      <div className="relative h-36 bg-gradient-to-r from-gray-800 to-black">
        {artist.coverImage && (
          <img
            src={artist.coverImage || "/placeholder.svg"}
            alt={`${artist.name}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Artist Info */}
      <div className="px-4 relative">
        <div className="flex items-start mt-[-40px]">
          <Avatar className="h-20 w-20 border-4 border-gray-900">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-xl text-white">{artist.name}</h1>
              <p className="text-gray-400 text-sm">{artist.handle}</p>
            </div>
            <Button
              className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              onClick={handleBuyToken}
              disabled={isLoading}
            >
              <BanknoteIcon className="h-4 w-4 mr-1" />
              Buy ${artist.tokenName}
            </Button>
          </div>

          <Badge variant="outline" className="mt-2 bg-gray-800 text-gray-300 border-gray-700">
            {artist.genre}
          </Badge>

          <p className="mt-3 text-sm text-gray-300">{artist.description}</p>

          <div className="flex mt-3 space-x-4 text-sm">
            <div>
              <span className="font-bold text-white">{artist.supporters}</span>
              <span className="text-gray-400 ml-1">followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{artist.blgReceived}</span>
              <span className="text-gray-400 ml-1">$DROPS received</span>
            </div>
          </div>
        </div>

        {/* Token Info */}
        <Card className="mt-4 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">${artist.tokenName}</h3>
                <p className="text-xs text-gray-400">{artist.name}'s personal token</p>
              </div>
              <div className="text-right">
                <p className="text-bright-yellow font-bold">${artist.tokenPrice} USD</p>
                <p className="text-xs text-gray-400">Current price</p>
              </div>
            </div>
            <Button
              className="w-full mt-3 bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              onClick={handleBuyToken}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Buy $${artist.tokenName}`}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs for Posts and Exclusive Content */}
        <div className="mt-6">
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="posts" className="data-[state=active]:bg-gray-700">
                Posts
              </TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="certifications" className="data-[state=active]:bg-gray-700">
                Certifications
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-4 space-y-4">
              {artist.posts.map((post, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={artist.avatar} alt={artist.name} />
                        <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{artist.name}</p>
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
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-4 space-y-3">
              <div className="mb-3">
                <h3 className="text-white font-medium">Artist Rewards</h3>
                <p className="text-sm text-gray-400">Exclusive rewards for {artist.name}'s token holders</p>
              </div>

              {artist.rewards ? (
                artist.rewards.map((reward, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bright-yellow/20 flex items-center justify-center">
                          <BanknoteIcon className="h-5 w-5 text-bright-yellow" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{reward.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                              {reward.minTokens} $DROPS required
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                          Get
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                  <Lock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">No rewards available yet</p>
                  <p className="text-gray-400 text-sm mt-1">{artist.name} hasn't created any rewards yet</p>
                </div>
              )}
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="mt-4 space-y-3">
              <div className="mb-3">
                <h3 className="text-white font-medium">Artist Certifications</h3>
                <p className="text-sm text-gray-400">Achievements and certifications earned by {artist.name}</p>
              </div>

              {artist.certifications ? (
                artist.certifications.map((cert, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
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
                            >
                              {cert.type === "gold" || cert.type === "platinum"
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
                ))
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                  <Award className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">No certifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">{artist.name} hasn't earned any certifications yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Fan-only section */}
        {!isArtist() && (
          <Card className="mt-6 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-bright-yellow mr-2" />
                <div className="flex-1">
                  <h3 className="text-white font-medium">Want to create content?</h3>
                  <p className="text-sm text-gray-400">Apply to become an artist on DROPSLAND</p>
                </div>
                <Button className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">Apply</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Vamos a actualizar los datos de los artistas para que cada uno tenga contenido único
// Reemplazaremos la constante artists con datos más personalizados

const artists = [
  {
    id: "iamjuampi",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Tech-House",
    description: "DJ, producer, and founder of the record label Best Drops Ever.",
    supporters: 1850,
    blgReceived: 1850,
    featured: true,
    tokenName: "JUAMPI",
    tokenPrice: 0.45,
    posts: [
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
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Midnight Pulse (Extended Mix)",
        description: "10-minute extended version only for $JUAMPI holders",
        date: "Mar 15, 2025",
      },
      {
        title: "Production tutorial - Techno Kicks",
        description: "Learn to create powerful kicks for your techno tracks",
        date: "Mar 10, 2025",
      },
      {
        title: "Live set - Club Underground",
        description: "Complete recording of my latest set at Club Underground",
        date: "Mar 5, 2025",
      },
    ],
    rewards: [
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
      {
        title: "VIP Club Access",
        description: "Priority access to my shows at Club Underground",
        minTokens: 75,
        subscribers: 28,
      },
    ],
    certifications: [
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
    ],
  },
  {
    id: "banger",
    name: "Banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "DNB y Tech-House",
    description: "House producer with disco and funk influences. Known for energetic rhythms.",
    supporters: 2100,
    blgReceived: 2100,
    featured: true,
    tokenName: "BANGER",
    tokenPrice: 0.42,
    posts: [
      {
        content: "Just dropped 'Disco Inferno' - my funkiest house track yet! Link in bio 🔥 #DiscoHouse #NewMusic",
        time: "3 hours ago",
        likes: 92,
        comments: 18,
        image: "/images/dj-mixer.png",
      },
      {
        content: "Vinyl lovers! Limited edition 12\" of 'Groove Machine' coming next week. Only 200 copies available!",
        time: "1 day ago",
        likes: 124,
        comments: 35,
      },
      {
        content:
          "Throwback to my Ibiza set last summer. Still can't believe how amazing that crowd was! #Ibiza #HouseMusic",
        time: "3 days ago",
        likes: 156,
        comments: 27,
        image: "/images/dj-mixer.png",
      },
      {
        content: "Studio session with @nicolamarti today. The collab you've all been waiting for is finally happening!",
        time: "5 days ago",
        likes: 187,
        comments: 42,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Disco Fever (Club Mix)",
        description: "Extended club mix only for $BANGER holders",
        date: "Mar 12, 2025",
      },
      {
        title: "Sample pack - House Essentials Vol. 1",
        description: "Collection of premium samples for house producers",
        date: "Mar 5, 2025",
      },
      {
        title: "Behind the scenes - Studio Session",
        description: "Watch how I created my latest track from scratch",
        date: "Feb 28, 2025",
      },
    ],
    rewards: [
      {
        title: "Disco House Sample Pack",
        description: "Monthly collection of disco samples and loops",
        minTokens: 15,
        subscribers: 178,
      },
      {
        title: "Vinyl First Access",
        description: "Early access to limited vinyl releases",
        minTokens: 30,
        subscribers: 92,
      },
      {
        title: "Remix Competition",
        description: "Exclusive stems to remix my tracks monthly",
        minTokens: 45,
        subscribers: 64,
      },
      {
        title: "DJ Feedback",
        description: "Personal feedback on your tracks once a month",
        minTokens: 75,
        subscribers: 38,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Disco Inferno single reached 500,000 streams",
        date: "Feb 10, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "2M Views",
        description: "Music video for 'Groove Machine' reached 2 million views",
        date: "Jan 25, 2025",
      },
      {
        id: "c3",
        type: "soldout",
        title: "Sold Out Tour",
        description: "European Summer Tour 2024 sold out in 48 hours",
        date: "Dec 15, 2024",
      },
      {
        id: "c4",
        type: "award",
        title: "Best House Producer",
        description: "DJ Mag Awards 2024",
        date: "Nov 20, 2024",
      },
    ],
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Tech-House",
    description: "Italian melodic techno artist with a unique and atmospheric style.",
    supporters: 1750,
    blgReceived: 1750,
    featured: true,
    tokenName: "NICOLA",
    tokenPrice: 0.38,
    posts: [
      {
        content:
          "My new album 'Ethereal Landscapes' is finally complete. Can't wait to share this journey with you all next month.",
        time: "5 hours ago",
        likes: 143,
        comments: 38,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Recording strings with the Milano Chamber Orchestra today. Adding classical elements to electronic music is pure magic.",
        time: "2 days ago",
        likes: 167,
        comments: 29,
      },
      {
        content:
          "Berlin, thank you for an unforgettable night at Panorama Bar. The energy was transcendent. #Berlin #MelodicTechno",
        time: "4 days ago",
        likes: 201,
        comments: 47,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Just finished mastering the collaboration with @banger - two different worlds colliding in the most beautiful way.",
        time: "1 week ago",
        likes: 178,
        comments: 35,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Melodic Journey (Extended Mix)",
        description: "10-minute journey through melodic techno landscapes",
        date: "Mar 14, 2025",
      },
      {
        title: "Ableton Live Template - Melodic Techno",
        description: "My personal template for creating melodic techno tracks",
        date: "Mar 7, 2025",
      },
      {
        title: "Live recording - Club Panorama Berlin",
        description: "Full 2-hour set from my recent Berlin performance",
        date: "Feb 25, 2025",
      },
    ],
    rewards: [
      {
        title: "Orchestral Elements",
        description: "Monthly orchestral samples recorded with live musicians",
        minTokens: 15,
        subscribers: 145,
      },
      {
        title: "Ambient Soundscapes",
        description: "Exclusive ambient compositions for meditation",
        minTokens: 25,
        subscribers: 78,
      },
      {
        title: "Melodic Progression Masterclass",
        description: "Monthly tutorial on creating emotional progressions",
        minTokens: 40,
        subscribers: 52,
      },
      {
        title: "Studio Live Stream",
        description: "Monthly live stream from my Milan studio",
        minTokens: 60,
        subscribers: 31,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "platinum",
        title: "Platinum Record",
        description: "Ethereal Landscapes album reached 1,000,000 streams",
        date: "Mar 5, 2025",
      },
      {
        id: "c2",
        type: "award",
        title: "Best Melodic Techno Artist",
        description: "International Electronic Music Awards 2024",
        date: "Dec 10, 2024",
      },
      {
        id: "c3",
        type: "soldout",
        title: "Sold Out Show",
        description: "Milan Techno Festival headlining show sold out",
        date: "Nov 20, 2024",
      },
      {
        id: "c4",
        type: "views",
        title: "3M Views",
        description: "Live performance at Tomorrowland reached 3 million views",
        date: "Oct 15, 2024",
      },
    ],
  },
  {
    id: "axs",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Riddim",
    description: "Producer of industrial techno with influences from EBM and post-punk.",
    supporters: 1680,
    blgReceived: 1680,
    featured: true,
    tokenName: "AXS",
    tokenPrice: 0.4,
    posts: [
      {
        content:
          "New EP 'Mechanical Dystopia' drops next week. The darkest, hardest techno I've ever made. #IndustrialTechno",
        time: "6 hours ago",
        likes: 132,
        comments: 41,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Field recording session at an abandoned factory today. These machines make the most incredible sounds.",
        time: "2 days ago",
        likes: 98,
        comments: 23,
      },
      {
        content:
          "My modular synth setup is finally complete. Spent 3 years building this beast. Time to make some noise!",
        time: "5 days ago",
        likes: 176,
        comments: 52,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Berghain closing set was pure madness last night. 4 hours of relentless industrial techno. Thank you Berlin!",
        time: "1 week ago",
        likes: 215,
        comments: 67,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Industrial Complex (Extended Mix)",
        description: "Hard-hitting industrial techno journey",
        date: "Mar 10, 2025",
      },
      {
        title: "Sound design tutorial - Creating industrial textures",
        description: "Learn how I create my signature industrial sounds",
        date: "Mar 3, 2025",
      },
      {
        title: "Modular patches collection",
        description: "My favorite modular synth patches for techno production",
        date: "Feb 20, 2025",
      },
    ],
    rewards: [
      {
        title: "Modular Synth Patches",
        description: "Monthly collection of my modular synth patches",
        minTokens: 20,
        subscribers: 132,
      },
      {
        title: "Industrial Sound Design",
        description: "Tutorials on creating harsh industrial sounds",
        minTokens: 35,
        subscribers: 85,
      },
      {
        title: "Field Recording Library",
        description: "Access to my industrial field recording library",
        minTokens: 50,
        subscribers: 47,
      },
      {
        title: "Hardware Processing Techniques",
        description: "Learn how I process sounds through hardware",
        minTokens: 75,
        subscribers: 29,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Mechanical Dystopia EP reached 500,000 streams",
        date: "Feb 15, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "1.5M Views",
        description: "Berghain live set reached 1.5 million views",
        date: "Jan 20, 2025",
      },
      {
        id: "c3",
        type: "award",
        title: "Best Industrial Techno Producer",
        description: "Underground Electronic Awards 2024",
        date: "Dec 5, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Warehouse Event",
        description: "Industrial Noise warehouse event sold out in 2 hours",
        date: "Nov 10, 2024",
      },
    ],
  },
  {
    id: "flush",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Dubstep",
    description: "Drum & bass producer with a focus on futuristic and experimental sounds.",
    supporters: 1320,
    blgReceived: 1320,
    featured: false,
    tokenName: "FLUSH",
    tokenPrice: 0.35,
    posts: [
      {
        content:
          "Just finished mastering 'Neurofunk Odyssey' - my most complex D&B track to date. Out next Friday! #DrumAndBass",
        time: "4 hours ago",
        likes: 108,
        comments: 32,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Breaking down the science of perfect breaks - new tutorial on my Patreon for those who want to level up their D&B game.",
        time: "2 days ago",
        likes: 87,
        comments: 19,
      },
      {
        content:
          "London, that was insane! Fabric nightclub, you never disappoint. The energy in that room was electric!",
        time: "5 days ago",
        likes: 143,
        comments: 38,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Working on some half-time experiments. Pushing the boundaries between D&B and hip-hop. Who's interested?",
        time: "1 week ago",
        likes: 96,
        comments: 27,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Future Breaks (VIP Mix)",
        description: "Special VIP version with extra breaks and bass",
        date: "Mar 13, 2025",
      },
      {
        title: "Drum processing tutorial",
        description: "Learn how to create punchy drum & bass breaks",
        date: "Mar 6, 2025",
      },
      {
        title: "Live set - Jungle Massive",
        description: "Full recording of my recent festival performance",
        date: "Feb 27, 2025",
      },
    ],
    rewards: [
      {
        title: "Break Engineering",
        description: "Monthly tutorial on crafting perfect D&B breaks",
        minTokens: 15,
        subscribers: 98,
      },
      {
        title: "Bass Design Masterclass",
        description: "Learn to create cutting-edge neurofunk bass",
        minTokens: 30,
        subscribers: 64,
      },
      {
        title: "Exclusive DJ Mixes",
        description: "Monthly exclusive DJ mixes with unreleased tracks",
        minTokens: 45,
        subscribers: 35,
      },
      {
        title: "Stem Access",
        description: "Download stems from my tracks for remixing",
        minTokens: 60,
        subscribers: 22,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Neurofunk Odyssey EP reached 500,000 streams",
        date: "Jan 25, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "1M Views",
        description: "Fabric London live set reached 1 million views",
        date: "Dec 15, 2024",
      },
      {
        id: "c3",
        type: "award",
        title: "Best Newcomer",
        description: "Drum&Bass Arena Awards 2024",
        date: "Nov 5, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Show",
        description: "Printworks London show sold out in 24 hours",
        date: "Oct 20, 2024",
      },
    ],
  },
  {
    id: "daniloDR",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Trap",
    description: "Creator of progressive trance with elements of classical music and ambient.",
    supporters: 980,
    blgReceived: 980,
    featured: false,
    tokenName: "DANILO",
    tokenPrice: 0.32,
    posts: [
      {
        content:
          "New album 'Harmonic Convergence' is finally complete after 2 years of work. A fusion of trance and classical orchestration.",
        time: "7 hours ago",
        likes: 89,
        comments: 24,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Just finished recording with the Prague Symphony Orchestra. Adding real strings to electronic music creates such depth.",
        time: "3 days ago",
        likes: 112,
        comments: 31,
      },
      {
        content: "Sunrise set at Ozora Festival was a spiritual experience. Thank you for joining me on this journey.",
        time: "6 days ago",
        likes: 134,
        comments: 42,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Exploring microtonal scales in my latest compositions. Breaking free from Western 12-tone limitations.",
        time: "1 week ago",
        likes: 76,
        comments: 19,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Ethereal Journey (Extended Mix)",
        description: "10-minute progressive trance journey",
        date: "Mar 11, 2025",
      },
      {
        title: "Orchestral samples collection",
        description: "Classical samples perfect for trance production",
        date: "Mar 4, 2025",
      },
      {
        title: "Production walkthrough - Layering techniques",
        description: "Learn how I create lush, layered trance soundscapes",
        date: "Feb 22, 2025",
      },
    ],
    rewards: [
      {
        title: "Orchestral Elements",
        description: "Monthly orchestral samples from live recordings",
        minTokens: 10,
        subscribers: 75,
      },
      {
        title: "Meditation Compositions",
        description: "Exclusive ambient tracks for meditation",
        minTokens: 25,
        subscribers: 48,
      },
      {
        title: "Harmonic Theory Lessons",
        description: "Learn music theory for emotional compositions",
        minTokens: 40,
        subscribers: 29,
      },
      {
        title: "Sunrise Set Recordings",
        description: "Access to my exclusive festival sunrise sets",
        minTokens: 60,
        subscribers: 18,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Harmonic Convergence album reached 500,000 streams",
        date: "Feb 5, 2025",
      },
      {
        id: "c2",
        type: "award",
        title: "Best Progressive Trance Album",
        description: "Global Trance Awards 2024",
        date: "Nov 30, 2024",
      },
      {
        id: "c3",
        type: "views",
        title: "1.2M Views",
        description: "Ozora Festival sunrise set reached 1.2 million views",
        date: "Oct 15, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Concert",
        description: "Orchestral electronic concert sold out in Prague",
        date: "Sep 20, 2024",
      },
    ],
  },
  {
    id: "spitflux",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Dubstep",
    description: "Innovator in the dubstep scene with an aggressive and detailed style.",
    supporters: 1450,
    blgReceived: 1450,
    featured: false,
    tokenName: "SPITFLUX",
    tokenPrice: 0.37,
    posts: [
      {
        content:
          "Just dropped 'Waveform Crusher' - the heaviest bass I've ever designed. Your speakers have been warned! #Dubstep",
        time: "5 hours ago",
        likes: 156,
        comments: 47,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "New sound design tutorial: How I created that alien bass sound everyone's been asking about. Link in bio.",
        time: "2 days ago",
        likes: 123,
        comments: 38,
      },
      {
        content:
          "Lost Lands Festival was INSANE! Dropping unreleased tunes to 30,000 headbangers was a dream come true.",
        time: "4 days ago",
        likes: 187,
        comments: 56,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Studio session with @kr4d today. Combining dubstep and ambient is creating some mind-bending results!",
        time: "1 week ago",
        likes: 109,
        comments: 31,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Bass Cannon (VIP Mix)",
        description: "Even heavier version with extra bass drops",
        date: "Mar 9, 2025",
      },
      {
        title: "Sound design tutorial - Creating alien bass",
        description: "Learn my techniques for creating unique bass sounds",
        date: "Mar 2, 2025",
      },
      {
        title: "Serum presets pack - Dubstep Essentials",
        description: "Collection of my personal Serum presets",
        date: "Feb 18, 2025",
      },
    ],
    rewards: [
      {
        title: "Serum Preset Pack",
        description: "Monthly pack of my custom Serum presets",
        minTokens: 15,
        subscribers: 112,
      },
      {
        title: "Bass Design Masterclass",
        description: "In-depth tutorials on creating unique bass sounds",
        minTokens: 30,
        subscribers: 67,
      },
      {
        title: "Unreleased Demos",
        description: "Access to unreleased and experimental tracks",
        minTokens: 45,
        subscribers: 41,
      },
      {
        title: "Feedback Sessions",
        description: "Monthly group feedback on your dubstep tracks",
        minTokens: 60,
        subscribers: 25,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Waveform Crusher EP reached 500,000 streams",
        date: "Jan 15, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "2M Views",
        description: "Lost Lands Festival set reached 2 million views",
        date: "Dec 10, 2024",
      },
      {
        id: "c3",
        type: "soldout",
        title: "Sold Out Tour",
        description: "North American Bass Tour sold out in 48 hours",
        date: "Nov 25, 2024",
      },
      {
        id: "c4",
        type: "award",
        title: "Best Dubstep Producer",
        description: "Bass Music Awards 2024",
        date: "Oct 5, 2024",
      },
    ],
  },
  {
    id: "kr4d",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Electro",
    description: "Ambient and experimental music artist focusing on immersive soundscapes.",
    supporters: 890,
    blgReceived: 890,
    featured: false,
    tokenName: "KR4D",
    tokenPrice: 0.3,
    posts: [
      {
        content:
          "New album 'Quantum Resonance' explores the relationship between sound and consciousness. A 60-minute journey into deep listening.",
        time: "8 hours ago",
        likes: 76,
        comments: 21,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Just returned from a month in the Himalayas recording mountain sounds. These will form the basis of my next project.",
        time: "3 days ago",
        likes: 92,
        comments: 27,
      },
      {
        content:
          "My installation at the Modern Art Museum opens next week. 12 speakers, generative algorithms, and responsive lighting.",
        time: "5 days ago",
        likes: 108,
        comments: 34,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Exploring the use of AI in ambient composition. The results are fascinating - both familiar and alien simultaneously.",
        time: "1 week ago",
        likes: 65,
        comments: 19,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Cosmic Whispers (Extended Journey)",
        description: "30-minute ambient soundscape experience",
        date: "Mar 8, 2025",
      },
      {
        title: "Field recordings collection - Forest Sounds",
        description: "High-quality nature recordings for ambient production",
        date: "Mar 1, 2025",
      },
      {
        title: "Ambient production techniques",
        description: "Learn how to create immersive ambient soundscapes",
        date: "Feb 15, 2025",
      },
    ],
    rewards: [
      {
        title: "Generative Music App",
        description: "Access to my custom generative music application",
        minTokens: 10,
        subscribers: 68,
      },
      {
        title: "Himalayan Field Recordings",
        description: "Exclusive access to my Himalayan sound library",
        minTokens: 20,
        subscribers: 42,
      },
      {
        title: "Meditation Compositions",
        description: "Monthly ambient pieces designed for deep meditation",
        minTokens: 30,
        subscribers: 31,
      },
      {
        title: "Sound Art Installations",
        description: "Virtual access to my sound art installations",
        minTokens: 50,
        subscribers: 17,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "award",
        title: "Best Ambient Album",
        description: "Quantum Resonance won Best Ambient Album 2024",
        date: "Dec 20, 2024",
      },
      {
        id: "c2",
        type: "views",
        title: "1M Streams",
        description: "Quantum Resonance album reached 1 million streams",
        date: "Nov 15, 2024",
      },
      {
        id: "c3",
        type: "award",
        title: "Sound Art Prize",
        description: "International Sound Art Biennale 2024",
        date: "Oct 10, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Installation",
        description: "Modern Art Museum sound installation sold out for 3 months",
        date: "Sep 5, 2024",
      },
    ],
  },
]
````

## File: components/buy-view.tsx
````typescript
"use client"

import { useState } from "react"
import { ArrowLeft, Info } from "lucide-react"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

// Import the useAuth hook
import { useAuth } from "@/hooks/use-auth"

interface BuyViewProps {
  onBack: () => void
}

export default function BuyView({ onBack }: BuyViewProps) {
  const [amount, setAmount] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [exchangeRate] = useState(0.42) // 1 DROPS = 0.42 USD
  const { toast } = useToast()
  const { addToBalance } = useAuth()

  const handleBuy = () => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // Update balance
      addToBalance(amount)

      toast({
        title: "Purchase successful!",
        description: `You've bought ${amount} $DROPS for ${(amount * exchangeRate).toFixed(2)} USD`,
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Buy $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-950">
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Amount to buy</span>
                  <div className="flex items-center text-bright-yellow font-bold">
                    <BanknoteIcon className="h-5 w-5 mr-1" />
                    <span>{amount} $DROPS</span>
                  </div>
                </div>
                <Slider
                  min={10}
                  max={500}
                  step={10}
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>10 $DROPS</span>
                  <span>500 $DROPS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => setAmount(value)}
                    className={
                      amount === value
                        ? "border-bright-yellow text-bright-yellow bg-gray-700"
                        : "bg-gray-700 text-white border-gray-600"
                    }
                  >
                    {value} $DROPS
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Purchase Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <div className="flex items-center text-white">
                  <BanknoteIcon className="h-5 w-5 mr-1 text-bright-yellow" />
                  <span>{amount} $DROPS</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unit price</span>
                <span className="text-white">{exchangeRate} USD</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between font-bold">
                <span className="text-white">Total to pay</span>
                <span className="text-white">{(amount * exchangeRate).toFixed(2)} USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleBuy}
            disabled={isLoading || amount <= 0}
            className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
          >
            {isLoading ? "Processing..." : "Confirm Purchase"}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            This is a demo. No real transaction will be made.
          </p>
        </div>
      </div>
    </div>
  )
}
````

## File: components/creators-list.tsx
````typescript
"use client"

import { useState } from "react"
import { Banknote, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Artistas reales
const ARTISTS = [
  {
    id: "1",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    genre: "Tech-House",
    description: "DJ y productor especializado en techno y house. Creador de Best Drops Ever.",
    supporters: 1850,
    blgReceived: 1850,
    featured: true,
  },
  {
    id: "2",
    name: "banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
    description: "Productor de house con influencias de disco y funk. Conocido por sus ritmos enérgicos.",
    supporters: 2100,
    blgReceived: 2100,
    featured: true,
  },
  {
    id: "3",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
    description: "Artista italiano de techno melódico con un estilo único y atmosférico.",
    supporters: 1750,
    blgReceived: 1750,
    featured: true,
  },
  {
    id: "4",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
    description: "Productor de drum & bass con un enfoque en sonidos futuristas y experimentales.",
    supporters: 1320,
    blgReceived: 1320,
    featured: false,
  },
  {
    id: "5",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    genre: "Trap",
    description: "Creador de trance progresivo con elementos de música clásica y ambient.",
    supporters: 980,
    blgReceived: 980,
    featured: false,
  },
  {
    id: "6",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    genre: "Dubstep",
    description: "Innovador en la escena dubstep con un estilo agresivo y detallado.",
    supporters: 1450,
    blgReceived: 1450,
    featured: false,
  },
  {
    id: "7",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
    description: "Productor de techno industrial con influencias de EBM y post-punk.",
    supporters: 1680,
    blgReceived: 1680,
    featured: true,
  },
  {
    id: "8",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    genre: "Electro",
    description: "Artista de ambient y música experimental con enfoque en paisajes sonoros inmersivos.",
    supporters: 890,
    blgReceived: 890,
    featured: false,
  },
]

export default function ArtistsList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArtists = ARTISTS.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Search artists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <div className="space-y-3">
        {filteredArtists.map((artist) => (
          <Card key={artist.id} className="overflow-hidden bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-white">{artist.name}</p>
                    {artist.featured && <Star className="h-3 w-3 text-bright-yellow ml-1" />}
                  </div>
                  <p className="text-xs text-gray-400">{artist.handle}</p>
                  <div className="flex items-center mt-1 text-xs">
                    <Banknote className="h-3 w-3 text-bright-yellow mr-1" />
                    <span>{artist.blgReceived.toLocaleString()} $DROPS</span>
                    <span className="mx-1">•</span>
                    <span>{artist.supporters.toLocaleString()} seguidores</span>
                  </div>
                </div>
                <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                  <Banknote className="h-4 w-4 mr-1" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
````

## File: components/donate-form.tsx
````typescript
"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { donateToCreator } from "@/lib/blockchain"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface DonateFormProps {
  creatorId: string
  creatorName: string
}

export default function DonateForm({ creatorId, creatorName }: DonateFormProps) {
  const [amount, setAmount] = useState(5)
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call the actual blockchain function
      await donateToCreator(creatorId, amount, message, isAnonymous)
      alert(`Successfully purchased ${amount} $DROPS from ${creatorName}!`)
      setAmount(5)
      setMessage("")
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BanknoteIcon className="mr-2 h-5 w-5 text-primary" />
          Buy $DROPS
        </CardTitle>
        <CardDescription>Support {creatorName} with music tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center text-primary font-bold">
              <BanknoteIcon className="mr-1 h-4 w-4" />
              {amount} $DROPS
            </div>
          </div>
          <Slider
            id="amount"
            min={1}
            max={100}
            step={1}
            value={[amount]}
            onValueChange={(value) => setAmount(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 $DROPS</span>
            <span>100 $DROPS</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a support message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="anonymous" className="text-sm">
            Buy anonymously
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Your purchase will be recorded on the blockchain, but your identity won't be shown publicly.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePurchase} disabled={isLoading}>
          {isLoading ? "Processing..." : `Buy ${amount} $DROPS`}
        </Button>
      </CardFooter>
    </Card>
  )
}
````

## File: components/donate-screen.tsx
````typescript
"use client"

import { useState } from "react"
import { ArrowLeft, Banknote } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

export default function DonateScreen({ creator, onBack }) {
  const [amount, setAmount] = useState(5)
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDonationComplete, setIsDonationComplete] = useState(false)
  const { addToBalance, addToDonated } = useAuth() // Obtener las funciones para actualizar el balance y el valor donado

  const handleDonate = () => {
    setIsLoading(true)
    // Simulate donation process
    setTimeout(() => {
      // Actualizar el balance y el valor donado
      addToBalance(-amount)
      addToDonated(amount)

      setIsLoading(false)
      setIsDonationComplete(true)
    }, 1500)
  }

  if (isDonationComplete) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-primary px-4 py-3 flex items-center">
          <button className="w-8 h-8 flex items-center justify-center" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg ml-2">Donation Complete</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <Banknote className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your donation of {amount} DROPS to {creator.name} was successful.
          </p>
          <div className="bg-primary/10 p-4 rounded-xl w-full mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold flex items-center">
                <Banknote className="h-4 w-4 text-primary mr-1" />
                {amount} DROPS
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="text-xs text-gray-500">tx_...{Math.random().toString(36).substring(2, 8)}</span>
            </div>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-medium w-full" onClick={onBack}>
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-primary px-4 py-3 flex items-center">
        <button className="w-8 h-8 flex items-center justify-center" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-white font-bold text-lg ml-2">Donate BEANS</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
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
            <div>
              <h3 className="font-medium">{creator.name}</h3>
              <p className="text-gray-500 text-xs">{creator.handle}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium mb-3">Amount</h3>
          <div className="flex justify-between mb-2">
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 5 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(5)}
            >
              5 DROPS
            </button>
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 10 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(10)}
            >
              10 BEANS
            </button>
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 20 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(20)}
            >
              20 BEANS
            </button>
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 50 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(50)}
            >
              50 BEANS
            </button>
          </div>
          <div className="mt-3">
            <label className="text-sm text-gray-600 block mb-1">Custom amount</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-3 py-2">
                <Banknote className="h-5 w-5 text-primary" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 px-3 py-2 outline-none"
              />
              <div className="bg-gray-100 px-3 py-2 text-gray-500">DROPS</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium mb-3">Message (optional)</h3>
          <textarea
            placeholder="Add a message to your donation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg p-3 h-24 outline-none focus:border-primary"
          ></textarea>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm">
              Donate anonymously
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Your donation will still be recorded on the blockchain, but your identity won't be displayed publicly.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount</span>
            <span className="font-bold flex items-center">
              <Banknote className="h-4 w-4 text-primary mr-1" />
              {amount} DROPS
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Platform fee (5%)</span>
            <span className="text-gray-600">{(amount * 0.05).toFixed(2)} BEANS</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-bold">{amount} BEANS</span>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-full font-medium ${isLoading ? "bg-gray-300 text-gray-600" : "bg-primary text-white"}`}
          onClick={handleDonate}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Donate ${amount} DROPS`}
        </button>
      </div>
    </div>
  )
}
````

## File: components/loading-creators.tsx
````typescript
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingCreators() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="mb-2 h-5 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-1 h-4 w-full" />
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Skeleton className="h-9 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
````

## File: components/login-screen.tsx
````typescript
"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface LoginScreenProps {
  onLogin: (username: string) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Modificar la función handleSubmit para permitir iniciar sesión con los nuevos artistas
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      toast({
        title: "Required fields",
        description: "Please enter your username and password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // Verificar si las credenciales son correctas
      if (password === "1234") {
        // Verificar si es un artista
        if (username === "iamjuampi") {
          onLogin("juampi")
        } else if (username === "banger") {
          onLogin("banger")
        } else if (username === "Nicola Marti" || username === "nicolamarti") {
          onLogin("nicolamarti")
        } else if (username === "AXS" || username === "axs") {
          onLogin("axs")
        } else if (username === "FLUSH" || username === "flush") {
          onLogin("flush")
        } else if (username === "DaniløDR" || username === "daniloDR") {
          onLogin("daniloDR")
        } else if (username === "Spitflux" || username === "spitflux") {
          onLogin("spitflux")
        } else if (username === "Kr4D" || username === "kr4d") {
          onLogin("kr4d")
        } else if (username === "fan" || username === "musicfan") {
          // Login como fan
          onLogin("fan")
        } else {
          toast({
            title: "Login error",
            description: "User not found.",
            variant: "destructive",
          })
          setIsLoading(false)
        }
      } else {
        toast({
          title: "Login error",
          description: "Incorrect password.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex flex-col items-center mb-4">
            <div className="w-64 h-24 flex items-center justify-center mb-2">
              <Image
                src="/images/dropsland-20logo-202025-20ddd.png"
                alt="DROPSLAND"
                width={240}
                height={80}
                className="object-contain"
              />
            </div>
            <p className="text-gray-400 text-sm">Support artists with music tokens</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-10 bg-white/5 backdrop-blur-sm border-white/20 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 bg-white/5 backdrop-blur-sm border-white/20 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-bright-yellow hover:bg-bright-yellow-700 text-black font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <span className="text-bright-yellow font-medium cursor-pointer" onClick={() => alert("Soon")}>
                Register
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">© 2025 DROPSLAND. All rights reserved.</p>
      </div>
    </div>
  )
}
````

## File: components/profile-screen.tsx
````typescript
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
````

## File: components/receive-view.tsx
````typescript
"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ReceiveViewProps {
  onBack: () => void
}

export default function ReceiveView({ onBack }: ReceiveViewProps) {
  const { balance } = useAuth()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"

  const copyToClipboard = () => {
    // Simplify clipboard copy to avoid API issues
    try {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      toast({
        title: "Address copied",
        description: "The wallet address has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy error",
        description: "Could not copy the address",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Receive $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Balance Card */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-400 mb-1">Current Balance</p>
              <div className="flex items-center">
                <BanknoteIcon className="h-5 w-5 text-bright-yellow mr-2" />
                <span className="text-2xl font-bold text-white">{balance} $DROPS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-400 mb-4">Scan this QR code to receive $DROPS</p>
              <div className="bg-white p-4 rounded-lg mb-4 w-48 h-48 flex items-center justify-center">
                {/* Use a styled div instead of Image to avoid issues */}
                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Address */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400 mb-2">Your wallet address</p>
            <div className="flex items-center bg-gray-700 p-3 rounded-lg mb-3">
              <div className="flex-1 text-white text-sm font-mono overflow-hidden overflow-ellipsis">
                {walletAddress}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2 text-gray-300 hover:text-white hover:bg-gray-600"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-gray-700 text-white border-gray-600"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" className="flex-1 bg-gray-700 text-white border-gray-600">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-medium text-white mb-2">Instructions</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Share your wallet address or QR code with anyone who wants to send you $DROPS.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>The sender should use the "Send" function in their app and paste your address.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>Once the transaction is complete, the $DROPS will automatically appear in your balance.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
````

## File: components/search-view.tsx
````typescript
"use client"

import { useState } from "react"
import { Search, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface SearchViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function SearchView({ onSelectArtist }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Function to handle artist selection with debugging
  const handleSelectArtist = (artistId: string) => {
    console.log("Search view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-4 pb-6 bg-gray-50 dark:bg-gray-950">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search artists..."
          className="pl-9 bg-gray-800 border-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery === "" ? (
        <>
          <h2 className="text-lg font-semibold mb-3 text-white">Popular Genres</h2>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {genres.map((genre) => (
              <Card key={genre.name} className="overflow-hidden bg-gray-800 border-gray-700">
                <CardContent className="p-0">
                  <div className="relative h-24">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                    <div className="absolute bottom-2 left-2 text-white z-20">
                      <p className="font-medium">{genre.name}</p>
                      <p className="text-xs">{genre.count} artists</p>
                    </div>
                    <img src="/images/dj-mixer.png" alt={genre.name} className="w-full h-full object-cover" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-3 text-white">Suggested Artists</h2>
        </>
      ) : (
        <h2 className="text-lg font-semibold mb-3 text-white">Results</h2>
      )}

      <div className="space-y-3 mb-6">
        {filteredArtists.map((artist) => (
          <Card
            key={artist.id}
            className="overflow-hidden bg-gray-800 border-gray-700 cursor-pointer"
            onClick={() => handleSelectArtist(artist.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={artist.avatar} alt={artist.name} />
                  <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-medium text-white">{artist.name}</p>
                    {artist.featured && <Star className="h-3 w-3 text-bright-yellow ml-1" />}
                  </div>
                  <p className="text-xs text-gray-400">{artist.handle}</p>
                  <Badge variant="outline" className="mt-1 text-xs bg-gray-700 text-gray-300 border-gray-600">
                    {artist.genre}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectArtist(artist.id)
                  }}
                >
                  <BanknoteIcon className="h-6 w-6 mr-0.5" />
                  Buy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Topics - Ahora después de los artistas sugeridos */}
      {searchQuery === "" && (
        <>
          <h2 className="text-lg font-semibold mb-3 text-white">Trending</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <Badge key={topic} variant="outline" className="bg-gray-800 border-gray-700 text-gray-300">
                {topic}
              </Badge>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Electronic music genre data
const genres = [
  { name: "House", count: 245, image: "/categories/house.jpg" },
  { name: "Techno", count: 189, image: "/categories/techno.jpg" },
  { name: "Trance", count: 156, image: "/categories/trance.jpg" },
  { name: "Drum & Bass", count: 203, image: "/categories/dnb.jpg" },
  { name: "Dubstep", count: 124, image: "/categories/dubstep.jpg" },
  { name: "Ambient", count: 167, image: "/categories/ambient.jpg" },
]

// Real artists
const artists = [
  {
    id: "iamjuampi",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    genre: "Tech-House",
    description: "DJ, producer, and founder of the record label Best Drops Ever.",
    featured: true,
    blgReceived: 1850,
  },
  {
    id: "banger",
    name: "Banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    genre: "DNB y Tech-House",
    description: "House producer with disco and funk influences. Known for energetic rhythms.",
    featured: true,
    blgReceived: 2100,
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    genre: "Tech-House",
    description: "Italian melodic techno artist with a unique and atmospheric style.",
    featured: true,
    blgReceived: 1750,
  },
  {
    id: "flush",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    genre: "Dubstep",
    description: "Drum & bass producer with a focus on futuristic and experimental sounds.",
    featured: false,
    blgReceived: 1320,
  },
  {
    id: "daniloDR",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    genre: "Trap",
    description: "Creator of progressive trance with elements of classical music and ambient.",
    featured: false,
    blgReceived: 980,
  },
  {
    id: "spitflux",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    genre: "Dubstep",
    description: "Innovator in the dubstep scene with an aggressive and detailed style.",
    featured: false,
    blgReceived: 1450,
  },
  {
    id: "axs",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    genre: "Riddim",
    description: "Producer of industrial techno with influences from EBM and post-punk.",
    featured: true,
    blgReceived: 1680,
  },
  {
    id: "kr4d",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    genre: "Electro",
    description: "Ambient and experimental music artist focusing on immersive soundscapes.",
    featured: false,
    blgReceived: 890,
  },
]

// Trending topics
const trendingTopics = [
  "#ElectronicMusic",
  "#HouseBeats",
  "#TechnoNights",
  "#TranceFamily",
  "#DrumAndBass",
  "#DubstepVibes",
]
````

## File: components/send-view.tsx
````typescript
"use client"

import { useState } from "react"
import { ArrowLeft, Info, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

// Import the useAuth hook
import { useAuth } from "@/hooks/use-auth"

interface SendViewProps {
  onBack: () => void
}

// Modify the SendView function to update balance and donated value after sending
export default function SendView({ onBack }: SendViewProps) {
  const [amount, setAmount] = useState(20)
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()
  const { balance, addToBalance, addToDonated } = useAuth() // Get balance and functions to update it

  const handleSend = () => {
    if (!selectedUser) {
      toast({
        title: "Select a recipient",
        description: "Please select who to send tokens to",
        variant: "destructive",
      })
      return
    }

    // Check if there's enough balance
    if (amount > balance) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough tokens. Your current balance is ${balance} $DROPS`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // Subtract from balance
      addToBalance(-amount)

      // Add to donated value
      addToDonated(amount)

      toast({
        title: "Sent successfully!",
        description: `You've sent ${amount} $DROPS to ${selectedUser.name}`,
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleSearch = () => {
    if (!recipient.trim()) return

    setIsLoading(true)

    // Simulate search delay
    setTimeout(() => {
      // Mock user found
      const user = {
        id: "u1",
        name: recipient,
        handle: `@${recipient.toLowerCase().replace(/\s+/g, "")}`,
        avatar: "/avatars/user.jpg",
      }

      setSelectedUser(user)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Send $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-950">
        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-white">
                  Recipient
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="recipient"
                      placeholder="Name or @username"
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      disabled={!!selectedUser}
                    />
                  </div>
                  {!selectedUser ? (
                    <Button
                      onClick={handleSearch}
                      disabled={!recipient.trim() || isLoading}
                      className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      Change
                    </Button>
                  )}
                </div>
              </div>

              {selectedUser && (
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{selectedUser.name}</p>
                      <p className="text-sm text-gray-400">{selectedUser.handle}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Amount to send</Label>
                  <div className="flex items-center text-bright-yellow font-bold">
                    <BanknoteIcon className="h-5 w-5 mr-1" />
                    <span>{amount} $DROPS</span>
                  </div>
                </div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 $DROPS</span>
                  <span>100 $DROPS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => setAmount(value)}
                    className={
                      amount === value
                        ? "border-bright-yellow text-bright-yellow bg-gray-700"
                        : "bg-gray-700 text-white border-gray-600"
                    }
                  >
                    {value} $DROPS
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Message (optional)
                </Label>
                <Input
                  id="message"
                  placeholder="Add a message..."
                  className="bg-gray-700 border-gray-600 text-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSend}
            disabled={isLoading || amount <= 0 || !selectedUser}
            className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
          >
            {isLoading ? "Processing..." : "Send tokens"}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            This is a demo. No real transaction will be made.
          </p>
        </div>
      </div>
    </div>
  )
}
````

## File: components/stats-card.tsx
````typescript
import type { ReactNode } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string
  trend: string
  trendUp: boolean
}

export default function StatsCard({ icon, title, value, trend, trendUp }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center pt-1">
          {trendUp ? (
            <span className="flex items-center text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              {trend}
            </span>
          ) : (
            <span className="flex items-center text-red-500">
              <ArrowDown className="mr-1 h-4 w-4" />
              {trend}
            </span>
          )}
          <span className="ml-1 text-muted-foreground">from last month</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
````

## File: components/theme-provider.tsx
````typescript
"use client"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
````

## File: hooks/use-auth.tsx
````typescript
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

// Add user type to the interface
type UserType = "fan" | "artist"

interface UserData {
  username: string
  type: UserType
  isVerified?: boolean
}

interface AuthContextType {
  user: string | null
  userData: UserData | null
  isAuthenticated: boolean
  balance: number
  donated: number
  login: (username: string) => void
  logout: () => void
  updateBalance: (newBalance: number) => void
  addToBalance: (amount: number) => void
  addToDonated: (amount: number) => void
  isArtist: () => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAuthenticated: false,
  balance: 0,
  donated: 0,
  login: () => {},
  logout: () => {},
  updateBalance: () => {},
  addToBalance: () => {},
  addToDonated: () => {},
  isArtist: () => false,
})

// Define user data for different accounts
const USER_DATA: Record<string, UserData> = {
  juampi: {
    username: "iamjuampi",
    type: "artist",
    isVerified: true,
  },
  banger: {
    username: "banger",
    type: "artist",
    isVerified: true,
  },
  nicolamarti: {
    username: "Nicola Marti",
    type: "artist",
    isVerified: true,
  },
  axs: {
    username: "AXS",
    type: "artist",
    isVerified: true,
  },
  flush: {
    username: "FLUSH",
    type: "artist",
    isVerified: false,
  },
  daniloDR: {
    username: "DaniløDR",
    type: "artist",
    isVerified: false,
  },
  spitflux: {
    username: "Spitflux",
    type: "artist",
    isVerified: false,
  },
  kr4d: {
    username: "Kr4D",
    type: "artist",
    isVerified: false,
  },
  fan: {
    username: "musicfan",
    type: "fan",
  },
  user: {
    username: "musicfan",
    type: "fan",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initial balance value
  const [balance, setBalance] = useState(125)
  const [donated, setDonated] = useState(75)
  const [user, setUser] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("beans_user")
    if (storedUser) {
      setUser(storedUser)
      setUserData(USER_DATA[storedUser] || { username: storedUser, type: "fan" })
      setIsAuthenticated(true)

      // Retrieve saved balance if it exists
      const storedBalance = localStorage.getItem("beans_balance")
      if (storedBalance) {
        setBalance(Number(storedBalance))
      }

      // Retrieve saved donated value if it exists
      const storedDonated = localStorage.getItem("beans_donated")
      if (storedDonated) {
        setDonated(Number(storedDonated))
      }
    }
  }, [])

  const login = useCallback((username: string) => {
    setUser(username)
    setUserData(USER_DATA[username] || { username, type: "fan" })
    setIsAuthenticated(true)
    localStorage.setItem("beans_user", username)

    // Set initial balance if it doesn't exist
    if (!localStorage.getItem("beans_balance")) {
      localStorage.setItem("beans_balance", "125")
    }

    // Set initial donated value if it doesn't exist
    if (!localStorage.getItem("beans_donated")) {
      localStorage.setItem("beans_donated", "75")
    }
  }, [])

  const logout = () => {
    setUser(null)
    setUserData(null)
    setIsAuthenticated(false)
    localStorage.removeItem("beans_user")
    // We don't remove balance or donated value to keep them between sessions
  }

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance)
    localStorage.setItem("beans_balance", newBalance.toString())
  }

  const addToBalance = (amount: number) => {
    const newBalance = balance + amount
    updateBalance(newBalance)
  }

  // New function to update donated value
  const addToDonated = (amount: number) => {
    const newDonated = donated + amount
    setDonated(newDonated)
    localStorage.setItem("beans_donated", newDonated.toString())
  }

  // Helper function to check if user is an artist
  const isArtist = () => {
    return userData?.type === "artist"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated,
        balance,
        donated,
        login,
        logout,
        updateBalance,
        addToBalance,
        addToDonated,
        isArtist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
````

## File: hooks/use-toast.ts
````typescript
'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
````

## File: lib/blockchain.ts
````typescript
// This file would contain the actual blockchain interactions
// For this demo, we're using mock implementations

import { ethers } from "ethers"

// ABI for the DROPS Token contract
const BEANS_TOKEN_ABI = [
  // This would be the actual ABI for the DROPS token contract
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
]

// ABI for the Beans Platform contract
const BEANS_PLATFORM_ABI = [
  // This would be the actual ABI for the Beans platform contract
  "function donateToCreator(string creatorId, uint256 amount, string message, bool isAnonymous) returns (bool)",
  "function getCreatorInfo(string creatorId) view returns (address walletAddress, uint256 totalReceived, uint256 supportersCount)",
  "function registerAsCreator(string name, string handle, string category, string description) returns (string creatorId)",
]

// Contract addresses (these would be the actual addresses on World Chain)
const BEANS_TOKEN_ADDRESS = "0x1234567890123456789012345678901234567890"
const BEANS_PLATFORM_ADDRESS = "0x0987654321098765432109876543210987654321"

// Connect to provider (in a real app, this would connect to World Chain)
const getProvider = () => {
  // In a real app, this would connect to the World Chain network
  // For now, we'll just return a mock provider
  return new ethers.JsonRpcProvider("https://worldchain-rpc.example.com")
}

// Get signer (in a real app, this would get the user's wallet)
const getSigner = async () => {
  const provider = getProvider()

  // In a real app, this would connect to the user's wallet
  // For now, we'll just return a mock signer
  return new ethers.Wallet("0xmockprivatekey", provider)
}

// Get BEANS token contract
const getBEANSTokenContract = async () => {
  const signer = await getSigner()
  return new ethers.Contract(BEANS_TOKEN_ADDRESS, BEANS_TOKEN_ABI, signer)
}

// Get Beans platform contract
const getBeansPlatformContract = async () => {
  const signer = await getSigner()
  return new ethers.Contract(BEANS_PLATFORM_ADDRESS, BEANS_PLATFORM_ABI, signer)
}

// Check DROPS balance
export const checkBEANSBalance = async (): Promise<number> => {
  try {
    const blgToken = await getBEANSTokenContract()
    const signer = await getSigner()
    const balance = await blgToken.balanceOf(await signer.getAddress())
    return Number(ethers.formatUnits(balance, 18))
  } catch (error) {
    console.error("Error checking DROPS balance:", error)
    // For demo purposes, return a mock balance
    return 100
  }
}

// Buy DROPS tokens with WLD
export const buyBEANSWithWLD = async (wldAmount: number): Promise<boolean> => {
  try {
    // In a real app, this would interact with a DEX or swap contract
    console.log(`Buying DROPS with ${wldAmount} WLD`)
    // Mock successful purchase
    return true
  } catch (error) {
    console.error("Error buying DROPS:", error)
    return false
  }
}

// Donate DROPS to creator
export const donateToCreator = async (
  creatorId: string,
  amount: number,
  message: string,
  isAnonymous: boolean,
): Promise<boolean> => {
  try {
    // In a real app, this would:
    // 1. Approve the Beans platform to spend DROPS tokens
    // 2. Call the donateToCreator function on the Beans platform contract

    console.log(`Donating ${amount} DROPS to creator ${creatorId}`)
    console.log(`Message: ${message}`)
    console.log(`Anonymous: ${isAnonymous}`)

    // Mock successful donation
    // Add a delay to simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return true
  } catch (error) {
    console.error("Error donating to creator:", error)
    throw error
  }
}

// Register as creator
export const registerAsCreator = async (
  name: string,
  handle: string,
  category: string,
  description: string,
): Promise<string> => {
  try {
    const beansPlatform = await getBeansPlatformContract()
    const tx = await beansPlatform.registerAsCreator(name, handle, category, description)
    await tx.wait()

    // In a real app, this would return the creator ID from the transaction receipt
    // For now, we'll just return a mock ID
    return "creator_" + Math.random().toString(36).substring(2, 10)
  } catch (error) {
    console.error("Error registering as creator:", error)
    throw error
  }
}

// Get creator info
export const getCreatorInfo = async (creatorId: string) => {
  try {
    const beansPlatform = await getBeansPlatformContract()
    const [walletAddress, totalReceived, supportersCount] = await beansPlatform.getCreatorInfo(creatorId)

    return {
      walletAddress,
      totalReceived: Number(ethers.formatUnits(totalReceived, 18)),
      supportersCount: Number(supportersCount),
    }
  } catch (error) {
    console.error("Error getting creator info:", error)
    // For demo purposes, return mock data
    return {
      walletAddress: "0x1234...5678",
      totalReceived: 8750,
      supportersCount: 1245,
    }
  }
}
````

## File: lib/utils.ts
````typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: public/images/banknote-custom.svg
````xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="24"
   height="24"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   stroke-width="2"
   stroke-linecap="round"
   stroke-linejoin="round"
   class="lucide lucide-banknote-icon lucide-banknote"
   version="1.1"
   id="svg7952"
   sodipodi:docname="banknote.svg"
   inkscape:version="1.1 (c4e8f9e, 2021-05-24)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs7956" />
  <sodipodi:namedview
     id="namedview7954"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     showgrid="false"
     showguides="true"
     inkscape:guide-bbox="true"
     inkscape:zoom="21.062088"
     inkscape:cx="12.463152"
     inkscape:cy="12.629327"
     inkscape:window-width="1384"
     inkscape:window-height="800"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="0"
     inkscape:current-layer="svg7952">
    <sodipodi:guide
       position="19.70365,25.661754"
       orientation="0,-1"
       id="guide8015" />
  </sodipodi:namedview>
  <rect
     width="20"
     height="12"
     x="2"
     y="6"
     rx="2"
     id="rect7946" />
  <path
     d="M6 12h.01M18 12h.01"
     id="path7950" />
  <text
     xml:space="preserve"
     style="font-size:40px;line-height:1.25;font-family:'a Big Deal';-inkscape-font-specification:'a Big Deal'"
     x="4.6920414"
     y="-8.0553637"
     id="text19025"><tspan
       sodipodi:role="line"
       id="tspan19023"
       x="4.6920414"
       y="-8.0553637" /></text>
  <g
     aria-label="D"
     id="text34926"
     style="font-size:10.6667px;line-height:1.25;font-family:'a Big Deal';-inkscape-font-specification:'a Big Deal'"
     transform="translate(0,-0.04747867)">
    <path
       d="m 8.0269266,15.374299 h 2.8848884 c 1.537341,0 2.685603,-0.427038 3.482743,-1.224179 0.711732,-0.711731 1.091322,-1.622749 1.091322,-2.619174 0,-0.80663 -0.227754,-1.451935 -0.721221,-1.9454026 C 14.261701,9.0825864 13.455071,8.7314647 12.164463,8.7314647 H 9.8110023 Z"
       style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra';stroke-width:1.77933"
       id="path43041"
       sodipodi:nodetypes="cssssscc" />
  </g>
</svg>
````

## File: public/images/dropsland-logo.svg
````xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!-- Created with Inkscape (http://www.inkscape.org/) -->

<svg
   width="210mm"
   height="297mm"
   viewBox="0 0 210 297"
   version="1.1"
   id="svg5"
   inkscape:version="1.1 (c4e8f9e, 2021-05-24)"
   sodipodi:docname="DROPSLAND LOGO 2025.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:document-units="mm"
     showgrid="false"
     inkscape:zoom="0.51491302"
     inkscape:cx="368.99436"
     inkscape:cy="704.97343"
     inkscape:window-width="1399"
     inkscape:window-height="800"
     inkscape:window-x="0"
     inkscape:window-y="25"
     inkscape:window-maximized="0"
     inkscape:current-layer="layer1" />
  <defs
     id="defs2">
    <rect
       x="149.53982"
       y="341.8053"
       width="543.78116"
       height="260.23813"
       id="rect2872" />
  </defs>
  <g
     inkscape:label="Capa 1"
     inkscape:groupmode="layer"
     id="layer1">
    <g
       aria-label="DROPSLAND"
       transform="scale(0.26458333)"
       id="text2870"
       style="font-size:74.6667px;line-height:1.25;font-family:'a Big Deal';-inkscape-font-specification:'a Big Deal';white-space:pre;shape-inside:url(#rect2872)">
      <path
         d="m 146.92573,412.3815 h 22.69868 c 12.096,0 21.13067,-3.36 27.40268,-9.632 5.6,-5.60001 8.58667,-12.76801 8.58667,-20.60801 0,-6.34667 -1.792,-11.42401 -5.67467,-15.30668 -3.95734,-3.95733 -10.30401,-6.72 -20.45868,-6.72 h -18.51734 z m 21.57867,-15.23201 5.82401,-21.80267 h 2.912 c 4.18133,0 6.79467,0.97066 8.43734,2.61333 1.344,1.344 2.16533,3.21067 2.16533,6.048 0,3.21067 -1.568,6.72001 -3.73333,8.88534 -2.68801,2.688 -7.24267,4.256 -12.54401,4.256 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7672" />
      <path
         d="m 202.63409,412.3815 h 17.47201 l 4.032,-14.93334 h 4.33067 l 5.824,14.93334 h 18.81601 l -7.24267,-17.39734 c 10.304,-3.21067 14.56,-10.22934 14.56,-18.36801 0,-4.10667 -1.19466,-7.98934 -4.10666,-10.90134 -3.50934,-3.50933 -9.63201,-5.6 -19.26401,-5.6 h -20.38401 z m 24.78934,-27.40268 2.76267,-10.22934 h 6.19734 c 2.464,0 4.18133,0.52267 5.152,1.49334 0.74667,0.74666 1.12,1.71733 1.12,2.76266 0,3.28534 -3.06134,5.97334 -8.88534,5.97334 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7674" />
      <path
         d="m 288.02713,413.42683 c 17.54667,0 30.76268,-14.48534 30.76268,-30.68801 0,-13.36534 -10.60267,-23.66935 -25.98401,-23.66935 -17.54668,0 -30.76269,14.48534 -30.76269,30.68802 0,13.36534 10.60268,23.66934 25.98402,23.66934 z m 1.19466,-15.38134 c -6.272,0 -9.632,-4.33067 -9.632,-9.856 0,-6.57067 4.704,-13.73867 12.02134,-13.73867 6.272,0 9.632,4.33066 9.632,9.856 0,6.57067 -4.704,13.73867 -12.02134,13.73867 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7676" />
      <path
         d="m 315.94663,412.3815 h 17.47201 l 3.808,-14.18667 h 7.39201 c 16.576,0 26.43201,-8.73601 26.43201,-21.80268 0,-4.10667 -1.344,-7.76534 -4.10667,-10.52801 -3.88267,-3.88266 -9.78134,-5.74933 -19.41334,-5.74933 h -17.54668 z m 24.64001,-26.65601 3.06134,-11.64801 h 3.28533 c 1.94134,0 4.03201,0.448 5.22667,1.64267 0.82134,0.82133 1.26934,1.94133 1.26934,3.06133 0,3.95734 -3.06134,6.94401 -9.70667,6.94401 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7678" />
      <path
         d="m 390.77784,413.42683 c 15.008,0 23.66934,-8.21333 23.66934,-18.74134 0,-7.98934 -5.67467,-11.72267 -14.56001,-15.00801 -7.24267,-2.688 -8.36267,-2.98666 -8.36267,-4.55466 0,-1.49334 1.568,-2.09067 3.80801,-2.09067 5.52533,0 11.12533,2.61333 15.08267,5.824 l 10.00534,-11.94667 c -5.67467,-4.85334 -13.96268,-7.84001 -23.29601,-7.84001 -14.26134,0 -23.52001,8.21334 -23.52001,18.29335 0,7.69067 4.55466,11.12534 14.26134,14.70934 7.616,2.83733 8.58667,3.36 8.58667,5.00267 0,1.49333 -1.568,2.31466 -3.80801,2.31466 -5.52533,0 -11.648,-2.38933 -17.62134,-7.392 l -10.00534,11.94667 c 6.34667,5.74934 15.38135,9.48267 25.76002,9.48267 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7680" />
      <path
         d="m 413.80085,412.3815 h 41.29069 l 4.032,-14.93334 h -23.81868 l 10.00534,-37.33335 h -17.47201 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7682" />
      <path
         d="m 455.19421,412.3815 h 19.04001 l 4.55467,-7.01867 h 18.29334 l 0.896,7.01867 h 18.59201 l -7.91467,-52.64002 H 491.3329 Z m 31.36002,-19.41334 8.13867,-12.69334 1.41866,12.69334 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7684" />
      <path
         d="m 517.78007,412.3815 h 17.32267 l 7.01867,-25.98401 12.39468,25.98401 h 15.53067 l 14.03734,-52.26669 h -17.32268 l -6.72,24.93868 -11.872,-24.93868 h -16.35201 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7686" />
      <path
         d="m 575.67594,412.3815 h 22.69868 c 12.096,0 21.13068,-3.36 27.40268,-9.632 5.6,-5.60001 8.58667,-12.76801 8.58667,-20.60801 0,-6.34667 -1.792,-11.42401 -5.67467,-15.30668 -3.95734,-3.95733 -10.304,-6.72 -20.45868,-6.72 h -18.51734 z m 21.57868,-15.23201 5.824,-21.80267 h 2.912 c 4.18134,0 6.79467,0.97066 8.43734,2.61333 1.344,1.344 2.16533,3.21067 2.16533,6.048 0,3.21067 -1.568,6.72001 -3.73333,8.88534 -2.688,2.688 -7.24267,4.256 -12.54401,4.256 z"
         style="font-family:'Gotham Ultra';-inkscape-font-specification:'Gotham Ultra'"
         id="path7688" />
    </g>
  </g>
</svg>
````

## File: public/images/verified-badge.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<path d="M 49.66 1.125 L 49.66 1.125 c 4.67 -2.393 10.394 -0.859 13.243 3.548 l 0 0 c 1.784 2.761 4.788 4.495 8.071 4.66 l 0 0 c 5.241 0.263 9.431 4.453 9.694 9.694 v 0 c 0.165 3.283 1.899 6.286 4.66 8.071 l 0 0 c 4.407 2.848 5.941 8.572 3.548 13.242 l 0 0 c -1.499 2.926 -1.499 6.394 0 9.319 l 0 0 c 2.393 4.67 0.859 10.394 -3.548 13.242 l 0 0 c -2.761 1.784 -4.495 4.788 -4.66 8.071 v 0 c -0.263 5.241 -4.453 9.431 -9.694 9.694 h 0 c -3.283 0.165 -6.286 1.899 -8.071 4.66 l 0 0 c -2.848 4.407 -8.572 5.941 -13.242 3.548 l 0 0 c -2.926 -1.499 -6.394 -1.499 -9.319 0 l 0 0 c -4.67 2.393 -10.394 0.859 -13.242 -3.548 l 0 0 c -1.784 -2.761 -4.788 -4.495 -8.071 -4.66 h 0 c -5.241 -0.263 -9.431 -4.453 -9.694 -9.694 l 0 0 c -0.165 -3.283 -1.899 -6.286 -4.66 -8.071 l 0 0 C 0.266 60.054 -1.267 54.33 1.125 49.66 l 0 0 c 1.499 -2.926 1.499 -6.394 0 -9.319 l 0 0 c -2.393 -4.67 -0.859 -10.394 3.548 -13.242 l 0 0 c 2.761 -1.784 4.495 -4.788 4.66 -8.071 l 0 0 c 0.263 -5.241 4.453 -9.431 9.694 -9.694 l 0 0 c 3.283 -0.165 6.286 -1.899 8.071 -4.66 l 0 0 c 2.848 -4.407 8.572 -5.941 13.242 -3.548 l 0 0 C 43.266 2.624 46.734 2.624 49.66 1.125 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,131,249); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
	<polygon points="36.94,66.3 36.94,66.3 36.94,46.9 36.94,46.9 62.8,35.34 72.5,45.04 " style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,119,227); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
	<polygon points="36.94,66.3 17.5,46.87 27.2,37.16 36.94,46.9 60.11,23.7 69.81,33.39 " style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(255,255,255); fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
</g>
</svg>
````

## File: styles/globals.css
````css
@import "tailwindcss";
@import "tw-animate-css";

body {
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@theme inline {
  /* optional: --font-sans, --font-serif, --font-mono if they are applied in the layout.tsx */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar-background);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules

# next.js
/.next/
/out/

# production
/build

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# hardhat
artifacts/
cache/
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
````

## File: next.config.mjs
````javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
````

## File: postcss.config.mjs
````javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
````

## File: components/ui/button.tsx
````typescript
import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-black shadow-sm hover:shadow-md font-semibold",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground border-black",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
````

## File: components/ui/select.tsx
````typescript
'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
````

## File: components/upload-view.tsx
````typescript
"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Music, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UploadView() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [artworkFile, setArtworkFile] = useState<File | null>(null)
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [trackName, setTrackName] = useState("")
  const [artistName, setArtistName] = useState("")
  const [genre, setGenre] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const audioFile = files.find((f) => f.type.startsWith("audio/"))

    if (audioFile) {
      setAudioFile(audioFile)
    }
  }, [])

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArtworkFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setArtworkPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (!audioFile || !trackName || !artistName || !genre) {
      alert("Please fill in all required fields and select an audio file")
      return
    }

    alert(`Track "${trackName}" by ${artistName} uploaded successfully!`)
    // Reset form
    setAudioFile(null)
    setArtworkFile(null)
    setArtworkPreview(null)
    setTrackName("")
    setArtistName("")
    setGenre("")
  }

  const removeAudio = () => {
    setAudioFile(null)
  }

  const removeArtwork = () => {
    setArtworkFile(null)
    setArtworkPreview(null)
  }

  return (
    <div className="pb-6 bg-white h-full overflow-y-auto">
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl text-[#1E1E1E] border-b border-gray-200">
        <h1 className="text-xl font-bold mb-1">Upload</h1>
        <p className="text-sm opacity-90">Share your music with the world</p>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Audio File Drag & Drop */}
        <div>
          <Label className="text-[#1E1E1E] text-sm mb-2 block">Audio File *</Label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-[#1FA9D6] bg-[#1FA9D6]/10" : "border-[#3A3A3A]/30 bg-[#3A3A3A]/5"
            }`}
          >
            {!audioFile ? (
              <>
                <Music className="h-12 w-12 mx-auto mb-3 text-[#3A3A3A]" />
                <p className="text-[#1E1E1E] mb-2">Drag & drop your audio file here</p>
                <p className="text-sm text-[#3A3A3A] mb-4">or</p>
                <label htmlFor="audio-input">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-medium"
                    onClick={() => document.getElementById("audio-input")?.click()}
                  >
                    Browse Files
                  </Button>
                </label>
                <input id="audio-input" type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                <p className="text-xs text-[#3A3A3A] mt-3">MP3, WAV, FLAC up to 200MB</p>
              </>
            ) : (
              <div className="flex items-center justify-between bg-[#3A3A3A]/10 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="h-8 w-8 text-[#1FA9D6]" />
                  <div className="text-left">
                    <p className="text-[#1E1E1E] font-medium text-sm">{audioFile.name}</p>
                    <p className="text-xs text-[#3A3A3A]">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={removeAudio}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Artwork Upload */}
        <div>
          <Label className="text-[#1E1E1E] text-sm mb-2 block">Artwork</Label>
          {!artworkPreview ? (
            <label htmlFor="artwork-input">
              <div className="border-2 border-dashed border-[#3A3A3A]/30 bg-[#3A3A3A]/5 rounded-lg p-6 text-center cursor-pointer hover:border-[#1FA9D6] transition-colors">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-[#3A3A3A]" />
                <p className="text-[#1E1E1E] text-sm mb-1">Upload cover art</p>
                <p className="text-xs text-[#3A3A3A]">JPG, PNG up to 10MB (Square recommended)</p>
              </div>
              <input
                id="artwork-input"
                type="file"
                accept="image/*"
                onChange={handleArtworkChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={artworkPreview || "/placeholder.svg"}
                alt="Artwork preview"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={removeArtwork}
                className="absolute top-2 right-2 bg-white/80 text-gray-900 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Track Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="track-name" className="text-[#1E1E1E] text-sm mb-2 block">
              Track Name *
            </Label>
            <Input
              id="track-name"
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="Enter track name"
              className="bg-white border-[#3A3A3A]/30 text-[#1E1E1E] placeholder:text-[#3A3A3A] focus:border-[#1FA9D6]"
            />
          </div>

          <div>
            <Label htmlFor="artist-name" className="text-[#1E1E1E] text-sm mb-2 block">
              Artist Name *
            </Label>
            <Input
              id="artist-name"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Enter artist name"
              className="bg-white border-[#3A3A3A]/30 text-[#1E1E1E] placeholder:text-[#3A3A3A] focus:border-[#1FA9D6]"
            />
          </div>

          <div>
            <Label htmlFor="genre" className="text-[#1E1E1E] text-sm mb-2 block">
              Genre *
            </Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-white border-[#3A3A3A]/30 text-[#1E1E1E]">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="techno">Techno</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="tech-house">Tech House</SelectItem>
                <SelectItem value="dubstep">Dubstep</SelectItem>
                <SelectItem value="riddim">Riddim</SelectItem>
                <SelectItem value="trap">Trap</SelectItem>
                <SelectItem value="dnb">Drum & Bass</SelectItem>
                <SelectItem value="electro">Electro</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!audioFile || !trackName || !artistName || !genre}
          className="w-full bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed py-6 text-lg font-semibold"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Track
        </Button>
      </div>
    </div>
  )
}
````

## File: README.md
````markdown
# Dropsland 💧

> **Dropsland is a Web3-native application that connects music content, live events, and real-world access using NFTs as verifiable ownership and redemption primitives.**

The current application focuses on:
* A lightweight **Explore / Reels** experience for DJs and events.
* **Event-linked NFTs** that can be redeemed for merch, food, beverages, and access at Dropsland-organized IRL events.

Over time, Dropsland evolves into a broader access and ownership layer for music communities.

---

## The Problem 🚨

Live music and DJ events generate strong engagement, but the value created during those moments disappears immediately after the event.

*   **Fans** leave with tickets and memories, but no reusable digital ownership.
*   **DJs and organizers** lack a direct, persistent channel to engage attendees.
*   **Event perks** (merch, drinks, access) are managed with fragile, manual systems.

There is no native way to connect **event attendance**, **digital identity**, and **real-world utility** in a single system.

---

## What Dropsland Does Today 🚀

Dropsland introduces a **tokenized event layer** where:
*   DJs and organizers publish content through a simple Explore / Reels interface.
*   Attendees receive **NFTs linked to specific events or rewards**.
*   These NFTs act as **verifiable access and redemption assets** at IRL events.

**Ownership is on-chain.**
**Usage and redemption are handled through a fast off-chain system designed for real-world environments.**

---

## Core Application Components 🧩

### 1. Explore & Reels Layer
A lightweight content discovery layer where:
*   DJs and events are surfaced visually.
*   Content acts as an entry point to upcoming events and rewards.
*   No social graph or engagement farming in the MVP.

*This layer is intentionally simple and optimized for mobile usage at events.*

### 2. Event & Merch NFTs
NFTs represent **entitlements**, not speculative assets. Each NFT can correspond to:
*   A merch item 👕
*   A food or beverage 🍹
*   VIP or restricted access 🎟️
*   A collectible proof of attendance 🏅

NFT ownership is used to:
*   Verify eligibility.
*   Unlock redemption.
*   Provide post-event digital ownership.

*NFTs are not spent by default; redemption state is tracked off-chain for speed and reliability during events.*

### 3. IRL Redemption Flow
At events:
1.  Users open the Dropsland app and display their NFT.
2.  A QR code or wallet proof is scanned by staff.
3.  The backend verifies ownership and redemption status.
4.  The perk is delivered.

*This design avoids on-chain transactions at the point of sale, ensuring fast throughput and low friction.*

---

## Technical Architecture 🏗️

### On-Chain Layer
Responsible for **ownership and verifiability**:
*   **Event NFT Contracts**: Mint NFTs tied to specific events or rewards (Standard NFT interfaces).
*   **Optional DJ Token Contracts (future layer)**: Membership or access tokens.

*The blockchain is used strictly as a source of truth for asset ownership.*

### Off-Chain Layer
Responsible for **UX, performance, and operations**:
*   Event and reward metadata.
*   Content indexing for Explore / Reels.
*   Ownership caching and indexing.
*   Redemption tracking (per NFT, per event).
*   Staff authentication and scanning tools.

*This layer enables fast event operations, manual overrides, and analytics.*

### Access & Verification Model
*   Ownership checks are performed via indexers or RPC calls.
*   Redemption eligibility is enforced by the backend.
*   QR codes are short-lived and session-bound to prevent abuse.

*This hybrid model balances decentralization with real-world usability.*

---

## Vision 🔮

Dropsland is designed to evolve incrementally. Future layers may include:
*   DJ membership tokens.
*   Token-gated digital content.
*   Recurring fan access.
*   Advanced event economics.

All future functionality builds on the same primitives introduced in the MVP: **verifiable ownership, composable access, and real-world utility**.

---

# Dropsland Application Structure 📱

Dropsland is a mobile-first application organized around **five core sections**, accessible through a persistent bottom navigation dock.

The structure is designed to support two primary use cases:
1.  **Discovery and engagement** around DJs and events.
2.  **Ownership and redemption** of digital assets at real-world events.

### Bottom Navigation Layout
```
[ Reels ]  [ Explore ]  [ Wallet ]  [ Activity ]  [ Profile ]
```

Each section owns a specific part of the user journey and does not overlap responsibilities with the others.

---

## 1. Reels (Home) 🎥
**Purpose**: The primary entry point, designed for passive discovery and event promotion.

**Responsibilities**:
*   Surface short-form DJ and event content.
*   Highlight upcoming Dropsland events and activations.
*   Drive interest/traffic toward events and rewards.

**Key Characteristics**: Scroll-based, mobile-optimized, visual.

---

## 2. Explore 🧭
**Purpose**: Supports intentional discovery of DJs, events, and collections.

**Responsibilities**:
*   Browse DJs, events, and past Dropsland activations.
*   Search and filter by location, date, or category.
*   Act as a directory for the ecosystem.

**Key Characteristics**: Structured, searchable, filter-based.

---

## 3. Create (Music / Posts) ➕
**Purpose**: Reserved for creators and organizers to publish content.

**Responsibilities**:
*   Upload music clips or videos.
*   Publish posts or announcements.
*   Link content to events or NFTs.

**Key Characteristics**: Creator-only functionality.

---

## 4. Wallet 💼
**Purpose**: The core **ownership and utility hub**. "My Passes & Rewards".

**Structure**:
```
[ Events ]  [ Rewards ]  [ Creator Coins ]
```

*   **Events**: Event access NFTs, attendance passes.
*   **Rewards**: Merch NFTs, F&B entitlements. *Redemption logic is optimized for speed.*
*   **Creator Coins**: DJ creator tokens (viewing held assets).

**Key Principles**: Asset-based UI, no technical jargon, optimized for fast access.

---

## 5. Profile 👤
**Purpose**: Represents the user’s identity and history.

**Responsibilities**:
*   Display user info.
*   Show past events and collected assets.
*   Manage preferences.

---

## Navigation & User Flow Design 🗺️

**Event Attendee Flow**:
`Reels → Event → Claim NFT → Wallet → Show QR → Redeem`

**Explorer / Fan Flow**:
`Explore → DJ or Event → Follow / Save`

**Creator Flow**:
`Create → Upload Content → Link to Event or Reward`

---

## Design Philosophy 🎨
*   Event-first, mobile-first.
*   Ownership over speculation.
*   Minimal on-chain logic, maximum real-world usability.
*   Clear separation of concerns per section.
````

## File: app/page.tsx
````typescript
"use client"
import MainApp from "@/components/main-app"
import { useAuth } from "@/hooks/use-auth"
import { useEffect } from "react"

export default function BeansApp() {
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      login("juampi") // Uses the iamjuampi profile from USER_DATA
    }
  }, [isAuthenticated, login])

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-50 overflow-hidden">
      <MainApp />
    </div>
  )
}
````

## File: components/explore-screen.tsx
````typescript
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
````

## File: package.json
````json
{
  "name": "my-v0-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "next lint",
    "start": "next start"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-alert-dialog": "1.1.4",
    "@radix-ui/react-aspect-ratio": "1.1.1",
    "@radix-ui/react-avatar": "latest",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-collapsible": "1.1.2",
    "@radix-ui/react-context-menu": "2.2.4",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-hover-card": "1.1.4",
    "@radix-ui/react-label": "latest",
    "@radix-ui/react-menubar": "1.1.4",
    "@radix-ui/react-navigation-menu": "1.2.3",
    "@radix-ui/react-popover": "1.1.4",
    "@radix-ui/react-progress": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.2",
    "@radix-ui/react-scroll-area": "1.2.2",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slider": "latest",
    "@radix-ui/react-slot": "latest",
    "@radix-ui/react-switch": "1.1.2",
    "@radix-ui/react-tabs": "latest",
    "@radix-ui/react-toast": "latest",
    "@radix-ui/react-toggle": "1.1.1",
    "@radix-ui/react-toggle-group": "1.1.1",
    "@radix-ui/react-tooltip": "latest",
    "@vercel/analytics": "1.3.1",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "4.1.0",
    "embla-carousel-react": "8.5.1",
    "ethers": "latest",
    "geist": "^1.3.1",
    "input-otp": "1.4.1",
    "lucide-react": "^0.454.0",
    "next": "15.2.8",
    "next-themes": "latest",
    "react": "^19",
    "react-day-picker": "9.8.0",
    "react-dom": "^19",
    "react-hook-form": "^7.60.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "3.25.76"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-ignition": "^3.0.6",
    "@nomicfoundation/hardhat-toolbox-viem": "^5.0.1",
    "@tailwindcss/postcss": "^4.1.9",
    "@types/node": "^22.19.3",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "forge-std": "github:foundry-rs/forge-std#v1.9.4",
    "hardhat": "^3.1.0",
    "postcss": "^8.5",
    "tailwindcss": "^4.1.9",
    "tw-animate-css": "1.3.3",
    "typescript": "^5.8.3",
    "viem": "^2.43.1"
  },
  "type": "module"
}
````

## File: components/wallet-view.tsx
````typescript
"use client"

import { TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

export default function WalletView() {
  const { balance, donated } = useAuth()

  const handleBuy = () => {
    alert("Buy tokens feature coming soon!")
  }

  const handleSend = () => {
    alert("Send tokens feature coming soon!")
  }

  const handleReceive = () => {
    alert("Receive tokens feature coming soon!")
  }

  return (
    <div className="pb-6 bg-white h-full overflow-y-auto">
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl text-[#1E1E1E] border-b border-gray-200">
        <h1 className="text-xl font-bold mb-2">Wallet</h1>
        <h2 className="text-sm font-medium opacity-90">Your Balance</h2>
        <div className="flex items-center mt-1">
          <span className="text-2xl font-bold">{balance} $DROPS</span>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="border-black bg-transparent text-black hover:bg-[#1FA9D6] hover:text-white active:bg-[#1FA9D6] active:text-white"
            onClick={handleReceive}
          >
            Receive
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-black text-black bg-transparent hover:bg-[#1FA9D6] hover:text-white active:bg-[#1FA9D6] active:text-white"
            onClick={handleBuy}
          >
            Buy
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="border-black text-black bg-transparent hover:bg-[#1FA9D6] hover:text-white active:bg-[#1FA9D6] active:text-white"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 px-4 mt-4">
        <Card className="bg-[#3A3A3A]/10 shadow-sm border-[#3A3A3A]/20">
          <CardContent className="p-3">
            <div className="flex flex-col items-center">
              <BanknoteIcon className="h-6 w-6 text-[#1FA9D6] mb-1" />
              <p className="text-xs text-[#3A3A3A]">Purchased</p>
              <p className="font-semibold text-[#1E1E1E]">{donated} $DROPS</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#3A3A3A]/10 shadow-sm border-[#3A3A3A]/20">
          <CardContent className="p-3">
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6 text-[#1FA9D6] mb-1" />
              <p className="text-xs text-[#3A3A3A]">Artists</p>
              <p className="font-semibold text-[#1E1E1E]">8</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#3A3A3A]/10 shadow-sm border-[#3A3A3A]/20">
          <CardContent className="p-3">
            <div className="flex flex-col items-center">
              <TrendingUp className="h-6 w-6 text-[#1FA9D6] mb-1" />
              <p className="text-xs text-[#3A3A3A]">Value</p>
              <p className="font-semibold text-[#1E1E1E]">$1.00</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Artist Tokens */}
      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-3 text-[#1E1E1E]">Artist Tokens</h2>
        <div className="space-y-3">
          {artistTokens.map((token) => (
            <Card key={token.id} className="bg-[#3A3A3A]/10 shadow-sm border-[#3A3A3A]/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={token.avatar || "/placeholder.svg"} alt={token.name} />
                    <AvatarFallback>{token.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[#1E1E1E]">${token.symbol}</p>
                      <div className="flex items-center text-[#1FA9D6] font-medium">
                        <BanknoteIcon className="h-5 w-5 mr-1" />
                        <span>{token.amount}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#3A3A3A]">{token.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-[#3A3A3A]">Current value: ${token.value}</p>
                      <p className="text-xs text-[#1FA9D6]">+{token.change}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {artistTokens.length === 0 && (
            <div className="text-center py-6 bg-[#3A3A3A]/10 rounded-lg border border-[#3A3A3A]/20">
              <p className="text-[#1E1E1E]">No tienes tokens de artistas aún</p>
              <p className="text-[#3A3A3A] text-sm mt-1">
                Compra tokens para apoyar a tus artistas favoritos y recibir recompensas exclusivas
              </p>
              <Button className="mt-3 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-medium">
                Explorar Artistas
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold mb-3 text-[#1E1E1E]">Transaction History</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="bg-[#3A3A3A]/10 shadow-sm border-[#3A3A3A]/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === "sent" ? "bg-[#3A3A3A]/20" : "bg-[#1FA9D6]/20"
                    }`}
                  >
                    <BanknoteIcon
                      className={`h-5 w-5 ${transaction.type === "sent" ? "text-[#3A3A3A]" : "text-[#1FA9D6]"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[#1E1E1E]">{transaction.description}</p>
                      <p className={`font-medium ${transaction.type === "sent" ? "text-[#3A3A3A]" : "text-[#1FA9D6]"}`}>
                        {transaction.type === "sent" ? "-" : "+"}
                        {transaction.amount} $DROPS
                      </p>
                    </div>
                    <p className="text-xs text-[#3A3A3A]">{transaction.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Artist tokens data
const artistTokens = [
  {
    id: "1",
    name: "Banger",
    symbol: "BANGER",
    avatar: "/avatars/banger.jpg",
    amount: 15,
    value: "6.75",
    change: "2.3",
  },
  {
    id: "2",
    name: "Nicola Marti",
    symbol: "NICOLA",
    avatar: "/avatars/nicola.jpg",
    amount: 10,
    value: "4.50",
    change: "1.8",
  },
  {
    id: "3",
    name: "AXS",
    symbol: "AXS",
    avatar: "/avatars/axs.jpg",
    amount: 25,
    value: "11.25",
    change: "3.5",
  },
  {
    id: "4",
    name: "FLUSH",
    symbol: "FLUSH",
    avatar: "/avatars/flush.jpg",
    amount: 5,
    value: "2.25",
    change: "0.9",
  },
]

// Sample transaction data
const transactions = [
  {
    id: "1",
    type: "sent",
    description: "Sent to banger",
    amount: 15,
    date: "Mar 15, 2025",
  },
  {
    id: "2",
    type: "received",
    description: "Received from AXS",
    amount: 10,
    date: "Mar 12, 2025",
  },
  {
    id: "3",
    type: "sent",
    description: "Sent to Nicola Marti",
    amount: 25,
    date: "Mar 10, 2025",
  },
  {
    id: "4",
    type: "received",
    description: "Purchased",
    amount: 50,
    date: "Mar 5, 2025",
  },
  {
    id: "5",
    type: "sent",
    description: "Sent to FLUSH",
    amount: 5,
    date: "Mar 1, 2025",
  },
]
````

## File: components/profile-view.tsx
````typescript
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
    bio: isArtist() ? "iamjuampi is a DJ, producer, and founder." : "Music enthusiast and electronic music fan.",
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
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-white">
      <div className="relative h-40">
        {coverSrc && <img src={coverSrc || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50" />
      </div>

      <div className="px-4 pb-20">
        <div className="flex justify-center -mt-16 mb-4">
          <Avatar className="w-28 h-28 border-4 border-white ring-2 ring-[#1FA9D6]/30">
            <AvatarImage src={avatarSrc || undefined} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-[#1FA9D6] to-[#1FA9D6]/80 text-white text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="text-center mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <h1 className="text-2xl font-bold text-[#1E1E1E] break-words max-w-full">{userProfile.name}</h1>
            {userProfile.isVerified && <Star className="h-5 w-5 text-[#1FA9D6] fill-[#1FA9D6] flex-shrink-0" />}
          </div>
          <p className="text-[#3A3A3A] text-base mb-3 break-words">@{userProfile.handle}</p>
          <div className="flex items-center gap-2 justify-center flex-wrap mb-4">
            <Badge variant="outline" className="bg-[#3A3A3A]/10 text-[#1E1E1E] border-[#3A3A3A]/30 text-xs">
              {userProfile.category}
            </Badge>
            <span className="text-xs text-[#3A3A3A]">Member since {userProfile.memberSince}</span>
          </div>

          {isEditingBio ? (
            <div className="space-y-2 max-w-full">
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="bg-[#3A3A3A]/5 border-[#3A3A3A]/30 text-[#1E1E1E] w-full text-sm"
                rows={3}
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSaveBio}
                  className="bg-[#1FA9D6] px-4 py-1.5 rounded-full text-white text-xs hover:bg-[#1FA9D6]/90 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="bg-[#3A3A3A]/10 px-4 py-1.5 rounded-full border border-[#3A3A3A]/30 text-[#1E1E1E] text-xs hover:bg-[#3A3A3A]/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[#3A3A3A] text-sm leading-relaxed break-words max-w-full mb-2">{userProfile.bio}</p>
              <button
                onClick={handleEditBio}
                className="bg-[#3A3A3A]/10 px-3 py-1.5 rounded-full border border-[#3A3A3A]/30 text-[#1E1E1E] text-xs hover:bg-[#3A3A3A]/20 inline-flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" />
                Edit Bio
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 mb-4 border-y border-gray-200">
          <div className="text-center">
            <p className="text-xl font-bold text-[#1E1E1E]">{balance}</p>
            <p className="text-xs text-[#3A3A3A]">Balance</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#1E1E1E]">{donated}</p>
            <p className="text-xs text-[#3A3A3A]">Purchased</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#1E1E1E]">8</p>
            <p className="text-xs text-[#3A3A3A]">Artists</p>
          </div>
        </div>

        <Tabs defaultValue={isArtist() ? "posts" : "artists"} className="w-full">
          <TabsList className="w-full bg-transparent h-auto p-0 gap-4 border-b border-gray-200 justify-start">
            {isArtist() ? (
              <>
                <TabsTrigger
                  value="posts"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-[#1FA9D6] rounded-none pb-3 text-[#3A3A3A] data-[state=active]:text-[#1FA9D6] text-sm font-medium"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="rewards"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-[#1FA9D6] rounded-none pb-3 text-[#3A3A3A] data-[state=active]:text-[#1FA9D6] text-sm font-medium"
                >
                  Rewards
                </TabsTrigger>
                <TabsTrigger
                  value="certs"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-[#1FA9D6] rounded-none pb-3 text-[#3A3A3A] data-[state=active]:text-[#1FA9D6] text-sm font-medium"
                >
                  Certs
                </TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger
                  value="artists"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-[#1FA9D6] rounded-none pb-3 text-[#3A3A3A] data-[state=active]:text-[#1FA9D6] text-sm font-medium"
                >
                  Following
                </TabsTrigger>
                <TabsTrigger
                  value="rewards"
                  className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-[#1FA9D6] rounded-none pb-3 text-[#3A3A3A] data-[state=active]:text-[#1FA9D6] text-sm font-medium"
                >
                  Rewards
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            <div className="bg-[#3A3A3A]/10 rounded-lg p-3 border border-[#3A3A3A]/20">
              <div className="flex items-start gap-2 mb-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={avatarSrc || "/placeholder.svg"} />
                  <AvatarFallback>{userProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-semibold text-sm text-[#1E1E1E] truncate">{userProfile.name}</span>
                    {userProfile.isVerified && <Star className="h-3 w-3 text-[#1FA9D6] fill-[#1FA9D6] flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[#3A3A3A]">2h ago</p>
                </div>
              </div>
              <p className="text-[#1E1E1E] text-sm break-words mb-2">New EP out now! #NewRelease</p>
              <div className="flex items-center gap-4 text-[#3A3A3A]">
                <button className="flex items-center gap-1 hover:text-[#1FA9D6] text-xs">
                  <Heart className="w-4 h-4" />
                  <span>124</span>
                </button>
                <button className="flex items-center gap-1 hover:text-[#1FA9D6] text-xs">
                  <MessageCircle className="w-4 h-4" />
                  <span>32</span>
                </button>
                <button className="hover:text-[#1FA9D6]">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="artists" className="mt-4">
            <Card className="bg-[#3A3A3A]/10 border-[#3A3A3A]/20">
              <CardContent className="p-6 text-center">
                <p className="text-[#1E1E1E] text-sm">Welcome to your feed.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <Card className="bg-[#3A3A3A]/10 border-[#3A3A3A]/20">
              <CardContent className="p-6 text-center">
                <p className="text-[#1E1E1E] text-sm">Your rewards will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certs" className="mt-4">
            <Card className="bg-[#3A3A3A]/10 border-[#3A3A3A]/20">
              <CardContent className="p-6 text-center">
                <p className="text-[#1E1E1E] text-sm">Your certifications will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-[#1E1E1E]">Settings</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start bg-[#3A3A3A]/10 text-[#1E1E1E] border-[#3A3A3A]/30 h-12 hover:bg-[#3A3A3A]/20"
              >
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-[#1E1E1E] border-[#3A3A3A]/30">
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#3A3A3A]/10 border-[#3A3A3A]/30 h-10 hover:bg-[#3A3A3A]/20"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#3A3A3A]/10 border-[#3A3A3A]/30 h-10 hover:bg-[#3A3A3A]/20"
                >
                  <Banknote className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-[#3A3A3A]/10 border-[#3A3A3A]/30 h-10 hover:bg-[#3A3A3A]/20"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {!isArtist() && (
            <Card className="bg-[#1FA9D6]/10 border-[#1FA9D6]/30 mt-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Lock className="h-5 w-5 text-[#1FA9D6] flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-[#1E1E1E] font-medium text-sm">Become an Artist</h3>
                      <p className="text-xs text-[#3A3A3A] truncate">Apply to become verified</p>
                    </div>
                  </div>
                  <Button className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-medium h-9 px-4 flex-shrink-0 text-sm">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-white text-[#1E1E1E] border-[#3A3A3A]/30">
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
                  <div className="flex-1 bg-gray-100 p-2 rounded-lg min-w-0">
                    <p className="text-xs font-medium truncate text-gray-900">{comment.author}</p>
                    <p className="text-xs text-gray-700 break-words">{comment.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-6 text-sm">No comments yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              className="bg-gray-50 border-gray-300 text-gray-900 text-sm"
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
              className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white flex-shrink-0"
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
````

## File: components/activity-view.tsx
````typescript
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ActivityViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function ActivityView({ onSelectArtist }: ActivityViewProps) {
  const { userData, isArtist } = useAuth()

  const handleSelectArtist = (artistId: string) => {
    console.log("Activity view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  const filteredActivity = allActivity.filter((activity) => {
    if (isArtist()) {
      return activity.relatedTo === "artist"
    } else {
      return activity.relatedTo === "fan"
    }
  })

  return (
    <div className="w-full max-w-full bg-white h-full overflow-y-auto overflow-x-hidden">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-4 pt-12 pb-3">
        <h1 className="text-xl font-bold text-[#1E1E1E]">Activity</h1>
      </div>

      {filteredActivity.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {filteredActivity.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onSelectArtist={handleSelectArtist} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">
              {isArtist()
                ? "Interactions with your followers will appear here"
                : "Updates from artists you follow will appear here"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityCard({
  activity,
  onSelectArtist,
}: {
  activity: Activity
  onSelectArtist: (artistId: string) => void
}) {
  return (
    <div className="px-4 py-3 hover:bg-[#3A3A3A]/5 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar
          className="h-11 w-11 cursor-pointer flex-shrink-0 ring-1 ring-[#3A3A3A]/20"
          onClick={() => onSelectArtist(activity.artistId)}
        >
          <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
          <AvatarFallback className="bg-[#3A3A3A]/10 text-[#1E1E1E]">
            {activity.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-semibold text-[#1E1E1E] hover:text-[#1FA9D6] cursor-pointer text-sm"
              onClick={() => onSelectArtist(activity.artistId)}
            >
              {activity.name}
            </span>
            <span className="text-[#3A3A3A] text-sm">{activity.action}</span>
            {activity.type === "purchase" && activity.amount && (
              <div className="flex items-center text-[#1FA9D6] text-sm font-semibold ml-1">
                <BanknoteIcon className="h-3.5 w-3.5 mr-0.5" />
                <span>
                  {activity.amount} ${activity.tokenName}
                </span>
              </div>
            )}
          </div>

          {activity.message && (
            <p className="text-[#3A3A3A] text-sm mt-1 leading-relaxed break-words">{activity.message}</p>
          )}

          <p className="text-[#3A3A3A]/70 text-xs mt-1.5">{activity.time}</p>
        </div>

        {/* Optional action icon for different types */}
        {activity.type === "purchase" && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1FA9D6]/10 flex items-center justify-center">
            <BanknoteIcon className="h-4 w-4 text-[#1FA9D6]" />
          </div>
        )}
      </div>
    </div>
  )
}

// Actualizar la interfaz Activity para incluir el campo relatedTo
interface Activity {
  id: string
  type: "purchase" | "mention" | "reward" | "follow"
  name: string
  avatar: string
  action: string
  message?: string
  amount?: number
  time: string
  artistId: string
  tokenName: string
  relatedTo: "artist" | "fan" // Indica si la actividad es relevante para artistas o fans
}

// Actividades con artistas reales y tokens personalizados
const allActivity: Activity[] = [
  {
    id: "a1",
    type: "purchase",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    action: "bought your tokens",
    message: "Love your latest track!",
    amount: 15,
    time: "5 minutos atrás",
    artistId: "banger",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  {
    id: "a2",
    type: "mention",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    action: "mentioned you in a comment",
    message: "@iamjuampi could have ideas for this remix.",
    time: "15 minutos atrás",
    artistId: "nicolamarti",
    tokenName: "NICOLA",
    relatedTo: "artist",
  },
  {
    id: "a3",
    type: "purchase",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    action: "bought your tokens",
    amount: 25,
    time: "30 minutos atrás",
    artistId: "axs",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  {
    id: "a4",
    type: "reward",
    name: "Drops",
    avatar: "/avatars/dropsland-logo-square.png",
    action: "gave you a reward for your activity",
    message: "100 followers! Here's 5 $DROPS.",
    amount: 5,
    time: "2 horas atrás",
    artistId: "dropsland",
    tokenName: "DROPS",
    relatedTo: "artist",
  },
  {
    id: "a5",
    type: "mention",
    name: "FLUSH",
    avatar: "/avatars/flush.jpg",
    action: "mentioned you in a post",
    message: "Learning from @iamjuampi's tutorials.",
    time: "3 horas atrás",
    artistId: "flush",
    tokenName: "FLUSH",
    relatedTo: "artist",
  },
  {
    id: "a6",
    type: "purchase",
    name: "Kr4D",
    avatar: "/avatars/kr4d.jpg",
    action: "bought your tokens",
    message: "For your next release!",
    amount: 10,
    time: "5 horas atrás",
    artistId: "kr4d",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  // Actividades para fans
  {
    id: "f1",
    type: "reward",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    action: "released a new reward for followers",
    message: "Exclusive track for token holders!",
    time: "1 hora atrás",
    artistId: "banger",
    tokenName: "BANGER",
    relatedTo: "fan",
  },
  {
    id: "f2",
    type: "mention",
    name: "iamjuampi",
    avatar: "/avatars/juampi.jpg",
    action: "posted a new track",
    message: "New EP 'Techno Dimensions' out now!",
    time: "3 horas atrás",
    artistId: "iamjuampi",
    tokenName: "JUAMPI",
    relatedTo: "fan",
  },
  {
    id: "f3",
    type: "follow",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    action: "announced an upcoming event",
    message: "Playing at Club Underground this weekend!",
    time: "1 día atrás",
    artistId: "nicolamarti",
    tokenName: "NICOLA",
    relatedTo: "fan",
  },
  {
    id: "f4",
    type: "reward",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    action: "released a new production tutorial",
    message: "Exclusive sound design tutorial available.",
    time: "2 días atrás",
    artistId: "axs",
    tokenName: "AXS",
    relatedTo: "fan",
  },
]
````

## File: components/main-app.tsx
````typescript
"use client";

import { useState, useRef, useEffect } from "react";
import HomeView from "@/components/home-view";
import ExploreScreen from "@/components/explore-screen";
import UploadView from "@/components/upload-view";
import WalletView from "@/components/wallet-view";
import ActivityView from "@/components/activity-view";
import ProfileView from "@/components/profile-view";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { Home, Search, Upload, Wallet, Bell, User } from "lucide-react";

export default function MainApp() {
  const [activeScreen, setActiveScreen] = useState(0);
  // Kept from main: allows for smooth header transitions
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Logic from main: Dynamic light mode based on precise scroll position
  const isLightMode = scrollProgress > 1.5;
  const transitionOpacity =
    scrollProgress >= 1 && scrollProgress <= 2
      ? scrollProgress - 1
      : scrollProgress < 1
        ? 0
        : 1;

  // Logic from main: Calculates precise scroll progress for UI effects
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const screenWidth = containerRef.current.offsetWidth;
      const progress = scrollLeft / screenWidth;
      setScrollProgress(progress);

      const newScreen = Math.round(progress);
      if (newScreen !== activeScreen) {
        setActiveScreen(newScreen);
      }
    }
  };

  const handleNavigate = (screenIndex: number) => {
    if (containerRef.current) {
      const screenWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: screenWidth * screenIndex,
        behavior: "smooth",
      });
    }
  };

  // Logic from main: Audio cleanup (Important bug fix)
  useEffect(() => {
    const allAudio = document.querySelectorAll("audio");
    allAudio.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [activeScreen]);

  // Common wrapper style
  const sectionClass = "min-w-full h-full flex-shrink-0 snap-start";
  const snapStyle = { scrollSnapStop: "always" as const };

  return (
    <div className="h-screen flex flex-col bg-black relative">
      <header
        className="absolute top-0 left-0 right-0 z-50 h-16 pointer-events-none"
        style={{
          background:
            scrollProgress >= 2
              ? `linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8), transparent)`
              : `linear-gradient(to bottom, rgba(0, 0, 0, ${1 - transitionOpacity}), rgba(0, 0, 0, ${0.8 - transitionOpacity * 0.8}), transparent), linear-gradient(to bottom, rgba(255, 255, 255, ${transitionOpacity}), rgba(255, 255, 255, ${transitionOpacity * 0.8}), transparent)`,
        }}
      >
        <div className="flex items-center justify-start h-12 px-2 pointer-events-auto">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className="h-5 w-auto"
            style={{
              filter: `invert(${transitionOpacity})`,
            }}
            priority
          />
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-scroll overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        <div data-index="0" className={sectionClass} style={snapStyle}>
          <HomeView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div data-index="1" className={sectionClass} style={snapStyle}>
          <ExploreScreen onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          data-index="2"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <UploadView />
        </div>

        <div
          data-index="3"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <WalletView />
        </div>

        <div
          data-index="4"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <ActivityView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div
          data-index="5"
          className={`${sectionClass} overflow-y-auto`}
          style={snapStyle}
        >
          <ProfileView />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center z-50 pointer-events-none">
        <div
          className={`
            pointer-events-auto
            flex items-center gap-1 px-2 py-1.5 rounded-full
            backdrop-blur-xl border shadow-2xl
            transition-all duration-500 ease-out
            ${
              isLightMode
                ? "bg-white/60 border-white/50 shadow-black/5 text-gray-800"
                : "bg-black/30 border-white/10 shadow-black/20 text-white"
            }
          `}
        >
          {[
            { index: 0, Icon: Home },
            { index: 1, Icon: Search },
            { index: 2, Icon: Upload },
            { index: 3, Icon: Wallet },
            { index: 4, Icon: Bell },
            { index: 5, Icon: User },
          ].map(({ index, Icon }) => {
            const isActive = activeScreen === index;

            return (
              <button
                key={index}
                onClick={() => handleNavigate(index)}
                className={`
                  relative p-2 rounded-full transition-all duration-300 group
                  ${
                    isActive
                      ? isLightMode
                        ? "bg-black/5"
                        : "bg-white/10"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }
                `}
              >
                <Icon
                  className={`
                    h-5 w-5 transition-all duration-300
                    ${
                      isActive
                        ? isLightMode
                          ? "text-black scale-105"
                          : "text-yellow-400 scale-105 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" // Kept HEAD style (Yellow)
                        : isLightMode
                          ? "text-gray-500 group-hover:text-black"
                          : "text-white/60 group-hover:text-white"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
````

## File: components/home-view.tsx
````typescript
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
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
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
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
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
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
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
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
  },
]
````

## File: components/tiktok-feed.tsx
````typescript
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
````
