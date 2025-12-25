"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Copy,
  RefreshCw,
  Check,
  ScanLine,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { balance, userData, isArtist } = useAuth();
  const { wallets } = useWallets();

  const [nativeBalance, setNativeBalance] = useState("0.00");
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // --- 1. Wallet Logic ---
  const wallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const shortAddress = wallet
    ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`
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

  // --- 2. Action Handlers (Modernized) ---
  const actions = [
    {
      label: "My ID",
      icon: ArrowDownLeft, // Keeping icon or changing to QrCode if preferred? Prompt: "Receive -> My ID (or just use the QR icon)"
      onClick: () => router.push("/wallet/receive"),
      color: "bg-black text-white", // Primary action
    },
    {
      label: "Send",
      icon: ArrowUpRight,
      onClick: () => router.push("/wallet/send"),
      color: "bg-gray-100 text-gray-900",
    },
    ...(isArtist() // Only show Scan for Artists/Staff
      ? [
        {
          label: "Scan",
          icon: ScanLine,
          onClick: () => router.push("/wallet/scan"),
          color: "bg-gray-100 text-gray-900",
        },
      ]
      : []),
    {
      label: "Buy",
      icon: CreditCard,
      onClick: () => alert("Coming soon!"),
      color: "bg-gray-100 text-gray-900",
    },
  ];

  // --- 3. Tabs Configuration ---
  const tabs = [
    { name: "Events", href: "/wallet/events" },
    { name: "Rewards", href: "/wallet/rewards" },
    { name: "Coins", href: "/wallet/coins" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white font-sans">
      {/* --- HERO SECTION --- */}
      <div className="px-6 pt-12 pb-2 bg-white">
        {/* Top Row: Title & Modern Wallet Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Wallet
          </h1>

          {/* Modern Wallet Pill */}
          <button
            onClick={copyAddress}
            className="group flex items-center gap-2 pl-1 pr-3 py-1 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 transition-all active:scale-95"
          >
            {/* Generative-style Avatar Placeholder */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1FA9D6] to-purple-500 shadow-inner" />

            <span className="text-xs font-mono font-medium text-gray-600 group-hover:text-gray-900">
              {shortAddress}
            </span>

            <div className="w-4 h-4 flex items-center justify-center">
              {isCopied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              )}
            </div>
          </button>
        </div>

        {/* Main Balance Display */}
        <div className="flex flex-col items-center justify-center mb-8 space-y-2">
          <div className="flex items-baseline gap-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="text-5xl font-extrabold text-gray-900 tracking-tighter">
              {nativeBalance}
            </span>
            <span className="text-xl font-medium text-gray-400">ETH</span>
          </div>

          {/* Secondary Balance (Drops) */}
          <button
            onClick={fetchNativeBalance}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#1FA9D6]/10 text-[#1FA9D6] rounded-full text-xs font-bold uppercase tracking-wide hover:bg-[#1FA9D6]/20 transition-colors"
          >
            {isLoadingBalance ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <span>$DROPS</span>
            )}
            <span>{balance}</span>
          </button>
        </div>

        {/* Modern Action Row (Circles) */}
        <div className="flex justify-center gap-6 mb-8">
          {actions.map((action) => (
            <div
              key={action.label}
              className="flex flex-col items-center gap-2"
            >
              <button
                onClick={action.onClick}
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-90 active:shadow-none",
                  action.color,
                )}
              >
                <action.icon className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <span className="text-[11px] font-semibold text-gray-500">
                {action.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- TAB SWITCHER --- */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "relative py-4 text-sm font-bold transition-colors",
                  isActive
                    ? "text-gray-900"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1FA9D6] rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* --- PAGE CONTENT --- */}
      <div className="flex-1 bg-gray-50/50 animate-in fade-in duration-300">
        {children}
      </div>
    </div>
  );
}
