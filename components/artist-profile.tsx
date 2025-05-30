"use client"

import { useState } from "react"
import { ArrowLeft, Heart, MessageCircle, Share2, Lock, Disc, Video, Users, Award } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ArtistProfileProps {
  artistId: string
  onBack: () => void
}

export default function ArtistProfile({ artistId, onBack }: ArtistProfileProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addToBalance, isArtist } = useAuth()

  // Find artist by ID with better error handling
  const artist = artists.find((a) => a.id === artistId)

  console.log("Artist Profile - ID received:", artistId)
  console.log("Artist Profile - Artist found:", artist)

  // If artist not found, show an error message
  if (!artist) {
    return (
      <div className="p-4 text-center">
        <Button variant="outline" size="sm" className="mb-4 bg-gray-800 text-white border-gray-700" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <p className="text-white">Artist not found. Please try again.</p>
      </div>
    )
  }

  // Simulate network delay
  const handleBuyToken = () => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      addToBalance(-10) // Subtract DROPS

      toast({
        title: "Purchase successful!",
        description: `You've bought 10 $${artist.tokenName} from ${artist.name}`,
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="pb-6 bg-gray-950">
      {/* Back button at the top */}

      {/* Cover Image */}
      <div className="relative h-36 bg-gradient-to-r from-gray-800 to-black">
        {artist.coverImage && (
          <img
            src={artist.coverImage || "/placeholder.svg"}
            alt={`${artist.name}'s cover`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Artist Info */}
      <div className="px-4 relative">
        <div className="flex items-start mt-[-40px]">
          <Avatar className="h-20 w-20 border-4 border-gray-900">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-xl text-white">{artist.name}</h1>
              <p className="text-gray-400 text-sm">{artist.handle}</p>
            </div>
            <Button
              className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              onClick={handleBuyToken}
              disabled={isLoading}
            >
              <BanknoteIcon className="h-4 w-4 mr-1" />
              Buy ${artist.tokenName}
            </Button>
          </div>

          <Badge variant="outline" className="mt-2 bg-gray-800 text-gray-300 border-gray-700">
            {artist.genre}
          </Badge>

          <p className="mt-3 text-sm text-gray-300">{artist.description}</p>

          <div className="flex mt-3 space-x-4 text-sm">
            <div>
              <span className="font-bold text-white">{artist.supporters}</span>
              <span className="text-gray-400 ml-1">followers</span>
            </div>
            <div>
              <span className="font-bold text-white">{artist.blgReceived}</span>
              <span className="text-gray-400 ml-1">$DROPS received</span>
            </div>
          </div>
        </div>

        {/* Token Info */}
        <Card className="mt-4 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white">${artist.tokenName}</h3>
                <p className="text-xs text-gray-400">{artist.name}'s personal token</p>
              </div>
              <div className="text-right">
                <p className="text-bright-yellow font-bold">${artist.tokenPrice} USD</p>
                <p className="text-xs text-gray-400">Current price</p>
              </div>
            </div>
            <Button
              className="w-full mt-3 bg-bright-yellow hover:bg-bright-yellow-700 text-black"
              onClick={handleBuyToken}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Buy $${artist.tokenName}`}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs for Posts and Exclusive Content */}
        <div className="mt-6">
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="posts" className="data-[state=active]:bg-gray-700">
                Posts
              </TabsTrigger>
              <TabsTrigger value="rewards" className="data-[state=active]:bg-gray-700">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="certifications" className="data-[state=active]:bg-gray-700">
                Certifications
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-4 space-y-4">
              {artist.posts.map((post, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={artist.avatar} alt={artist.name} />
                        <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-white">{artist.name}</p>
                        <p className="text-gray-400 text-xs">{post.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{post.content}</p>
                    {post.image && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-auto" />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <button className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </button>
                      <button className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </button>
                      <button className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="mt-4 space-y-3">
              <div className="mb-3">
                <h3 className="text-white font-medium">Artist Rewards</h3>
                <p className="text-sm text-gray-400">Exclusive rewards for {artist.name}'s token holders</p>
              </div>

              {artist.rewards ? (
                artist.rewards.map((reward, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-bright-yellow/20 flex items-center justify-center">
                          <BanknoteIcon className="h-5 w-5 text-bright-yellow" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">{reward.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                              {reward.minTokens} $DROPS required
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                          Get
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                  <Lock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">No rewards available yet</p>
                  <p className="text-gray-400 text-sm mt-1">{artist.name} hasn't created any rewards yet</p>
                </div>
              )}
            </TabsContent>

            {/* Certifications Tab */}
            <TabsContent value="certifications" className="mt-4 space-y-3">
              <div className="mb-3">
                <h3 className="text-white font-medium">Artist Certifications</h3>
                <p className="text-sm text-gray-400">Achievements and certifications earned by {artist.name}</p>
              </div>

              {artist.certifications ? (
                artist.certifications.map((cert, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-bright-yellow/20 flex items-center justify-center">
                          {cert.type === "gold" && <Disc className="h-6 w-6 text-bright-yellow" />}
                          {cert.type === "platinum" && <Disc className="h-6 w-6 text-gray-300" />}
                          {cert.type === "views" && <Video className="h-6 w-6 text-bright-yellow" />}
                          {cert.type === "soldout" && <Users className="h-6 w-6 text-bright-yellow" />}
                          {cert.type === "award" && <Award className="h-6 w-6 text-bright-yellow" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-white font-medium">{cert.title}</p>
                            <Button
                              size="sm"
                              className={`${
                                cert.type === "gold"
                                  ? "bg-[#F9BF15] hover:bg-[#e0ab13] text-black" // Changed from #082479 to #F9BF15 with black text
                                  : cert.type === "platinum"
                                    ? "bg-gray-400 hover:bg-gray-500"
                                    : cert.type === "views"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : cert.type === "soldout"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                              } text-white rounded-full`}
                            >
                              {cert.type === "gold" || cert.type === "platinum"
                                ? "Stream"
                                : cert.type === "views"
                                  ? "Watch"
                                  : cert.type === "soldout"
                                    ? "Tour Dates"
                                    : "Award"}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-400">{cert.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{cert.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                  <Award className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium">No certifications yet</p>
                  <p className="text-gray-400 text-sm mt-1">{artist.name} hasn't earned any certifications yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Fan-only section */}
        {!isArtist() && (
          <Card className="mt-6 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-bright-yellow mr-2" />
                <div className="flex-1">
                  <h3 className="text-white font-medium">Want to create content?</h3>
                  <p className="text-sm text-gray-400">Apply to become an artist on DROPSLAND</p>
                </div>
                <Button className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">Apply</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// Vamos a actualizar los datos de los artistas para que cada uno tenga contenido único
// Reemplazaremos la constante artists con datos más personalizados

const artists = [
  {
    id: "iamjuampi",
    name: "iamjuampi",
    handle: "@iamjuampi",
    avatar: "/avatars/juampi.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Tech-House",
    description: "DJ, producer, and founder of the record label Best Drops Ever.",
    supporters: 1850,
    blgReceived: 1850,
    featured: true,
    tokenName: "JUAMPI",
    tokenPrice: 0.45,
    posts: [
      {
        content:
          "Just released my new EP 'Techno Dimensions'. Available now on all platforms! #TechnoDimensions #NewRelease",
        time: "2 hours ago",
        likes: 87,
        comments: 14,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Preparing my set for this weekend at Club Underground. It's going to be an epic night of techno and house. Who's coming? 🎧",
        time: "1 day ago",
        likes: 65,
        comments: 23,
      },
      {
        content:
          "Happy to announce I'll be playing at the Electronic Dreams festival next month. See you there! #ElectronicDreams #Festival",
        time: "3 days ago",
        likes: 112,
        comments: 31,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Working on new sounds for my upcoming release. I'm experimenting with analog synthesizers and 90s samples.",
        time: "1 week ago",
        likes: 94,
        comments: 17,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Midnight Pulse (Extended Mix)",
        description: "10-minute extended version only for $JUAMPI holders",
        date: "Mar 15, 2025",
      },
      {
        title: "Production tutorial - Techno Kicks",
        description: "Learn to create powerful kicks for your techno tracks",
        date: "Mar 10, 2025",
      },
      {
        title: "Live set - Club Underground",
        description: "Complete recording of my latest set at Club Underground",
        date: "Mar 5, 2025",
      },
    ],
    rewards: [
      {
        title: "Exclusive Monthly Track",
        description: "Unreleased track available only to token holders",
        minTokens: 10,
        subscribers: 156,
      },
      {
        title: "Production Masterclass",
        description: "Monthly video tutorial on advanced production techniques",
        minTokens: 25,
        subscribers: 87,
      },
      {
        title: "Stems & Project Files",
        description: "Complete project files for selected tracks",
        minTokens: 50,
        subscribers: 42,
      },
      {
        title: "VIP Club Access",
        description: "Priority access to my shows at Club Underground",
        minTokens: 75,
        subscribers: 28,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Techno Dimensions EP reached 500,000 streams",
        date: "Mar 15, 2025",
      },
      {
        id: "c2",
        type: "platinum",
        title: "Platinum Record",
        description: "Midnight Pulse single reached 1,000,000 streams",
        date: "Feb 20, 2025",
      },
      {
        id: "c3",
        type: "views",
        title: "1M Views",
        description: "Music video for 'Electronic Dreams' reached 1 million views",
        date: "Jan 30, 2025",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Event",
        description: "Club Underground performance sold out in 24 hours",
        date: "Jan 15, 2025",
      },
      {
        id: "c5",
        type: "award",
        title: "Best New Artist",
        description: "Electronic Music Awards 2025",
        date: "Jan 5, 2025",
      },
    ],
  },
  {
    id: "banger",
    name: "Banger",
    handle: "@banger",
    avatar: "/avatars/banger.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "DNB y Tech-House",
    description: "House producer with disco and funk influences. Known for energetic rhythms.",
    supporters: 2100,
    blgReceived: 2100,
    featured: true,
    tokenName: "BANGER",
    tokenPrice: 0.42,
    posts: [
      {
        content: "Just dropped 'Disco Inferno' - my funkiest house track yet! Link in bio 🔥 #DiscoHouse #NewMusic",
        time: "3 hours ago",
        likes: 92,
        comments: 18,
        image: "/images/dj-mixer.png",
      },
      {
        content: "Vinyl lovers! Limited edition 12\" of 'Groove Machine' coming next week. Only 200 copies available!",
        time: "1 day ago",
        likes: 124,
        comments: 35,
      },
      {
        content:
          "Throwback to my Ibiza set last summer. Still can't believe how amazing that crowd was! #Ibiza #HouseMusic",
        time: "3 days ago",
        likes: 156,
        comments: 27,
        image: "/images/dj-mixer.png",
      },
      {
        content: "Studio session with @nicolamarti today. The collab you've all been waiting for is finally happening!",
        time: "5 days ago",
        likes: 187,
        comments: 42,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Disco Fever (Club Mix)",
        description: "Extended club mix only for $BANGER holders",
        date: "Mar 12, 2025",
      },
      {
        title: "Sample pack - House Essentials Vol. 1",
        description: "Collection of premium samples for house producers",
        date: "Mar 5, 2025",
      },
      {
        title: "Behind the scenes - Studio Session",
        description: "Watch how I created my latest track from scratch",
        date: "Feb 28, 2025",
      },
    ],
    rewards: [
      {
        title: "Disco House Sample Pack",
        description: "Monthly collection of disco samples and loops",
        minTokens: 15,
        subscribers: 178,
      },
      {
        title: "Vinyl First Access",
        description: "Early access to limited vinyl releases",
        minTokens: 30,
        subscribers: 92,
      },
      {
        title: "Remix Competition",
        description: "Exclusive stems to remix my tracks monthly",
        minTokens: 45,
        subscribers: 64,
      },
      {
        title: "DJ Feedback",
        description: "Personal feedback on your tracks once a month",
        minTokens: 75,
        subscribers: 38,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Disco Inferno single reached 500,000 streams",
        date: "Feb 10, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "2M Views",
        description: "Music video for 'Groove Machine' reached 2 million views",
        date: "Jan 25, 2025",
      },
      {
        id: "c3",
        type: "soldout",
        title: "Sold Out Tour",
        description: "European Summer Tour 2024 sold out in 48 hours",
        date: "Dec 15, 2024",
      },
      {
        id: "c4",
        type: "award",
        title: "Best House Producer",
        description: "DJ Mag Awards 2024",
        date: "Nov 20, 2024",
      },
    ],
  },
  {
    id: "nicolamarti",
    name: "Nicola Marti",
    handle: "@nicolamarti",
    avatar: "/avatars/nicola.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Tech-House",
    description: "Italian melodic techno artist with a unique and atmospheric style.",
    supporters: 1750,
    blgReceived: 1750,
    featured: true,
    tokenName: "NICOLA",
    tokenPrice: 0.38,
    posts: [
      {
        content:
          "My new album 'Ethereal Landscapes' is finally complete. Can't wait to share this journey with you all next month.",
        time: "5 hours ago",
        likes: 143,
        comments: 38,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Recording strings with the Milano Chamber Orchestra today. Adding classical elements to electronic music is pure magic.",
        time: "2 days ago",
        likes: 167,
        comments: 29,
      },
      {
        content:
          "Berlin, thank you for an unforgettable night at Panorama Bar. The energy was transcendent. #Berlin #MelodicTechno",
        time: "4 days ago",
        likes: 201,
        comments: 47,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Just finished mastering the collaboration with @banger - two different worlds colliding in the most beautiful way.",
        time: "1 week ago",
        likes: 178,
        comments: 35,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Melodic Journey (Extended Mix)",
        description: "10-minute journey through melodic techno landscapes",
        date: "Mar 14, 2025",
      },
      {
        title: "Ableton Live Template - Melodic Techno",
        description: "My personal template for creating melodic techno tracks",
        date: "Mar 7, 2025",
      },
      {
        title: "Live recording - Club Panorama Berlin",
        description: "Full 2-hour set from my recent Berlin performance",
        date: "Feb 25, 2025",
      },
    ],
    rewards: [
      {
        title: "Orchestral Elements",
        description: "Monthly orchestral samples recorded with live musicians",
        minTokens: 15,
        subscribers: 145,
      },
      {
        title: "Ambient Soundscapes",
        description: "Exclusive ambient compositions for meditation",
        minTokens: 25,
        subscribers: 78,
      },
      {
        title: "Melodic Progression Masterclass",
        description: "Monthly tutorial on creating emotional progressions",
        minTokens: 40,
        subscribers: 52,
      },
      {
        title: "Studio Live Stream",
        description: "Monthly live stream from my Milan studio",
        minTokens: 60,
        subscribers: 31,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "platinum",
        title: "Platinum Record",
        description: "Ethereal Landscapes album reached 1,000,000 streams",
        date: "Mar 5, 2025",
      },
      {
        id: "c2",
        type: "award",
        title: "Best Melodic Techno Artist",
        description: "International Electronic Music Awards 2024",
        date: "Dec 10, 2024",
      },
      {
        id: "c3",
        type: "soldout",
        title: "Sold Out Show",
        description: "Milan Techno Festival headlining show sold out",
        date: "Nov 20, 2024",
      },
      {
        id: "c4",
        type: "views",
        title: "3M Views",
        description: "Live performance at Tomorrowland reached 3 million views",
        date: "Oct 15, 2024",
      },
    ],
  },
  {
    id: "axs",
    name: "AXS",
    handle: "@axs",
    avatar: "/avatars/axs.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Riddim",
    description: "Producer of industrial techno with influences from EBM and post-punk.",
    supporters: 1680,
    blgReceived: 1680,
    featured: true,
    tokenName: "AXS",
    tokenPrice: 0.4,
    posts: [
      {
        content:
          "New EP 'Mechanical Dystopia' drops next week. The darkest, hardest techno I've ever made. #IndustrialTechno",
        time: "6 hours ago",
        likes: 132,
        comments: 41,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Field recording session at an abandoned factory today. These machines make the most incredible sounds.",
        time: "2 days ago",
        likes: 98,
        comments: 23,
      },
      {
        content:
          "My modular synth setup is finally complete. Spent 3 years building this beast. Time to make some noise!",
        time: "5 days ago",
        likes: 176,
        comments: 52,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Berghain closing set was pure madness last night. 4 hours of relentless industrial techno. Thank you Berlin!",
        time: "1 week ago",
        likes: 215,
        comments: 67,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Industrial Complex (Extended Mix)",
        description: "Hard-hitting industrial techno journey",
        date: "Mar 10, 2025",
      },
      {
        title: "Sound design tutorial - Creating industrial textures",
        description: "Learn how I create my signature industrial sounds",
        date: "Mar 3, 2025",
      },
      {
        title: "Modular patches collection",
        description: "My favorite modular synth patches for techno production",
        date: "Feb 20, 2025",
      },
    ],
    rewards: [
      {
        title: "Modular Synth Patches",
        description: "Monthly collection of my modular synth patches",
        minTokens: 20,
        subscribers: 132,
      },
      {
        title: "Industrial Sound Design",
        description: "Tutorials on creating harsh industrial sounds",
        minTokens: 35,
        subscribers: 85,
      },
      {
        title: "Field Recording Library",
        description: "Access to my industrial field recording library",
        minTokens: 50,
        subscribers: 47,
      },
      {
        title: "Hardware Processing Techniques",
        description: "Learn how I process sounds through hardware",
        minTokens: 75,
        subscribers: 29,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Mechanical Dystopia EP reached 500,000 streams",
        date: "Feb 15, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "1.5M Views",
        description: "Berghain live set reached 1.5 million views",
        date: "Jan 20, 2025",
      },
      {
        id: "c3",
        type: "award",
        title: "Best Industrial Techno Producer",
        description: "Underground Electronic Awards 2024",
        date: "Dec 5, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Warehouse Event",
        description: "Industrial Noise warehouse event sold out in 2 hours",
        date: "Nov 10, 2024",
      },
    ],
  },
  {
    id: "flush",
    name: "FLUSH",
    handle: "@flush",
    avatar: "/avatars/flush.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Dubstep",
    description: "Drum & bass producer with a focus on futuristic and experimental sounds.",
    supporters: 1320,
    blgReceived: 1320,
    featured: false,
    tokenName: "FLUSH",
    tokenPrice: 0.35,
    posts: [
      {
        content:
          "Just finished mastering 'Neurofunk Odyssey' - my most complex D&B track to date. Out next Friday! #DrumAndBass",
        time: "4 hours ago",
        likes: 108,
        comments: 32,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Breaking down the science of perfect breaks - new tutorial on my Patreon for those who want to level up their D&B game.",
        time: "2 days ago",
        likes: 87,
        comments: 19,
      },
      {
        content:
          "London, that was insane! Fabric nightclub, you never disappoint. The energy in that room was electric!",
        time: "5 days ago",
        likes: 143,
        comments: 38,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Working on some half-time experiments. Pushing the boundaries between D&B and hip-hop. Who's interested?",
        time: "1 week ago",
        likes: 96,
        comments: 27,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Future Breaks (VIP Mix)",
        description: "Special VIP version with extra breaks and bass",
        date: "Mar 13, 2025",
      },
      {
        title: "Drum processing tutorial",
        description: "Learn how to create punchy drum & bass breaks",
        date: "Mar 6, 2025",
      },
      {
        title: "Live set - Jungle Massive",
        description: "Full recording of my recent festival performance",
        date: "Feb 27, 2025",
      },
    ],
    rewards: [
      {
        title: "Break Engineering",
        description: "Monthly tutorial on crafting perfect D&B breaks",
        minTokens: 15,
        subscribers: 98,
      },
      {
        title: "Bass Design Masterclass",
        description: "Learn to create cutting-edge neurofunk bass",
        minTokens: 30,
        subscribers: 64,
      },
      {
        title: "Exclusive DJ Mixes",
        description: "Monthly exclusive DJ mixes with unreleased tracks",
        minTokens: 45,
        subscribers: 35,
      },
      {
        title: "Stem Access",
        description: "Download stems from my tracks for remixing",
        minTokens: 60,
        subscribers: 22,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Neurofunk Odyssey EP reached 500,000 streams",
        date: "Jan 25, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "1M Views",
        description: "Fabric London live set reached 1 million views",
        date: "Dec 15, 2024",
      },
      {
        id: "c3",
        type: "award",
        title: "Best Newcomer",
        description: "Drum&Bass Arena Awards 2024",
        date: "Nov 5, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Show",
        description: "Printworks London show sold out in 24 hours",
        date: "Oct 20, 2024",
      },
    ],
  },
  {
    id: "daniloDR",
    name: "DaniløDR",
    handle: "@daniloDR",
    avatar: "/avatars/danilo.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Trap",
    description: "Creator of progressive trance with elements of classical music and ambient.",
    supporters: 980,
    blgReceived: 980,
    featured: false,
    tokenName: "DANILO",
    tokenPrice: 0.32,
    posts: [
      {
        content:
          "New album 'Harmonic Convergence' is finally complete after 2 years of work. A fusion of trance and classical orchestration.",
        time: "7 hours ago",
        likes: 89,
        comments: 24,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Just finished recording with the Prague Symphony Orchestra. Adding real strings to electronic music creates such depth.",
        time: "3 days ago",
        likes: 112,
        comments: 31,
      },
      {
        content: "Sunrise set at Ozora Festival was a spiritual experience. Thank you for joining me on this journey.",
        time: "6 days ago",
        likes: 134,
        comments: 42,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Exploring microtonal scales in my latest compositions. Breaking free from Western 12-tone limitations.",
        time: "1 week ago",
        likes: 76,
        comments: 19,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Ethereal Journey (Extended Mix)",
        description: "10-minute progressive trance journey",
        date: "Mar 11, 2025",
      },
      {
        title: "Orchestral samples collection",
        description: "Classical samples perfect for trance production",
        date: "Mar 4, 2025",
      },
      {
        title: "Production walkthrough - Layering techniques",
        description: "Learn how I create lush, layered trance soundscapes",
        date: "Feb 22, 2025",
      },
    ],
    rewards: [
      {
        title: "Orchestral Elements",
        description: "Monthly orchestral samples from live recordings",
        minTokens: 10,
        subscribers: 75,
      },
      {
        title: "Meditation Compositions",
        description: "Exclusive ambient tracks for meditation",
        minTokens: 25,
        subscribers: 48,
      },
      {
        title: "Harmonic Theory Lessons",
        description: "Learn music theory for emotional compositions",
        minTokens: 40,
        subscribers: 29,
      },
      {
        title: "Sunrise Set Recordings",
        description: "Access to my exclusive festival sunrise sets",
        minTokens: 60,
        subscribers: 18,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Harmonic Convergence album reached 500,000 streams",
        date: "Feb 5, 2025",
      },
      {
        id: "c2",
        type: "award",
        title: "Best Progressive Trance Album",
        description: "Global Trance Awards 2024",
        date: "Nov 30, 2024",
      },
      {
        id: "c3",
        type: "views",
        title: "1.2M Views",
        description: "Ozora Festival sunrise set reached 1.2 million views",
        date: "Oct 15, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Concert",
        description: "Orchestral electronic concert sold out in Prague",
        date: "Sep 20, 2024",
      },
    ],
  },
  {
    id: "spitflux",
    name: "Spitflux",
    handle: "@spitflux",
    avatar: "/avatars/spitflux.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Dubstep",
    description: "Innovator in the dubstep scene with an aggressive and detailed style.",
    supporters: 1450,
    blgReceived: 1450,
    featured: false,
    tokenName: "SPITFLUX",
    tokenPrice: 0.37,
    posts: [
      {
        content:
          "Just dropped 'Waveform Crusher' - the heaviest bass I've ever designed. Your speakers have been warned! #Dubstep",
        time: "5 hours ago",
        likes: 156,
        comments: 47,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "New sound design tutorial: How I created that alien bass sound everyone's been asking about. Link in bio.",
        time: "2 days ago",
        likes: 123,
        comments: 38,
      },
      {
        content:
          "Lost Lands Festival was INSANE! Dropping unreleased tunes to 30,000 headbangers was a dream come true.",
        time: "4 days ago",
        likes: 187,
        comments: 56,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Studio session with @kr4d today. Combining dubstep and ambient is creating some mind-bending results!",
        time: "1 week ago",
        likes: 109,
        comments: 31,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Bass Cannon (VIP Mix)",
        description: "Even heavier version with extra bass drops",
        date: "Mar 9, 2025",
      },
      {
        title: "Sound design tutorial - Creating alien bass",
        description: "Learn my techniques for creating unique bass sounds",
        date: "Mar 2, 2025",
      },
      {
        title: "Serum presets pack - Dubstep Essentials",
        description: "Collection of my personal Serum presets",
        date: "Feb 18, 2025",
      },
    ],
    rewards: [
      {
        title: "Serum Preset Pack",
        description: "Monthly pack of my custom Serum presets",
        minTokens: 15,
        subscribers: 112,
      },
      {
        title: "Bass Design Masterclass",
        description: "In-depth tutorials on creating unique bass sounds",
        minTokens: 30,
        subscribers: 67,
      },
      {
        title: "Unreleased Demos",
        description: "Access to unreleased and experimental tracks",
        minTokens: 45,
        subscribers: 41,
      },
      {
        title: "Feedback Sessions",
        description: "Monthly group feedback on your dubstep tracks",
        minTokens: 60,
        subscribers: 25,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "gold",
        title: "Gold Record",
        description: "Waveform Crusher EP reached 500,000 streams",
        date: "Jan 15, 2025",
      },
      {
        id: "c2",
        type: "views",
        title: "2M Views",
        description: "Lost Lands Festival set reached 2 million views",
        date: "Dec 10, 2024",
      },
      {
        id: "c3",
        type: "soldout",
        title: "Sold Out Tour",
        description: "North American Bass Tour sold out in 48 hours",
        date: "Nov 25, 2024",
      },
      {
        id: "c4",
        type: "award",
        title: "Best Dubstep Producer",
        description: "Bass Music Awards 2024",
        date: "Oct 5, 2024",
      },
    ],
  },
  {
    id: "kr4d",
    name: "Kr4D",
    handle: "@kr4d",
    avatar: "/avatars/kr4d.jpg",
    coverImage: "/images/bdeeeee.jpg",
    genre: "Electro",
    description: "Ambient and experimental music artist focusing on immersive soundscapes.",
    supporters: 890,
    blgReceived: 890,
    featured: false,
    tokenName: "KR4D",
    tokenPrice: 0.3,
    posts: [
      {
        content:
          "New album 'Quantum Resonance' explores the relationship between sound and consciousness. A 60-minute journey into deep listening.",
        time: "8 hours ago",
        likes: 76,
        comments: 21,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Just returned from a month in the Himalayas recording mountain sounds. These will form the basis of my next project.",
        time: "3 days ago",
        likes: 92,
        comments: 27,
      },
      {
        content:
          "My installation at the Modern Art Museum opens next week. 12 speakers, generative algorithms, and responsive lighting.",
        time: "5 days ago",
        likes: 108,
        comments: 34,
        image: "/images/dj-mixer.png",
      },
      {
        content:
          "Exploring the use of AI in ambient composition. The results are fascinating - both familiar and alien simultaneously.",
        time: "1 week ago",
        likes: 65,
        comments: 19,
      },
    ],
    exclusiveContent: [
      {
        title: "Exclusive track - Cosmic Whispers (Extended Journey)",
        description: "30-minute ambient soundscape experience",
        date: "Mar 8, 2025",
      },
      {
        title: "Field recordings collection - Forest Sounds",
        description: "High-quality nature recordings for ambient production",
        date: "Mar 1, 2025",
      },
      {
        title: "Ambient production techniques",
        description: "Learn how to create immersive ambient soundscapes",
        date: "Feb 15, 2025",
      },
    ],
    rewards: [
      {
        title: "Generative Music App",
        description: "Access to my custom generative music application",
        minTokens: 10,
        subscribers: 68,
      },
      {
        title: "Himalayan Field Recordings",
        description: "Exclusive access to my Himalayan sound library",
        minTokens: 20,
        subscribers: 42,
      },
      {
        title: "Meditation Compositions",
        description: "Monthly ambient pieces designed for deep meditation",
        minTokens: 30,
        subscribers: 31,
      },
      {
        title: "Sound Art Installations",
        description: "Virtual access to my sound art installations",
        minTokens: 50,
        subscribers: 17,
      },
    ],
    certifications: [
      {
        id: "c1",
        type: "award",
        title: "Best Ambient Album",
        description: "Quantum Resonance won Best Ambient Album 2024",
        date: "Dec 20, 2024",
      },
      {
        id: "c2",
        type: "views",
        title: "1M Streams",
        description: "Quantum Resonance album reached 1 million streams",
        date: "Nov 15, 2024",
      },
      {
        id: "c3",
        type: "award",
        title: "Sound Art Prize",
        description: "International Sound Art Biennale 2024",
        date: "Oct 10, 2024",
      },
      {
        id: "c4",
        type: "soldout",
        title: "Sold Out Installation",
        description: "Modern Art Museum sound installation sold out for 3 months",
        date: "Sep 5, 2024",
      },
    ],
  },
]

