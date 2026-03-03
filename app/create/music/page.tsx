"use client";

import { useState, useCallback } from "react";
import { Upload, Music, ImageIcon, X, Loader2 } from "lucide-react";
import { useWallets } from "@privy-io/react-auth";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Hooks & Libs
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import AppHeader from "@/components/layout/app-header";

export default function CreateMusicPage() {
    const { toast } = useToast();
    const { wallets } = useWallets();

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [artworkFile, setArtworkFile] = useState<File | null>(null);
    const [artworkPreview, setArtworkPreview] = useState<string | null>(null);

    const [trackName, setTrackName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [genre, setGenre] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // --- Drag & Drop Handlers ---
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const audio = files.find((f) => f.type.startsWith("audio/"));
        if (audio) setAudioFile(audio);
    }, []);

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAudioFile(file);
    };

    const handleArtworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setArtworkFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setArtworkPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // --- Upload Logic ---
    const handleUpload = async () => {
        if (!audioFile || !trackName || !artistName || !genre) {
            toast({
                title: "Missing fields",
                description: "Please fill all required fields.",
                variant: "destructive",
            });
            return;
        }

        const primaryWallet =
            wallets.find((w) => w.walletClientType === "privy") || wallets[0];
        const walletAddress = primaryWallet?.address;

        if (!walletAddress) {
            toast({
                title: "Authentication Error",
                description: "Please connect your wallet first.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            const { error: profileError } = await supabase.from("profiles").upsert(
                {
                    wallet_address: walletAddress,
                    username: artistName,
                    role: "DJ",
                },
                { onConflict: "wallet_address", ignoreDuplicates: true },
            );

            if (profileError) {
                console.error("Profile check failed:", profileError);
                throw new Error("Could not verify artist profile.");
            }

            const timestamp = Date.now();
            let audioUrl = "";
            let artworkUrl = "";

            const safeAudioName = audioFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const audioPath = `${walletAddress}/${timestamp}-${safeAudioName}`;

            const { error: audioError } = await supabase.storage
                .from("audio_files")
                .upload(audioPath, audioFile);

            if (audioError) throw audioError;

            const { data: audioPublic } = supabase.storage
                .from("audio_files")
                .getPublicUrl(audioPath);
            audioUrl = audioPublic.publicUrl;

            if (artworkFile) {
                const safeImageName = artworkFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const imagePath = `${walletAddress}/${timestamp}-${safeImageName}`;

                const { error: imageError } = await supabase.storage
                    .from("cover_images")
                    .upload(imagePath, artworkFile);

                if (imageError) throw imageError;

                const { data: imagePublic } = supabase.storage
                    .from("cover_images")
                    .getPublicUrl(imagePath);
                artworkUrl = imagePublic.publicUrl;
            }

            const { error: dbError } = await supabase.from("tracks").insert({
                artist_wallet: walletAddress,
                title: trackName,
                description: `Genre: ${genre} | Artist: ${artistName}`,
                cover_image_url: artworkUrl || null,
                audio_file_path: audioUrl,
                is_public: true,
            });

            if (dbError) throw dbError;

            toast({ title: "Success!", description: "Track uploaded successfully." });

            setAudioFile(null);
            setArtworkFile(null);
            setArtworkPreview(null);
            setTrackName("");
        } catch (error: any) {
            console.error("Upload failed:", error);
            toast({
                title: "Upload Failed",
                description: error.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const removeAudio = () => setAudioFile(null);
    const removeArtwork = () => {
        setArtworkFile(null);
        setArtworkPreview(null);
    };

    return (
        <div className="pb-24 bg-white h-full overflow-y-auto">
            <AppHeader
                title="Upload Music"
                subtitle="Share your tracks with the world"
                showBack
            />

            <div className="px-4 mt-6 space-y-6">
                <div>
                    <Label className="text-[#1E1E1E] text-sm mb-2 block">
                        Audio File *
                    </Label>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                                ? "border-[#1FA9D6] bg-[#1FA9D6]/10"
                                : "border-[#3A3A3A]/30 bg-[#3A3A3A]/5"
                            }`}
                    >
                        {!audioFile ? (
                            <>
                                <Music className="h-12 w-12 mx-auto mb-3 text-[#3A3A3A]" />
                                <p className="text-[#1E1E1E] mb-2">
                                    Drag & drop your audio file here
                                </p>
                                <p className="text-sm text-[#3A3A3A] mb-4">or</p>
                                <label htmlFor="audio-input">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-medium"
                                        onClick={() =>
                                            document.getElementById("audio-input")?.click()
                                        }
                                    >
                                        Browse Files
                                    </Button>
                                </label>
                                <input
                                    id="audio-input"
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleAudioChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-[#3A3A3A] mt-3">
                                    MP3, WAV, FLAC up to 200MB
                                </p>
                            </>
                        ) : (
                            <div className="flex items-center justify-between bg-[#3A3A3A]/10 p-3 rounded-lg">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Music className="h-8 w-8 text-[#1FA9D6] flex-shrink-0" />
                                    <div className="text-left min-w-0">
                                        <p className="text-[#1E1E1E] font-medium text-sm truncate">
                                            {audioFile.name}
                                        </p>
                                        <p className="text-xs text-[#3A3A3A]">
                                            {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={removeAudio}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Label className="text-[#1E1E1E] text-sm mb-2 block">Artwork</Label>
                    {!artworkPreview ? (
                        <label htmlFor="artwork-input">
                            <div className="border-2 border-dashed border-[#3A3A3A]/30 bg-[#3A3A3A]/5 rounded-lg p-6 text-center cursor-pointer hover:border-[#1FA9D6] transition-colors">
                                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-[#3A3A3A]" />
                                <p className="text-[#1E1E1E] text-sm mb-1">Upload cover art</p>
                                <p className="text-xs text-[#3A3A3A]">
                                    JPG, PNG up to 10MB (Square recommended)
                                </p>
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
                                className="absolute top-2 right-2 bg-white/80 text-gray-900 hover:bg-white"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <Label
                            htmlFor="track-name"
                            className="text-[#1E1E1E] text-sm mb-2 block"
                        >
                            Track Name *
                        </Label>
                        <Input
                            id="track-name"
                            value={trackName}
                            onChange={(e) => setTrackName(e.target.value)}
                            placeholder="Enter track name"
                            className="bg-white border-[#3A3A3A]/30 text-[#1E1E1E] placeholder:text-[#3A3A3A] focus:border-[#1FA9D6]"
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="artist-name"
                            className="text-[#1E1E1E] text-sm mb-2 block"
                        >
                            Artist Name *
                        </Label>
                        <Input
                            id="artist-name"
                            value={artistName}
                            onChange={(e) => setArtistName(e.target.value)}
                            placeholder="Enter artist name"
                            className="bg-white border-[#3A3A3A]/30 text-[#1E1E1E] placeholder:text-[#3A3A3A] focus:border-[#1FA9D6]"
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="genre"
                            className="text-[#1E1E1E] text-sm mb-2 block"
                        >
                            Genre *
                        </Label>
                        <Select value={genre} onValueChange={setGenre}>
                            <SelectTrigger className="bg-white border-[#3A3A3A]/30 text-[#1E1E1E]">
                                <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="techno">Techno</SelectItem>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="tech-house">Tech House</SelectItem>
                                <SelectItem value="dubstep">Dubstep</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={handleUpload}
                    disabled={
                        isUploading || !audioFile || !trackName || !artistName || !genre
                    }
                    className="w-full bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed py-6 text-lg font-semibold"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-5 w-5 mr-2" />
                            Upload Track
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
