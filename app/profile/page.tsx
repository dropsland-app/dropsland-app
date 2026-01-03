"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Bell } from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";
import { getUserPosts, type Post } from "@/lib/api/posts";
import { allArtists } from "@/lib/mock-data";

import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { ProfileComments } from "@/components/profile/profile-comments";

export default function ProfilePage() {
  const router = useRouter();
  const { wallets } = useWallets();
  const { balance, donated, userData, isArtist, logout } = useAuth();
  const { login, authenticated, ready } = usePrivy();

  // --- Local State ---
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState<number | null>(null);
  const [postComments, setPostComments] = useState<{
    [key: string]: { author: string; text: string }[];
  }>({});
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]); // Adapting to component expectations

  // --- Logic / Mocks ---
  const displayName = userData?.username || "musicfan";
  const isJuampi = displayName.toLowerCase() === "juampi";
  const avatarSrc = isJuampi
    ? "/images/profile/iamjuampi-avatar.jpg"
    : "/avatars/user.jpg";
  const coverSrc = isJuampi ? "/images/profile/iamjuampi-cover.jpg" : "";

  const userProfile = {
    name: displayName,
    handle: displayName,
    bio: isArtist()
      ? "iamjuampi is a DJ, producer, and founder."
      : "Music enthusiast and electronic music fan.",
    category: isArtist() ? "Techno / House" : "Fan",
    memberSince: "March 2025",
    isVerified: userData?.isVerified || false,
  };

  const certifications =
    isJuampi && isArtist()
      ? allArtists.find((a) => a.id === "iamjuampi")?.certifications || []
      : [];

  const primaryWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = primaryWallet?.address;

  // --- Effects ---
  useEffect(() => {
    if (!walletAddress) return;

    // Fetch Rewards
    const fetchRewards = async () => {
      setLoadingRewards(true);
      try {
        const data = await getUserRewards(walletAddress);
        setRewards(data);
      } catch (error) {
        console.error("❌ Error fetching rewards:", error);
      } finally {
        setLoadingRewards(false);
      }
    };

    // Fetch Posts
    const fetchPosts = async () => {
      try {
        const posts = await getUserPosts(walletAddress);
        // Map DB posts to UI format if needed
        const mappedPosts = posts.map(p => ({
          content: p.content,
          time: new Date(p.created_at).toLocaleDateString(),
          likes: p.likes_count,
          comments: p.comments_count,
          image: p.media_url // Assuming media_url is an image for now
        }));
        setUserPosts(mappedPosts);
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
      }
    };

    fetchRewards();
    fetchPosts();
  }, [walletAddress]);

  // --- Handlers ---
  const handleSaveBio = () => {
    // In real app: await api.updateBio(...)
    alert("Profile updated successfully!");
    setIsEditingBio(false);
  };

  const handleSendComment = () => {
    if (!commentText.trim() || currentPostIndex === null) return;
    const postKey = `profile-${currentPostIndex}`;
    setPostComments((prev) => ({
      ...prev,
      [postKey]: [
        ...(prev[postKey] || []),
        { author: displayName, text: commentText },
      ],
    }));
    setCommentText("");
  };

  // --- Guest View ---
  if (ready && !authenticated) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-20 h-20 bg-[#1FA9D6]/10 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-[#1FA9D6]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Guest Access</h1>
        <p className="text-[#3A3A3A] mb-8 max-w-xs mx-auto leading-relaxed">
          Connect your wallet to view your profile and collect rewards.
        </p>
        <Button
          onClick={login}
          className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold py-6 px-10 rounded-full text-lg shadow-lg hover:shadow-[#1FA9D6]/20 transition-all"
        >
          Login / Connect
        </Button>
      </div>
    );
  }

  // --- Main View ---
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-white pb-20 relative">
      {/* Activity Button - Fixed Position */}
      <button
        onClick={() => router.push("/activity")}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white text-neutral-700 shadow-md flex items-center justify-center hover:bg-neutral-50 active:scale-95 transition-all"
      >
        <Bell className="w-5 h-5" />
      </button>

      {/* 1. Profile Header */}
      <ProfileHeader
        userProfile={userProfile}
        isEditingBio={isEditingBio}
        editedBio={editedBio}
        setEditedBio={setEditedBio}
        setIsEditingBio={setIsEditingBio}
        handleSaveBio={handleSaveBio}
        balance={balance}
        donated={donated}
        rewardsCount={rewards.length}
        avatarSrc={avatarSrc}
        coverSrc={coverSrc}
      />

      {/* 2. Tabs (Posts / Rewards / Certs) */}
      <ProfileTabs
        isArtist={isArtist()}
        userPosts={userPosts}
        rewards={rewards}
        loadingRewards={loadingRewards}
        certifications={certifications}
        onCommentClick={(index) => {
          setCurrentPostIndex(index);
          setShowCommentDialog(true);
        }}
        avatarSrc={avatarSrc}
        userName={userProfile.name}
        isVerified={userProfile.isVerified || false}
      />

      {/* 3. Settings Section */}
      <ProfileSettings isArtist={isArtist()} logout={logout} />

      {/* 4. Comments Dialog */}
      <ProfileComments
        open={showCommentDialog}
        onOpenChange={setShowCommentDialog}
        comments={
          currentPostIndex !== null
            ? postComments[`profile-${currentPostIndex}`]
            : []
        }
        commentText={commentText}
        setCommentText={setCommentText}
        handleSendComment={handleSendComment}
        avatarSrc={avatarSrc} // Using current user's avatar for list demo (or mock)
      />
    </div>
  );
}