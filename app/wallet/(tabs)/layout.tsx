"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Check,
  ScanLine,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useWallets } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";
import { cn } from "@/lib/utils";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isArtist } = useAuth();
  const { wallets } = useWallets();

  const [nativeBalance, setNativeBalance] = useState("0.00");
  const [isCopied, setIsCopied] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountPopoverRef = useRef<HTMLDivElement | null>(null);

  // --- 1. Wallet Logic ---
  const wallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];
  const shortAddress = wallet
    ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}`
    : "No Wallet";

  const fetchNativeBalance = async () => {
    if (!wallet) return;
    try {
      const client = createPublicClient({ chain: mainnet, transport: http() });
      const balanceWei = await client.getBalance({
        address: wallet.address as `0x${string}`,
      });
      setNativeBalance(formatEther(balanceWei).slice(0, 6));
    } catch (error) {
      console.error("Error fetching balance:", error);
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
      setIsAccountOpen(false);
    }
  };

  useEffect(() => {
    if (!isAccountOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        accountPopoverRef.current &&
        !accountPopoverRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isAccountOpen]);

  // --- 2. Compact Actions ---
  const actions = [
    {
      label: "My ID",
      icon: ArrowDownLeft,
      onClick: () => router.push("/wallet/receive"),
      primary: true,
    },
    {
      label: "Send",
      icon: ArrowUpRight,
      onClick: () => router.push("/wallet/send"),
      primary: false,
    },
    ...(isArtist()
      ? [
          {
            label: "Scan",
            icon: ScanLine,
            onClick: () => router.push("/wallet/scan"),
            primary: false,
          },
        ]
      : []),
    {
      label: "Buy",
      icon: CreditCard,
      onClick: () => alert("Coming soon!"),
      primary: false,
    },
  ];

  const tabs = [
    { name: "Events", href: "/wallet/events" },
    { name: "Rewards", href: "/wallet/rewards" },
    { name: "Memberships", href: "/wallet/memberships" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white font-sans">
      {/* --- COMPACT HEADER SECTION --- */}
      <div className="px-5 pt-8 pb-2 bg-white">
        {/* Top Row: Identity */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Wallet
          </h1>

          <div className="relative" ref={accountPopoverRef}>
            <button
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className="group flex items-center gap-2 pl-2 pr-2.5 py-1.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 transition-all active:scale-95"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#1FA9D6] to-purple-500 shadow-inner flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
                Account
              </span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-gray-400 transition-transform",
                  isAccountOpen && "rotate-180",
                )}
              />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-lg z-30">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Wallet Address
                </p>
                <p className="mt-1 text-sm font-mono text-gray-800">{shortAddress}</p>

                <button
                  onClick={copyAddress}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Address
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Balance (Left) & Actions (Right) */}
        <div className="flex items-end justify-between gap-4">
          {/* Compact Balance */}
          <div className="flex flex-col mb-2 mt-2">
            <span className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              Balance
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tighter">
                {nativeBalance}
              </span>
              <span className="text-sm font-bold text-gray-400">USDC</span>
            </div>
          </div>

          {/* Compact Action Toolbar */}
          <div className="flex gap-2.5">
            {actions.map((action) => (
              <div
                key={action.label}
                className="flex flex-col items-center gap-1"
              >
                <button
                  onClick={action.onClick}
                  className={cn(
                    "size-16 rounded-3xl flex items-center justify-center shadow-sm transition-all active:scale-90 border",
                    action.primary
                      ? "bg-[#1E1E1E] text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:bg-gray-50",
                  )}
                >
                  <action.icon className="size-8" strokeWidth={2} />
                </button>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TAB SWITCHER --- */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 mt-4">
        <div className="flex gap-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "relative py-3 text-sm font-bold transition-colors",
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
