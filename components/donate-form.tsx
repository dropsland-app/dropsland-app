"use client";

import { useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { parseEther } from "viem";
import { useSendTransaction } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BanknoteIcon } from "@/components/icons/banknote-icon";

interface DonateFormProps {
  creatorId: string;
  creatorName: string;
  creatorAddress: string;
}

export default function DonateForm({
  creatorName,
  creatorAddress,
}: DonateFormProps) {
  const [amount, setAmount] = useState("0.001"); // Default to small ETH amount
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { sendTransaction } = useSendTransaction({
    onSuccess: (hash) => {
      setIsLoading(false);
      alert(
        `Successfully donated ${amount} ETH to ${creatorName}!\nTx Hash: ${hash}`,
      );
      setMessage("");
    },
    onError: (error) => {
      console.error("Donation failed:", error);
      setIsLoading(false);
      alert("Donation failed. Please try again.");
    },
  });

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      await sendTransaction({
        to: creatorAddress,
        value: parseEther(amount),
      });
    } catch (error) {
      console.error("Tx request failed", error);
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BanknoteIcon className="mr-2 h-5 w-5 text-primary" />
          Donate ETH
        </CardTitle>
        <CardDescription>Support {creatorName} directly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (ETH)</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-9"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold">
              Ξ
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a support message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Info Tooltip */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This transaction sends native ETH directly to the creator's
                  wallet on the current network.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span>
            Funds go directly to {creatorAddress.slice(0, 6)}...
            {creatorAddress.slice(-4)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleDonate} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Donate ${amount} ETH`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
