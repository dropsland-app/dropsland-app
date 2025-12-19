"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// === Core Hooks & Utils ===
import { useAuth } from "@/hooks/use-auth";
import { useWallets } from "@privy-io/react-auth"; // Required for wallet switching
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/ipfs";
import { createWalletClient, custom } from "viem";

// === Configuration & Constants ===
import { CHAIN, DROPSLAND_EVENTS_CONTRACT } from "@/config/chain";
import { DROPSLAND_EVENTS_ABI } from "@/util/abis";

export default function CreateMerchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { wallets } = useWallets(); // Get active wallet interface

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [supply, setSupply] = useState("100");
  const [type, setType] = useState("merch");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!imageFile || !name || !user?.wallet) {
      alert("Please fill all fields and connect wallet");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload Image
      setStep("Uploading Image...");
      const imageUri = await uploadFileToIPFS(imageFile);

      // 2. Upload Metadata
      setStep("Saving Metadata...");
      const metadata = {
        name: name,
        description: description,
        image: imageUri,
        attributes: [
          { trait_type: "Type", value: type },
          { trait_type: "Creator", value: user.wallet.address },
        ],
      };
      const metadataUri = await uploadJSONToIPFS(metadata);

      // 3. Blockchain Transaction
      setStep("Check Wallet...");

      // --- WALLET & CHAIN FIX ---
      const activeWallet = wallets.find(
        (w) => w.address === user.wallet?.address,
      );
      if (!activeWallet) throw new Error("Active wallet not found");

      // Force chain switch if needed
      const currentChainId = Number(activeWallet.chainId.split(":")[1]);
      if (currentChainId !== CHAIN.id) {
        setStep("Switching Network...");
        await activeWallet.switchChain(CHAIN.id);
      }

      // Get provider AFTER ensuring correct chain
      const provider = await activeWallet.getEthereumProvider();

      setStep("Confirming...");

      const walletClient = createWalletClient({
        account: user.wallet.address as `0x${string}`,
        chain: CHAIN,
        transport: custom(provider),
      });

      const hash = await walletClient.writeContract({
        chain: CHAIN,
        address: DROPSLAND_EVENTS_CONTRACT,
        abi: DROPSLAND_EVENTS_ABI,
        functionName: "createItem",
        args: [BigInt(supply), metadataUri, "0x"],
      });

      console.log("Tx Hash:", hash);
      setStep("Done!");

      router.back();
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Failed to create merch. See console.");
    } finally {
      setIsLoading(false);
      setStep("");
    }
  };

  return (
    // LIGHT MODE: bg-background (white), text-foreground (dark)
    <div className="min-h-screen bg-background text-foreground p-6 pb-24 safe-top flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          New Item
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        {/* Image Upload Area */}
        <div className="flex justify-center">
          <label className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:shadow-md transition-all border border-border">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-medium">Upload Image</span>
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

        {/* Form Inputs */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Item Name
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              // Transparent input with border that focuses to Primary Blue
              className="h-12 bg-transparent border-input focus:border-primary focus:ring-primary/20 text-lg text-foreground placeholder:text-muted-foreground/50"
              placeholder="e.g. VIP Backstage Pass"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
              Description
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-transparent border-input focus:border-primary focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="What utility does this item provide?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Supply
              </Label>
              <Input
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                className="h-12 bg-transparent border-input focus:border-primary focus:ring-primary/20 text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Category
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12 bg-transparent border-input focus:ring-primary/20 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="merch">Merchandise</SelectItem>
                  <SelectItem value="drink">Beverage</SelectItem>
                  <SelectItem value="ticket">Ticket / Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Action Area */}
      <div className="mt-8 space-y-4">
        {/* Network Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 py-2 rounded-lg border border-border/50">
          <span>Network:</span>
          <span className="font-semibold text-primary flex items-center gap-1">
            {CHAIN.name}
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </span>
        </div>

        {/* Primary Action Button (Dropsland Blue) */}
        <Button
          className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
          onClick={handleCreate}
          disabled={isLoading || !imageFile || !name}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin w-5 h-5" />
              <span>{step}</span>
            </div>
          ) : (
            "Create Item"
          )}
        </Button>
      </div>
    </div>
  );
}
