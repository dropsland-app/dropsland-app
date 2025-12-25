"use client";

import { Loader2, Heart, MessageCircle, Share2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RewardItem } from "@/lib/alchemy";

interface ProfileTabsProps {
  isArtist: boolean;
  userPosts: any[];
  rewards: RewardItem[];
  loadingRewards: boolean;
  certifications: any[];
  onCommentClick: (index: number) => void;
  avatarSrc: string;
  userName: string;
  isVerified: boolean;
}

export function ProfileTabs({
  isArtist,
  userPosts,
  rewards,
  loadingRewards,
  certifications,
  onCommentClick,
  avatarSrc,
  userName,
  isVerified,
}: ProfileTabsProps) {
  return (
    <div className="px-4">
      <Tabs defaultValue={isArtist ? "posts" : "rewards"} className="w-full">
        <TabsList className="w-full bg-transparent h-auto p-0 gap-4 border-b border-gray-100 justify-start mb-4">
          {isArtist ? (
            <>
              <TabTrigger value="posts" label="Posts" />
              <TabTrigger value="rewards" label="Rewards" />
              <TabTrigger value="certs" label="Certs" />
            </>
          ) : (
            <>
              <TabTrigger value="artists" label="Following" />
              <TabTrigger value="rewards" label="Rewards" />
            </>
          )}
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {userPosts.map((post, index) => (
            <Card key={index} className="bg-white border-neutral-100 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-start gap-2 mb-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={avatarSrc} />
                    <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="font-semibold text-sm text-[#1E1E1E] truncate">
                        {userName}
                      </span>
                      {isVerified && (
                        <Star className="h-3 w-3 text-[#1FA9D6] fill-[#1FA9D6] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#3A3A3A]">{post.time}</p>
                  </div>
                </div>
                <p className="text-[#1E1E1E] text-sm break-words mb-2">
                  {post.content}
                </p>
                {post.image && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-neutral-100">
                    <img src={post.image} alt="Post" className="w-full h-auto" />
                  </div>
                )}
                <div className="flex items-center gap-4 text-[#3A3A3A]">
                  <button className="flex items-center gap-1 hover:text-[#1FA9D6] text-xs transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 hover:text-[#1FA9D6] text-xs transition-colors"
                    onClick={() => onCommentClick(index)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="hover:text-[#1FA9D6] transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="artists">
          <Card className="bg-white border-neutral-100 shadow-sm">
            <CardContent className="p-6 text-center">
              <p className="text-[#1E1E1E] text-sm">Welcome to your feed.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          {loadingRewards ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#1FA9D6]" />
            </div>
          ) : rewards.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
              {rewards.map((reward) => (
                <Card
                  key={reward.id}
                  className="bg-white border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col min-w-0 max-w-[140px]"
                >
                  <div className="aspect-square w-full relative bg-gray-100 overflow-hidden">
                    <img
                      src={reward.metadata.image}
                      alt={reward.metadata.name}
                      loading="lazy"
                      className="w-full h-full object-cover block transition-transform hover:scale-105"
                    />
                    <div className="absolute top-1.5 right-1.5 bg-black/70 backdrop-blur-[2px] text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">
                      x{reward.balance}
                    </div>
                  </div>
                  <CardContent className="p-2 flex flex-col gap-1 flex-1">
                    <p className="font-semibold text-[#1E1E1E] text-[11px] truncate leading-tight">
                      {reward.metadata.name}
                    </p>
                    <Button
                      size="sm"
                      className="w-full mt-auto h-6 text-[10px] font-medium bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white shadow-none rounded-sm"
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white border-neutral-100 shadow-sm border-dashed">
              <CardContent className="p-8 text-center">
                <p className="text-[#1E1E1E] text-sm font-medium">No rewards yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Attend events to collect items!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certs" className="space-y-3">
          {certifications && certifications.length > 0 ? (
            certifications.map((cert, index) => (
              <Card key={index} className="bg-white border-neutral-100 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1FA9D6]/10 flex items-center justify-center flex-shrink-0">
                      <Star className="h-6 w-6 text-[#1FA9D6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <p className="text-sm text-[#1E1E1E] font-medium truncate">
                          {cert.title}
                        </p>
                        <Badge className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white border-0 text-[10px] h-5">
                          {cert.type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#3A3A3A] break-words">
                        {cert.description}
                      </p>
                      <p className="text-xs text-[#3A3A3A]/70 mt-1">{cert.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-100 border-dashed">
              <Star className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-[#1E1E1E] font-medium">No certifications yet</p>
              <p className="text-[#3A3A3A] text-sm mt-1">
                Earn certifications by reaching milestones
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="bg-transparent data-[state=active]:bg-transparent border-b-2 border-transparent data-[state=active]:border-[#1FA9D6] rounded-none pb-3 text-[#3A3A3A] data-[state=active]:text-[#1FA9D6] text-sm font-medium"
    >
      {label}
    </TabsTrigger>
  );
}