"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSendTransaction } from "@privy-io/react-auth";
import { parseEther, isAddress } from "viem";
import {
  ScanLine,
  Search,
  Loader2,
  History,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

const RECENT_CONTACTS = [
  {
    name: "juampi.eth",
    address: "0x123...456",
    avatar: "/avatars/juampi.jpg",
  },
  { name: "banger.eth", address: "0x789...012", avatar: "/avatars/banger.jpg" },
  { name: "danilo.eth", address: "0xabc...def", avatar: "/avatars/danilo.jpg" },
  { name: "nicola.eth", address: "0xdef...123", avatar: "/avatars/nicola.jpg" },
];

interface SendDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
  nativeBalance: string;
}

export function SendDrawer({
  open,
  onOpenChange,
  nativeBalance,
}: SendDrawerProps) {
  const router = useRouter();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const { sendTransaction } = useSendTransaction({
    onSuccess: (hash) => {
      setLoading(false);
      alert(`Success! Tx: ${hash}`);
      setRecipient("");
      setAmount("");
      onOpenChange(false);
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
      alert("Invalid address");
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

  const handleScanClick = () => {
    onOpenChange(false);
    router.push("/wallet/scan");
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">Send</DrawerTitle>
          <DrawerDescription>Send funds to a friend</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {/* Recipient Input */}
          <div className="mb-5 space-y-2">
            <label className="text-sm font-bold text-gray-900 ml-1">To</label>
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Address, ENS, or Name"
                className="h-14 pl-12 pr-12 bg-gray-50 border-gray-100 rounded-2xl text-base focus:bg-white focus:border-[#1FA9D6] transition-all"
              />
              {recipient ? (
                <button
                  onClick={() => setRecipient("")}
                  className="absolute right-4 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleScanClick}
                  className="absolute right-3 p-2 bg-white shadow-sm border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ScanLine className="w-5 h-5 text-[#1FA9D6]" />
                </button>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-900">Amount</label>
              <span className="text-xs font-medium text-gray-400">
                Available: {nativeBalance} USDC
              </span>
            </div>

            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="h-16 pl-6 pr-20 bg-gray-50 border-gray-100 rounded-2xl text-2xl font-bold focus:bg-white focus:border-[#1FA9D6] transition-all placeholder:text-gray-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="h-8 w-[1px] bg-gray-200" />
                <span className="font-bold text-sm text-gray-500">USDC</span>
              </div>
            </div>

          </div>

          {/* Recent Contacts */}
          <div>
            <div className="flex items-center gap-2 mb-3 ml-1">
              <History className="w-4 h-4 text-[#1FA9D6]" />
              <h3 className="text-sm font-bold text-gray-900">Recent</h3>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {RECENT_CONTACTS.map((contact, i) => (
                <div
                  key={i}
                  onClick={() => setRecipient(contact.address)}
                  className="flex flex-col items-center gap-2 cursor-pointer group min-w-[70px]"
                >
                  <Avatar className="w-14 h-14 border-2 border-white shadow-sm group-hover:scale-105 transition-transform ring-2 ring-transparent group-hover:ring-[#1FA9D6]/20">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-gray-100 text-gray-500 font-bold">
                      {contact.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-gray-600 truncate w-full text-center">
                    {contact.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter>
          <Button
            onClick={handleSend}
            disabled={!recipient || !amount || loading}
            className="w-full h-14 bg-[#1E1E1E] hover:bg-black text-white rounded-2xl text-lg font-bold shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </div>
            ) : (
              "Preview Send"
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
