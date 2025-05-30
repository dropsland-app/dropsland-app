"use client"

import { useState } from "react"
import { ArrowLeft, Banknote } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

export default function DonateScreen({ creator, onBack }) {
  const [amount, setAmount] = useState(5)
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDonationComplete, setIsDonationComplete] = useState(false)
  const { addToBalance, addToDonated } = useAuth() // Obtener las funciones para actualizar el balance y el valor donado

  const handleDonate = () => {
    setIsLoading(true)
    // Simulate donation process
    setTimeout(() => {
      // Actualizar el balance y el valor donado
      addToBalance(-amount)
      addToDonated(amount)

      setIsLoading(false)
      setIsDonationComplete(true)
    }, 1500)
  }

  if (isDonationComplete) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-primary px-4 py-3 flex items-center">
          <button className="w-8 h-8 flex items-center justify-center" onClick={onBack}>
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg ml-2">Donation Complete</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <Banknote className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your donation of {amount} DROPS to {creator.name} was successful.
          </p>
          <div className="bg-primary/10 p-4 rounded-xl w-full mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold flex items-center">
                <Banknote className="h-4 w-4 text-primary mr-1" />
                {amount} DROPS
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="text-xs text-gray-500">tx_...{Math.random().toString(36).substring(2, 8)}</span>
            </div>
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-medium w-full" onClick={onBack}>
            Back to Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-primary px-4 py-3 flex items-center">
        <button className="w-8 h-8 flex items-center justify-center" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <h1 className="text-white font-bold text-lg ml-2">Donate BEANS</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
              <Image
                src={creator.avatar || "/placeholder.svg"}
                alt={creator.name}
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{creator.name}</h3>
              <p className="text-gray-500 text-xs">{creator.handle}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium mb-3">Amount</h3>
          <div className="flex justify-between mb-2">
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 5 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(5)}
            >
              5 DROPS
            </button>
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 10 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(10)}
            >
              10 BEANS
            </button>
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 20 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(20)}
            >
              20 BEANS
            </button>
            <button
              className={`w-16 h-12 rounded-lg flex items-center justify-center ${amount === 50 ? "bg-primary text-white" : "bg-gray-100"}`}
              onClick={() => setAmount(50)}
            >
              50 BEANS
            </button>
          </div>
          <div className="mt-3">
            <label className="text-sm text-gray-600 block mb-1">Custom amount</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-3 py-2">
                <Banknote className="h-5 w-5 text-primary" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1 px-3 py-2 outline-none"
              />
              <div className="bg-gray-100 px-3 py-2 text-gray-500">DROPS</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <h3 className="font-medium mb-3">Message (optional)</h3>
          <textarea
            placeholder="Add a message to your donation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border rounded-lg p-3 h-24 outline-none focus:border-primary"
          ></textarea>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 text-primary"
            />
            <label htmlFor="anonymous" className="ml-2 text-sm">
              Donate anonymously
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Your donation will still be recorded on the blockchain, but your identity won't be displayed publicly.
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount</span>
            <span className="font-bold flex items-center">
              <Banknote className="h-4 w-4 text-primary mr-1" />
              {amount} DROPS
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Platform fee (5%)</span>
            <span className="text-gray-600">{(amount * 0.05).toFixed(2)} BEANS</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="font-bold">{amount} BEANS</span>
          </div>
        </div>

        <button
          className={`w-full py-3 rounded-full font-medium ${isLoading ? "bg-gray-300 text-gray-600" : "bg-primary text-white"}`}
          onClick={handleDonate}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Donate ${amount} DROPS`}
        </button>
      </div>
    </div>
  )
}

