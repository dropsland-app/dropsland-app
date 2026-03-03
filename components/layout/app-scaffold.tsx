"use client";

import { usePathname } from "next/navigation";
import BottomDock from "@/components/bottom-dock";

export default function AppScaffold({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes where we DON'T want the dock (e.g. login, full-screen camera)
  const hideNavRoutes = [
    "/login",
    "/signup",
    "/onboarding",
    "/wallet/scan", // Camera view needs full screen
    "/verify/", // Dynamic verify routes usually use camera
    "/events/",
    "/wallet/rewards/",
  ];

  // Check strict match or startWith for dynamic routes
  const shouldHideNav = hideNavRoutes.some(
    (route) => pathname === route || pathname?.startsWith(route),
  );

  const shouldHideForCreatorTier =
    pathname?.startsWith("/creator/") && pathname.includes("/tier/");

  const isHomeFeedRoute = pathname === "/";
  const shouldPadForDock =
    !shouldHideNav && !shouldHideForCreatorTier && !isHomeFeedRoute;

  return (
    <div
      className={`flex flex-col h-full min-h-screen relative ${isHomeFeedRoute ? "bg-black" : "bg-white"}`}
    >
      {/* If nav is visible, add padding-bottom so content isn't covered.
         We use 'pb-24' to give ample space for the floating dock.
      */}
      <main
        className={`flex-1 w-full h-full ${shouldPadForDock ? "pb-24" : ""}`}
      >
        {children}
      </main>

      {!shouldHideNav && !shouldHideForCreatorTier && <BottomDock />}
    </div>
  );
}
