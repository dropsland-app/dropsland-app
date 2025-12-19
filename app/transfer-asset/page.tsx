"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import TransferAssetView from "@/components/transfer-asset-view";
import { Loader2 } from "lucide-react";

function TransferAssetContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipient = searchParams.get("recipient");

  // Redirect back to scan if accessed directly without a recipient
  useEffect(() => {
    if (!recipient) {
      router.replace("/scan");
    }
  }, [recipient, router]);

  if (!recipient) return null;

  return (
    <div className="h-[calc(100vh-80px)]">
      {" "}
      <TransferAssetView
        recipientAddress={recipient}
        onBack={() => router.back()}
        onComplete={() => router.push("/wallet")}
      />
    </div>
  );
}

export default function TransferAssetPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6]" />
        </div>
      }
    >
      <TransferAssetContent />
    </Suspense>
  );
}
