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
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/ipfs";
import { createWalletClient, custom } from "viem";
import { usePrivy, useWallets } from "@privy-io/react-auth";

// === Configuration & Constants ===
import { CHAIN, DROPSLAND_EVENTS_CONTRACT } from "@/util/constants";
import { DROPSLAND_EVENTS_ABI } from "@/util/abis";

export default function CreateMerchPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { wallets } = useWallets();

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
      setStep("Confirming in Wallet...");

      const activeWallet = wallets.find(
        (w) => w.address === user.wallet?.address,
      );
      if (!activeWallet) {
        throw new Error("Active wallet not found");
      }
      const currentChainId = Number(activeWallet.chainId.split(":")[1]);
      if (currentChainId !== CHAIN.id) {
        setStep("Switching Network...");
        await activeWallet.switchChain(CHAIN.id);
      }

      const provider = await activeWallet.getEthereumProvider();

      const walletClient = createWalletClient({
        account: user.wallet.address as `0x${string}`,
        chain: CHAIN,
        transport: custom(provider),
      });

      const hash = await walletClient.writeContract({
        address: DROPSLAND_EVENTS_CONTRACT as `0x${string}`,
        abi: DROPSLAND_EVENTS_ABI,
        functionName: "createItem",
        args: [BigInt(supply), metadataUri, "0x"],
      });

      console.log("Tx Hash:", hash);
      setStep("Done!");

      // Optional: Add a success toast here
      router.push("/profile");
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Failed to create merch. See console.");
    } finally {
      setIsLoading(false);
      setStep("");
    }
  };

  return (
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
        <h1 className="text-xl font-bold tracking-tight">New Item</h1>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        {/* Image Upload Area */}
        <div className="flex justify-center">
          <label className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden bg-muted/20">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                <div className="p-3 bg-background rounded-full shadow-sm mb-3 group-hover:shadow-md transition-all">
                  <Upload className="w-6 h-6" />
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
              className="h-12 bg-transparent border-input focus:border-primary focus:ring-primary/20 text-lg"
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
              className="min-h-[100px] bg-transparent border-input focus:border-primary focus:ring-primary/20 resize-none"
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
                className="h-12 bg-transparent border-input focus:border-primary focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">
                Category
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-12 bg-transparent border-input focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 py-2 rounded-lg">
          <span>Network:</span>
          <span className="font-semibold text-primary flex items-center gap-1">
            {CHAIN.name}
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </span>
        </div>

        <Button
          className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl"
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
