"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Copy,
  RefreshCw,
  Check,
  Camera,
  ArrowRightLeft,
  Send,
  Banknote,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth"; // Your existing hook
import { BanknoteIcon } from "@/components/icons/banknote-icon"; // Your existing icon
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { balance } = useAuth(); // Removed 'donated' from here, moved to Coins tab
  const { wallets } = useWallets();

  const [nativeBalance, setNativeBalance] = useState("0.00");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // --- 1. Wallet Logic ---
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

  useEffect(() => {
    fetchNativeBalance();
  }, [wallets]);

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // --- 2. Action Handlers ---
  const actions = [
    {
      label: "Receive",
      icon: ArrowRightLeft,
      onClick: () => router.push("/wallet/receive"),
      primary: true,
    },
    { label: "Scan", icon: Camera, onClick: () => router.push("/wallet/scan") },
    { label: "Send", icon: Send, onClick: () => router.push("/wallet/send") },
    { label: "Buy", icon: Banknote, onClick: () => alert("Coming soon!") },
  ];

  // --- 3. Tabs Configuration ---
  const tabs = [
    { name: "Events", href: "/wallet/events" },
    { name: "Rewards", href: "/wallet/rewards" },
    { name: "Coins", href: "/wallet/coins" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* --- HEADER SECTION --- */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl border-b border-gray-200">
        {/* Top Row */}
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-xl font-bold text-[#1E1E1E]">Wallet</h1>
          <button
            onClick={copyAddress}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/40 border border-black/5 rounded-full"
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

        {/* Balances */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 opacity-80 text-xs font-medium uppercase tracking-wider text-gray-600">
            Native Balance
            <button
              onClick={fetchNativeBalance}
              className={isLoadingBalance ? "animate-spin" : ""}
            >
              <RefreshCw className="w-3 h-3 opacity-50" />
            </button>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-[#1FA9D6]">
              {nativeBalance}
            </span>
            <span className="text-lg font-bold opacity-60 text-gray-600">
              ETH
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-black/5 rounded-lg w-fit">
            <BanknoteIcon className="w-4 h-4 text-[#1FA9D6]" />
            <span className="text-sm font-semibold text-[#1E1E1E]">
              {balance} $DROPS
            </span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all active:scale-95 ${
                action.primary
                  ? "bg-[#1E1E1E] text-white shadow-lg shadow-black/10"
                  : "bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <div className={action.primary ? "text-white" : "text-[#1E1E1E]"}>
                <action.icon
                  className={action.label === "Send" ? "w-4 h-4" : "w-5 h-5"}
                />
              </div>
              <span className="text-[11px] font-semibold">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- TAB SWITCHER --- */}
      <div className="flex border-b border-gray-100 px-4 sticky top-0 bg-white z-10">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex-1 text-center py-4 text-sm font-bold border-b-2 transition-colors ${
                isActive
                  ? "border-[#1FA9D6] text-[#1FA9D6]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* --- PAGE CONTENT --- */}
      <div className="flex-1 bg-white">{children}</div>
    </div>
  );
}
