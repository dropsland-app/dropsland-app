"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, Music, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UploadView() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [artworkFile, setArtworkFile] = useState<File | null>(null)
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [trackName, setTrackName] = useState("")
  const [artistName, setArtistName] = useState("")
  const [genre, setGenre] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const audioFile = files.find((f) => f.type.startsWith("audio/"))

    if (audioFile) {
      setAudioFile(audioFile)
    }
  }, [])

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
    }
  }

  const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArtworkFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setArtworkPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (!audioFile || !trackName || !artistName || !genre) {
      alert("Please fill in all required fields and select an audio file")
      return
    }

    alert(`Track "${trackName}" by ${artistName} uploaded successfully!`)
    // Reset form
    setAudioFile(null)
    setArtworkFile(null)
    setArtworkPreview(null)
    setTrackName("")
    setArtistName("")
    setGenre("")
  }

  const removeAudio = () => {
    setAudioFile(null)
  }

  const removeArtwork = () => {
    setArtworkFile(null)
    setArtworkPreview(null)
  }

  return (
    <div className="pb-6 bg-gray-950 h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 bg-gradient-to-r from-black/60 to-gray-800/60 backdrop-blur-xl text-white border-b border-white/10">
        <h1 className="text-xl font-bold mb-1">Upload</h1>
        <p className="text-sm opacity-90">Share your music with the world</p>
      </div>

      <div className="px-4 mt-6 space-y-6">
        {/* Audio File Drag & Drop */}
        <div>
          <Label className="text-white text-sm mb-2 block">Audio File *</Label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-yellow-400 bg-yellow-400/10" : "border-white/20 bg-white/5"
            }`}
          >
            {!audioFile ? (
              <>
                <Music className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-white mb-2">Drag & drop your audio file here</p>
                <p className="text-sm text-gray-400 mb-4">or</p>
                <label htmlFor="audio-input">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={() => document.getElementById("audio-input")?.click()}
                  >
                    Browse Files
                  </Button>
                </label>
                <input id="audio-input" type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" />
                <p className="text-xs text-gray-500 mt-3">MP3, WAV, FLAC up to 200MB</p>
              </>
            ) : (
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <Music className="h-8 w-8 text-yellow-400" />
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">{audioFile.name}</p>
                    <p className="text-xs text-gray-400">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={removeAudio}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Artwork Upload */}
        <div>
          <Label className="text-white text-sm mb-2 block">Artwork</Label>
          {!artworkPreview ? (
            <label htmlFor="artwork-input">
              <div className="border-2 border-dashed border-white/20 bg-white/5 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400/50 transition-colors">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p className="text-white text-sm mb-1">Upload cover art</p>
                <p className="text-xs text-gray-500">JPG, PNG up to 10MB (Square recommended)</p>
              </div>
              <input
                id="artwork-input"
                type="file"
                accept="image/*"
                onChange={handleArtworkChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative">
              <img
                src={artworkPreview || "/placeholder.svg"}
                alt="Artwork preview"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={removeArtwork}
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Track Information */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="track-name" className="text-white text-sm mb-2 block">
              Track Name *
            </Label>
            <Input
              id="track-name"
              type="text"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="Enter track name"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="artist-name" className="text-white text-sm mb-2 block">
              Artist Name *
            </Label>
            <Input
              id="artist-name"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Enter artist name"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="genre" className="text-white text-sm mb-2 block">
              Genre *
            </Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="techno">Techno</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="tech-house">Tech House</SelectItem>
                <SelectItem value="dubstep">Dubstep</SelectItem>
                <SelectItem value="riddim">Riddim</SelectItem>
                <SelectItem value="trap">Trap</SelectItem>
                <SelectItem value="dnb">Drum & Bass</SelectItem>
                <SelectItem value="electro">Electro</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!audioFile || !trackName || !artistName || !genre}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50 disabled:cursor-not-allowed py-6 text-lg font-semibold"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Track
        </Button>
      </div>
    </div>
  )
}
