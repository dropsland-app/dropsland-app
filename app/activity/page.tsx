"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { BanknoteIcon } from "@/components/icons/banknote-icon";

// Interface for Activity Items
interface Activity {
  id: string;
  type: "purchase" | "mention" | "reward" | "follow";
  name: string;
  avatar: string;
  action: string;
  message?: string;
  amount?: number;
  time: string;
  artistId: string;
  tokenName: string;
  relatedTo: "artist" | "fan";
}

// Mock Data
const allActivity: Activity[] = [
  {
    id: "a1",
    type: "purchase",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    action: "bought your tokens",
    message: "Love your latest track!",
    amount: 15,
    time: "5 minutes ago",
    artistId: "banger",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  {
    id: "a2",
    type: "mention",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    action: "mentioned you in a comment",
    message: "@iamjuampi could have ideas for this remix.",
    time: "15 minutes ago",
    artistId: "nicolamarti",
    tokenName: "NICOLA",
    relatedTo: "artist",
  },
  {
    id: "a3",
    type: "purchase",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    action: "bought your tokens",
    amount: 25,
    time: "30 minutes ago",
    artistId: "axs",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  {
    id: "a4",
    type: "reward",
    name: "Drops",
    avatar: "/avatars/dropsland-logo-square.png",
    action: "gave you a reward",
    message: "100 followers! Here's 5 $DROPS.",
    amount: 5,
    time: "2 hours ago",
    artistId: "dropsland",
    tokenName: "DROPS",
    relatedTo: "artist",
  },
  {
    id: "a5",
    type: "mention",
    name: "FLUSH",
    avatar: "/avatars/flush.jpg",
    action: "mentioned you in a post",
    message: "Learning from @iamjuampi's tutorials.",
    time: "3 hours ago",
    artistId: "flush",
    tokenName: "FLUSH",
    relatedTo: "artist",
  },
  {
    id: "a6",
    type: "purchase",
    name: "Kr4D",
    avatar: "/avatars/kr4d.jpg",
    action: "bought your tokens",
    message: "For your next release!",
    amount: 10,
    time: "5 hours ago",
    artistId: "kr4d",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  // Fan Activities
  {
    id: "f1",
    type: "reward",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    action: "released a new reward",
    message: "Exclusive track for token holders!",
    time: "1 hour ago",
    artistId: "banger",
    tokenName: "BANGER",
    relatedTo: "fan",
  },
  {
    id: "f2",
    type: "mention",
    name: "iamjuampi",
    avatar: "/avatars/juampi.jpg",
    action: "posted a new track",
    message: "New EP 'Techno Dimensions' out now!",
    time: "3 hours ago",
    artistId: "iamjuampi",
    tokenName: "JUAMPI",
    relatedTo: "fan",
  },
  {
    id: "f3",
    type: "follow",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    action: "announced an event",
    message: "Playing at Club Underground this weekend!",
    time: "1 day ago",
    artistId: "nicolamarti",
    tokenName: "NICOLA",
    relatedTo: "fan",
  },
  {
    id: "f4",
    type: "reward",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    action: "released a tutorial",
    message: "Exclusive sound design tutorial available.",
    time: "2 days ago",
    artistId: "axs",
    tokenName: "AXS",
    relatedTo: "fan",
  },
];

export default function ActivityPage() {
  const router = useRouter();
  const { isArtist } = useAuth();

  // Navigation handler
  const handleSelectArtist = (artistId: string) => {
    console.log("Navigating to artist:", artistId);
    // Assuming you will implement a dynamic profile page later:
    router.push(`/profile/${artistId}`);
  };

  const filteredActivity = allActivity.filter((activity) => {
    if (isArtist()) {
      return activity.relatedTo === "artist";
    } else {
      return activity.relatedTo === "fan";
    }
  });

  return (
    <div className="w-full max-w-full bg-white h-full overflow-y-auto overflow-x-hidden pb-24">
      <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-4 pt-12 pb-3">
        <h1 className="text-xl font-bold text-[#1E1E1E]">Activity</h1>
      </div>

      {filteredActivity.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {filteredActivity.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSelectArtist={handleSelectArtist}
            />
          ))}
        </div>
      ) : (
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 font-medium">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">
              {isArtist()
                ? "Interactions with your followers will appear here"
                : "Updates from artists you follow will appear here"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ActivityCard({
  activity,
  onSelectArtist,
}: {
  activity: Activity;
  onSelectArtist: (artistId: string) => void;
}) {
  return (
    <div className="px-4 py-3 hover:bg-[#3A3A3A]/5 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar
          className="h-11 w-11 cursor-pointer flex-shrink-0 ring-1 ring-[#3A3A3A]/20"
          onClick={() => onSelectArtist(activity.artistId)}
        >
          <AvatarImage
            src={activity.avatar || "/placeholder.svg"}
            alt={activity.name}
          />
          <AvatarFallback className="bg-[#3A3A3A]/10 text-[#1E1E1E]">
            {activity.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className="font-semibold text-[#1E1E1E] hover:text-[#1FA9D6] cursor-pointer text-sm"
              onClick={() => onSelectArtist(activity.artistId)}
            >
              {activity.name}
            </span>
            <span className="text-[#3A3A3A] text-sm">{activity.action}</span>
            {activity.type === "purchase" && activity.amount && (
              <div className="flex items-center text-[#1FA9D6] text-sm font-semibold ml-1">
                <BanknoteIcon className="h-3.5 w-3.5 mr-0.5" />
                <span>
                  {activity.amount} ${activity.tokenName}
                </span>
              </div>
            )}
          </div>

          {activity.message && (
            <p className="text-[#3A3A3A] text-sm mt-1 leading-relaxed break-words">
              {activity.message}
            </p>
          )}

          <p className="text-[#3A3A3A]/70 text-xs mt-1.5">{activity.time}</p>
        </div>

        {/* Optional action icon for different types */}
        {activity.type === "purchase" && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1FA9D6]/10 flex items-center justify-center">
            <BanknoteIcon className="h-4 w-4 text-[#1FA9D6]" />
          </div>
        )}
      </div>
    </div>
  );
}
