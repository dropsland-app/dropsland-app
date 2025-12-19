"use client";

import { useState } from "react";
import { useSendTransaction } from "@privy-io/react-auth";
import { parseEther, isAddress } from "viem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Info, User, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";

export default function SendFundsPage() {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number>(0.001);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const { sendTransaction } = useSendTransaction({
    onSuccess: (hash) => {
      setLoading(false);
      alert(`Success! Tx Hash: ${hash}`);
      router.push("/wallet");
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
        value: parseEther(amount.toString()),
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    // FIXED: Use h-screen and flex-col to match app shell layout
    <div className="flex flex-col h-screen bg-white text-[#1E1E1E] overflow-hidden">
      {/* Header - Matches WalletView style */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2 text-[#1E1E1E] hover:bg-black/5 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold tracking-tight">Send Funds</h2>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        {" "}
        {/* pb-32 adds space for the bottom dock */}
        {/* Recipient Input */}
        <div className="space-y-3 mb-8">
          <label className="text-sm font-bold text-[#1E1E1E]">To</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="0x Address, ENS or Username"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="pl-9 h-11 bg-gray-50 border-gray-200 focus:ring-[#1FA9D6] focus:border-[#1FA9D6] rounded-xl text-[#1E1E1E]"
              />
            </div>
            <Button className="h-11 w-11 p-0 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 rounded-xl">
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
        {/* Amount Section */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-[#1E1E1E]">Amount</label>
            <span className="text-xs font-bold text-[#1FA9D6] bg-[#1FA9D6]/10 px-2 py-1 rounded-md">
              Balance: 0.05 ETH
            </span>
          </div>

          {/* Big Amount Display */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center gap-1 shadow-inner">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
                {amount}
              </span>
              <span className="text-lg font-bold text-gray-400">ETH</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              ≈ ${(amount * 3500).toFixed(2)} USD
            </p>
          </div>

          <Slider
            defaultValue={[0.001]}
            max={0.1}
            step={0.001}
            value={[amount]}
            onValueChange={(val) => setAmount(val[0])}
            className="[&_.bg-primary]:bg-[#1FA9D6] [&_.border-primary]:border-[#1FA9D6]"
          />

          {/* Quick Select Pills */}
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 ETH</span>
            <span>0.1 ETH</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[0.001, 0.01, 0.05, 0.1].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  amount === val
                    ? "bg-[#1FA9D6] text-white shadow-md shadow-[#1FA9D6]/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
        {/* Note Input */}
        <div className="space-y-3 mb-8">
          <label className="text-sm font-bold text-[#1E1E1E]">
            Note (Optional)
          </label>
          <Input
            placeholder="What is this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-11 bg-gray-50 border-gray-200 focus:ring-[#1FA9D6] focus:border-[#1FA9D6] rounded-xl text-[#1E1E1E]"
          />
        </div>
        {/* Action Button */}
        <Button
          onClick={handleSend}
          disabled={loading || !amount || !recipient}
          className="w-full bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-[#1FA9D6]/20 transition-all active:scale-[0.98] mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Transaction"
          )}
        </Button>
        <div className="flex items-center justify-center text-gray-400 gap-1.5">
          <Info className="w-3 h-3" />
          <span className="text-[10px] uppercase tracking-wider font-bold">
            Gas fees apply
          </span>
        </div>
      </div>
    </div>
  );
}
