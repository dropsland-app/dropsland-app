"use client";

import { useState } from "react";
import { useSendTransaction } from "@privy-io/react-auth";
import { parseEther, isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Wallet } from "lucide-react"; // Changed ArrowRight to ArrowLeft for back
import { useRouter } from "next/navigation"; // Use Next.js router

export default function SendFundsPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // Manual loading state

  const { sendTransaction } = useSendTransaction({
    onSuccess: (hash) => {
      setLoading(false);
      console.log("Transaction sent:", hash);
      alert(`Success! Tx Hash: ${hash}`);
      router.push("/wallet"); // Go back to wallet on success
    },
    onError: (error) => {
      setLoading(false);
      console.error("Transfer failed", error);
      alert("Transfer failed. Please try again.");
    },
  });

  const handleSend = async () => {
    if (!recipient || !amount) return;
    if (!isAddress(recipient)) {
      alert("Invalid Ethereum address");
      return;
    }
    setLoading(true);
    try {
      await sendTransaction({
        to: recipient,
        value: parseEther(amount),
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    // Added min-h-screen and pb-20 to account for bottom nav if visible
    <div className="flex flex-col min-h-screen bg-black text-white p-6 pb-24 animate-in slide-in-from-right duration-300">
      {/* Header with Back Navigation */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-[#F9BF15]">
          SEND FUNDS
        </h2>
      </div>

      {/* Form Content */}
      <div className="space-y-6 flex-1">
        {/* Amount */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1FA9D6] uppercase tracking-widest">
            Amount (ETH)
          </label>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-zinc-900 border-zinc-800 text-3xl font-bold h-20 pl-4 pr-12 text-white focus:ring-[#1FA9D6] focus:border-[#1FA9D6] rounded-xl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">
              ETH
            </div>
          </div>
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#1FA9D6] uppercase tracking-widest">
            Recipient Address
          </label>
          <div className="relative">
            <Wallet className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
            <Input
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-zinc-900 border-zinc-800 h-12 pl-12 font-mono text-sm text-gray-300 focus:ring-[#1FA9D6] focus:border-[#1FA9D6] rounded-xl"
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
          <p className="text-xs text-gray-500 text-center">
            Transactions are processed on-chain. <br />
            Gas fees apply.
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-auto pt-6">
        <Button
          onClick={handleSend}
          disabled={loading || !amount || !recipient}
          className="w-full bg-[#F9BF15] hover:bg-[#dca60b] text-black font-bold h-14 text-lg rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Send"
          )}
        </Button>
      </div>
    </div>
  );
}
