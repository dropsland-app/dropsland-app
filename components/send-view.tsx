"use client"

import { useState } from "react"
import { ArrowLeft, Info, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

// Import the useAuth hook
import { useAuth } from "@/hooks/use-auth"

interface SendViewProps {
  onBack: () => void
}

// Modify the SendView function to update balance and donated value after sending
export default function SendView({ onBack }: SendViewProps) {
  const [amount, setAmount] = useState(20)
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()
  const { balance, addToBalance, addToDonated } = useAuth() // Get balance and functions to update it

  const handleSend = () => {
    if (!selectedUser) {
      toast({
        title: "Select a recipient",
        description: "Please select who to send tokens to",
        variant: "destructive",
      })
      return
    }

    // Check if there's enough balance
    if (amount > balance) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough tokens. Your current balance is ${balance} $DROPS`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      // Subtract from balance
      addToBalance(-amount)

      // Add to donated value
      addToDonated(amount)

      toast({
        title: "Sent successfully!",
        description: `You've sent ${amount} $DROPS to ${selectedUser.name}`,
      })
      setIsLoading(false)
    }, 1500)
  }

  const handleSearch = () => {
    if (!recipient.trim()) return

    setIsLoading(true)

    // Simulate search delay
    setTimeout(() => {
      // Mock user found
      const user = {
        id: "u1",
        name: recipient,
        handle: `@${recipient.toLowerCase().replace(/\s+/g, "")}`,
        avatar: "/avatars/user.jpg",
      }

      setSelectedUser(user)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex items-center">
        <button onClick={onBack} className="flex items-center text-gray-300">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back</span>
        </button>
        <h1 className="flex-1 text-center font-semibold text-white">Send $DROPS</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto bg-gray-950">
        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient" className="text-white">
                  Recipient
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="recipient"
                      placeholder="Name or @username"
                      className="pl-10 bg-gray-700 border-gray-600 text-white"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      disabled={!!selectedUser}
                    />
                  </div>
                  {!selectedUser ? (
                    <Button
                      onClick={handleSearch}
                      disabled={!recipient.trim() || isLoading}
                      className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-700 text-white border-gray-600"
                    >
                      Change
                    </Button>
                  )}
                </div>
              </div>

              {selectedUser && (
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-white">{selectedUser.name}</p>
                      <p className="text-sm text-gray-400">{selectedUser.handle}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Amount to send</Label>
                  <div className="flex items-center text-bright-yellow font-bold">
                    <BanknoteIcon className="h-5 w-5 mr-1" />
                    <span>{amount} $DROPS</span>
                  </div>
                </div>
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={[amount]}
                  onValueChange={(value) => setAmount(value[0])}
                  className="my-4"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>1 $DROPS</span>
                  <span>100 $DROPS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50].map((value) => (
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

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Message (optional)
                </Label>
                <Input
                  id="message"
                  placeholder="Add a message..."
                  className="bg-gray-700 border-gray-600 text-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSend}
            disabled={isLoading || amount <= 0 || !selectedUser}
            className="bg-bright-yellow hover:bg-bright-yellow-700 text-black"
          >
            {isLoading ? "Processing..." : "Send tokens"}
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

