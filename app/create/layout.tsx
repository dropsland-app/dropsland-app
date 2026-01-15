"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { supabase } from "@/lib/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready } = usePrivy();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!ready) return;

      // Not logged in
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("wallet_address", user.wallet?.address)
          .single();

        if (error || !data) {
          console.error("Error fetching profile:", error);
          router.push("/");
          return;
        }

        // Check if user is a DJ or STAFF (Promoters can also create events)
        if (data.role === "DJ" || data.role === "STAFF") {
          setIsAuthorized(true);
        } else {
          // Show brief message then redirect for Fans
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (err) {
        console.error("Access check failed:", err);
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    }

    checkAccess();
  }, [user, ready, router]);

  // Loading state
  if (isChecking) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#1FA9D6] mb-2" />
        <p className="text-gray-400 text-sm">Verifying access...</p>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthorized) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Creator Access Only
        </h2>
        <p className="text-gray-600 text-sm max-w-sm">
          The Create section is only available for DJ/Artist and Staff/Promoter
          accounts. Redirecting you back...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
