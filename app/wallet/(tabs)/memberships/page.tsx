"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Ticket, Loader2 } from "lucide-react";
import { useWallets } from "@privy-io/react-auth";
import { getUserMemberships, type RewardItem } from "@/lib/alchemy";
import { MembershipCard } from "@/components/membership-card";

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
            <MembershipCard
              key={`${membership.id}-${index}`}
              id={membership.id}
              name={membership.metadata.name || `Membership #${membership.id}`}
              image={membership.metadata.image}
              index={index}
              balance={membership.balance}
              variant="wallet"
              onClick={() => setSelectedPass(membership)}
            />
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
