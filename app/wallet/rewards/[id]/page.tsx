"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useWallets } from "@privy-io/react-auth";
import { Gift, Loader2, Ticket, ShieldAlert } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";

function getAttribute(item: RewardItem, trait: string) {
  return item.metadata.attributes?.find(
    (attr) => String(attr?.trait_type || "").toLowerCase() === trait.toLowerCase(),
  )?.value;
}

export default function RewardDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { wallets } = useWallets();
  const [loading, setLoading] = useState(true);
  const [reward, setReward] = useState<RewardItem | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [holding, setHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);

  const wallet = wallets.find((w) => w.walletClientType === "privy") || wallets[0];

  useEffect(() => {
    async function loadReward() {
      if (!wallet?.address) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const allRewards = await getUserRewards(wallet.address);
      const found = allRewards.find((item) => item.id === params.id);
      setReward(found || null);
      setLoading(false);
    }

    loadReward();
  }, [wallet?.address, params.id]);

  const eventId = useMemo(() => {
    if (!reward) return null;
    return (
      getAttribute(reward, "event_id") ||
      getAttribute(reward, "eventId") ||
      getAttribute(reward, "event") ||
      null
    );
  }, [reward]);

  const startHold = () => {
    setHolding(true);
    holdTimerRef.current = window.setTimeout(() => {
      setShowQr(true);
      setHolding(false);
    }, 900);
  };

  const cancelHold = () => {
    setHolding(false);
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1FA9D6]" />
        <p className="mt-3 text-sm font-medium text-gray-500">Loading reward...</p>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="min-h-screen bg-[#F7FAFC]">
        <AppHeader title="Reward" showBack className="bg-white" />
        <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Gift className="h-7 w-7 text-gray-400" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">Reward not found</h2>
          <p className="mt-1 text-sm text-gray-500">This item is not available in your wallet.</p>
          <Button onClick={() => router.back()} className="mt-5 rounded-2xl bg-[#1FA9D6] text-white">
            Back to Rewards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] pb-32">
      <AppHeader title="Reward" showBack className="bg-white/95" />

      <div className="px-4 pt-4">
        <div className="relative rounded-3xl bg-blue-50 p-8 shadow-xl shadow-blue-900/5">
          <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-700 shadow-sm">
            Qty: {reward.balance}
          </div>

          <div className="mx-auto flex aspect-square w-44 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-lg shadow-blue-900/10">
            {reward.metadata.image ? (
              <img src={reward.metadata.image} alt={reward.metadata.name} className="h-full w-full object-cover" />
            ) : (
              <Gift className="h-16 w-16 text-[#1FA9D6]/50" />
            )}
          </div>
        </div>

        <div className="mt-5 rounded-3xl bg-white p-5 shadow-xl shadow-blue-900/5">
          <h1 className="text-2xl font-extrabold text-gray-900">{reward.metadata.name}</h1>
          {reward.metadata.description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{reward.metadata.description}</p>
          )}

          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Valid At</p>
            {eventId ? (
              <Link
                href={`/events/${eventId}`}
                className="flex items-center justify-between rounded-2xl border border-gray-100 bg-[#F9FBFD] p-4 shadow-sm transition hover:border-[#1FA9D6]/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1FA9D6]/10 text-[#1FA9D6]">
                    <Ticket className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Linked Event</p>
                    <p className="text-xs text-gray-500">View event details</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[#1FA9D6]">Open</span>
              </Link>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-[#F9FBFD] p-4">
                <p className="text-sm font-semibold text-gray-900">Event link unavailable</p>
                <p className="text-xs text-gray-500">This reward metadata does not include an event ID yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white/95 px-4 pb-6 pt-3 backdrop-blur-md safe-bottom">
        <div className="rounded-2xl bg-[#1FA9D6]/10 p-1.5">
          <Button
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            className="h-12 w-full rounded-2xl bg-[#1FA9D6] text-base font-bold text-white hover:bg-[#1FA9D6]/90"
          >
            {holding ? "Keep Holding..." : "Hold to Reveal QR"}
          </Button>
        </div>
      </div>

      <Dialog open={showQr} onOpenChange={setShowQr}>
        <DialogContent className="w-[90%] max-w-sm rounded-3xl border-none bg-white p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-extrabold text-gray-900">
              Show to Staff
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 flex flex-col items-center">
            <Badge className="mb-4 rounded-full bg-[#1FA9D6]/10 px-3 py-1 text-[#1FA9D6] hover:bg-[#1FA9D6]/10">
              {reward.metadata.name}
            </Badge>

            <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-lg shadow-blue-900/5">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=redeem:${wallet?.address}:${reward.id}`}
                alt="Redeem QR"
                className="h-52 w-52"
              />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-2xl bg-yellow-50 p-3 text-xs text-yellow-800">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Only event staff should scan this code.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
