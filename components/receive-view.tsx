"use client"

import { useState } from "react"
import { ArrowLeft, Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

interface ReceiveViewProps {
  onBack: () => void
}

export default function ReceiveView({ onBack }: ReceiveViewProps) {
  const { balance } = useAuth()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const walletAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t"

  const copyToClipboard = () => {
    // Simplify clipboard copy to avoid API issues
    try {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      toast({
        title: "Address copied",
        description: "The wallet address has been copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy error",
        description: "Could not copy the address",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Receive $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Balance Card */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-400 mb-1">Current Balance</p>
              <div className="flex items-center">
                <BanknoteIcon className="h-5 w-5 text-bright-yellow mr-2" />
                <span className="text-2xl font-bold text-white">{balance} $DROPS</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-400 mb-4">Scan this QR code to receive $DROPS</p>
              <div className="bg-white p-4 rounded-lg mb-4 w-48 h-48 flex items-center justify-center">
                {/* Use a styled div instead of Image to avoid issues */}
                <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Address */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400 mb-2">Your wallet address</p>
            <div className="flex items-center bg-gray-700 p-3 rounded-lg mb-3">
              <div className="flex-1 text-white text-sm font-mono overflow-hidden overflow-ellipsis">
                {walletAddress}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="ml-2 text-gray-300 hover:text-white hover:bg-gray-600"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                className="flex-1 bg-gray-700 text-white border-gray-600"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" className="flex-1 bg-gray-700 text-white border-gray-600">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-medium text-white mb-2">Instructions</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start">
                <span className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Share your wallet address or QR code with anyone who wants to send you $DROPS.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>The sender should use the "Send" function in their app and paste your address.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-gray-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>Once the transaction is complete, the $DROPS will automatically appear in your balance.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

