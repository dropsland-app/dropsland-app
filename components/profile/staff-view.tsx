import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { QrCode, ShieldCheck } from "lucide-react";
import { Profile } from "@/types";
import Link from "next/link";

interface StaffViewProps {
  profile: Profile;
  isOwner: boolean;
}

export function StaffView({ profile, isOwner }: StaffViewProps) {
  return (
    <div className="px-5 -mt-12 relative z-10">
      <div className="flex justify-center mb-4">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="bg-green-100 text-green-700">
            {profile.username?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-gray-500 text-sm mb-2">
          {profile.wallet_address.slice(0, 6)}...
          {profile.wallet_address.slice(-4)}
        </p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Badge className="bg-green-600 hover:bg-green-700 flex gap-1 items-center">
            <ShieldCheck className="w-3 h-3" /> Official Staff
          </Badge>
          {isOwner && <Badge variant="outline">You</Badge>}
        </div>
        {profile.bio && (
          <p className="text-gray-600 mt-4 text-sm max-w-sm mx-auto">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Staff Actions */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
        <h3 className="font-bold text-green-900 mb-2">Verified Event Staff</h3>
        <p className="text-sm text-green-700 mb-6">
          Authorized to verify tickets and manage venue entry.
        </p>

        {isOwner ? (
          <Link href="/verify">
            <Button className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold shadow-green-200 shadow-lg">
              <QrCode className="mr-2 w-5 h-5" /> Open Scanner
            </Button>
          </Link>
        ) : (
          <div className="text-xs text-gray-400">
            Start Date:{" "}
            {new Date(profile.created_at || Date.now()).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
