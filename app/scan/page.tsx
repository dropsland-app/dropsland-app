"use client";

import { useRouter } from "next/navigation";
import ScanView from "@/components/scan-view";

export default function ScanPage() {
  const router = useRouter();

  return (
    <ScanView
      onBack={() => router.back()}
      onScanSuccess={(address) => {
        // Navigate to the transfer page with the scanned address in the URL
        router.push(`/transfer?recipient=${address}`);
      }}
    />
  );
}
