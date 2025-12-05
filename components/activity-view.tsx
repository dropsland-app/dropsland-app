"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ActivityViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function ActivityView({ onSelectArtist }: ActivityViewProps) {
  const { userData, isArtist } = useAuth()

  const handleSelectArtist = (artistId: string) => {
    console.log("Activity view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  const filteredActivity = allActivity.filter((activity) => {
    if (isArtist()) {
      return activity.relatedTo === "artist"
    } else {
      return activity.relatedTo === "fan"
    }
  })

  return (
    <div className="w-full max-w-full bg-black h-full overflow-y-auto overflow-x-hidden">
      <div className="sticky top-0 bg-black z-10 border-b border-gray-800 px-4 py-3">
        <h1 className="text-xl font-bold text-white">Activity</h1>
      </div>

      {filteredActivity.length > 0 ? (
        <div className="divide-y divide-gray-800">
          {filteredActivity.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onSelectArtist={handleSelectArtist} />
          ))}
        </div>
      ) : (
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400 font-medium">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">
              {isArtist()
                ? "Interactions with your followers will appear here"
                : "Updates from artists you follow will appear here"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityCard({
  activity,
  onSelectArtist,
}: {
  activity: Activity
  onSelectArtist: (artistId: string) => void
}) {
  return (
    <div className="px-4 py-3 hover:bg-white/5 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar
          className="h-11 w-11 cursor-pointer flex-shrink-0 ring-1 ring-white/10"
          onClick={() => onSelectArtist(activity.artistId)}
        >
          <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
          <AvatarFallback className="bg-gray-800 text-white">
            {activity.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-semibold text-white hover:text-gray-300 cursor-pointer text-sm"
              onClick={() => onSelectArtist(activity.artistId)}
            >
              {activity.name}
            </span>
            <span className="text-gray-400 text-sm">{activity.action}</span>
            {activity.type === "purchase" && activity.amount && (
              <div className="flex items-center text-bright-yellow text-sm font-semibold ml-1">
                <BanknoteIcon className="h-3.5 w-3.5 mr-0.5" />
                <span>
                  {activity.amount} ${activity.tokenName}
                </span>
              </div>
            )}
          </div>

          {activity.message && (
            <p className="text-gray-400 text-sm mt-1 leading-relaxed break-words">{activity.message}</p>
          )}

          <p className="text-gray-500 text-xs mt-1.5">{activity.time}</p>
        </div>

        {/* Optional action icon for different types */}
        {activity.type === "purchase" && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bright-yellow/10 flex items-center justify-center">
            <BanknoteIcon className="h-4 w-4 text-bright-yellow" />
          </div>
        )}
      </div>
    </div>
  )
}

// Actualizar la interfaz Activity para incluir el campo relatedTo
interface Activity {
  id: string
  type: "purchase" | "mention" | "reward" | "follow"
  name: string
  avatar: string
  action: string
  message?: string
  amount?: number
  time: string
  artistId: string
  tokenName: string
  relatedTo: "artist" | "fan" // Indica si la actividad es relevante para artistas o fans
}

// Actividades con artistas reales y tokens personalizados
const allActivity: Activity[] = [
  {
    id: "a1",
    type: "purchase",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    action: "bought your tokens",
    message: "Love your latest track!",
    amount: 15,
    time: "5 minutos atrás",
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
    time: "15 minutos atrás",
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
    time: "30 minutos atrás",
    artistId: "axs",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  {
    id: "a4",
    type: "reward",
    name: "Drops",
    avatar: "/avatars/dropsland-logo-square.png",
    action: "gave you a reward for your activity",
    message: "100 followers! Here's 5 $DROPS.",
    amount: 5,
    time: "2 horas atrás",
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
    time: "3 horas atrás",
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
    time: "5 horas atrás",
    artistId: "kr4d",
    tokenName: "JUAMPI",
    relatedTo: "artist",
  },
  // Actividades para fans
  {
    id: "f1",
    type: "reward",
    name: "Banger",
    avatar: "/avatars/banger.jpg",
    action: "released a new reward for followers",
    message: "Exclusive track for token holders!",
    time: "1 hora atrás",
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
    time: "3 horas atrás",
    artistId: "iamjuampi",
    tokenName: "JUAMPI",
    relatedTo: "fan",
  },
  {
    id: "f3",
    type: "follow",
    name: "Nicola Marti",
    avatar: "/avatars/nicola.jpg",
    action: "announced an upcoming event",
    message: "Playing at Club Underground this weekend!",
    time: "1 día atrás",
    artistId: "nicolamarti",
    tokenName: "NICOLA",
    relatedTo: "fan",
  },
  {
    id: "f4",
    type: "reward",
    name: "AXS",
    avatar: "/avatars/axs.jpg",
    action: "released a new production tutorial",
    message: "Exclusive sound design tutorial available.",
    time: "2 días atrás",
    artistId: "axs",
    tokenName: "AXS",
    relatedTo: "fan",
  },
]
