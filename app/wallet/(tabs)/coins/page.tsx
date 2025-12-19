"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Users } from "lucide-react";
import { BanknoteIcon } from "@/components/icons/banknote-icon";
import { useAuth } from "@/hooks/use-auth";

export default function WalletCoinsPage() {
  const { donated } = useAuth(); // Moved 'donated' usage here as it relates to stats

  const stats = [
    { label: "Purchased", value: donated, icon: BanknoteIcon },
    { label: "Artists", value: "8", icon: Users },
    { label: "Value", value: "$1.00", icon: TrendingUp },
  ];

  const artistTokens = [
    {
      id: "1",
      name: "Banger",
      symbol: "BANGER",
      avatar: "/avatars/banger.jpg",
      amount: 15,
      change: "2.3",
    },
    {
      id: "2",
      name: "Nicola Marti",
      symbol: "NICOLA",
      avatar: "/avatars/nicola.jpg",
      amount: 10,
      change: "1.8",
    },
    {
      id: "3",
      name: "AXS",
      symbol: "AXS",
      avatar: "/avatars/axs.jpg",
      amount: 25,
      change: "3.5",
    },
  ];

  return (
    <div className="pb-20">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50/50 border-b border-gray-100">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-white shadow-none border border-gray-200"
          >
            <CardContent className="p-3 flex flex-col items-center justify-center gap-1">
              <stat.icon className="h-4 w-4 text-[#1FA9D6] mb-1" />
              <p className="text-[10px] uppercase font-bold text-gray-400">
                {stat.label}
              </p>
              <p className="font-bold text-[#1E1E1E] text-sm">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Token List */}
      <div className="p-4 space-y-3">
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
  );
}
