"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, parseEther, decodeEventLog } from "viem";
import { CHAIN, DROPSLAND_CREATORS_CONTRACT } from "@/config/chain";
import { DROPSLAND_CREATORS_ABI } from "@/util/abis";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/ipfs";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Upload, Plus, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createPublicClient, http } from "viem";

export default function CreateMembershipPage() {
  const router = useRouter();
  const { wallets } = useWallets();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [supply, setSupply] = useState("100");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [perks, setPerks] = useState<string[]>([""]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePerkChange = (index: number, value: string) => {
    const newPerks = [...perks];
    newPerks[index] = value;
    setPerks(newPerks);
  };

  const addPerk = () => setPerks([...perks, ""]);

  const removePerk = (index: number) => {
    const newPerks = perks.filter((_, i) => i !== index);
    setPerks(newPerks.length > 0 ? newPerks : [""]);
  };

  const handleCreate = async () => {
    const wallet =
      wallets.find((w) => w.walletClientType === "privy") || wallets[0];

    if (!wallet || !image || !name || !price) {
      alert("Please fill all required fields and connect wallet");
      return;
    }

    setLoading(true);

    try {
      // 1. IPFS Uploads
      setStep("Uploading Image...");
      const imageUri = await uploadFileToIPFS(image);

      setStep("Uploading Metadata...");
      const filteredPerks = perks.filter((p) => p.trim() !== "");
      const metadata = {
        name: name,
        description: desc,
        image: imageUri,
        attributes: filteredPerks.map((p) => ({
          trait_type: "Perk",
          value: p,
        })),
      };
      const metadataUri = await uploadJSONToIPFS(metadata);

      // 2. Blockchain Transaction
      setStep("Preparing Transaction...");

      // Switch chain if needed
      const currentChainId = Number(wallet.chainId.split(":")[1]);
      if (currentChainId !== CHAIN.id) {
        setStep("Switching Network...");
        await wallet.switchChain(CHAIN.id);
      }

      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: CHAIN,
        transport: custom(provider),
      });

      setStep("Confirm in Wallet...");

      const hash = await walletClient.writeContract({
        chain: CHAIN,
        address: DROPSLAND_CREATORS_CONTRACT as `0x${string}`,
        abi: DROPSLAND_CREATORS_ABI,
        functionName: "createTier",
        args: [
          parseEther(price), // Price in Wei
          BigInt(supply), // Max Supply
          metadataUri, // IPFS CID
        ],
      });

      console.log("Tx Hash:", hash);

      // 3. Wait for transaction and get the tier ID from the event
      setStep("Waiting for confirmation...");

      const publicClient = createPublicClient({
        chain: CHAIN,
        transport: http(),
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // Find the TierCreated event to get the tierId
      let tierId: bigint | null = null;
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: DROPSLAND_CREATORS_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "TierCreated") {
            const args = decoded.args as unknown as { tierId: bigint };
            tierId = args.tierId;
            break;
          }
        } catch {
          // Not the event we're looking for
        }
      }

      if (tierId === null) {
        console.warn(
          "Could not find TierCreated event, using fallback tier ID",
        );
        tierId = 0n;
      }

      // 4. Save to Supabase
      setStep("Saving to Database...");

      const { error: dbError } = await supabase
        .from("membership_tiers")
        .insert({
          creator_wallet: wallet.address,
          name,
          description: desc,
          price: parseFloat(price),
          image_url: imageUri,
          perks: filteredPerks,
          max_supply: parseInt(supply),
          onchain_token_id: Number(tierId),
        });

      if (dbError) {
        console.error("Database error:", dbError);
        // Don't fail completely - the on-chain tier was created
        alert(
          "Tier created on-chain but failed to save to database. You may need to re-sync.",
        );
      }

      setStep("Done!");
      router.push("/profile");
    } catch (e) {
      console.error("Creation failed:", e);
      alert("Failed to create membership tier. See console for details.");
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pt-[60px] pb-4 px-5 sticky top-0 z-50 bg-white border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft size={28} className="text-gray-900" />
        </button>
        <h1 className="font-extrabold text-[20px] text-gray-900">
          Create Membership
        </h1>
      </div>

      <div className="flex-1 px-5 pb-12 w-full max-w-md mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pt-6">
        {/* Image Upload */}
        <div className="flex justify-center">
          <label className="relative w-40 h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-[#1FA9D6] hover:bg-[#1FA9D6]/5 transition-all group overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400 group-hover:text-[#1FA9D6] transition-colors">
                <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:shadow-md transition-all border border-gray-100">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">Cover Art</span>
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
          {/* Tier Name */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Tier Name
            </Label>
            <Input
              placeholder="e.g. Gold Inner Circle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-transparent border-gray-200 focus:border-[#1FA9D6] focus:ring-[#1FA9D6]/20 text-lg text-gray-900 placeholder:text-gray-300"
            />
          </div>

          {/* Price and Supply */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                Price (ETH)
              </Label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.05"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-12 bg-transparent border-gray-200 focus:border-[#1FA9D6] focus:ring-[#1FA9D6]/20 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                Max Supply
              </Label>
              <Input
                type="number"
                placeholder="100"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                className="h-12 bg-transparent border-gray-200 focus:border-[#1FA9D6] focus:ring-[#1FA9D6]/20 text-gray-900"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Description
            </Label>
            <Textarea
              placeholder="What do fans get with this tier?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="min-h-[100px] bg-transparent border-gray-200 focus:border-[#1FA9D6] focus:ring-[#1FA9D6]/20 resize-none text-gray-900 placeholder:text-gray-300"
            />
          </div>

          {/* Perks List */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
              Perks List
            </Label>
            <div className="space-y-2">
              {perks.map((perk, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={perk}
                    onChange={(e) => handlePerkChange(i, e.target.value)}
                    placeholder="e.g. Backstage Access"
                    className="h-11 bg-transparent border-gray-200 focus:border-[#1FA9D6] focus:ring-[#1FA9D6]/20 text-gray-900 placeholder:text-gray-300"
                  />
                  {perks.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePerk(i)}
                      className="h-11 w-11 shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addPerk}
                className="w-full mt-2 border-dashed border-gray-200 text-gray-500 hover:text-[#1FA9D6] hover:border-[#1FA9D6]"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Perk
              </Button>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg border border-gray-100">
            <span>Network:</span>
            <span className="font-semibold text-[#1FA9D6] flex items-center gap-1">
              {CHAIN.name}
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FA9D6] animate-pulse" />
            </span>
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading || !image || !name || !price}
            className="w-full h-14 text-base font-bold shadow-lg shadow-[#1FA9D6]/20 rounded-xl bg-[#1FA9D6] text-white hover:bg-[#1FA9D6]/90"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>{step}</span>
              </div>
            ) : (
              "Publish Tier"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
