"use client";

import { useRouter } from "next/navigation";
import { Star, Pencil, Plus, QrCode } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface ProfileHeaderProps {
  userProfile: any;
  isEditingBio: boolean;
  editedBio: string;
  setEditedBio: (val: string) => void;
  setIsEditingBio: (val: boolean) => void;
  handleSaveBio: () => void;
  balance: number;
  donated: number;
  rewardsCount: number;
  avatarSrc: string;
  coverSrc: string;
}

export function ProfileHeader({
  userProfile,
  isEditingBio,
  editedBio,
  setEditedBio,
  setIsEditingBio,
  handleSaveBio,
  balance,
  donated,
  rewardsCount,
  avatarSrc,
  coverSrc,
}: ProfileHeaderProps) {
  const router = useRouter();

  return (
    <>
      {/* Cover Image */}
      <div className="relative h-40 bg-neutral-100 border-b border-neutral-100">
        {coverSrc && (
          <img
            src={coverSrc}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="px-4">
        {/* Avatar */}
        <div className="flex justify-center -mt-16 mb-4 relative z-0">
          <Avatar className="w-28 h-28 border-4 border-white shadow-sm bg-white">
            <AvatarImage src={avatarSrc} alt={userProfile.name} />
            <AvatarFallback className="bg-gradient-to-br from-[#1FA9D6] to-[#1FA9D6]/80 text-white text-3xl font-bold">
              {userProfile.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <div className="flex items-center gap-2 justify-center mb-2">
            <h1 className="text-2xl font-bold text-[#1E1E1E] break-words max-w-full">
              {userProfile.name}
            </h1>
            {userProfile.isVerified && (
              <Star className="h-5 w-5 text-[#1FA9D6] fill-[#1FA9D6] flex-shrink-0" />
            )}
          </div>
          <p className="text-[#3A3A3A] text-base mb-3 break-words">
            @{userProfile.handle}
          </p>
          <div className="flex items-center gap-2 justify-center flex-wrap mb-4">
            <Badge
              variant="outline"
              className="bg-neutral-50 text-neutral-700 border-neutral-200 text-xs"
            >
              {userProfile.category}
            </Badge>
            <span className="text-xs text-[#3A3A3A]">
              Member since {userProfile.memberSince}
            </span>
          </div>

          {isEditingBio ? (
            <div className="space-y-2 max-w-full">
              <Textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="bg-[#3A3A3A]/5 border-[#3A3A3A]/30 text-[#1E1E1E] w-full text-sm"
                rows={3}
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={handleSaveBio}
                  className="bg-[#1FA9D6] px-4 py-1.5 rounded-full text-white text-xs hover:bg-[#1FA9D6]/90 font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="bg-neutral-100 px-4 py-1.5 rounded-full border border-neutral-200 text-neutral-700 text-xs hover:bg-neutral-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[#3A3A3A] text-sm leading-relaxed break-words max-w-full mb-2">
                {userProfile.bio}
              </p>

              <div className="flex items-center gap-2 justify-center">
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-700 text-xs hover:bg-neutral-100 inline-flex items-center gap-1 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit Bio
                </button>

                <button
                  onClick={() => router.push("/create/reward")}
                  className="bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-700 text-xs hover:bg-neutral-100 inline-flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Create Merch
                </button>

                <button
                  onClick={() => router.push("/verify")}
                  className="bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200 text-neutral-700 text-xs hover:bg-neutral-100 inline-flex items-center gap-1 transition-colors"
                >
                  <QrCode className="w-3 h-3" />
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 py-4 mb-4 border-y border-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold text-[#1E1E1E]">{balance}</p>
            <p className="text-xs text-[#3A3A3A]">Balance</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#1E1E1E]">{donated}</p>
            <p className="text-xs text-[#3A3A3A]">Purchased</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-[#1E1E1E]">
              {rewardsCount}
            </p>
            <p className="text-xs text-[#3A3A3A]">Rewards</p>
          </div>
        </div>
      </div>
    </>
  );
}