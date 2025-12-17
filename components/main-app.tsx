"use client"

import { useState, useRef, useEffect } from "react"
import HomeView from "@/components/home-view"
import ExploreScreen from "@/components/explore-screen"
import UploadView from "@/components/upload-view"
import WalletView from "@/components/wallet-view"
import ActivityView from "@/components/activity-view"
import ProfileView from "@/components/profile-view"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"
import { Home, Search, Upload, Wallet, Bell, User } from "lucide-react"

export default function MainApp() {
  const [activeScreen, setActiveScreen] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  const isLightMode = activeScreen >= 2

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollLeft = containerRef.current.scrollLeft
      const screenWidth = containerRef.current.offsetWidth
      const newScreen = Math.round(scrollLeft / screenWidth)
      if (newScreen !== activeScreen) {
        setActiveScreen(newScreen)
      }
    }
  }

  const handleNavigate = (screenIndex: number) => {
    if (containerRef.current) {
      const screenWidth = containerRef.current.offsetWidth
      containerRef.current.scrollTo({
        left: screenWidth * screenIndex,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    // Pause all audio elements whenever the screen changes
    const allAudio = document.querySelectorAll("audio")
    allAudio.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }, [activeScreen])

  return (
    <div className="h-screen flex flex-col bg-black relative">
      <header
        className={`absolute top-0 left-0 right-0 z-50 h-16 ${
          isLightMode
            ? "bg-gradient-to-b from-white via-white/80 to-transparent"
            : "bg-gradient-to-b from-black via-black/80 to-transparent"
        }`}
      >
        <div className="flex items-center justify-start h-12 px-2">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className={`h-5 w-auto ${isLightMode ? "invert" : ""}`}
            priority
          />
        </div>
      </header>

      <div
        ref={containerRef}
        className="flex-1 flex overflow-x-scroll overflow-y-hidden scrollbar-hide snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        <div className="min-w-full h-full flex-shrink-0 snap-start">
          <HomeView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 snap-start">
          <ExploreScreen onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <UploadView />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <WalletView />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <ActivityView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <ProfileView />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-50 px-4">
        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 flex items-center gap-4">
          <button
            onClick={() => handleNavigate(0)}
            className={`transition-all ${activeScreen === 0 ? "text-yellow-400" : "text-white/60"}`}
          >
            <Home className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleNavigate(1)}
            className={`transition-all ${activeScreen === 1 ? "text-yellow-400" : "text-white/60"}`}
          >
            <Search className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleNavigate(2)}
            className={`transition-all ${activeScreen === 2 ? "text-yellow-400" : "text-white/60"}`}
          >
            <Upload className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleNavigate(3)}
            className={`transition-all ${activeScreen === 3 ? "text-yellow-400" : "text-white/60"}`}
          >
            <Wallet className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleNavigate(4)}
            className={`transition-all ${activeScreen === 4 ? "text-yellow-400" : "text-white/60"}`}
          >
            <Bell className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleNavigate(5)}
            className={`transition-all ${activeScreen === 5 ? "text-yellow-400" : "text-white/60"}`}
          >
            <User className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}
