"use client"

import { useState } from "react"
import { ArrowLeft, Info } from "lucide-react"
import { BanknoteIcon } from "@/components/icons/banknote-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"

// Import the useAuth hook
import { useAuth } from "@/hooks/use-auth"

interface BuyViewProps {
  onBack: () => void
}

export default function BuyView({ onBack }: BuyViewProps) {
  const [amount, setAmount] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [exchangeRate] = useState(0.42) // 1 DROPS = 0.42 USD
  const { toast } = useToast()
  const { addToBalance } = useAuth()

  const handleBuy = () => {
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // Update balance
      addToBalance(amount)

      toast({
        title: "Purchase successful!",
        description: `You've bought ${amount} $DROPS for ${(amount * exchangeRate).toFixed(2)} USD`,
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Buy $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-950">
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Amount to buy</span>
                  <div className="flex items-center text-bright-yellow font-bold">
                    <BanknoteIcon className="h-5 w-5 mr-1" />
                    <span>{amount} $DROPS</span>
                  </div>
                </div>
                <Slider
                  min={10}
                  max={500}
                  step={10}
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>10 $DROPS</span>
                  <span>500 $DROPS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    onClick={() => setAmount(value)}
                    className={
                      amount === value
                        ? "border-bright-yellow text-bright-yellow bg-gray-700"
                        : "bg-gray-700 text-white border-gray-600"
                    }
                  >
                    {value} $DROPS
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Purchase Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <div className="flex items-center text-white">
                  <BanknoteIcon className="h-5 w-5 mr-1 text-bright-yellow" />
                  <span>{amount} $DROPS</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unit price</span>
                <span className="text-white">{exchangeRate} USD</span>
              </div>
              <div className="border-t border-gray-700 my-2"></div>
              <div className="flex justify-between font-bold">
                <span className="text-white">Total to pay</span>
                <span className="text-white">{(amount * exchangeRate).toFixed(2)} USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleBuy}
            disabled={isLoading || amount <= 0}
            className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
          >
            {isLoading ? "Processing..." : "Confirm Purchase"}
          </Button>
          <p className="text-xs text-gray-400 text-center mt-2 flex items-center justify-center">
            <Info className="h-3 w-3 mr-1" />
            This is a demo. No real transaction will be made.
          </p>
        </div>
      </div>
    </div>
  )
}

