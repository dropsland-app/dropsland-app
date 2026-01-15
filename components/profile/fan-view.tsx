import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Profile } from "@/types";
import { RewardItem } from "@/lib/alchemy";

interface FanViewProps {
  profile: Profile;
  memberships: RewardItem[];
  isOwner: boolean;
}

export function FanView({ profile, memberships, isOwner }: FanViewProps) {
  return (
    <div className="px-5 -mt-12 relative z-10">
      <div className="flex justify-center mb-4">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback>{profile.username?.[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-gray-500 text-sm mb-2">
          {profile.wallet_address.slice(0, 6)}...
          {profile.wallet_address.slice(-4)}
        </p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            Fan
          </Badge>
          {isOwner && <Badge variant="outline">You</Badge>}
        </div>
        <p className="text-gray-600 mt-4 text-sm">
          {profile.bio || "Just here for the music."}
        </p>
      </div>

      {/* Collection Section */}
      <div>
        <h2 className="font-bold text-sm text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
          Collection
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {memberships.length === 0 ? (
            <div className="col-span-2 text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-400 text-sm">
                No memberships collected yet.
              </p>
            </div>
          ) : (
            memberships.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border-0 shadow-md flex flex-col"
              >
                <div className="aspect-square bg-gray-200 relative">
                  {item.metadata.image && (
                    <img
                      src={item.metadata.image}
                      alt={item.metadata.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-2 bg-white flex-1">
                  <p className="font-bold text-xs truncate">
                    {item.metadata.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {item.balance}x owned
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
