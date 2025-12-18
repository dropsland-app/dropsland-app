"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Users, Copy, RefreshCw, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { BanknoteIcon } from "@/components/icons/banknote-icon";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";
import SendView from "./send-view";
import ReceiveView from "./receive-view";

export default function WalletView() {
  const { balance, donated } = useAuth();
  const { wallets } = useWallets();

  const [nativeBalance, setNativeBalance] = useState("0.00");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);

  // Get the active Privy wallet
  const wallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const shortAddress = wallet
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : "No Wallet";

  const fetchNativeBalance = async () => {
    if (!wallet) return;

    setIsLoadingBalance(true);
    try {
      const client = createPublicClient({
        chain: mainnet, // Replace with worldchain if available in your viem config
        transport: http(),
      });

      const balanceWei = await client.getBalance({
        address: wallet.address as `0x${string}`,
      });

      setNativeBalance(formatEther(balanceWei).slice(0, 6));
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  useEffect(() => {
    fetchNativeBalance();
  }, [wallets]);

  const handleBuy = () => alert("Buy tokens feature coming soon!");
  const handleReceive = () => alert("Receive tokens feature coming soon!");

  // Conditional Rendering
  if (showSend) {
    return <SendView onBack={() => setShowSend(false)} />;
  }
  if (showReceive) {
    return <ReceiveView onBack={() => setShowReceive(false)} />;
  }

  return (
    <div className="pb-6 bg-white h-full overflow-y-auto">
      {/* PROFESSIONAL HEADER SECTION */}
      <div className="px-4 pt-12 pb-8 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl text-[#1E1E1E] border-b border-gray-200">
        {/* Title & Address Row */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-xl font-bold">Wallet</h1>

          {/* Address Badge */}
          <button
            onClick={copyAddress}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/40 hover:bg-white/60 border border-black/5 rounded-full transition-all active:scale-95"
          >
            <div
              className={`w-2 h-2 rounded-full ${wallet ? "bg-green-500" : "bg-gray-400"}`}
            />
            <span className="text-xs font-mono font-medium opacity-80">
              {shortAddress}
            </span>
            {isCopied ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3 opacity-50" />
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 opacity-80 text-xs font-medium uppercase tracking-wider">
            Native Balance
            <button
              onClick={fetchNativeBalance}
              className={`${isLoadingBalance ? "animate-spin" : ""}`}
            >
              <RefreshCw className="w-3 h-3 opacity-50 hover:opacity-100" />
            </button>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-[#1FA9D6]">
              {nativeBalance}
            </span>
            <span className="text-lg font-bold opacity-60">ETH</span>
          </div>

          {/* Secondary Drops Balance */}
          <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-black/5 rounded-lg w-fit">
            <BanknoteIcon className="w-4 h-4 text-[#1FA9D6]" />
            <span className="text-sm font-semibold">{balance} $DROPS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            className="flex-1 bg-[#1E1E1E] text-white hover:bg-black border-none h-10 shadow-sm"
            onClick={() => setShowReceive(true)}
          >
            Receive
          </Button>
          <Button
            className="flex-1 bg-white text-[#1E1E1E] border border-gray-200 hover:bg-gray-50 h-10 shadow-sm"
            onClick={handleBuy}
          >
            Buy
          </Button>
          <Button
            className="flex-1 bg-white text-[#1E1E1E] border border-gray-200 hover:bg-gray-50 h-10 shadow-sm"
            onClick={() => setShowSend(true)}
          >
            Send
          </Button>
        </div>
      </div>

      {/* Stats Cards (Unchanged) */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-6">
        <Card className="bg-[#3A3A3A]/5 shadow-none border border-black/5">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <BanknoteIcon className="h-5 w-5 text-[#1FA9D6] mb-1" />
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Purchased
            </p>
            <p className="font-bold text-[#1E1E1E] text-sm">{donated}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3A3A3A]/5 shadow-none border border-black/5">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <Users className="h-5 w-5 text-[#1FA9D6] mb-1" />
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Artists
            </p>
            <p className="font-bold text-[#1E1E1E] text-sm">8</p>
          </CardContent>
        </Card>
        <Card className="bg-[#3A3A3A]/5 shadow-none border border-black/5">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
            <TrendingUp className="h-5 w-5 text-[#1FA9D6] mb-1" />
            <p className="text-[10px] uppercase font-bold text-gray-400">
              Value
            </p>
            <p className="font-bold text-[#1E1E1E] text-sm">$1.00</p>
          </CardContent>
        </Card>
      </div>

      {/* Artist Tokens */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4 text-[#1E1E1E]">Artist Tokens</h2>
        <div className="space-y-3">
          {artistTokens.map((token) => (
            <Card
              key={token.id}
              className="bg-white shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-gray-50">
                    <AvatarImage
                      src={token.avatar || "/placeholder.svg"}
                      alt={token.name}
                    />
                    <AvatarFallback>
                      {token.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#1E1E1E] text-sm">
                        ${token.symbol}
                      </p>
                      <div className="flex items-center text-[#1FA9D6] font-semibold text-sm">
                        <BanknoteIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{token.amount}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-gray-500">{token.name}</p>
                      <p className="text-xs font-medium text-green-600">
                        +{token.change}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="mt-8 px-4">
        <h2 className="text-lg font-bold mb-4 text-[#1E1E1E]">Activity</h2>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "sent"
                    ? "bg-gray-100"
                    : "bg-[#1FA9D6]/10"
                }`}
              >
                <BanknoteIcon
                  className={`h-5 w-5 ${transaction.type === "sent" ? "text-gray-500" : "text-[#1FA9D6]"}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-[#1E1E1E] text-sm">
                    {transaction.description}
                  </p>
                  <p
                    className={`font-bold text-sm ${transaction.type === "sent" ? "text-gray-600" : "text-[#1FA9D6]"}`}
                  >
                    {transaction.type === "sent" ? "-" : "+"}
                    {transaction.amount}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {transaction.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Artist tokens data
const artistTokens = [
  {
    id: "1",
    name: "Banger",
    symbol: "BANGER",
    avatar: "/avatars/banger.jpg",
    amount: 15,
    value: "6.75",
    change: "2.3",
  },
  {
    id: "2",
    name: "Nicola Marti",
    symbol: "NICOLA",
    avatar: "/avatars/nicola.jpg",
    amount: 10,
    value: "4.50",
    change: "1.8",
  },
  {
    id: "3",
    name: "AXS",
    symbol: "AXS",
    avatar: "/avatars/axs.jpg",
    amount: 25,
    value: "11.25",
    change: "3.5",
  },
  {
    id: "4",
    name: "FLUSH",
    symbol: "FLUSH",
    avatar: "/avatars/flush.jpg",
    amount: 5,
    value: "2.25",
    change: "0.9",
  },
];

// Sample transaction data
const transactions = [
  {
    id: "1",
    type: "sent",
    description: "Sent to banger",
    amount: 15,
    date: "Mar 15, 2025",
  },
  {
    id: "2",
    type: "received",
    description: "Received from AXS",
    amount: 10,
    date: "Mar 12, 2025",
  },
  {
    id: "3",
    type: "sent",
    description: "Sent to Nicola Marti",
    amount: 25,
    date: "Mar 10, 2025",
  },
  {
    id: "4",
    type: "received",
    description: "Purchased",
    amount: 50,
    date: "Mar 5, 2025",
  },
  {
    id: "5",
    type: "sent",
    description: "Sent to FLUSH",
    amount: 5,
    date: "Mar 1, 2025",
  },
];
