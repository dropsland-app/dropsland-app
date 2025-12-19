import { Gift, QrCode } from "lucide-react";

export default function WalletRewardsPage() {
  const rewards = [
    {
      id: 1,
      title: "Free Drink Token",
      venue: "Club Space",
      expiry: "Valid tonight",
    },
    {
      id: 2,
      title: "Exclusive Tee",
      venue: "Dropsland Merch",
      expiry: "Claim anytime",
    },
  ];

  return (
    <div className="p-4 space-y-3">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="flex items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#1FA9D6] transition-colors cursor-pointer"
        >
          <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#1FA9D6]">
            <Gift className="w-6 h-6" />
          </div>
          <div className="ml-3 flex-1">
            <h4 className="font-bold text-[#1E1E1E]">{reward.title}</h4>
            <p className="text-xs text-gray-500">
              {reward.venue} • {reward.expiry}
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg">
            <QrCode className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
