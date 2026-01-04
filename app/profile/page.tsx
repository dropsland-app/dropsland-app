// app/profile/page.tsx
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
} from "lucide-react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuth } from "@/hooks/use-auth";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";

export default function ProfilePage() {
  const router = useRouter();
  const { wallets } = useWallets();
  const { balance, donated, userData, isArtist, logout } = useAuth();
  const { login, authenticated, ready } = usePrivy();

  // --- Local State ---
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);

  // --- Logic / Mocks ---
  const displayName = userData?.username || "User";
  const handle = `@${displayName.toLowerCase().replace(/\s/g, "")}`;

  // Use a generated avatar style if no image
  const avatarSrc =
    userData?.avatar ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${displayName}`;

  const primaryWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = primaryWallet?.address;

  // --- Effects ---
  useEffect(() => {
    if (!walletAddress) return;

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

    fetchRewards();
  }, [walletAddress]);

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
      {/* 1. Header Section (Clean White) */}
      <div className="bg-white pb-6 pt-12 px-6 rounded-b-[2rem] shadow-sm border-b border-gray-100 relative">
        {/* Notification Bell */}
        <button
          onClick={() => router.push("/activity")}
          className="absolute top-6 right-6 p-2 rounded-full bg-white border border-gray-100 text-gray-600 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Avatar with Ring */}
          <div className="relative mb-4">
            <div className="p-1 rounded-full border-2 border-dashed border-[#1FA9D6]/30">
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarImage src={avatarSrc} className="object-cover" />
                <AvatarFallback className="bg-gray-100 text-xl font-bold text-gray-400">
                  {displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            {userData?.isVerified && (
              <div className="absolute bottom-1 right-1 bg-[#1FA9D6] text-white p-1 rounded-full border-2 border-white shadow-sm">
                <ShieldCheck className="w-4 h-4" />
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
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent"
            >
              {isArtist() ? "Artist" : "Fan"}
            </Badge>
            <span className="text-xs text-gray-400 font-medium">
              Member since March 2025
            </span>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto mb-6">
            Music enthusiast and electronic music fan.
            <br />
            Collecting moments on-chain.
          </p>

          {/* Action Row */}
          <div className="flex gap-3 w-full justify-center max-w-sm">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-9 px-5 border-gray-200 text-gray-600 font-semibold text-xs gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Bio
            </Button>
            {/* TODO: Add 'Create Merch' only if artist?
              For now keeping it simple as per screenshot
            */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-9 px-5 border-gray-200 text-gray-600 font-semibold text-xs gap-2"
            >
              <QrCode className="w-3.5 h-3.5" />
              Verify
            </Button>
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
            <p className="text-xl font-extrabold text-gray-900">{donated}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Purchased
            </p>
          </div>
          <div className="text-center border-l border-gray-100">
            <p className="text-xl font-extrabold text-gray-900">
              {rewards.length}
            </p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Rewards
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tabs Section */}
      <div className="px-4 mt-6">
        <Tabs defaultValue="following" className="w-full">
          <TabsList className="w-full bg-white p-1 rounded-xl shadow-sm border border-gray-100 h-12 mb-6">
            <TabsTrigger
              value="following"
              className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-400"
            >
              Following
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-400"
            >
              Rewards
            </TabsTrigger>
          </TabsList>

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

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start h-14 rounded-xl bg-white border-gray-100 text-gray-700 font-semibold hover:bg-gray-50"
            >
              <Settings className="w-5 h-5 mr-3 text-gray-400" />
              Account Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 py-4">
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {!isArtist() && (
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
      </div>
    </div>
  );
}
