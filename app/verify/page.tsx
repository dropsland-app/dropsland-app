"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getUserRewards, type RewardItem } from "@/lib/alchemy";
import BottomDock from "@/components/bottom-dock";

export default function VerifyDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<RewardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      if (user?.wallet?.address) {
        // Fetch items the organizer holds (inventory/created items)
        const data = await getUserRewards(user.wallet.address);
        setItems(data);
        setLoading(false);
      }
    }
    loadItems();
  }, [user]);

  return (
    // Main layout container: Full screen, no body scroll
    <div className="flex flex-col h-screen bg-white text-[#1E1E1E] overflow-hidden">
      {/* Header: Fixed height, shrink-0 to prevent compression */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="-ml-2 text-[#1E1E1E] hover:bg-black/5 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">
            Select Item to Verify
          </h1>
        </div>
      </div>

      {/* Content Area: Flex-1 to fill remaining space, overflow-y-auto for internal scrolling */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-[#1FA9D6]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No items found.</p>
            <Button
              variant="link"
              className="text-[#1FA9D6]"
              onClick={() => router.push("/create-merch")}
            >
              Create your first item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="border-gray-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => router.push(`/verify/${item.id}`)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <img
                    src={item.metadata.image}
                    alt={item.metadata.name}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1E1E1E] truncate">
                      {item.metadata.name}
                    </h3>
                    <p className="text-xs text-gray-500">ID: {item.id}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs font-medium text-[#1FA9D6] bg-[#1FA9D6]/10 px-2 py-0.5 rounded">
                        Tap to Scan
                      </span>
                    </div>
                  </div>
                  <QrCode className="w-6 h-6 text-gray-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dock: We use index 5 (User Profile) as the parent context */}
      <BottomDock activeIndex={5} theme="light" />
    </div>
  );
}
