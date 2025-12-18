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
        className: "bg-green-600 text-white border-none",
      })
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-4 py-3 bg-gradient-to-r from-[#1FA9D6]/10 to-[#1FA9D6]/5 backdrop-blur-xl border-b border-gray-100 flex items-center">
        <button onClick={onBack} className="flex items-center text-[#1E1E1E] hover:bg-black/5 p-2 -ml-2 rounded-full transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="font-medium">Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-[#1E1E1E]">Buy $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto bg-white">
        <Card className="mb-6 bg-white border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Amount to buy</span>
                  <div className="flex items-center text-[#1FA9D6] font-bold">
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
                  className="my-4 [&_.bg-primary]:bg-[#1FA9D6] [&_.border-primary]:border-[#1FA9D6]"
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
                        ? "border-[#1FA9D6] text-[#1FA9D6] bg-[#1FA9D6]/5"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }
                  >
                    {value} $DROPS
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-white border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2 text-[#1E1E1E]">Purchase Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <div className="flex items-center text-[#1E1E1E]">
                  <BanknoteIcon className="h-5 w-5 mr-1 text-[#1FA9D6]" />
                  <span>{amount} $DROPS</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Unit price</span>
                <span className="text-[#1E1E1E] font-medium">{exchangeRate} USD</span>
              </div>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-[#1E1E1E]">Total to pay</span>
                <span className="text-[#1FA9D6]">{(amount * exchangeRate).toFixed(2)} USD</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button
            onClick={handleBuy}
            disabled={isLoading || amount <= 0}
            className="w-full bg-[#1FA9D6] hover:bg-[#1FA9D6]/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-[#1FA9D6]/20 transition-all active:scale-[0.98]"
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
