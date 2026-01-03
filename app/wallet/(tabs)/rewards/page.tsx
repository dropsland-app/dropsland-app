"use client";

import { useState, useEffect } from "react";
import {
  Gift,
  QrCode,
  Loader2,
  Ticket,
  Beer,
  Shirt,
  Utensils,
  Search,
  X
} from "lucide-react";
import { useWallets } from "@privy-io/react-auth";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// Helper to guess icon based on name (if no image is present)
const getRewardIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("beer") || n.includes("drink") || n.includes("cocktail")) return Beer;
  if (n.includes("vip") || n.includes("ticket") || n.includes("access")) return Ticket;
  if (n.includes("shirt") || n.includes("merch") || n.includes("hat")) return Shirt;
  if (n.includes("steak") || n.includes("food") || n.includes("burger")) return Utensils;
  return Gift;
};

export default function WalletRewardsPage() {
  const { wallets } = useWallets();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Selection State for Redemption
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);

  const primaryWallet = wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = primaryWallet?.address;

  useEffect(() => {
    async function fetchRewards() {
      if (!walletAddress) return;
      try {
        setLoading(true);
        const data = await getUserRewards(walletAddress);
        setRewards(data);
      } catch (error) {
        console.error("Failed to fetch wallet rewards:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRewards();
  }, [walletAddress]);

  // Filter rewards based on search
  const filteredRewards = rewards.filter(r =>
    r.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6]" />
        <p className="text-sm text-gray-400 font-medium">Loading your stash...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24 bg-gray-50/50">
      {/* Search / Filter Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-3 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search perks..."
            className="pl-9 bg-gray-100 border-transparent focus:bg-white transition-all h-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="p-4">
        {rewards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Rewards Yet</h3>
            <p className="text-sm text-gray-500 max-w-[200px] mt-1">
              Attend events to collect exclusive perks and merchandise.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredRewards.map((reward) => {
              const Icon = getRewardIcon(reward.metadata.name);

              return (
                <div
                  key={reward.id}
                  onClick={() => setSelectedReward(reward)}
                  className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1FA9D6]/30 transition-all cursor-pointer overflow-hidden flex flex-col"
                >
                  {/* Image Aspect Ratio Container */}
                  <div className="aspect-square relative bg-gray-50 overflow-hidden">
                    {reward.metadata.image ? (
                      <img
                        src={reward.metadata.image}
                        alt={reward.metadata.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50/50">
                        <Icon className="w-12 h-12 text-[#1FA9D6]/40" />
                      </div>
                    )}

                    {/* Quantity Badge */}
                    {reward.balance > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full border border-white/10 shadow-sm">
                        x{reward.balance}
                      </div>
                    )}

                    {/* Redeem Overlay (Hover) */}
                    <div className="absolute inset-0 bg-[#1FA9D6]/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white font-bold flex items-center gap-2">
                        <QrCode className="w-5 h-5" />
                        <span>Use Item</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col gap-1 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
                      {reward.metadata.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                      {reward.metadata.name.includes("VIP") ? "Premium Perk" : "Standard Item"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Redemption Dialog */}
      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
        <DialogContent className="w-[90%] max-w-sm rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white">
          {selectedReward && (
            <div className="flex flex-col items-center">
              {/* Header Image */}
              <div className="w-full h-32 bg-gray-100 relative">
                {selectedReward.metadata.image ? (
                  <img
                    src={selectedReward.metadata.image}
                    className="w-full h-full object-cover"
                    alt="Reward Header"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1FA9D6]/10">
                    <Gift className="w-12 h-12 text-[#1FA9D6]" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full"
                  onClick={() => setSelectedReward(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="px-6 py-6 w-full flex flex-col items-center">
                <Badge variant="outline" className="mb-3 border-[#1FA9D6] text-[#1FA9D6] bg-[#1FA9D6]/5">
                  Available: {selectedReward.balance}
                </Badge>

                <DialogHeader className="mb-6 text-center">
                  <DialogTitle className="text-2xl font-extrabold text-gray-900">
                    {selectedReward.metadata.name}
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Show this QR code to staff to redeem your perk.
                  </DialogDescription>
                </DialogHeader>

                {/* QR Code Container */}
                <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl mb-6 shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=redeem:${walletAddress}:${selectedReward.id}`}
                    alt="Redemption QR"
                    className="w-48 h-48 mix-blend-multiply opacity-90"
                  />
                </div>

                <div className="w-full bg-yellow-50 border border-yellow-100 p-3 rounded-xl flex gap-3 items-start">
                  <div className="mt-0.5 min-w-[16px]">
                    <Ticket className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="text-xs text-yellow-800 leading-relaxed">
                    Do not scan this yourself. This code is intended for event staff only.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}