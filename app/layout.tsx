import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import PrivyProviderWrapper from "@/components/providers/privy-provider";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often needed for "app-like" feel
};

export const metadata: Metadata = {
  title: "Dropsland",
  description: "Elevate your DJ career on-chain",
  manifest: "/manifest.json",
  icons: {
    apple: "/icon.png", // Ensure this file exists in /public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <PrivyProviderWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex justify-center items-start min-h-screen bg-gray-900">
              <div className="w-full max-w-md min-h-screen bg-black relative">
                <AuthProvider>{children}</AuthProvider>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
