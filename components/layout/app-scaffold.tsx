"use client";

import { usePathname } from "next/navigation";
import BottomDock from "@/components/bottom-dock";

export default function AppScaffold({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. Define routes where the Bottom Navigation should be HIDDEN
  const hideNavRoutes = [
    "/login",
    "/onboarding",
    "/signup",
    "/forgot-password",
  ];

  // 2. Check if the current path matches any of the hidden routes
  const shouldHideNav = hideNavRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* 3. Content Area
         We add padding-bottom (pb-[90px]) ONLY if the nav is visible
         so content doesn't get hidden behind the fixed bar.
      */}
      <main className={`flex-1 ${!shouldHideNav ? "pb-[90px]" : ""}`}>
        {children}
      </main>

      {/* 4. Conditionally render the Navigation */}
      {/*{!shouldHideNav && <BottomDock />}*/}
    </div>
  );
}
