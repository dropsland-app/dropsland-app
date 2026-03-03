"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { CHAIN } from "@/config/chain";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/ipfs";
import { supabase } from "@/lib/supabase/client";
import {
  Loader2,
  Upload,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppHeader from "@/components/layout/app-header";

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = usePrivy();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [ticketSupply, setTicketSupply] = useState("100");
  const [ticketPrice, setTicketPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!image || !title || !eventDate || !location) {
      alert("Please fill all required fields");
      return;
    }

    if (!user?.wallet?.address) {
      alert("Please connect your wallet");
      return;
    }

    setLoading(true);

    try {
      // 1. IPFS Uploads
      setStep("Uploading Image...");
      const imageUri = await uploadFileToIPFS(image);

      setStep("Uploading Metadata...");
      const eventDateTime = new Date(`${eventDate}T${eventTime || "00:00"}`);
      const metadata = {
        name: title,
        description: description,
        image: imageUri,
        attributes: [
          { trait_type: "Event Type", value: "Ticket" },
          { trait_type: "Location", value: location },
          { trait_type: "Date", value: eventDateTime.toISOString() },
          { trait_type: "Max Supply", value: ticketSupply },
        ],
      };
      const metadataUri = await uploadJSONToIPFS(metadata);

      // 2. Save to Supabase (for now, without on-chain)
      // TODO: Add smart contract integration for ticket minting
      setStep("Saving Event...");

      const { error: dbError } = await supabase.from("events").insert({
        organizer_wallet: user?.wallet?.address,
        title,
        description,
        location,
        event_date: eventDateTime.toISOString(),
        image_url: imageUri,
        metadata_uri: metadataUri,
        ticket_supply: parseInt(ticketSupply),
        ticket_price: ticketPrice ? parseFloat(ticketPrice) : 0,
        is_active: true,
      });

      if (dbError) {
        console.error("Database error:", dbError);
        // Check if the events table doesn't exist
        if (dbError.code === "42P01") {
          alert(
            "Events table not found. Please run the database migration first.",
          );
        } else {
          alert("Failed to save event. See console for details.");
        }
        return;
      }

      setStep("Done!");
      router.push("/profile");
    } catch (e) {
      console.error("Creation failed:", e);
      alert("Failed to create event. See console for details.");
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <AppHeader title="Create Event" showBack />

      <div className="flex-1 px-5 pb-12 w-full max-w-md mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pt-6">
        {/* Image Upload */}
        <div className="flex justify-center">
          <label className="relative w-full aspect-video max-w-sm rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all group overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-green-600 transition-colors">
                <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:shadow-md transition-all border border-gray-100">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium">Event Cover Image</span>
                <span className="text-xs text-gray-400 mt-1">
                  Recommended: 16:9 aspect ratio
                </span>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="space-y-5">
          {/* Event Title */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Event Title *
            </Label>
            <Input
              placeholder="e.g. Summer Music Festival 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 text-lg text-gray-900 placeholder:text-gray-300"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location *
            </Label>
            <Input
              placeholder="e.g. Madison Square Garden, NYC"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 text-gray-900 placeholder:text-gray-300"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date *
              </Label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="h-12 bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Time
              </Label>
              <Input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="h-12 bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 text-gray-900"
              />
            </div>
          </div>

          {/* Ticket Supply and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <Ticket className="w-3 h-3" /> Ticket Supply
              </Label>
              <Input
                type="number"
                placeholder="100"
                value={ticketSupply}
                onChange={(e) => setTicketSupply(e.target.value)}
                className="h-12 bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Price (ETH)
              </Label>
              <Input
                type="number"
                step="0.001"
                placeholder="0 = Free"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                className="h-12 bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 text-gray-900"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Description
            </Label>
            <Textarea
              placeholder="Tell attendees about this event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-transparent border-gray-200 focus:border-green-500 focus:ring-green-500/20 resize-none text-gray-900 placeholder:text-gray-300"
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg border border-gray-100">
            <span>Network:</span>
            <span className="font-semibold text-green-600 flex items-center gap-1">
              {CHAIN.name}
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </span>
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading || !image || !title || !eventDate || !location}
            className="w-full h-14 text-base font-bold shadow-lg shadow-green-500/20 rounded-xl bg-green-600 text-white hover:bg-green-700"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>{step}</span>
              </div>
            ) : (
              "Publish Event"
            )}
          </Button>

          <p className="text-xs text-gray-400 text-center">
            Event tickets will be minted as NFTs on {CHAIN.name}
          </p>
        </div>
      </div>
    </div>
  );
}
