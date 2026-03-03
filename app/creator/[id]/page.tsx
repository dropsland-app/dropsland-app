"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Star,
  Users,
  Lock,
  Music,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MembershipTierCard,
  type MembershipTier,
} from "@/components/creator/membership-tier-card";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, parseEther } from "viem";
import { CHAIN, DROPSLAND_CREATORS_CONTRACT } from "@/config/chain";
import { DROPSLAND_CREATORS_ABI } from "@/util/abis";
import { supabase } from "@/lib/supabase/client";

// Color palette for tiers
const TIER_COLORS = [
  "bg-slate-700",
  "bg-[#1FA9D6]",
  "bg-purple-600",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-rose-600",
];

interface CreatorProfile {
  wallet_address: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  role: string;
}

interface MembershipTierDB {
  id: string;
  creator_wallet: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  perks: string[] | null;
  onchain_token_id: number;
  max_supply: number;
  created_at: string;
}

export default function CreatorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { wallets } = useWallets();
  const [activeTab, setActiveTab] = useState("membership");
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mintingTierId, setMintingTierId] = useState<string | null>(null);

  // Fetch creator profile and tiers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch creator profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("wallet_address", params.id)
          .single();

        if (profileData) {
          setCreator(profileData);
        }

        // Fetch membership tiers for this creator
        const { data: tiersData } = await supabase
          .from("membership_tiers")
          .select("*")
          .eq("creator_wallet", params.id)
          .order("price", { ascending: true });

        if (tiersData && tiersData.length > 0) {
          // Transform database tiers to MembershipTier format
          const transformedTiers: MembershipTier[] = tiersData.map(
            (tier: MembershipTierDB, index: number) => ({
              id: tier.id,
              name: tier.name,
              price: tier.price,
              currency: tier.currency || "ETH",
              color: TIER_COLORS[index % TIER_COLORS.length],
              benefits: tier.perks || [],
              isPopular: index === 1, // Mark second tier as popular
              image: tier.image_url || undefined,
              onchainTokenId: tier.onchain_token_id,
            }),
          );
          setTiers(transformedTiers);
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleJoin = async (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;

    const wallet =
      wallets.find((w) => w.walletClientType === "privy") || wallets[0];

    if (!wallet) {
      alert("Please connect your wallet first");
      return;
    }

    setMintingTierId(tierId);

    try {
      // Switch chain if needed
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

      // Get the on-chain token ID from the tier
      const onchainTokenId = (
        tier as MembershipTier & { onchainTokenId?: number }
      ).onchainTokenId;

      if (onchainTokenId === undefined) {
        throw new Error("Tier does not have an on-chain token ID");
      }

      const hash = await walletClient.writeContract({
        chain: CHAIN,
        address: DROPSLAND_CREATORS_CONTRACT as `0x${string}`,
        abi: DROPSLAND_CREATORS_ABI,
        functionName: "mintMembership",
        args: [BigInt(onchainTokenId), 1n], // TierID, Amount
        value: parseEther(tier.price.toString()), // Price in ETH
      });

      console.log("Tx Hash:", hash);
      alert(`Transaction sent! Hash: ${hash.slice(0, 10)}...`);
    } catch (e) {
      console.error("Purchase failed:", e);
      alert("Purchase failed. See console for details.");
    } finally {
      setMintingTierId(null);
    }
  };

  // Mock content for the feed tab
  const content = [
    {
      id: 1,
      type: "video",
      title: "Live @ Space Miami",
      isLocked: false,
      views: "12K",
      image: "/posts/space.jpg",
    },
    {
      id: 2,
      type: "audio",
      title: "Unreleased ID (Edit)",
      isLocked: true,
      views: "Locked",
      image: "/posts/audio-lock.jpg",
    },
    {
      id: 3,
      type: "video",
      title: "Studio Tour & Tips",
      isLocked: true,
      views: "Locked",
      image: "/posts/studio.jpg",
    },
  ];

  const displayName = creator?.username || `Creator`;
  const displayHandle = `@${creator?.username?.toLowerCase().replace(/\s+/g, "") || params.id.slice(0, 8)}`;
  const displayBio =
    creator?.bio ||
    "Join my membership for exclusive access, unreleased content, and special perks.";
  const displayAvatar = creator?.avatar_url || "/placeholder.svg";

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 1. Immersive Header */}
      <div className="relative h-64 w-full bg-gradient-to-br from-[#1FA9D6] to-purple-600">
        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center z-10">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/20 text-white hover:bg-black/40 backdrop-blur-md rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Floating Avatar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
            <AvatarImage src={displayAvatar} />
            <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {/* Verified Badge */}
          {creator?.role === "DJ" && (
            <div className="absolute bottom-1 right-1 bg-[#1FA9D6] p-1 rounded-full border-2 border-white shadow-sm">
              <Star className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          )}
        </div>
      </div>

      {/* 2. Creator Info */}
      <div className="pt-14 px-5 text-center pb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
          {displayName}
        </h1>
        <p className="text-gray-500 font-medium text-sm mb-3">
          {displayHandle}
        </p>

        <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto mb-4">
          {displayBio}
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 mb-6">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Users className="w-3.5 h-3.5" />
            {tiers.length} Tiers
          </div>
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <Music className="w-3.5 h-3.5" />
            {creator?.role || "Creator"}
          </div>
        </div>
      </div>

      {/* 3. Main Content Tabs */}
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <div className="px-5 mb-6">
          <TabsList className="w-full grid grid-cols-2 bg-gray-100 p-1 rounded-xl h-12">
            <TabsTrigger
              value="membership"
              className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              Memberships
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm transition-all"
            >
              Exclusive Feed
            </TabsTrigger>
          </TabsList>
        </div>

        {/* -- MEMBERSHIP TAB -- */}
        <TabsContent
          value="membership"
          className="px-5 space-y-6 animate-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-[#1FA9D6]" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Select a Tier
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6] mb-4" />
              <p className="text-gray-500 text-sm">Loading memberships...</p>
            </div>
          ) : tiers.length > 0 ? (
            <div className="grid gap-5">
              {tiers.map((tier) => (
                <div key={tier.id} className="relative">
                  <MembershipTierCard tier={tier} onJoin={handleJoin} />
                  <Button
                    variant="ghost"
                    className="mt-2 w-full rounded-2xl text-sm font-semibold text-[#1FA9D6] hover:bg-[#1FA9D6]/10"
                    onClick={() => router.push(`/creator/${params.id}/tier/${tier.id}`)}
                  >
                    View Tier Details
                  </Button>
                  {mintingTierId === tier.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[#1FA9D6]">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Processing...</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">
                No Memberships Yet
              </h3>
              <p className="text-sm text-gray-500">
                This creator hasn&apos;t set up any membership tiers yet.
              </p>
            </div>
          )}

          <p className="text-xs text-center text-gray-400 mt-4 pb-4">
            Memberships are minted as NFTs on {CHAIN.name}.
            <br />
            You own them forever.
          </p>
        </TabsContent>

        {/* -- EXCLUSIVE FEED TAB -- */}
        <TabsContent
          value="content"
          className="px-5 animate-in slide-in-from-right-4 duration-500"
        >
          <div className="grid grid-cols-2 gap-3">
            {content.map((item) => (
              <div
                key={item.id}
                className={`
                  relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm border border-gray-100
                  ${item.isLocked ? "grayscale opacity-90" : ""}
                `}
              >
                {/* Background Image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                  {/* Lock State */}
                  {item.isLocked ? (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-black font-bold text-[10px]"
                      >
                        MEMBERS ONLY
                      </Badge>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-[#1FA9D6] border-none text-[10px]">
                        FREE
                      </Badge>
                    </div>
                  )}

                  <h3 className="text-white font-bold text-sm leading-tight mb-0.5 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-[10px] uppercase font-medium">
                    {item.type} • {item.views}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA for Content Tab */}
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
            <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900">Unlock Full Access</h3>
            <p className="text-sm text-gray-500 mb-4 mt-1">
              Join a membership tier to access exclusive content.
            </p>
            <Button
              onClick={() => setActiveTab("membership")}
              variant="outline"
              className="bg-white text-black font-bold border-gray-200"
            >
              View Plans
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
