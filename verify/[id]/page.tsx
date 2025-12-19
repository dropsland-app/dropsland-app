"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ScanView from "@/components/scan-view";
import { createPublicClient, http, createWalletClient, custom } from "viem";
import { CHAIN, DROPSLAND_EVENTS_CONTRACT } from "@/config/chain";
import { DROPSLAND_EVENTS_ABI } from "@/util/abis";
import { Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallets } from "@privy-io/react-auth";

export default function VerifyItemPage() {
  const params = useParams(); // Get tokenId from URL
  const router = useRouter();
  const { wallets } = useWallets();
  const tokenId = BigInt(params.id as string);

  // States: 'scanning' | 'verifying' | 'valid' | 'invalid' | 'redeeming'
  const [status, setStatus] = useState("scanning");
  const [fanAddress, setFanAddress] = useState("");
  const [balance, setBalance] = useState<bigint>(0n);

  // 1. Verify Ownership (Read-Only)
  const verifyOwnership = async (address: string) => {
    setFanAddress(address);
    setStatus("verifying");

    try {
      const client = createPublicClient({ chain: CHAIN, transport: http() });

      // Call balanceOf on the smart contract
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
      console.error(e);
      setStatus("error");
    }
  };

  // 2. Redeem / Burn (Write)
  // TODO! This requires the Organizer (admin) to prompt the burn,
  // OR usually, the Fan burns it.
  // *Design Note*: In the provided contract, `burn` checks if `msg.sender == account` or is approved.
  // Since the Organizer scans the Fan, the Organizer cannot burn the Fan's token without `setApprovalForAll`.
  // FOR MVP: We will assume the Scanner just *Verifies*.
  // To allow burning, the Fan would need to sign.
  // Alternatively, if this is a specialized event, the contract could allow the Creator to burn tokens they issued.

  const reset = () => {
    setStatus("scanning");
    setFanAddress("");
  };

  if (status === "scanning") {
    return (
      <ScanView onBack={() => router.back()} onScanSuccess={verifyOwnership} />
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      {status === "verifying" && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#1FA9D6] mb-4" />
          <h2 className="text-xl font-bold">Verifying Ownership...</h2>
        </div>
      )}

      {status === "valid" && (
        <div className="flex flex-col items-center animate-in zoom-in">
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">VALID</h1>
          <p className="text-gray-500 mb-8">
            Fan holds <strong>{balance.toString()}</strong> tickets.
          </p>
          <div className="bg-gray-100 p-3 rounded-xl mb-8 font-mono text-xs text-gray-500">
            {fanAddress}
          </div>

          <Button
            onClick={reset}
            className="w-full bg-[#1E1E1E] text-white h-12 text-lg rounded-xl"
          >
            Scan Next
          </Button>
        </div>
      )}

      {status === "invalid" && (
        <div className="flex flex-col items-center animate-in zoom-in">
          <XCircle className="w-24 h-24 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-[#1E1E1E] mb-2">INVALID</h1>
          <p className="text-gray-500 mb-8">No assets found in this wallet.</p>
          <Button
            onClick={reset}
            variant="outline"
            className="w-full h-12 text-lg rounded-xl"
          >
            Try Again
          </Button>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <p>Connection Error</p>
          <Button onClick={reset}>Retry</Button>
        </div>
      )}
    </div>
  );
}
