"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

interface ShareDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    id: string;
    name: string;
    content: string;
  } | null;
}

export function ShareDrawer({ open, onOpenChange, post }: ShareDrawerProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const postUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/post/${post.id}`;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Post link copied to clipboard.",
        className: "bg-green-600 text-white border-none",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy Failed",
        description: "Could not copy link.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.name} on Dropsland`,
          text: post.content,
          url: postUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">Share</DrawerTitle>
          <DrawerDescription>Share {post.name}&apos;s post</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCopyLink}
              className="h-12 bg-[#1E1E1E] hover:bg-black text-white font-semibold rounded-xl border-none"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button
              onClick={handleShare}
              className="h-12 bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#1FA9D6]/20 border-none"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
