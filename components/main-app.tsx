"use client"

import { useState, useRef, useEffect } from "react"
import HomeView from "@/components/home-view"
import ExploreScreen from "@/components/explore-screen"
import WalletView from "@/components/wallet-view"
import ActivityView from "@/components/activity-view"
import ProfileView from "@/components/profile-view"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export default function MainApp() {
  const [activeScreen, setActiveScreen] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

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
      <header className="absolute top-0 left-0 right-0 z-50 h-16 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="flex items-center justify-start h-12 px-2">
          <Image
            src="/images/dropsland-logo.png"
            alt="Dropsland"
            width={80}
            height={20}
            className="h-5 w-auto"
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
          <WalletView />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <ActivityView onSelectArtist={(id) => console.log("Artist:", id)} />
        </div>

        <div className="min-w-full h-full flex-shrink-0 overflow-y-auto snap-start">
          <ProfileView />
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-1 transition-all duration-300 rounded-full ${
              activeScreen === index ? "w-8 bg-yellow-400" : "w-4 bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
