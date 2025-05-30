"use client"

import { useState } from "react"
import { ArrowLeft, PlusCircle, Users, Music, Calendar, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ArtistDashboardProps {
  onBack: () => void
}

export default function ArtistDashboard({ onBack }: ArtistDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const { userData } = useAuth()

  // Artist data would come from the backend in a real app
  const artistData = {
    name: userData?.username || "iamjuampi",
    supporters: 1850,
    totalReceived: 1850,
    growth: "+12%",
    newSupporters: 24,
    posts: 42,
    rewards: 3,
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Artist Dashboard</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Artist Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-400">Total Supporters</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">{artistData.supporters}</p>
                  <Users className="h-5 w-5 text-bright-yellow" />
                </div>
                <p className="text-xs text-green-500 mt-1">{artistData.growth} this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-400">Total Received</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">{artistData.totalReceived}</p>
                  <BanknoteIcon className="h-5 w-5 text-bright-yellow" />
                </div>
                <p className="text-xs text-green-500 mt-1">+{artistData.newSupporters} new supporters</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button className="h-auto py-3 bg-bright-yellow hover:bg-bright-yellow-700 text-black">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" className="h-auto py-3 bg-gray-700 text-white border-gray-600">
            <Music className="h-4 w-4 mr-2" />
            Add Reward
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-gray-700">
              Content
            </TabsTrigger>
            <TabsTrigger value="supporters" className="data-[state=active]:bg-gray-700">
              Supporters
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{artistData.posts}</p>
                    <p className="text-xs text-gray-400">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{artistData.rewards}</p>
                    <p className="text-xs text-gray-400">Rewards</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">$0.45</p>
                    <p className="text-xs text-gray-400">Token Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-bright-yellow" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{event.title}</p>
                        <p className="text-xs text-gray-400">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-medium">Your Posts</h3>
              <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                New Post
              </Button>
            </div>

            {posts.map((post) => (
              <Card key={post.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{post.content.substring(0, 60)}...</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                          {post.likes} likes
                        </Badge>
                        <p className="text-xs text-gray-500 ml-2">{post.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 bg-gray-700 text-white border-gray-600">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-white font-medium">Your Rewards</h3>
              <Button size="sm" className="bg-bright-yellow hover:bg-bright-yellow-700 text-black">
                Add Reward
              </Button>
            </div>

            {rewards.map((reward) => (
              <Card key={reward.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">{reward.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{reward.description}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                          {reward.minTokens} $DROPS required
                        </Badge>
                        <p className="text-xs text-gray-500 ml-2">{reward.subscribers} subscribers</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 bg-gray-700 text-white border-gray-600">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Supporters Tab */}
          <TabsContent value="supporters" className="mt-4 space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Top Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supporters.map((supporter) => (
                    <div key={supporter.id} className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={supporter.avatar} alt={supporter.name} />
                        <AvatarFallback>{supporter.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-white">{supporter.name}</p>
                        <p className="text-xs text-gray-400">{supporter.since}</p>
                      </div>
                      <div className="flex items-center text-bright-yellow font-medium">
                        <BanknoteIcon className="h-3 w-3 mr-1" />
                        <span>{supporter.tokens} $DROPS</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings */}
        <div className="mt-6">
          <Button variant="outline" className="w-full justify-start bg-gray-800 text-white border-gray-700">
            <Settings className="h-4 w-4 mr-2" />
            Artist Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

// Sample data
const events = [
  { id: "1", title: "Release new track", date: "Mar 25, 2025" },
  { id: "2", title: "Live stream session", date: "Apr 2, 2025" },
  { id: "3", title: "Club Underground performance", date: "Apr 10, 2025" },
]

const posts = [
  {
    id: "1",
    content: 'Just released my new track "Midnight Pulse". Listen to it now on my profile!',
    time: "2 hours ago",
    likes: 42,
    comments: 8,
  },
  {
    id: "2",
    content: "Thanks everyone for the support on my last set. I'll be sharing more music with you soon.",
    time: "2 days ago",
    likes: 76,
    comments: 12,
  },
  {
    id: "3",
    content:
      "Working on a new project that combines techno with elements of classical music. What do you think about this fusion?",
    time: "4 days ago",
    likes: 93,
    comments: 28,
  },
]

const rewards = [
  {
    id: "1",
    title: "Exclusive Monthly Track",
    description: "Unreleased track available only to token holders",
    minTokens: 10,
    subscribers: 156,
  },
  {
    id: "2",
    title: "Production Masterclass",
    description: "Monthly video tutorial on advanced production techniques",
    minTokens: 25,
    subscribers: 87,
  },
  {
    id: "3",
    title: "Stems & Project Files",
    description: "Complete project files for selected tracks",
    minTokens: 50,
    subscribers: 42,
  },
]

const supporters = [
  {
    id: "1",
    name: "musicfan",
    avatar: "/avatars/user.jpg",
    tokens: 120,
    since: "Supporting since Jan 2025",
  },
  {
    id: "2",
    name: "technoLover",
    avatar: "/avatars/user.jpg",
    tokens: 85,
    since: "Supporting since Feb 2025",
  },
  {
    id: "3",
    name: "beatMaster",
    avatar: "/avatars/user.jpg",
    tokens: 65,
    since: "Supporting since Feb 2025",
  },
  {
    id: "4",
    name: "rhythmQueen",
    avatar: "/avatars/user.jpg",
    tokens: 50,
    since: "Supporting since Mar 2025",
  },
]

