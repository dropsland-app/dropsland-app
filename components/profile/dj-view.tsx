"use client";

import { useState } from "react";
import { MembershipCard } from "@/components/membership-card";
import {
  MembershipTierCard,
  type MembershipTier as TierCardProps,
} from "@/components/creator/membership-tier-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pencil,
  Upload,
  Loader2,
  Check,
  X,
  Sparkles,
  Music,
  Clock,
} from "lucide-react";
import type { Profile, MembershipTier, Track } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { uploadFileToIPFS } from "@/lib/ipfs";

// Color palette for subscription tier cards
const TIER_COLORS = [
  "bg-slate-700",
  "bg-[#1FA9D6]",
  "bg-purple-600",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-rose-600",
];

/** Map DB MembershipTier → MembershipTierCard UI shape */
function toTierCardProps(
  tier: MembershipTier,
  index: number,
): TierCardProps {
  return {
    id: tier.id,
    name: tier.name,
    price: tier.price,
    currency: tier.currency,
    color: TIER_COLORS[index % TIER_COLORS.length],
    benefits: tier.perks ?? [],
    isPopular: index === 1,
    image: tier.image_url ?? undefined,
  };
}

/** Format seconds into m:ss */
function formatDuration(seconds: number | null): string {
  if (seconds == null) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface DJViewProps {
  profile: Profile;
  tiers: MembershipTier[];
  tracks: Track[];
  onJoin: (tierId: string) => void;
  isOwner: boolean;
  onProfileUpdate?: (updatedProfile: Profile) => void;
}

export function DJView({
  profile,
  tiers,
  tracks,
  onJoin,
  isOwner,
  onProfileUpdate,
}: DJViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Edit form state
  const [editUsername, setEditUsername] = useState(profile.username);
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatar_url || "");
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url || "");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to IPFS
    setUploadingImage(true);
    try {
      const ipfsUrl = await uploadFileToIPFS(file);
      setEditAvatarUrl(ipfsUrl);
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to upload image. Please try again.");
      setAvatarPreview(profile.avatar_url || "");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editUsername.trim()) {
      alert("Username is required");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: editUsername.trim(),
          bio: editBio.trim(),
          avatar_url: editAvatarUrl,
        })
        .eq("wallet_address", profile.wallet_address);

      if (error) throw error;

      // Update local state
      const updatedProfile: Profile = {
        ...profile,
        username: editUsername.trim(),
        bio: editBio.trim(),
        avatar_url: editAvatarUrl,
      };

      onProfileUpdate?.(updatedProfile);
      setIsEditOpen(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditUsername(profile.username);
    setEditBio(profile.bio || "");
    setEditAvatarUrl(profile.avatar_url || "");
    setAvatarPreview(profile.avatar_url || "");
  };

  return (
    <div className="px-5 -mt-12 relative z-10">
      {/* Identity */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-xl font-bold">
              {profile.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOwner && (
            <Dialog
              open={isEditOpen}
              onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Edit Profile
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                  {/* Avatar Upload */}
                  <div className="flex justify-center">
                    <label className="relative cursor-pointer group">
                      <Avatar className="w-24 h-24 border-2 border-dashed border-gray-200 group-hover:border-purple-500 transition-colors">
                        <AvatarImage src={avatarPreview} />
                        <AvatarFallback className="bg-gray-50">
                          {uploadingImage ? (
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                          ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Artist Name
                    </Label>
                    <Input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="Your display name"
                      className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Bio
                    </Label>
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell fans about yourself..."
                      className="min-h-[100px] border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-11"
                      onClick={() => setIsEditOpen(false)}
                      disabled={saving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 h-11 bg-purple-600 hover:bg-purple-700"
                      onClick={handleSaveProfile}
                      disabled={saving || uploadingImage}
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
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

      {/* --- Benefits Section --- */}
      {(() => {
        const allPerks = tiers.flatMap((t) => t.perks ?? []);
        const uniquePerks = [...new Set(allPerks)];
        if (uniquePerks.length === 0) return null;
        return (
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
                Member Benefits
              </h2>
            </div>
            <div className="grid gap-2">
              {uniquePerks.map((perk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="mt-0.5 min-w-[20px] h-[20px] rounded-full bg-green-50 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700 leading-tight">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* --- Subscriptions Section (Tier Cards) --- */}
      {tiers.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
              Subscriptions
            </h2>
            <span className="text-xs text-gray-400">
              {tiers.length} {tiers.length === 1 ? "Tier" : "Tiers"}
            </span>
          </div>
          <div className="grid gap-5">
            {tiers.map((tier, index) => (
              <MembershipTierCard
                key={tier.id}
                tier={toTierCardProps(tier, index)}
                onJoin={onJoin}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- Media Section (Tracks) --- */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-[#1FA9D6]" />
            <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider">
              Media
            </h2>
          </div>
          <span className="text-xs text-gray-400">
            {tracks.length} {tracks.length === 1 ? "Track" : "Tracks"}
          </span>
        </div>

        {tracks.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <Music className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No tracks yet.</p>
            {isOwner && (
              <p className="text-xs text-[#1FA9D6] mt-1">
                Go to Create &gt; Music to upload one.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                {/* Cover image or fallback */}
                {track.cover_image_url ? (
                  <img
                    src={track.cover_image_url}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-[#1FA9D6]/20 flex items-center justify-center">
                    <Music className="w-10 h-10 text-purple-300" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">
                    {track.title}
                  </h3>
                  {track.duration_seconds != null && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-white/70" />
                      <span className="text-white/70 text-[10px] font-medium">
                        {formatDuration(track.duration_seconds)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Active Memberships (original section) --- */}
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
            {tiers.map((tier, index) => (
              <MembershipCard
                key={tier.id}
                id={tier.onchain_token_id}
                name={tier.name}
                image={tier.image_url || ""}
                index={index}
                variant="shop"
                price={tier.price}
                currency={tier.currency}
                actionLabel="Join Tier"
                onClick={() => onJoin(tier.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
