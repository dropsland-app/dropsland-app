"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react"; // Required for useSearchParams in Next.js
import TransferAssetView from "@/components/transfer-asset-view";
import { Loader2 } from "lucide-react";

function TransferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipientAddress = searchParams.get("recipient");

  // Redirect back if accessed without a recipient
  if (!recipientAddress) {
    router.replace("/scan");
    return null;
  }

  return (
    <TransferAssetView
      recipientAddress={recipientAddress}
      onBack={() => router.back()}
      onComplete={() => router.push("/wallet")} // Go back to wallet home on success
    />
  );
}

export default function TransferPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-white text-[#1FA9D6]">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      }
    >
      <TransferContent />
    </Suspense>
  );
}
