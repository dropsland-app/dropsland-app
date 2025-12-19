"use client";

import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAddress } from "viem";
import { useToast } from "@/hooks/use-toast";

interface ScanViewProps {
  onBack: () => void;
  onScanSuccess: (address: string) => void;
}

export default function ScanView({ onBack, onScanSuccess }: ScanViewProps) {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScan = (result: any, error: any) => {
    if (result) {
      const text = result?.text || result;
      // Handle "ethereum:0x123..." format or plain "0x123..."
      const rawAddress = text.replace("ethereum:", "").split("@")[0];

      if (isAddress(rawAddress)) {
        onScanSuccess(rawAddress);
      } else {
        // Only show toast if we haven't shown an error recently to avoid spam
        if (!error) {
          toast({
            title: "Invalid QR",
            description: "No valid wallet address found.",
            variant: "destructive",
          });
          setError("Invalid QR Code");
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Overlay Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-12 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full pointer-events-auto"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 flex flex-col justify-center bg-black relative overflow-hidden rounded-b-3xl">
        <div className="relative w-full aspect-[3/4] max-h-[70vh] bg-black">
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            className="w-full h-full"
            // FIX: Force container to fill parent without default padding hack
            videoContainerStyle={{
              paddingTop: 0,
              height: "100%",
              width: "100%",
              position: "relative",
              overflow: "hidden",
            }}
            // FIX: Force video to cover the entire container absolutely
            videoStyle={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />

          {/* Scanning Frame Overlay */}
          <div className="absolute inset-0 border-[40px] border-black/50 z-10 pointer-events-none">
            <div className="w-full h-full border-2 border-[#1FA9D6] relative">
              {/* Corner Markers */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#1FA9D6] -mt-1 -ml-1" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#1FA9D6] -mt-1 -mr-1" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#1FA9D6] -mb-1 -ml-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#1FA9D6] -mb-1 -mr-1" />
            </div>
            {/* Animated Scan Line */}
            <div
              className="absolute top-0 left-0 w-full h-0.5 bg-[#1FA9D6] shadow-[0_0_10px_#1FA9D6] animate-[scan_2s_infinite_ease-in-out]"
              style={{ top: "50%" }}
            />
          </div>
        </div>

        <p className="text-center text-white/70 mt-6 px-6">
          Scan a fan's{" "}
          <span className="text-[#1FA9D6] font-bold">Wallet QR</span> to verify
          ownership.
        </p>
      </div>
    </div>
  );
}
