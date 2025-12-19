"use client";

import { useRouter } from "next/navigation";
import ScanView from "@/components/scan-view";
import BottomDock from "@/components/bottom-dock";

export default function ScanPage() {
  const router = useRouter();

  return (
    // Use h-screen to ensure full height and prevent scrolling issues
    <div className="h-screen w-full relative bg-black flex flex-col overflow-hidden">
      {/* We use flex-1 to let the ScanView take up all available space.
        ScanView handles its own internal layout (Camera + Header).
      */}
      <div className="flex-1 relative">
        <ScanView
          onBack={() => router.back()}
          onScanSuccess={(address) => {
            // Navigate to the transfer page with the scanned address
            router.push(`/transfer?recipient=${address}`);
          }}
        />
      </div>
    </div>
  );
}
