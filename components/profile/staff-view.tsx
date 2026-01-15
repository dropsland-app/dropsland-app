"use client";

import { useState } from "react";
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
  QrCode,
  CalendarPlus,
  BarChart3,
  ShieldCheck,
  Pencil,
  Upload,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Profile } from "@/types";
import { supabase } from "@/lib/supabase/client";
import { uploadFileToIPFS } from "@/lib/ipfs";
import Link from "next/link";

interface StaffViewProps {
  profile: Profile;
  isOwner: boolean;
  onProfileUpdate?: (updatedProfile: Profile) => void;
}

export function StaffView({
  profile,
  isOwner,
  onProfileUpdate,
}: StaffViewProps) {
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
      {/* Identity Section */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-green-100 text-green-700 text-2xl font-bold">
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
                      <Avatar className="w-24 h-24 border-2 border-dashed border-gray-200 group-hover:border-green-500 transition-colors">
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
                      Username
                    </Label>
                    <Input
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="Your display name"
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
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
                      placeholder="Tell us about yourself..."
                      className="min-h-[100px] border-gray-200 focus:border-green-500 focus:ring-green-500/20 resize-none"
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
                      className="flex-1 h-11 bg-green-600 hover:bg-green-700"
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
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-gray-500 text-sm mb-2">
          {profile.wallet_address.slice(0, 6)}...
          {profile.wallet_address.slice(-4)}
        </p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Badge className="bg-green-600 hover:bg-green-700 gap-1">
            <ShieldCheck className="w-3 h-3" /> Promoter / Staff
          </Badge>
          {isOwner && <Badge variant="outline">You</Badge>}
        </div>
        {profile.bio && (
          <p className="text-gray-600 mt-4 text-sm max-w-sm mx-auto">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Promoter Dashboard - Only for Owner */}
      {isOwner && (
        <div className="space-y-4">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/create/event" className="w-full">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#1FA9D6] hover:bg-[#1FA9D6]/5 transition-all"
              >
                <div className="p-2 bg-[#1FA9D6]/10 rounded-full text-[#1FA9D6]">
                  <CalendarPlus className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-700">New Event</span>
              </Button>
            </Link>

            <Link href="/verify" className="w-full">
              <Button
                variant="outline"
                className="w-full h-24 flex-col gap-2 rounded-2xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
              >
                <div className="p-2 bg-green-100 rounded-full text-green-600">
                  <QrCode className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-700">Scan Tickets</span>
              </Button>
            </Link>
          </div>

          {/* Analytics / Summary Card */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <h3 className="font-bold text-lg">Event Stats</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-400 uppercase">Events</p>
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-400 uppercase">Tickets</p>
              </div>
              <div>
                <p className="text-2xl font-bold">$0</p>
                <p className="text-xs text-gray-400 uppercase">Volume</p>
              </div>
            </div>
          </div>

          {/* Verified Staff Badge */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-sm text-green-700">
              <ShieldCheck className="w-4 h-4 inline mr-1" />
              Authorized to create events and verify tickets
            </p>
          </div>
        </div>
      )}

      {/* Non-owner view */}
      {!isOwner && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
          <h3 className="font-bold text-green-900 mb-2">
            Verified Event Staff
          </h3>
          <p className="text-sm text-green-700 mb-4">
            Authorized to verify tickets and manage venue entry.
          </p>
          <div className="text-xs text-gray-400">
            Member since:{" "}
            {new Date(profile.created_at || Date.now()).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}
