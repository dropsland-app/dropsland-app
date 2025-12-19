"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { CHAIN, DROPSLAND_EVENTS_CONTRACT } from "@/config/chain";
import { DROPSLAND_EVENTS_ABI } from "@/util/abis";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";

interface TransferAssetViewProps {
  recipientAddress: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function TransferAssetView({
  recipientAddress,
  onBack,
  onComplete,
}: TransferAssetViewProps) {
  const { wallets } = useWallets();
  const { toast } = useToast();

  const [inventory, setInventory] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);

  // 1. Get Active Wallet
  const activeWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];

  // 2. Fetch Organizer's Inventory
  useEffect(() => {
    async function fetchInventory() {
      if (!activeWallet?.address) return;
      try {
        const items = await getUserRewards(activeWallet.address);
        setInventory(items.filter((item) => item.balance > 0)); // Only show items they own
      } catch (e) {
        console.error("Failed to load inventory", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInventory();
  }, [activeWallet]);

  // 3. Handle Transfer Logic
  const handleTransfer = async () => {
    if (!selectedTokenId || !activeWallet) return;

    setIsSending(true);
    try {
      // Switch chain if needed
      await activeWallet.switchChain(CHAIN.id);
      const provider = await activeWallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: activeWallet.address as `0x${string}`,
        chain: CHAIN,
        transport: custom(provider),
      });

      // Execute safeTransferFrom
      const hash = await walletClient.writeContract({
        chain: CHAIN,
        address: DROPSLAND_EVENTS_CONTRACT,
        abi: DROPSLAND_EVENTS_ABI,
        functionName: "safeTransferFrom",
        args: [
          activeWallet.address, // From (Organizer)
          recipientAddress, // To (Fan)
          BigInt(selectedTokenId), // Token ID
          1n, // Amount (Always 1 for this flow)
          "0x", // Data
        ],
      });

      toast({
        title: "Asset Sent!",
        description: "The NFT is on its way to the fan.",
        className: "bg-green-600 text-white border-none",
      });

      onComplete(); // Go back to wallet view
    } catch (error) {
      console.error("Transfer error:", error);
      toast({
        title: "Transfer Failed",
        description: "Could not send the asset. Check console.",
        variant: "destructive",
      });
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2 hover:bg-black/5 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-[#1E1E1E]" />
          </Button>
          <h1 className="text-xl font-bold text-[#1E1E1E]">Select Asset</h1>
        </div>

        <div className="bg-white/60 p-3 rounded-xl border border-black/5 flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase font-bold">
            Sending to:
          </span>
          <span className="font-mono text-sm font-medium text-[#1FA9D6]">
            {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
          </span>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6]" />
            <p className="text-sm text-gray-400">Loading your assets...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>You don't have any assets to send.</p>
            <Button variant="link" className="text-[#1FA9D6]">
              Create one first
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {inventory.map((item) => {
              const isSelected = selectedTokenId === item.id;
              return (
                <Card
                  key={item.id}
                  onClick={() => setSelectedTokenId(item.id)}
                  className={`
                    cursor-pointer transition-all duration-200 overflow-hidden relative
                    ${isSelected ? "ring-2 ring-[#1FA9D6] border-[#1FA9D6] shadow-md" : "border-gray-100 hover:border-gray-300"}
                  `}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={item.metadata.image}
                      alt={item.metadata.name}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#1FA9D6]/20 flex items-center justify-center">
                        <div className="bg-[#1FA9D6] rounded-full p-1">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                      x{item.balance}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm truncate">
                      {item.metadata.name}
                    </p>
                    <p className="text-xs text-gray-500">ID: {item.id}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <Button
          className="w-full h-12 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold text-lg shadow-lg shadow-[#1FA9D6]/20 rounded-xl disabled:opacity-50"
          disabled={!selectedTokenId || isSending}
          onClick={handleTransfer}
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Transfer Asset
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
