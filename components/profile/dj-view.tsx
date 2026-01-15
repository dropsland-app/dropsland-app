import { MembershipTierCard } from "@/components/creator/membership-tier-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Profile, MembershipTier } from "@/types";

interface DJViewProps {
  profile: Profile;
  tiers: MembershipTier[];
  onJoin: (tierId: string) => void;
  isOwner: boolean;
}

export function DJView({ profile, tiers, onJoin, isOwner }: DJViewProps) {
  return (
    <div className="px-5 -mt-12 relative z-10">
      {/* Identity */}
      <div className="flex justify-center mb-4">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-xl font-bold">
            {profile.username?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
        <p className="text-gray-500 text-sm mb-2">
          {profile.wallet_address.slice(0, 6)}...
          {profile.wallet_address.slice(-4)}
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge className="bg-purple-600 hover:bg-purple-700">
            DJ / Artist
          </Badge>
          {isOwner && <Badge variant="outline">You</Badge>}
        </div>
        <p className="text-gray-600 mt-4 text-sm max-w-sm mx-auto">
          {profile.bio || "Building a community on Dropsland."}
        </p>
      </div>

      {/* Selling Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
            Active Memberships
          </h2>
          <span className="text-xs text-gray-400">{tiers.length} Tiers</span>
        </div>

        {tiers.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No memberships active yet.</p>
            {isOwner && (
              <p className="text-xs text-[#1FA9D6] mt-1">
                Go to Create to add one.
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-5">
            {tiers.map((tier) => (
              <MembershipTierCard
                key={tier.id}
                tier={{
                  id: tier.id,
                  name: tier.name,
                  price: tier.price,
                  currency: tier.currency,
                  image: tier.image_url,
                  color: "bg-zinc-900",
                  benefits: tier.perks || [],
                  isPopular: false,
                }}
                onJoin={onJoin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
