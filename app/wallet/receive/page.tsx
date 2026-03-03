"use client";

import { useState } from "react";
import { Copy, Check, Share2, Info, Wallet } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useWallets } from "@privy-io/react-auth";

export default function ReceivePage() {
  const { wallets } = useWallets();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // 1. Get the active wallet
  const activeWallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const walletAddress = activeWallet?.address || "";

  // 2. Get Chain ID for Payment Link
  const rawChainId = activeWallet?.chainId || "";
  const chainId = rawChainId.toString().replace("eip155:", "");

  // 3. Construct Payment URI (EIP-681 Standard)
  const paymentUri = walletAddress
    ? `ethereum:${walletAddress}${chainId ? `@${chainId}` : ""}`
    : "";

  // 4. Generate QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    paymentUri,
  )}&bgcolor=ffffff`;

  // Helper for display
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Loading...";

  const getNetworkName = (id: string) => {
    if (id === "8453") return "Base Network";
    if (id === "1") return "Ethereum Mainnet";
    if (id === "10") return "Optimism";
    if (id === "42161") return "Arbitrum";
    return "Ethereum / Base";
  };

  const handleCopy = () => {
    if (!walletAddress) return;

    try {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
        className: "bg-green-600 text-white border-none",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy address.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!walletAddress) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Dropsland Address",
          text: `Send funds to my Dropsland wallet: ${walletAddress}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    // FIXED: Use h-screen and flex-col to match app shell layout
    <div className="flex flex-col h-screen bg-white text-[#1E1E1E] overflow-hidden">
      <AppHeader title="Receive Funds" showBack className="shrink-0" />

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32 flex flex-col items-center">
        {/* NETWORK BADGE */}
        <div className="mb-6 flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {getNetworkName(chainId)}
          </span>
        </div>

        {/* QR CODE CARD */}
        <Card className="w-full max-w-[280px] aspect-square bg-white border border-gray-100 shadow-xl shadow-blue-900/5 rounded-3xl mb-8 overflow-hidden relative group">
          <CardContent className="p-0 flex items-center justify-center h-full relative">
            {walletAddress ? (
              <img
                src={qrCodeUrl}
                alt="Wallet QR Code"
                className="w-full h-full object-contain p-4 mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Wallet className="h-8 w-8 opacity-20" />
                <span className="text-xs">Loading Wallet...</span>
              </div>
            )}

            {/* Center Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Wallet className="h-5 w-5 text-[#1FA9D6]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ADDRESS DISPLAY & COPY */}
        <div className="w-full space-y-4">
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-gray-500">Your Address</p>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition-all active:scale-95 group"
            >
              <span className="font-mono text-[#1E1E1E] text-sm sm:text-base font-medium truncate max-w-[200px] sm:max-w-xs">
                {shortAddress}
              </span>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400 group-hover:text-[#1FA9D6]" />
              )}
            </button>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              onClick={handleCopy}
              className="h-12 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#1FA9D6]/20 border-none"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="h-12 bg-white text-[#1E1E1E] border-gray-200 hover:bg-gray-50 font-semibold rounded-xl"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-auto pt-8 flex items-start gap-2 text-xs text-gray-400 max-w-xs mx-auto">
          <Info className="h-4 w-4 flex-shrink-0 text-[#1FA9D6]" />
          <p className="leading-relaxed text-center">
            This QR code specifies Chain ID{" "}
            <strong>{chainId || "Unknown"}</strong>. Ensure the sender is on the
            correct network to avoid asset loss.
          </p>
        </div>
      </div>
    </div>
  );
}
