"use client";

import { useState } from "react";
import { ArrowLeft, Info, Search, User, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Imports for Real Blockchain Logic
import { useSendTransaction } from "@privy-io/react-auth";
import { parseEther, isAddress } from "viem";

interface SendViewProps {
  onBack: () => void;
}

export default function SendView({ onBack }: SendViewProps) {
  // State
  const [amount, setAmount] = useState(0.001);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Search State
  const [isSearching, setIsSearching] = useState(false);

  // Transaction Loading State
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  // Privy Hook for Real Transactions
  const { sendTransaction } = useSendTransaction({
    onSuccess: ({ hash }) => {
      console.log("Transaction sent:", hash);
      setIsLoading(false);

      toast({
        title: "Transaction Submitted!",
        description: `Tx Hash: ${hash.slice(0, 6)}...${hash.slice(-4)}`,
        className: "bg-green-600 text-white border-none",
      });

      // Wait a bit before going back
      setTimeout(() => onBack(), 1000);
    },
    onError: (error) => {
      console.error("Transfer failed", error);
      setIsLoading(false);
      toast({
        title: "Transfer Failed",
        description: "Transaction rejected or failed.",
        variant: "destructive",
      });
    },
  });

  // Handle confirming the transaction
  const handleSend = async () => {
    const targetAddress = selectedUser?.walletAddress || recipient;

    if (!targetAddress) {
      toast({
        title: "Recipient Required",
        description: "Please enter a wallet address or select a user.",
        variant: "destructive",
      });
      return;
    }

    if (!isAddress(targetAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (0x...).",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true); // Start loading

    try {
      await sendTransaction({
        to: targetAddress,
        value: parseEther(amount.toString()),
      });
    } catch (err) {
      console.error("Tx Trigger Error:", err);
      setIsLoading(false);
    }
  };

  // Mock Search Handler
  const handleSearch = () => {
    if (!recipient.trim()) return;

    setIsSearching(true);

    // Simulate search delay
    setTimeout(() => {
      const user = {
        id: "u1",
        name: recipient,
        handle: `@${recipient.toLowerCase().replace(/\s+/g, "")}`,
        avatar: "/avatars/user.jpg",
        walletAddress: isAddress(recipient) ? recipient : null,
      };

      if (!user.walletAddress) {
        toast({
          title: "User found, but no wallet linked",
          description: "Please enter a valid 0x address directly.",
          variant: "destructive",
        });
        setIsSearching(false);
        return;
      }

      setSelectedUser(user);
      setRecipient("");
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. Header (Consistent with Wallet View) */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl text-[#1E1E1E] border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={isLoading}
            className="-ml-2 text-[#1E1E1E] hover:bg-black/5 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">Send Funds</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto space-y-8">
        {/* Recipient Section */}
        <div className="space-y-3">
          <Label className="text-[#1E1E1E] text-sm font-semibold">To</Label>

          {!selectedUser ? (
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="0x Address, ENS or Username"
                  className="pl-9 h-11 bg-gray-50 border-gray-200 text-[#1E1E1E] focus:ring-[#1FA9D6] focus:border-[#1FA9D6] rounded-xl"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!recipient.trim() || isSearching || isLoading}
                className="h-11 w-11 p-0 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white rounded-xl shadow-sm"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            // Selected User Card
            <div className="flex items-center justify-between bg-[#1FA9D6]/5 border border-[#1FA9D6]/20 p-3 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="bg-[#1FA9D6] text-white">
                    {selectedUser.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="font-bold text-[#1E1E1E] text-sm truncate">
                    {selectedUser.name}
                  </p>
                  <p className="text-xs text-[#1FA9D6] font-mono truncate">
                    {selectedUser.walletAddress?.slice(0, 6)}...
                    {selectedUser.walletAddress?.slice(-4)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setRecipient(selectedUser.walletAddress);
                  setSelectedUser(null);
                }}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Amount Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[#1E1E1E] text-sm font-semibold">
              Amount
            </Label>
            <div className="flex items-center text-[#1FA9D6] font-bold bg-[#1FA9D6]/10 px-2 py-1 rounded-md text-xs">
              Balance: 0.05 ETH
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col items-center justify-center gap-2 shadow-inner">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-[#1E1E1E] tracking-tight">
                {amount}
              </span>
              <span className="text-lg font-bold text-gray-400">ETH</span>
            </div>
            <p className="text-xs text-gray-400">
              ≈ ${(amount * 3500).toFixed(2)} USD
            </p>
          </div>

          {/* Slider */}
          <div className="px-1">
            <Slider
              min={0}
              max={0.1}
              step={0.001}
              value={[amount]}
              onValueChange={(value) => setAmount(value[0])}
              className="my-4 [&_.bg-primary]:bg-[#1FA9D6] [&_.border-primary]:border-[#1FA9D6]" // Customizing slider colors locally
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span>0 ETH</span>
              <span>0.1 ETH</span>
            </div>
          </div>

          {/* Quick Amount Pills */}
          <div className="grid grid-cols-4 gap-2">
            {[0.001, 0.01, 0.05, 0.1].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                disabled={isLoading}
                className={`
                    py-2 rounded-lg text-xs font-semibold transition-all
                    ${
                      amount === val
                        ? "bg-[#1FA9D6] text-white shadow-md shadow-[#1FA9D6]/20"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100"
                    }
                 `}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input (Optional) */}
        <div className="space-y-2">
          <Label
            htmlFor="message"
            className="text-[#1E1E1E] text-sm font-semibold"
          >
            Note (Optional)
          </Label>
          <Input
            id="message"
            placeholder="What is this for?"
            className="bg-gray-50 border-gray-200 text-[#1E1E1E] focus:ring-[#1FA9D6] focus:border-[#1FA9D6] rounded-xl h-11"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-6 bg-white border-t border-gray-100 mt-auto">
        <Button
          onClick={handleSend}
          disabled={isLoading || amount <= 0 || (!recipient && !selectedUser)}
          className="w-full bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold h-14 text-lg rounded-xl shadow-lg shadow-[#1FA9D6]/20 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Transaction"
          )}
        </Button>
        <div className="flex items-center justify-center mt-3 text-gray-400">
          <Info className="h-3 w-3 mr-1.5" />
          <span className="text-[10px] uppercase tracking-wider font-medium">
            Gas fees apply
          </span>
        </div>
      </div>
    </div>
  );
}
