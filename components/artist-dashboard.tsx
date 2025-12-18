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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-4 py-3 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl border-b border-gray-100 flex items-center">
        <button onClick={onBack} className="flex items-center text-[#1E1E1E] hover:bg-black/5 p-2 -ml-2 rounded-full transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-[#1E1E1E]">Artist Dashboard</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 content-bg">
        {/* Artist Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 font-medium">Total Supporters</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold text-[#1E1E1E]">{artistData.supporters}</p>
                  <Users className="h-5 w-5 text-[#1FA9D6]" />
                </div>
                <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">{artistData.growth} this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 font-medium">Total Received</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-2xl font-bold text-[#1E1E1E]">{artistData.totalReceived}</p>
                  <BanknoteIcon className="h-5 w-5 text-[#1FA9D6]" />
                </div>
                <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 inline-block px-1.5 py-0.5 rounded">+{artistData.newSupporters} new</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button className="h-auto py-3 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white shadow-lg shadow-[#1FA9D6]/20 border-none rounded-xl">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" className="h-auto py-3 bg-white text-[#1E1E1E] border-gray-200 hover:bg-gray-50 rounded-xl">
            <Music className="h-4 w-4 mr-2" />
            Add Reward
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-[#1FA9D6] data-[state=active]:shadow-sm rounded-lg text-gray-500"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-white data-[state=active]:text-[#1FA9D6] data-[state=active]:shadow-sm rounded-lg text-gray-500"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="supporters"
              className="data-[state=active]:bg-white data-[state=active]:text-[#1FA9D6] data-[state=active]:shadow-sm rounded-lg text-gray-500"
            >
              Supporters
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#1E1E1E] text-lg">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-[#1E1E1E]">{artistData.posts}</p>
                    <p className="text-xs text-gray-500 font-medium">Posts</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-[#1E1E1E]">{artistData.rewards}</p>
                    <p className="text-xs text-gray-500 font-medium">Rewards</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-[#1E1E1E]">$0.45</p>
                    <p className="text-xs text-gray-500 font-medium">Token Price</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#1E1E1E] text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#1FA9D6]/10 flex items-center justify-center mr-3">
                        <Calendar className="h-5 w-5 text-[#1FA9D6]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1E1E1E]">{event.title}</p>
                        <p className="text-xs text-gray-500">{event.date}</p>
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
              <h3 className="text-[#1E1E1E] font-medium">Your Posts</h3>
              <Button size="sm" className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white border-none shadow-sm rounded-lg">
                New Post
              </Button>
            </div>

            {posts.map((post) => (
              <Card key={post.id} className="bg-white border-gray-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-[#1E1E1E] font-medium leading-relaxed">{post.content.substring(0, 60)}...</p>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                          {post.likes} likes
                        </Badge>
                        <p className="text-xs text-gray-400 ml-2">{post.time}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 bg-white text-gray-600 border-gray-200 hover:bg-gray-50 rounded-lg">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-[#1E1E1E] font-medium">Your Rewards</h3>
              <Button size="sm" className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white border-none shadow-sm rounded-lg">
                Add Reward
              </Button>
            </div>

            {rewards.map((reward) => (
              <Card key={reward.id} className="bg-white border-gray-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-[#1E1E1E] font-medium">{reward.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{reward.description}</p>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="text-xs bg-[#1FA9D6]/10 text-[#1FA9D6] border-[#1FA9D6]/20">
                          {reward.minTokens} $DROPS required
                        </Badge>
                        <p className="text-xs text-gray-400 ml-2">{reward.subscribers} subscribers</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="h-8 bg-white text-gray-600 border-gray-200 hover:bg-gray-50 rounded-lg">
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Supporters Tab */}
          <TabsContent value="supporters" className="mt-4 space-y-4">
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#1E1E1E] text-lg">Top Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supporters.map((supporter) => (
                    <div key={supporter.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <Avatar className="h-10 w-10 mr-3 ring-2 ring-white shadow-sm">
                        <AvatarImage src={supporter.avatar} alt={supporter.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">{supporter.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-[#1E1E1E]">{supporter.name}</p>
                        <p className="text-xs text-gray-500">{supporter.since}</p>
                      </div>
                      <div className="flex items-center text-[#1FA9D6] font-bold bg-[#1FA9D6]/5 px-2 py-1 rounded-md">
                        <BanknoteIcon className="h-3 w-3 mr-1" />
                        <span className="text-sm">{supporter.tokens}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings */}
        <div className="mt-6 mb-8">
          <Button variant="outline" className="w-full justify-start bg-white text-[#1E1E1E] border-gray-200 hover:bg-gray-50 h-12 rounded-xl">
            <Settings className="h-4 w-4 mr-2 text-gray-500" />
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
