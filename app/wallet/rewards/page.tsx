"use client";

import { useState, useEffect } from "react";
import { Gift, QrCode, Loader2 } from "lucide-react";
import { useWallets } from "@privy-io/react-auth";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";

export default function WalletRewardsPage() {
  const { wallets } = useWallets();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the active wallet address
  const primaryWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = primaryWallet?.address;

  useEffect(() => {
    async function fetchRewards() {
      // If no wallet is connected yet, keep loading or return
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

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-[#1FA9D6]" />
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Gift className="w-10 h-10 mx-auto mb-3 opacity-20" />
        <p className="text-sm">No rewards collected yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#1FA9D6] transition-colors cursor-pointer"
        >
          {/* Image or Fallback Icon */}
          <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1FA9D6] overflow-hidden shrink-0">
            {reward.metadata.image ? (
              <img
                src={reward.metadata.image}
                alt={reward.metadata.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Gift className="w-6 h-6" />
            )}
          </div>

          {/* Reward Details */}
          <div className="ml-3 flex-1 min-w-0">
            <h4 className="font-bold text-[#1E1E1E] truncate">
              {reward.metadata.name}
            </h4>
            <p className="text-xs text-gray-500 truncate">
              Qty: {reward.balance} • ID: {reward.id}
            </p>
          </div>

          {/* QR Action */}
          <div className="bg-gray-50 p-2 rounded-lg shrink-0">
            <QrCode className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
