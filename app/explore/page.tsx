"use client";

import { useRouter } from "next/navigation";
import TikTokFeed from "@/components/tiktok-feed"; // Verify this path matches your project structure

// Mock Data
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
];

const artistImages = [
  "/images/explore/dnb-tech-house.jpg",
  "/images/explore/tech-house.jpg",
  "/images/explore/riddim.jpg",
  "/images/explore/dubstep.jpg",
  "/images/explore/trap.jpg",
  "/images/explore/dubstep-2.jpg",
  "/images/explore/electro.jpg",
  "/images/explore/tech-house-2.jpg",
];

export default function ExplorePage() {
  const router = useRouter();

  // Navigation handler to replace the old prop
  const handleSelectArtist = (artistId: string) => {
    console.log("Navigating to artist:", artistId);
    router.push(`/profile/${artistId}`);
  };

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
    // Using the blob URL provided in your snippet
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_hMsSjyCuaCBEyDq2U7vGQxcyRsbL/t9Xk774WGI7haIDyGupOeb/public/images/dropsland-20intro-20.mp3",
  }));

  return (
    <div className="w-full h-full pb-20">
      {/* Added container with pb-20 to ensure content isn't hidden behind bottom nav */}
      <TikTokFeed
        onSelectArtist={handleSelectArtist}
        posts={explorePosts}
        type="explore"
      />
    </div>
  );
}
