"use client";

import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAddress } from "viem";
// import { useToast } from "@/hooks/use-toast"; -- Unused

interface ScanViewProps {
  onBack: () => void;
  onScanSuccess: (address: string) => void;
}

export default function ScanView({ onBack, onScanSuccess }: ScanViewProps) {
  const [mounted, setMounted] = useState(false);
  const [camKey, setCamKey] = useState(0); // Used to force remount of camera
  // const { toast } = useToast(); // Removed as it's unused

  // Prevent hydration mismatch and ensure browser APIs are available
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScan = (result: any, error: any) => {
    if (result) {
      const text = result?.text || result;
      // Handle "ethereum:0x123..." format or plain "0x123..."
      const rawAddress = text.replace("ethereum:", "").split("@")[0];

      if (isAddress(rawAddress)) {
        onScanSuccess(rawAddress);
      } else {
        // Debounce error toasts (optional logic could be added here)
        // For now, we rely on user feedback or console
        console.log("Invalid address scanned:", rawAddress);
      }
    }
    // We ignore 'error' logs here to prevent console spam as the library polls constantly
  };

  const reloadCamera = () => {
    setCamKey((prev) => prev + 1);
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

        {/* Reload Camera Button (Useful fallback if stream hangs) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={reloadCamera}
          className="text-white hover:bg-white/20 rounded-full pointer-events-auto"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 flex flex-col justify-center bg-black relative overflow-hidden rounded-b-3xl">
        <div className="relative w-full aspect-[3/4] max-h-[75vh] bg-black overflow-hidden rounded-3xl mx-auto my-auto">
          {mounted && (
            <QrReader
              key={camKey}
              onResult={handleScan}
              constraints={{ facingMode: "environment" }}
              className="w-full h-full"
              // Correct styles to override the library's default padding-hack
              videoContainerStyle={{
                paddingTop: 0,
                height: "100%",
                width: "100%",
              }}
              videoStyle={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {!mounted && (
            <div className="absolute inset-0 flex items-center justify-center text-white/50">
              Initializing Camera...
            </div>
          )}

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

        <p className="text-center text-white/70 mt-6 px-6 mb-8">
          Scan a fan's{" "}
          <span className="text-[#1FA9D6] font-bold">Wallet QR</span> to verify
          ownership.
        </p>
      </div>
    </div>
  );
}