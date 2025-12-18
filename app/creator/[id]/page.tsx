import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Banknote, Share2, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonateForm from "@/components/donate-form";

// Mock data for a single creator
const CREATOR = {
  id: "1",
  name: "Elena Rodriguez",
  handle: "@elenadraws",
  avatar: "/avatars/elena.jpg",
  coverImage: "/covers/elena-cover.jpg",
  category: "Digital Art",
  description:
    "I create vibrant digital illustrations and animations inspired by nature and fantasy worlds. Each piece tells a story and brings a little magic into everyday life.",
  supporters: 1245,
  blgReceived: 8750,
  featured: true,
  walletAddress: "0x1234567890123456789012345678901234567890", // Placeholder ETH address
  socialLinks: {
    twitter: "https://twitter.com/elenadraws",
    instagram: "https://instagram.com/elenadraws",
    website: "https://elenadraws.art",
  },
  rewards: [
    {
      level: "Bean Sprout",
      amount: 5,
      benefits: ["Access to exclusive posts", "Monthly wallpaper download"],
    },
    {
      level: "Coffee Bean",
      amount: 20,
      benefits: [
        "All previous rewards",
        "Name in credits",
        "Early access to new art",
      ],
    },
    {
      level: "Coffee Cup",
      amount: 50,
      benefits: [
        "All previous rewards",
        "Digital art print (monthly)",
        "Vote on future projects",
      ],
    },
    {
      level: "Coffee Pot",
      amount: 100,
      benefits: [
        "All previous rewards",
        "Custom digital portrait",
        "1-on-1 virtual coffee chat",
      ],
    },
  ],
  recentPosts: [
    {
      id: "p1",
      title: "New Fantasy Series Preview",
      preview:
        "I'm excited to share a sneak peek of my upcoming fantasy series...",
      date: "2 days ago",
      image: "/posts/elena-post1.jpg",
    },
    {
      id: "p2",
      title: "Behind the Scenes: Digital Painting Process",
      preview: "Many of you have asked about my digital painting workflow...",
      date: "1 week ago",
      image: "/posts/elena-post2.jpg",
    },
    {
      id: "p3",
      title: "Thank You for 1000+ Supporters!",
      preview: "I'm incredibly grateful to have reached this milestone...",
      date: "2 weeks ago",
      image: "/posts/elena-post3.jpg",
    },
  ],
};

export default function CreatorPage({ params }: { params: { id: string } }) {
  // TODO! fetch the creator data based on the ID
  // const creator = await getCreator(params.id)
  const creator = CREATOR;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-48 md:h-64 lg:h-80 w-full">
        <Image
          src={creator.coverImage || "/placeholder.svg?height=300&width=1200"}
          alt={`${creator.name}'s cover image`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <Button
          asChild
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm"
        >
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="container px-4 md:px-6">
        <div className="relative -mt-20 mb-6 flex flex-col items-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-3xl font-bold">{creator.name}</h1>
          <p className="text-muted-foreground">{creator.handle}</p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline">{creator.category}</Badge>
            {creator.featured && (
              <Badge variant="secondary">
                <Star className="mr-1 h-3 w-3" /> Featured Creator
              </Badge>
            )}
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center">
              <Banknote className="mr-1 h-4 w-4 text-primary" />
              <span>
                {creator.blgReceived.toLocaleString()} $DROPS received
              </span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{creator.supporters.toLocaleString()} supporters</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Button size="lg" className="gap-2">
              <Banknote className="h-4 w-4" />
              Donate $DROPS
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 lg:gap-8 py-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{creator.description}</p>
                <div className="mt-4 flex gap-2">
                  {Object.entries(creator.socialLinks).map(
                    ([platform, url]) => (
                      <Button
                        key={platform}
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Link>
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="posts">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Recent Posts</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-4 space-y-4">
                {creator.recentPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>{post.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
                        <p className="text-sm">{post.preview}</p>
                        <div className="relative h-24 sm:h-full rounded-md overflow-hidden">
                          <Image
                            src={
                              post.image ||
                              "/placeholder.svg?height=150&width=200"
                            }
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <Button variant="link" className="mt-2 px-0">
                        Read more
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="rewards" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {creator.rewards.map((reward, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {reward.level}
                          </CardTitle>
                          <div className="flex items-center text-primary font-bold">
                            <Banknote className="mr-1 h-4 w-4" />
                            {reward.amount} $DROPS
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {reward.benefits.map((benefit, i) => (
                            <li key={i}>{benefit}</li>
                          ))}
                        </ul>
                        <Button className="mt-4 w-full">Select</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <DonateForm
              creatorId={creator.id}
              creatorName={creator.name}
              creatorAddress={creator.walletAddress}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
