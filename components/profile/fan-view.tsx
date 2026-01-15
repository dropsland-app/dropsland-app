"use client";

import { Profile } from "@/types";
import { RewardItem } from "@/lib/alchemy";
import { Ticket } from "lucide-react";
import { MembershipCard } from "@/components/membership-card";

interface FanViewProps {
  profile: Profile;
  memberships: RewardItem[];
  isOwner: boolean;
  onProfileUpdate: (p: Profile) => void;
}

export function FanView({
  profile,
  memberships,
  isOwner,
  onProfileUpdate,
}: FanViewProps) {
  return (
    <div className="relative -mt-12 px-4 pb-20">
      {/* Profile Header (Avatar/Name) */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg mb-3">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1FA9D6] to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
              {profile.username[0].toUpperCase()}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          @{profile.username}
        </h1>
        {profile.bio && (
          <p className="text-center text-gray-500 text-sm mt-1 max-w-xs">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Memberships Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Membership Collection
          </h2>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {memberships.length} Items
          </span>
        </div>

        {memberships.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {memberships.map((membership, index) => (
              <MembershipCard
                key={`${membership.id}-${index}`}
                id={membership.id}
                name={
                  membership.metadata.name || `Membership #${membership.id}`
                }
                image={membership.metadata.image}
                index={index}
                balance={membership.balance}
                variant="wallet"
                onClick={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">No memberships yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
