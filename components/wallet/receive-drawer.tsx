"use client";

import { useState } from "react";
import { Copy, Check, Share2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

interface ReceiveDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
}

export function ReceiveDrawer({
  open,
  onOpenChange,
  walletAddress,
}: ReceiveDrawerProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "Loading...";

  const qrCodeUrl = walletAddress
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(walletAddress)}&bgcolor=ffffff`
    : "";

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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">My ID</DrawerTitle>
          <DrawerDescription>
            Share your address to receive funds
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col items-center px-4 pb-2">
          {/* QR Code */}
          <div className="w-[220px] h-[220px] bg-white border border-gray-100 shadow-lg shadow-blue-900/5 rounded-3xl overflow-hidden relative mb-5">
            {walletAddress ? (
              <img
                src={qrCodeUrl}
                alt="Wallet QR Code"
                className="w-full h-full object-contain p-4 mix-blend-multiply"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                <Wallet className="h-8 w-8 opacity-20" />
                <span className="text-xs">Loading...</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Wallet className="h-4 w-4 text-[#1FA9D6]" />
              </div>
            </div>
          </div>

          {/* Address */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl transition-all active:scale-95"
          >
            <span className="font-mono text-sm font-medium text-[#1E1E1E] truncate max-w-[200px]">
              {shortAddress}
            </span>
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        <DrawerFooter>
          <div className="grid grid-cols-2 gap-3">
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
