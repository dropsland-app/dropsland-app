"use client";

import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProfileCommentsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments: { author: string; text: string }[];
  commentText: string;
  setCommentText: (text: string) => void;
  handleSendComment: () => void;
  avatarSrc: string; // The avatar for users in the list
}

export function ProfileComments({
  open,
  onOpenChange,
  comments,
  commentText,
  setCommentText,
  handleSendComment,
  avatarSrc,
}: ProfileCommentsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-[#1E1E1E] border-neutral-200">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto space-y-2 my-4">
          {comments && comments.length > 0 ? (
            comments.map((comment, i) => (
              <div key={i} className="flex gap-2">
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback>
                    {comment.author.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-100 p-2 rounded-lg min-w-0">
                  <p className="text-xs font-medium truncate text-gray-900">
                    {comment.author}
                  </p>
                  <p className="text-xs text-gray-700 break-words">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-6 text-sm">
              No comments yet
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add a comment..."
            className="bg-gray-50 border-gray-300 text-gray-900 text-sm"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
          />
          <Button
            className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white flex-shrink-0"
            onClick={handleSendComment}
            disabled={!commentText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}