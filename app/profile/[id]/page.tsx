"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { getUserMemberships, RewardItem } from "@/lib/alchemy";
import { createWalletClient, custom, parseEther } from "viem";
import { CHAIN, DROPSLAND_CREATORS_CONTRACT } from "@/config/chain";
import { DROPSLAND_CREATORS_ABI } from "@/util/abis";

// Components
import { DJView } from "@/components/profile/dj-view";
import { FanView } from "@/components/profile/fan-view";
import { StaffView } from "@/components/profile/staff-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

// Types
import type { Profile, MembershipTier } from "@/types";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = usePrivy();
  const { wallets } = useWallets();

  const profileId = params.id as string;
  const isOwner =
    currentUser?.wallet?.address?.toLowerCase() === profileId.toLowerCase();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [djTiers, setDjTiers] = useState<MembershipTier[]>([]);
  const [fanMemberships, setFanMemberships] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

      try {
        // 1. Fetch Basic Profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("wallet_address", profileId)
          .single();

        if (profileError || !profileData) {
          setError("Profile not found");
          setLoading(false);
          return;
        }

        setProfile(profileData as Profile);

        // 2. Fetch Role-Specific Data
        // CASE: DJ
        if (profileData.role === "DJ") {
          const { data: tiers } = await supabase
            .from("membership_tiers")
            .select("*")
            .eq("creator_wallet", profileId)
            .eq("is_active", true);
          setDjTiers((tiers as MembershipTier[]) || []);
        }

        // CASE: FAN (Fetch what they own)
        else if (profileData.role === "FAN") {
          const nfts = await getUserMemberships(profileId);
          setFanMemberships(nfts);
        }

        // CASE: STAFF (No extra data needed yet)
      } catch (e) {
        console.error(e);
        setError("Error loading profile");
      } finally {
        setLoading(false);
      }
    }

    if (profileId) loadData();
  }, [profileId]);

  // --- Minting Logic (For DJs) ---
  const handleMint = async (tierId: string) => {
    const tier = djTiers.find((t: MembershipTier) => t.id === tierId);
    if (!tier) return;

    const wallet = wallets.find((w) => w.walletClientType === "privy");
    if (!wallet) return alert("Please connect wallet");

    try {
      await wallet.switchChain(CHAIN.id);
      const provider = await wallet.getEthereumProvider();
      const client = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: CHAIN,
        transport: custom(provider),
      });

      const hash = await client.writeContract({
        address: DROPSLAND_CREATORS_CONTRACT,
        chain: CHAIN,
        abi: DROPSLAND_CREATORS_ABI,
        functionName: "mintMembership",
        args: [BigInt(tier.onchain_token_id), 1n],
        value: parseEther(tier.price.toString()),
      });

      alert(`Transaction Sent! Tx: ${hash}`);
    } catch (e) {
      console.error(e);
      alert("Transaction failed. Check console.");
    }
  };

  // --- Render States ---

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6] mb-2" />
        <p className="text-gray-400 text-sm">Loading Dropsland...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold">User Not Found</h2>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </div>
    );
  }

  // --- Main Render ---

  // Determine Header Background based on Role
  const headerGradient =
    profile.role === "DJ"
      ? "from-purple-500/40 to-black/90"
      : profile.role === "STAFF"
        ? "from-green-500/40 to-black/90"
        : "from-[#1FA9D6]/40 to-black/90";

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Dynamic Header */}
      <div className="relative h-48 bg-gray-900">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${headerGradient}`}
        />
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Role Switcher */}
      {profile.role === "DJ" && (
        <DJView
          profile={profile}
          tiers={djTiers}
          onJoin={handleMint}
          isOwner={isOwner}
        />
      )}

      {profile.role === "FAN" && (
        <FanView
          profile={profile}
          memberships={fanMemberships}
          isOwner={isOwner}
        />
      )}

      {profile.role === "STAFF" && (
        <StaffView profile={profile} isOwner={isOwner} />
      )}
    </div>
  );
}
