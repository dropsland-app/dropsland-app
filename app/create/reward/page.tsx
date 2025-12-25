"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import { useWallets } from "@privy-io/react-auth";
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/ipfs";
import { createWalletClient, custom } from "viem";
import { CHAIN, DROPSLAND_EVENTS_CONTRACT } from "@/config/chain";
import { DROPSLAND_EVENTS_ABI } from "@/util/abis";

export default function CreateRewardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { wallets } = useWallets();

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [supply, setSupply] = useState("100");
    const [type, setType] = useState("merch");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
            setStep("Uploading Image...");
            const imageUri = await uploadFileToIPFS(imageFile);

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

            setStep("Check Wallet...");
            const activeWallet = wallets.find(
                (w) => w.address === user.wallet?.address,
            );
            if (!activeWallet) throw new Error("Active wallet not found");

            const currentChainId = Number(activeWallet.chainId.split(":")[1]);
            if (currentChainId !== CHAIN.id) {
                setStep("Switching Network...");
                await activeWallet.switchChain(CHAIN.id);
            }

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
        <div className="min-h-screen bg-white font-manrope flex flex-col">
            <div className="flex items-center gap-3 pt-[60px] pb-4 px-5 sticky top-0 z-50 bg-white">
                <button
                    onClick={() => router.back()}
                    className="p-1 -ml-1 hover:opacity-70 transition-opacity"
                >
                    <ChevronLeft size={28} className="text-[#1b1c23]" />
                </button>
                <h1 className="font-extrabold text-[20px] text-[#1b1c23]">New Item</h1>
            </div>

            <div className="flex-1 px-5 pb-12 w-full max-w-md mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-center mt-2">
                    <label className="relative w-48 h-48 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                                <div className="p-3 bg-white shadow-sm rounded-full mb-3 group-hover:shadow-md transition-all border border-gray-100">
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

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                            Item Name
                        </Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 bg-transparent border-gray-200 focus:border-primary focus:ring-primary/20 text-lg text-[#1b1c23] placeholder:text-gray-300"
                            placeholder="e.g. VIP Backstage Pass"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                            Description
                        </Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[100px] bg-transparent border-gray-200 focus:border-primary focus:ring-primary/20 resize-none text-[#1b1c23] placeholder:text-gray-300"
                            placeholder="What utility does this item provide?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                                Supply
                            </Label>
                            <Input
                                type="number"
                                value={supply}
                                onChange={(e) => setSupply(e.target.value)}
                                className="h-12 bg-transparent border-gray-200 focus:border-primary focus:ring-primary/20 text-[#1b1c23]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
                                Category
                            </Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-12 bg-transparent border-gray-200 focus:ring-primary/20 text-[#1b1c23]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-100">
                                    <SelectItem value="merch">Merchandise</SelectItem>
                                    <SelectItem value="drink">Beverage</SelectItem>
                                    <SelectItem value="ticket">Ticket / Access</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg border border-gray-100">
                        <span>Network:</span>
                        <span className="font-semibold text-primary flex items-center gap-1">
                            {CHAIN.name}
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </span>
                    </div>

                    <Button
                        className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 rounded-xl bg-primary text-white hover:bg-primary/90"
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
        </div>
    );
}
