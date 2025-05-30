"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { donateToCreator } from "@/lib/blockchain"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface DonateFormProps {
  creatorId: string
  creatorName: string
}

export default function DonateForm({ creatorId, creatorName }: DonateFormProps) {
  const [amount, setAmount] = useState(5)
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call the actual blockchain function
      await donateToCreator(creatorId, amount, message, isAnonymous)
      alert(`Successfully purchased ${amount} $DROPS from ${creatorName}!`)
      setAmount(5)
      setMessage("")
    } catch (error) {
      console.error("Purchase failed:", error)
      alert("Purchase failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BanknoteIcon className="mr-2 h-5 w-5 text-primary" />
          Buy $DROPS
        </CardTitle>
        <CardDescription>Support {creatorName} with music tokens</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex items-center text-primary font-bold">
              <BanknoteIcon className="mr-1 h-4 w-4" />
              {amount} $DROPS
            </div>
          </div>
          <Slider
            id="amount"
            min={1}
            max={100}
            step={1}
            value={[amount]}
            onValueChange={(value) => setAmount(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 $DROPS</span>
            <span>100 $DROPS</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message (optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a support message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="anonymous" className="text-sm">
            Buy anonymously
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Your purchase will be recorded on the blockchain, but your identity won't be shown publicly.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handlePurchase} disabled={isLoading}>
          {isLoading ? "Processing..." : `Buy ${amount} $DROPS`}
        </Button>
      </CardFooter>
    </Card>
  )
}

