"use client"

// No import needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ActivityViewProps {
  onSelectArtist: (artistId: string) => void
}

export default function ActivityView({ onSelectArtist }: ActivityViewProps) {
  // Añadir el hook useAuth para obtener información del usuario actual
  const { userData, isArtist } = useAuth()

  // Función para redirigir al artista relacionado con la actividad
  const handleSelectArtist = (artistId: string) => {
    console.log("Activity view - Selected artist:", artistId)
    onSelectArtist(artistId)
  }

  // Filtrar actividades según el tipo de usuario
  const filteredActivity = allActivity.filter((activity) => {
    if (isArtist()) {
      // Si es artista, mostrar actividades donde alguien interactúa con él
      return activity.relatedTo === "artist"
    } else {
      // Si es fan, mostrar actividades relacionadas con los artistas que sigue
      return activity.relatedTo === "fan"
    }
  })

  return (
    <div className="p-4 pb-6 bg-gray-50 dark:bg-gray-950">
      <h1 className="text-xl font-bold mb-4 text-white">Activity</h1>

      {filteredActivity.length > 0 ? (
        <div className="space-y-3">
          {filteredActivity.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} onSelectArtist={handleSelectArtist} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-300 font-medium">You don't have any notifications yet</p>
          <p className="text-gray-400 text-sm mt-1">
            {isArtist()
              ? "Interactions with your followers will appear here"
              : "Updates from artists you follow will appear here"}
          </p>
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
    <Card className="overflow-hidden bg-gray-800 border-gray-700">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 cursor-pointer" onClick={() => onSelectArtist(activity.artistId)}>
            <AvatarImage src={activity.avatar} alt={activity.name} />
            <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-white">
              <span className="font-medium">{activity.name}</span> {activity.action}
            </p>
            {activity.message && (
              <p className="text-sm mt-1 bg-gray-700 p-2 rounded-lg text-gray-300">{activity.message}</p>
            )}
            <div className="flex items-center mt-1">
              <p className="text-xs text-gray-400">{activity.time}</p>
              {activity.type === "purchase" && (
                <div className="flex items-center text-bright-yellow text-xs font-medium ml-2">
                  <BanknoteIcon className="h-4 w-4 mr-1" />
                  <span>
                    {activity.amount} ${activity.tokenName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
    message: "I love your latest track! Keep up the great work.",
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
    message: "I think @iamjuampi could have good ideas for this remix.",
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
    message: "You've reached 100 followers! Here's 5 $DROPS as a reward.",
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
    message: "Learning a lot from @iamjuampi's techno production tutorials.",
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
    message: "For your next release. Keep it up!",
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
    message: "New exclusive track available for token holders!",
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
    message: "My new EP 'Techno Dimensions' is now available on all platforms!",
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
    message: "I'll be playing at Club Underground this weekend. Don't miss it!",
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
    message: "Exclusive sound design tutorial available for token holders.",
    time: "2 días atrás",
    artistId: "axs",
    tokenName: "AXS",
    relatedTo: "fan",
  },
]

