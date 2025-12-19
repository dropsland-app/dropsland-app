"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getUserRewards } from "@/lib/alchemy";

export default function OrganizerDashboard() {
  const router = useRouter();
  const { user, isArtist } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, you would fetch items where `creator == user.wallet.address`
    // For MVP, we will fetch the user's inventory to simulate "Managed Items"
    async function loadItems() {
      if (user?.wallet?.address) {
        const data = await getUserRewards(user.wallet.address);
        setItems(data);
        setLoading(false);
      }
    }
    loadItems();
  }, [user]);

  if (!isArtist()) return <div className="p-10 text-center">Access Denied</div>;

  return (
    <div className="p-4 pt-12 pb-24 h-full overflow-y-auto bg-white">
      <h1 className="text-2xl font-bold mb-6 text-[#1E1E1E]">Event Manager</h1>

      <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
        Select Item to Verify
      </h2>

      {loading ? (
        <Loader2 className="animate-spin text-[#1FA9D6]" />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="border border-gray-100 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <img
                  src={item.metadata.image}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[#1E1E1E]">
                    {item.metadata.name}
                  </h3>
                  <p className="text-xs text-gray-500">ID: {item.id}</p>
                </div>
                <Button
                  onClick={() => router.push(`/organizer/verify/${item.id}`)}
                  className="bg-[#1FA9D6] text-white rounded-full"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
