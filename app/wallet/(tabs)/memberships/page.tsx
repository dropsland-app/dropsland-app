"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QrCode, Ticket, Loader2 } from "lucide-react";
import { useWallets } from "@privy-io/react-auth";
import { getUserMemberships, type RewardItem } from "@/lib/alchemy";

// Color palette for membership cards
const MEMBERSHIP_COLORS = [
  "bg-[#1FA9D6]",
  "bg-purple-600",
  "bg-slate-800",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-rose-600",
];

export default function WalletMembershipsPage() {
  const { wallets } = useWallets();
  const [memberships, setMemberships] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPass, setSelectedPass] = useState<RewardItem | null>(null);

  const wallet =
    wallets.find((w) => w.walletClientType === "privy") || wallets[0];

  useEffect(() => {
    const fetchMemberships = async () => {
      if (!wallet?.address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getUserMemberships(wallet.address);
        setMemberships(data);
      } catch (error) {
        console.error("Error fetching memberships:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [wallet?.address]);

  const getColorForIndex = (index: number) => {
    return MEMBERSHIP_COLORS[index % MEMBERSHIP_COLORS.length];
  };

  return (
    <div className="pb-24">
      {/* Memberships List */}
      <div className="p-4 space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Your Access Passes
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6] mb-4" />
            <p className="text-sm text-gray-500">Loading memberships...</p>
          </div>
        ) : memberships.length > 0 ? (
          memberships.map((membership, index) => (
            <div
              key={`${membership.id}-${index}`}
              onClick={() => setSelectedPass(membership)}
              className="group relative w-full rounded-2xl overflow-hidden shadow-md transition-transform active:scale-[0.98] cursor-pointer"
            >
              {/* Card Header / Color Strip */}
              <div
                className={`${getColorForIndex(index)} h-24 p-4 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-extrabold text-lg tracking-tight">
                      {membership.metadata.name ||
                        `Membership #${membership.id}`}
                    </h3>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mt-1 backdrop-blur-md">
                      Token #{membership.id}
                    </Badge>
                  </div>
                  <Avatar className="h-10 w-10 border-2 border-white/30">
                    <AvatarImage src={membership.metadata.image} />
                    <AvatarFallback>
                      {(membership.metadata.name || "M")[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Card Body */}
              <div className="bg-white p-4 border-x border-b border-gray-100 rounded-b-2xl">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 font-medium uppercase">
                      Balance
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {membership.balance}x Owned
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
            <p className="text-xs text-gray-400 mt-1">
              Join a creator&apos;s membership to see it here
            </p>
          </div>
        )}
      </div>

      {/* QR Code Dialog (Simulated Apple Wallet View) */}
      <Dialog
        open={!!selectedPass}
        onOpenChange={(open) => !open && setSelectedPass(null)}
      >
        <DialogContent className="w-[90%] rounded-3xl bg-white border-none shadow-2xl">
          <DialogHeader className="text-center pt-4">
            <DialogTitle className="text-gray-900">Access Pass</DialogTitle>
          </DialogHeader>

          {selectedPass && (
            <div className="flex flex-col items-center pb-6">
              {/* Generative QR Placeholder */}
              <div className="bg-white p-2 rounded-xl border-2 border-dashed border-gray-200 mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=membership-${selectedPass.id}`}
                  className="w-48 h-48 opacity-90 mix-blend-multiply"
                  alt="QR Code"
                />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {selectedPass.metadata.name || `Membership #${selectedPass.id}`}
              </h3>
              {selectedPass.metadata.description && (
                <p className="text-gray-500 text-sm mb-6 text-center px-4">
                  {selectedPass.metadata.description}
                </p>
              )}

              <div className="w-full bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">
                  Token ID
                </span>
                <span className="font-mono text-sm font-bold text-gray-900">
                  #{selectedPass.id}
                </span>
              </div>

              {selectedPass.metadata.attributes &&
                selectedPass.metadata.attributes.length > 0 && (
                  <div className="w-full mt-4 space-y-2">
                    <span className="text-xs font-bold text-gray-400 uppercase">
                      Perks
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedPass.metadata.attributes.map((attr, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700"
                        >
                          {attr.value || attr.trait_type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
