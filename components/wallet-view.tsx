"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  Copy,
  RefreshCw,
  Check,
  Camera,
  ArrowRightLeft,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { BanknoteIcon } from "@/components/icons/banknote-icon";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

export default function WalletView() {
  const router = useRouter(); // Initialize Router
  const { balance, donated } = useAuth();
  const { wallets } = useWallets();

  const [nativeBalance, setNativeBalance] = useState("0.00");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const wallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const shortAddress = wallet
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : "No Wallet";

  const fetchNativeBalance = async () => {
    if (!wallet) return;
    setIsLoadingBalance(true);
    try {
      const client = createPublicClient({ chain: mainnet, transport: http() });
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

  // --- NAVIGATION HANDLERS ---
  // These now push to routes instead of setting state
  const goToReceive = () => router.push("/wallet/receive");
  const goToScan = () => router.push("/wallet/scan"); // Or just /scan
  const goToSend = () => router.push("/wallet/send");
  const handleBuy = () => alert("Coming Soon");

  return (
    <div className="pb-6 bg-white h-full overflow-y-auto">
      {/* HEADER SECTION */}
      <div className="px-4 pt-12 pb-8 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl text-[#1E1E1E] border-b border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-xl font-bold">Wallet</h1>
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
          <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-black/5 rounded-lg w-fit">
            <BanknoteIcon className="w-4 h-4 text-[#1FA9D6]" />
            <span className="text-sm font-semibold">{balance} $DROPS</span>
          </div>
        </div>

        {/* ACTION BUTTONS GRID - UPDATED HANDLERS */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          <ActionBtn
            icon={<ArrowRightLeft className="w-5 h-5" />}
            label="Receive"
            onClick={goToReceive}
            primary
          />
          <ActionBtn
            icon={<Camera className="w-5 h-5" />}
            label="Scan"
            onClick={goToScan}
          />
          <ActionBtn
            icon={<Send className="w-4 h-4" />}
            label="Send"
            onClick={goToSend}
          />
          <ActionBtn
            icon={<BanknoteIcon className="w-5 h-5" />}
            label="Buy"
            onClick={handleBuy}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-6">
        <StatCard
          icon={<BanknoteIcon className="h-5 w-5 text-[#1FA9D6]" />}
          label="Purchased"
          value={donated}
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-[#1FA9D6]" />}
          label="Artists"
          value="8"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-[#1FA9D6]" />}
          label="Value"
          value="$1.00"
        />
      </div>

      {/* Artist Tokens Section */}
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
                    <AvatarImage src={token.avatar} alt={token.name} />
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
    </div>
  );
}

// Helper Components
function ActionBtn({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`
                flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all active:scale-95
                ${primary ? "bg-[#1E1E1E] text-white shadow-lg shadow-black/10" : "bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"}
            `}
    >
      <div className={primary ? "text-white" : "text-[#1E1E1E]"}>{icon}</div>
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="bg-[#3A3A3A]/5 shadow-none border border-black/5">
      <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
        <div className="mb-1">{icon}</div>
        <p className="text-[10px] uppercase font-bold text-gray-400">{label}</p>
        <p className="font-bold text-[#1E1E1E] text-sm">{value}</p>
      </CardContent>
    </Card>
  );
}

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
