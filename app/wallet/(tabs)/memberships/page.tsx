"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { QrCode, Ticket, ShieldCheck, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const MY_MEMBERSHIPS = [
  {
    id: "m1",
    artistName: "DJ Juampi",
    artistAvatar: "/avatars/juampi.jpg",
    tierName: "Backstage",
    color: "bg-[#1FA9D6]", // Dropsland Blue
    expiry: "Renews Oct 12",
    perks: ["+1 Entry", "Backstage"],
    tokenId: "#8821"
  },
  {
    id: "m2",
    artistName: "Banger",
    artistAvatar: "/avatars/banger.jpg",
    tierName: "Guestlist",
    color: "bg-slate-800",
    expiry: "Renews Oct 15",
    perks: ["Priority Entry"],
    tokenId: "#0442"
  }
];

export default function WalletMembershipsPage() {
  const { userData } = useAuth();
  const [selectedPass, setSelectedPass] = useState<any | null>(null);

  const stats = [
    { label: "Active Passes", value: MY_MEMBERSHIPS.length.toString(), icon: Ticket },
    { label: "Verified", value: "Level 2", icon: ShieldCheck },
    { label: "Saved", value: "$45.00", icon: Star },
  ];

  return (
    <div className="pb-24">
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

      {/* Memberships List */}
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Your Access Passes
        </h2>

        {MY_MEMBERSHIPS.length > 0 ? (
          MY_MEMBERSHIPS.map((membership) => (
            <div
              key={membership.id}
              onClick={() => setSelectedPass(membership)}
              className="group relative w-full rounded-2xl overflow-hidden shadow-md transition-transform active:scale-[0.98] cursor-pointer"
            >
              {/* Card Header / Color Strip */}
              <div className={`${membership.color} h-24 p-4 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-extrabold text-lg tracking-tight">
                      {membership.artistName}
                    </h3>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mt-1 backdrop-blur-md">
                      {membership.tierName}
                    </Badge>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-white/30">
                    <AvatarImage src={membership.artistAvatar} />
                    <AvatarFallback>{membership.artistName[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Card Body */}
              <div className="bg-white p-4 border-x border-b border-gray-100 rounded-b-2xl">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium uppercase">
                      Next Renewal
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {membership.expiry}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    className="bg-gray-900 text-white hover:bg-black gap-2 h-9 px-4 rounded-lg shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    Show QR
                  </Button>
                </div>
              </div>

              {/* Decorative "Notch" to simulate a physical ticket punch */}
              <div className="absolute top-24 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full" />
              <div className="absolute top-24 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-50 rounded-full" />
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-60">
            <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium">No active memberships</p>
          </div>
        )}
      </div>

      {/* QR Code Dialog (Simulated Apple Wallet View) */}
      <Dialog open={!!selectedPass} onOpenChange={(open) => !open && setSelectedPass(null)}>
        <DialogContent className="w-[90%] rounded-3xl bg-white border-none shadow-2xl">
          <DialogHeader className="text-center pt-4">
            <DialogTitle className="text-gray-900">Access Pass</DialogTitle>
          </DialogHeader>

          {selectedPass && (
            <div className="flex flex-col items-center pb-6">
              {/* Generative QR Placeholder */}
              <div className="bg-white p-2 rounded-xl border-2 border-dashed border-gray-200 mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedPass.id}-${selectedPass.tokenId}`}
                  className="w-48 h-48 opacity-90 mix-blend-multiply"
                  alt="QR Code"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedPass.tierName} Access
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {selectedPass.artistName}
              </p>

              <div className="w-full bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Token ID</span>
                <span className="font-mono text-sm font-bold text-gray-900">{selectedPass.tokenId}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}