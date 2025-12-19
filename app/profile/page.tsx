"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Banknote,
  Heart,
  MessageCircle,
  Share2,
  Lock,
  Send,
  LogOut,
  Star,
  Pencil,
  Loader2,
  Plus,
  QrCode,
} from "lucide-react";
import { useWallets } from "@privy-io/react-auth";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Hooks & Libs
// Note: Ensure these files exist or adjust imports to your project structure
import { useAuth } from "@/hooks/use-auth";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";

// Mock Data
const USER_POSTS = [
  {
    content: "New EP 'Techno Dimensions' out now! 🎵 #NewRelease",
    time: "2 hours ago",
    likes: 87,
    comments: 14,
    image: "/images/dj-mixer.png",
  },
];

export default function ProfilePage() {
  const router = useRouter();

  // --- Hooks ---
  const { wallets } = useWallets();
  const { balance, donated, userData, isArtist, logout } = useAuth();

  // --- State ---
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

  // --- Derived State ---
  const displayName = userData?.username || "musicfan";
  // Mock logic for specific user demo
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

  const primaryWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = primaryWallet?.address;

  // --- Effects ---
  useEffect(() => {
    if (!walletAddress) return;

    const fetchRewards = async () => {
      console.log("🔍 Starting fetch for:", walletAddress);
      setLoadingRewards(true);

      try {
        const data = await getUserRewards(walletAddress);
        console.log("✅ Rewards fetched:", data);
        setRewards(data);
      } catch (error) {
        console.error("❌ Error in component fetch:", error);
      } finally {
        setLoadingRewards(false);
      }
    };

    fetchRewards();
  }, [walletAddress]);

  // --- Handlers ---
  const handleEditBio = () => {
    setEditedBio(userProfile.bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = () => {
    // In a real app, you would make an API call here
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

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-white pb-20">
      {/* Cover Image */}
      <div className="relative h-40">
        {coverSrc && (
          <img
            src={coverSrc}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50" />
      </div>

      <div className="px-4">
        {/* Avatar */}
        <div className="flex justify-center -mt-16 mb-4">
          <Avatar className="w-28 h-28 border-4 border-white ring-2 ring-[#1FA9D6]/30">
            <AvatarImage src={avatarSrc} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-[#1FA9D6] to-[#1FA9D6]/80 text-white text-3xl font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <h1 className="text-2xl font-bold text-[#1E1E1E] break-words max-w-full">
              {userProfile.name}
            </h1>
            {userProfile.isVerified && (
              <Star className="h-5 w-5 text-[#1FA9D6] fill-[#1FA9D6] flex-shrink-0" />
            )}
          </div>
          <p className="text-[#3A3A3A] text-base mb-3 break-words">
            @{userProfile.handle}
          </p>
          <div className="flex items-center gap-2 justify-center flex-wrap mb-4">
            <Badge
              variant="outline"
              className="bg-[#3A3A3A]/10 text-[#1E1E1E] border-[#3A3A3A]/30 text-xs"
            >
              {userProfile.category}
            </Badge>
            <span className="text-xs text-[#3A3A3A]">
              Member since {userProfile.memberSince}
            </span>
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
              <p className="text-[#3A3A3A] text-sm leading-relaxed break-words max-w-full mb-2">
                {userProfile.bio}
              </p>

              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={handleEditBio}
                  className="bg-[#3A3A3A]/10 px-3 py-1.5 rounded-full border border-[#3A3A3A]/30 text-[#1E1E1E] text-xs hover:bg-[#3A3A3A]/20 inline-flex items-center gap-1"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Bio
                </button>

                <button
                  onClick={() => router.push("/create-merch")}
                  className="bg-[#3A3A3A]/10 px-3 py-1.5 rounded-full border border-[#3A3A3A]/30 text-[#1E1E1E] text-xs hover:bg-[#3A3A3A]/20 inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Create Merch
                </button>

                <button
                  onClick={() => router.push("/verify")}
                  className="bg-[#3A3A3A]/10 px-3 py-1.5 rounded-full border border-[#3A3A3A]/30 text-[#1E1E1E] text-xs hover:bg-[#3A3A3A]/20 inline-flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
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
            <p className="text-xl font-bold text-[#1E1E1E]">
              {rewards.length > 0 ? rewards.length : 0}
            </p>
            <p className="text-xs text-[#3A3A3A]">Rewards</p>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs
          defaultValue={isArtist() ? "posts" : "rewards"}
          className="w-full"
        >
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
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>
                    {userProfile.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="font-semibold text-sm text-[#1E1E1E] truncate">
                      {userProfile.name}
                    </span>
                    {userProfile.isVerified && (
                      <Star className="h-3 w-3 text-[#1FA9D6] fill-[#1FA9D6] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#3A3A3A]">2h ago</p>
                </div>
              </div>
              <p className="text-[#1E1E1E] text-sm break-words mb-2">
                New EP out now! #NewRelease
              </p>
              <div className="flex items-center gap-4 text-[#3A3A3A]">
                <button className="flex items-center gap-1 hover:text-[#1FA9D6] text-xs">
                  <Heart className="w-4 h-4" />
                  <span>124</span>
                </button>
                <button
                  className="flex items-center gap-1 hover:text-[#1FA9D6] text-xs"
                  onClick={() => {
                    setCurrentPostIndex(0); // Mock index
                    setShowCommentDialog(true);
                  }}
                >
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
            {loadingRewards ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#1FA9D6]" />
              </div>
            ) : rewards.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
                {rewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="bg-[#3A3A3A]/5 border-[#3A3A3A]/10 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col min-w-0 max-w-[140px]"
                  >
                    <div className="aspect-square w-full relative bg-gray-200 overflow-hidden">
                      <img
                        src={reward.metadata.image}
                        alt={reward.metadata.name}
                        loading="lazy"
                        className="w-full h-full object-cover block transition-transform hover:scale-105"
                      />
                      <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-[2px] text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                        x{reward.balance}
                      </div>
                    </div>
                    <CardContent className="p-2 flex flex-col gap-1 flex-1">
                      <p className="font-semibold text-[#1E1E1E] text-[11px] truncate leading-tight">
                        {reward.metadata.name}
                      </p>
                      <Button
                        size="sm"
                        className="w-full mt-auto h-6 text-[10px] font-medium bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white shadow-none rounded-sm"
                      >
                        Redeem
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#3A3A3A]/10 border-[#3A3A3A]/20 shadow-none">
                <CardContent className="p-6 text-center">
                  <p className="text-[#1E1E1E] text-sm font-medium">
                    No rewards yet
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Attend events to collect items!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Settings Area */}
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
                      <h3 className="text-[#1E1E1E] font-medium text-sm">
                        Become an Artist
                      </h3>
                      <p className="text-xs text-[#3A3A3A] truncate">
                        Apply to become verified
                      </p>
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

      {/* Comments Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent className="bg-white text-[#1E1E1E] border-[#3A3A3A]/30">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="max-h-80 overflow-y-auto space-y-2 my-4">
            {currentPostIndex !== null &&
            postComments[`profile-${currentPostIndex}`]?.length > 0 ? (
              postComments[`profile-${currentPostIndex}`].map((comment, i) => (
                <div key={i} className="flex gap-2">
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage
                      src={
                        isJuampi
                          ? "/images/profile/iamjuampi-avatar.jpg"
                          : "/avatars/user.jpg"
                      }
                    />
                    <AvatarFallback>
                      {comment.author.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-gray-100 p-2 rounded-lg min-w-0">
                    <p className="text-xs font-medium truncate text-gray-900">
                      {comment.author}
                    </p>
                    <p className="text-xs text-gray-700 break-words">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-6 text-sm">
                No comments yet
              </p>
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
                  e.preventDefault();
                  handleSendComment();
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
  );
}
