"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Bell,
  Settings,
  LogOut,
  Edit3,
  QrCode,
  ShieldCheck,
  Gift,
  Music,
  ScanLine,
  Ticket,
  X,
} from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useAuth } from "@/hooks/use-auth";
import { getUserMemberships, getUserRewards, type RewardItem } from "@/lib/alchemy";

export default function ProfilePage() {
  const router = useRouter();
  const { wallets } = useWallets();
  const { balance, userData, logout } = useAuth();
  const { login, authenticated, ready } = usePrivy();

  // --- Local State ---
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [membershipsCount, setMembershipsCount] = useState(0);
  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false);
  const [bio, setBio] = useState("");
  const [bioDraft, setBioDraft] = useState("");

  // --- Derived State ---
  // Fallback to "FAN" if role is missing in the current auth hook version
  // In a full implementation, userData.role would come directly from useAuth
  const userRole =
    userData?.role || (userData?.type === "artist" ? "DJ" : "FAN");

  const displayName = userData?.username || "User";
  const handle = `@${displayName.toLowerCase().replace(/\s/g, "")}`;
  const avatarSrc =
    userData?.avatar ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${displayName}`;

  const primaryWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = primaryWallet?.address;
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "N/A";

  // --- Role Based Config ---
  const roleConfig = {
    FAN: {
      color: "text-[#1FA9D6]",
      bgColor: "bg-[#1FA9D6]",
      borderColor: "border-[#1FA9D6]",
      badge: "Fan",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    DJ: {
      color: "text-purple-600",
      bgColor: "bg-purple-600",
      borderColor: "border-purple-600",
      badge: "DJ / Artist",
      icon: <Music className="w-4 h-4" />,
    },
    STAFF: {
      color: "text-green-600",
      bgColor: "bg-green-600",
      borderColor: "border-green-600",
      badge: "Staff / Promoter",
      icon: <Ticket className="w-4 h-4" />,
    },
  }[userRole as "FAN" | "DJ" | "STAFF"] || {
    color: "text-gray-600",
    bgColor: "bg-gray-600",
    borderColor: "border-gray-600",
    badge: "User",
    icon: <ShieldCheck className="w-4 h-4" />,
  };

  const defaultBioByRole =
    userData?.role === "STAFF"
      ? "Official Dropsland Event Staff. Authorized for verification."
      : "Music enthusiast and electronic music fan. Collecting moments on-chain.";

  // --- Effects ---
  useEffect(() => {
    if (!walletAddress) return;

    const fetchOwnedAssets = async () => {
      try {
        const [rewardData, membershipData] = await Promise.all([
          getUserRewards(walletAddress),
          getUserMemberships(walletAddress),
        ]);
        setRewards(rewardData);
        setMembershipsCount(membershipData.length);
      } catch (error) {
        console.error("❌ Error fetching owned assets:", error);
      }
    };

    fetchOwnedAssets();
  }, [walletAddress]);

  useEffect(() => {
    setBio(defaultBioByRole);
    setBioDraft(defaultBioByRole);
  }, [defaultBioByRole]);

  const openEditBio = () => {
    setBioDraft(bio);
    setIsEditBioOpen(true);
  };

  const saveBio = () => {
    const nextBio = bioDraft.trim();
    setBio(nextBio || defaultBioByRole);
    setIsEditBioOpen(false);
  };

  useEffect(() => {
    if (!isAvatarPreviewOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAvatarPreviewOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAvatarPreviewOpen]);

  // --- Guest View ---
  if (ready && !authenticated) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Guest Access</h1>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
          Connect your wallet to view your profile and collect rewards.
        </p>
        <Button
          onClick={login}
          className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold py-6 px-10 rounded-full text-lg shadow-xl shadow-[#1FA9D6]/20 transition-all"
        >
          Login / Connect
        </Button>
      </div>
    );
  }

  // --- Main View ---
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-gray-50/30 pb-24 relative">
      {/* 1. Header Section */}
      <div className="bg-white pb-6 pt-12 px-6 rounded-b-[2rem] shadow-sm border-b border-gray-100 relative">
        {/* Notification Bell */}
        <button
          onClick={() => router.push("/activity")}
          className="absolute top-6 right-6 p-2 rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Avatar with Role-Based Ring */}
          <div className="relative mb-4">
            <button
              type="button"
              onClick={() => setIsAvatarPreviewOpen(true)}
              className={`p-1 rounded-full border-2 border-dashed ${roleConfig.borderColor} bg-opacity-30 transition-transform active:scale-95`}
              aria-label="Open profile photo preview"
            >
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarImage src={avatarSrc} className="object-cover" />
                <AvatarFallback className="bg-gray-100 text-xl font-bold text-gray-400">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>
            {userData?.isVerified && (
              <div
                className={`absolute bottom-1 right-1 ${roleConfig.bgColor} text-white p-1 rounded-full border-2 border-white shadow-sm`}
              >
                {roleConfig.icon}
              </div>
            )}
          </div>

          {/* Identity */}
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">
            {displayName}
          </h1>
          <p className="text-gray-400 font-medium text-sm mb-3">{handle}</p>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <Badge
              variant="secondary"
              className={`bg-gray-100 ${roleConfig.color} hover:bg-gray-200 border-transparent`}
            >
              {roleConfig.badge}
            </Badge>
            <span className="text-xs text-gray-400 font-medium">
              Member since {memberSince}
            </span>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto mb-6">
            {bio}
          </p>

          {/* Role-Based Action Row */}
          <div className="flex gap-3 w-full justify-center max-w-sm">
            <Drawer open={isEditBioOpen} onOpenChange={setIsEditBioOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditBio}
                  className="rounded-full h-9 px-5 border-gray-200 text-gray-600 font-semibold text-xs gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Bio
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-w-md mx-auto">
                <DrawerHeader className="px-2 text-left">
                  <DrawerTitle>Edit Bio</DrawerTitle>
                  <DrawerDescription>
                    Keep it short and personal. This appears on your profile.
                  </DrawerDescription>
                </DrawerHeader>

                <div className="px-2 py-2">
                  <Textarea
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value)}
                    placeholder="Tell fans about you..."
                    className="min-h-[110px] resize-none rounded-2xl border-gray-200 bg-white text-sm text-gray-800"
                    maxLength={180}
                  />
                  <p className="mt-2 text-right text-xs text-gray-400">
                    {bioDraft.length}/180
                  </p>
                </div>

                <DrawerFooter className="px-2 pb-4">
                  <Button
                    onClick={saveBio}
                    className="h-11 rounded-2xl bg-[#1FA9D6] text-white hover:bg-[#1FA9D6]/90"
                  >
                    Save Bio
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      className="h-11 rounded-2xl border-gray-200"
                    >
                      Cancel
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            {/* CTA: STAFF */}
            {userRole === "STAFF" && (
              <Button
                onClick={() => router.push("/verify")}
                size="sm"
                className="rounded-full h-9 px-5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs gap-2 shadow-lg shadow-green-200"
              >
                <ScanLine className="w-3.5 h-3.5" />
                Scan Tickets
              </Button>
            )}

            {/* CTA: DJ */}
            {userRole === "DJ" && (
              <Button
                onClick={() => router.push("/create")}
                size="sm"
                className="rounded-full h-9 px-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs gap-2 shadow-lg shadow-purple-200"
              >
                <Gift className="w-3.5 h-3.5" />
                Create Drop
              </Button>
            )}

            {/* CTA: FAN */}
            {userRole === "FAN" && (
              <Drawer open={isQrOpen} onOpenChange={setIsQrOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full h-9 px-5 border-gray-200 text-gray-600 font-semibold text-xs gap-2"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    My QR
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-w-md mx-auto">
                  <DrawerHeader className="px-2 text-left">
                    <DrawerTitle>My Wallet QR</DrawerTitle>
                    <DrawerDescription>
                      Show this code to quickly receive drops and rewards.
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="px-2 py-2">
                    <div className="mx-auto w-fit rounded-3xl border border-gray-100 bg-white p-4 shadow-lg shadow-blue-900/5">
                      {walletAddress ? (
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${walletAddress}`}
                          alt="Wallet QR"
                          className="h-52 w-52"
                        />
                      ) : (
                        <div className="flex h-52 w-52 items-center justify-center rounded-2xl bg-gray-50 text-sm text-gray-400">
                          Wallet unavailable
                        </div>
                      )}
                    </div>

                    {walletAddress && (
                      <p className="mt-3 truncate text-center text-xs font-medium text-gray-500">
                        {walletAddress}
                      </p>
                    )}
                  </div>

                  <DrawerFooter className="px-2 pb-4">
                    <DrawerClose asChild>
                      <Button
                        variant="outline"
                        className="h-11 rounded-2xl border-gray-200"
                      >
                        Close
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-50">
          <div className="text-center">
            <p className="text-xl font-extrabold text-gray-900">{balance}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Balance
            </p>
          </div>
          <div className="text-center border-l border-gray-100">
            {userRole === "STAFF" ? (
              <>
                <p className="text-xl font-extrabold text-gray-900">124</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Verified
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-extrabold text-gray-900">
                  {rewards.length + membershipsCount}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  Purchased
                </p>
              </>
            )}
          </div>
          <div className="text-center border-l border-gray-100">
            <p className="text-xl font-extrabold text-gray-900">
              {rewards.length}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Collected
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tabs Section */}
      <div className="px-4 mt-6">
        <Tabs
          defaultValue={userRole === "STAFF" ? "tools" : "following"}
          className="w-full"
        >
          <TabsList className="w-full bg-white p-1 rounded-xl shadow-sm border border-gray-100 h-12 mb-6">
            {/* Staff gets a "Tools" tab */}
            {userRole === "STAFF" ? (
              <TabsTrigger
                value="tools"
                className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-400"
              >
                Promoter Tools
              </TabsTrigger>
            ) : (
              <TabsTrigger
                value="following"
                className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-400"
              >
                Following
              </TabsTrigger>
            )}

            <TabsTrigger
              value="rewards"
              className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-400"
            >
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="tools"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Card
              className="bg-white border-dashed border-2 border-green-100 shadow-none rounded-2xl py-8 cursor-pointer hover:bg-green-50/50 transition-colors"
              onClick={() => router.push("/verify")}
            >
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                  <ScanLine className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-gray-900 font-bold text-sm">Open Scanner</p>
                <p className="text-gray-400 text-xs mt-1">
                  Verify tickets and redeem perks at the door.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="following"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Card className="bg-white border-dashed border-2 border-gray-100 shadow-none rounded-2xl py-12">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-900 font-semibold text-sm">
                  Welcome to your feed.
                </p>
                <p className="text-gray-400 text-xs mt-1 max-w-[200px]">
                  Follow artists to see their updates and exclusive drops here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="rewards"
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {rewards.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#1FA9D6] shrink-0">
                      {reward.metadata.image ? (
                        <img
                          src={reward.metadata.image}
                          className="w-full h-full object-cover rounded-lg"
                          alt=""
                        />
                      ) : (
                        <Gift className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-xs truncate">
                        {reward.metadata.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        Qty: {reward.balance}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-dashed border-2 border-gray-100 shadow-none rounded-2xl py-12">
                <CardContent className="flex flex-col items-center justify-center text-center">
                  <Gift className="w-8 h-8 text-gray-300 mb-3" />
                  <p className="text-gray-900 font-semibold text-sm">
                    No rewards yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 3. Settings & Footer */}
      <div className="px-4 mt-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Settings</h3>

        <Drawer open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start h-14 rounded-xl bg-white border-gray-100 text-gray-700 font-semibold hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 mr-3 text-gray-400" />
              Account Settings
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-md mx-auto">
            <DrawerHeader className="px-2 text-left">
              <DrawerTitle>Account Settings</DrawerTitle>
              <DrawerDescription>
                Manage your session and account actions.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-2 py-2 space-y-2">
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full h-11 rounded-2xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>

            <DrawerFooter className="px-2 pb-4">
              <DrawerClose asChild>
                <Button variant="outline" className="h-11 rounded-2xl border-gray-200">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Upsell for Fans only */}
        {userRole === "FAN" && (
          <div className="bg-[#1FA9D6]/10 rounded-2xl p-5 flex items-center justify-between border border-[#1FA9D6]/20">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 bg-[#1FA9D6] rounded-full flex items-center justify-center text-white shadow-md shadow-[#1FA9D6]/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Become an Artist
                </h4>
                <p className="text-xs text-gray-500">
                  Apply to become verified
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold rounded-lg h-9"
            >
              Apply
            </Button>
          </div>
        )}

        {/* Staff Indicator */}
        {userRole === "STAFF" && (
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
            <p className="text-xs text-green-700 font-medium">
              You are logged in as Venue Staff.
              <br />
              Actions are logged for security.
            </p>
          </div>
        )}
      </div>

      {isAvatarPreviewOpen && (
        <div
          className="fixed inset-y-0 left-1/2 z-[90] flex w-full max-w-md -translate-x-1/2 items-center justify-center bg-black/35 backdrop-blur-md px-6"
          onClick={() => setIsAvatarPreviewOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsAvatarPreviewOpen(false)}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm"
            aria-label="Close profile photo preview"
          >
            <X className="h-4 w-4" />
          </button>

          <Avatar
            className="mx-auto h-[72vw] w-[72vw] max-h-[300px] max-w-[300px] border-4 border-white shadow-2xl shadow-blue-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <AvatarImage src={avatarSrc} className="object-cover" />
            <AvatarFallback className="bg-gray-100 text-5xl font-bold text-gray-400">
              {displayName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}
