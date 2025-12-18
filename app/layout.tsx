import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import PrivyProviderWrapper from "@/components/providers/privy-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DROPSLAND - Support Artists with Music-Backed Tokens",
  description: "Buy $DROPS tokens for your favorite artists on World Chain",
  generator: "v0.dev",
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
            defaultTheme="dark"
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
