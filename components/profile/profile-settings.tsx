"use client";

import { Settings, LogOut, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileSettingsProps {
  isArtist: boolean;
  logout: () => void;
}

export function ProfileSettings({ isArtist, logout }: ProfileSettingsProps) {
  return (
    <div className="mt-8 px-4">
      <h2 className="text-xl font-bold mb-4 text-[#1E1E1E]">Settings</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start bg-white text-[#1E1E1E] border-neutral-200 h-12 hover:bg-neutral-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white text-[#1E1E1E] border-neutral-200">
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start bg-white border-neutral-200 h-10 hover:bg-neutral-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-white border-neutral-200 h-10 hover:bg-neutral-50"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {!isArtist && (
        <Card className="bg-[#1FA9D6]/5 border-[#1FA9D6]/20 mt-4 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Lock className="h-5 w-5 text-[#1FA9D6] flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-[#1E1E1E] font-medium text-sm">
                    Become an Artist
                  </h3>
                  <p className="text-xs text-[#3A3A3A] truncate">
                    Apply to become verified
                  </p>
                </div>
              </div>
              <Button className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-medium h-9 px-4 flex-shrink-0 text-sm">
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}