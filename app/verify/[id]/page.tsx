"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ScanView from "@/components/scan-view";
import { createPublicClient, http } from "viem";
import { CHAIN, DROPSLAND_EVENTS_CONTRACT } from "@/config/chain";
import { DROPSLAND_EVENTS_ABI } from "@/util/abis";
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomDock from "@/components/bottom-dock";

export default function VerifyItemPage() {
  const params = useParams();
  const router = useRouter();
  const tokenId = BigInt(params.id as string);

  // States
  const [status, setStatus] = useState<
    "scanning" | "verifying" | "valid" | "invalid" | "error"
  >("scanning");
  const [fanAddress, setFanAddress] = useState("");
  const [balance, setBalance] = useState<bigint>(0n);

  // Blockchain Verification Logic
  const checkOwnership = async (address: string) => {
    setFanAddress(address);
    setStatus("verifying");

    try {
      const client = createPublicClient({ chain: CHAIN, transport: http() });
      const result = await client.readContract({
        address: DROPSLAND_EVENTS_CONTRACT,
        abi: DROPSLAND_EVENTS_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`, tokenId],
      });

      const userBalance = result as bigint;
      setBalance(userBalance);

      if (userBalance > 0n) {
        setStatus("valid");
      } else {
        setStatus("invalid");
      }
    } catch (e) {
      console.error("Verification failed:", e);
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("scanning");
    setFanAddress("");
  };

  // 1. Camera View (Dark Theme)
  if (status === "scanning") {
    return (
      <div className="h-screen w-full relative bg-black flex flex-col overflow-hidden">
        {/* Flex-1 ensures ScanView takes all available space above the dock area */}
        <div className="flex-1 relative">
          <ScanView
            onBack={() => router.back()}
            onScanSuccess={checkOwnership}
          />
        </div>
        {/* Dark Theme Dock for Camera Mode */}
        <BottomDock activeIndex={5} theme="dark" />
      </div>
    );
  }

  // 2. Result View (Light Theme)
  return (
    <div className="flex flex-col h-screen bg-white text-[#1E1E1E] overflow-hidden">
      {/* Header mainly for back navigation or context */}
      <div className="px-4 pt-12 pb-6 bg-white shrink-0 relative z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={reset} // 'Reset' goes back to scanning, or use router.back() to exit
          className="-ml-2 text-[#1E1E1E] hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Centered Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32 text-center animate-in fade-in">
        {/* LOADING */}
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 animate-spin text-[#1FA9D6] mb-6" />
            <h2 className="text-2xl font-bold text-[#1E1E1E]">Verifying...</h2>
            <p className="text-gray-500 mt-2">Checking blockchain records</p>
          </div>
        )}

        {/* VALID */}
        {status === "valid" && (
          <div className="flex flex-col items-center w-full max-w-sm">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#1E1E1E] mb-2 tracking-tight">
              VALID
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Ownership Verified.
              <br />
              <span className="font-bold text-[#1E1E1E]">
                Balance: {balance.toString()}
              </span>
            </p>

            <div className="w-full bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">
                Fan Address
              </p>
              <p className="font-mono text-xs text-[#1FA9D6] break-all">
                {fanAddress}
              </p>
            </div>

            <Button
              onClick={reset}
              className="w-full bg-[#1E1E1E] hover:bg-black text-white h-14 text-lg font-bold rounded-xl shadow-xl"
            >
              Scan Next
            </Button>
          </div>
        )}

        {/* INVALID */}
        {status === "invalid" && (
          <div className="flex flex-col items-center w-full max-w-sm">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#1E1E1E] mb-2 tracking-tight">
              INVALID
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              This wallet does not own the required asset.
            </p>
            <Button
              onClick={reset}
              variant="outline"
              className="w-full h-14 text-lg font-bold rounded-xl border-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <p className="text-red-500 mb-4">Connection Error</p>
            <Button onClick={reset} variant="outline">
              Retry
            </Button>
          </div>
        )}
      </div>

      <BottomDock activeIndex={5} theme="light" />
    </div>
  );
}
