"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createWalletClient, custom, parseEther } from "viem";
import { useWallets } from "@privy-io/react-auth";
import { motion, useScroll, useTransform } from "motion/react";
import { Check, Loader2, ShieldCheck, Star } from "lucide-react";
import AppHeader from "@/components/layout/app-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MembershipCard } from "@/components/membership-card";
import { supabase } from "@/lib/supabase/client";
import { CHAIN, DROPSLAND_CREATORS_CONTRACT } from "@/config/chain";
import { DROPSLAND_CREATORS_ABI } from "@/util/abis";

type CreatorProfile = {
  wallet_address: string;
  username: string;
  avatar_url: string | null;
  role: string;
};

type MembershipTierDB = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  perks: string[] | null;
  onchain_token_id: number;
};

export default function TierDetailPage() {
  const params = useParams<{ id: string; tierId: string }>();
  const router = useRouter();
  const { wallets } = useWallets();
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [tier, setTier] = useState<MembershipTierDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 3]);

  const wallet = wallets.find((w) => w.walletClientType === "privy") || wallets[0];

  useEffect(() => {
    async function loadTier() {
      setLoading(true);

      const [{ data: profileData }, { data: tierData }] = await Promise.all([
        supabase
          .from("profiles")
          .select("wallet_address, username, avatar_url, role")
          .eq("wallet_address", params.id)
          .single(),
        supabase
          .from("membership_tiers")
          .select("id, name, description, price, currency, image_url, perks, onchain_token_id")
          .eq("creator_wallet", params.id)
          .eq("id", params.tierId)
          .single(),
      ]);

      setCreator(profileData || null);
      setTier(tierData || null);
      setLoading(false);
    }

    loadTier();
  }, [params.id, params.tierId]);

  const perks = useMemo(() => tier?.perks?.filter(Boolean) || [], [tier?.perks]);

  const handleJoin = async () => {
    if (!wallet || !tier) {
      alert("Connect your wallet to continue.");
      return;
    }

    setJoining(true);
    try {
      const currentChainId = Number(wallet.chainId.split(":")[1]);
      if (currentChainId !== CHAIN.id) {
        await wallet.switchChain(CHAIN.id);
      }

      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: CHAIN,
        transport: custom(provider),
      });

      await walletClient.writeContract({
        chain: CHAIN,
        address: DROPSLAND_CREATORS_CONTRACT as `0x${string}`,
        abi: DROPSLAND_CREATORS_ABI,
        functionName: "mintMembership",
        args: [BigInt(tier.onchain_token_id), 1n],
        value: parseEther(String(tier.price)),
      });

      router.push(`/profile/${params.id}`);
    } catch (error) {
      console.error("Join tier failed:", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7FAFC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1FA9D6]" />
        <p className="mt-3 text-sm font-medium text-gray-500">Loading membership tier...</p>
      </div>
    );
  }

  if (!creator || !tier) {
    return (
      <div className="min-h-screen bg-[#F7FAFC]">
        <AppHeader title="Membership" showBack className="bg-white" />
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <h2 className="text-lg font-bold text-gray-900">Tier not found</h2>
          <p className="mt-2 text-sm text-gray-500">This membership may have been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] pb-32">
      <div className="relative overflow-hidden rounded-b-[2rem] bg-white pb-8 shadow-xl shadow-blue-900/5">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-[#1FA9D6]/20 via-[#1FA9D6]/10 to-transparent" />
        <AppHeader title="Membership" showBack className="relative border-none bg-transparent" />

        <div className="relative mt-2 flex flex-col items-center px-5 text-center">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg shadow-blue-900/10">
            <AvatarImage src={creator.avatar_url || undefined} />
            <AvatarFallback className="bg-[#1FA9D6]/15 font-bold text-[#1FA9D6]">
              {creator.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#1FA9D6]/10 px-3 py-1 text-xs font-semibold text-[#1FA9D6]">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified Creator
          </div>

          <h1 className="mt-2 text-2xl font-extrabold text-gray-900">{creator.username}</h1>
        </div>
      </div>

      <div className="px-4 pt-5">
        <motion.div style={{ rotate }} className="origin-top">
          <MembershipCard
            id={tier.onchain_token_id}
            name={tier.name}
            image={tier.image_url}
            index={1}
            variant="shop"
            price={tier.price}
            currency={tier.currency || "ETH"}
            actionLabel="Join Tier"
            onClick={handleJoin}
          />
        </motion.div>

        <section className="mt-5 rounded-3xl bg-white p-5 shadow-xl shadow-blue-900/5">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-[#1FA9D6]" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Perks Included</h2>
          </div>

          <div className="space-y-3">
            {perks.length > 0 ? (
              perks.map((perk, index) => (
                <div key={`${perk}-${index}`} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    <span className="font-semibold text-gray-900">{perk}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Perk details will be announced soon.</p>
            )}
          </div>

          {tier.description && (
            <p className="mt-5 rounded-2xl bg-[#F9FBFD] p-4 text-sm leading-relaxed text-gray-600">
              {tier.description}
            </p>
          )}
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white/95 px-4 pb-6 pt-3 backdrop-blur-md safe-bottom">
        <Button
          onClick={handleJoin}
          disabled={joining}
          className="h-12 w-full rounded-2xl bg-[#1FA9D6] text-base font-bold text-white hover:bg-[#1FA9D6]/90"
        >
          {joining ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Joining Tier...
            </span>
          ) : (
            `Join Tier - ${tier.price} ${tier.currency || "ETH"}`
          )}
        </Button>
      </div>
    </div>
  );
}
