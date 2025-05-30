"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { BanknoteIcon } from "@/components/icons/banknote-icon"

// Importar el hook useAuth
import { useAuth } from "@/hooks/use-auth"

// Mock data for activity
const ACTIVITIES = [
  {
    id: "a1",
    type: "donation_sent",
    user: {
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 5,
    time: "2 hours ago",
  },
  {
    id: "a2",
    type: "purchase",
    amount: 50,
    wldAmount: 0.5,
    time: "1 day ago",
  },
  {
    id: "a3",
    type: "donation_received",
    user: {
      name: "Anonymous",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 10,
    time: "3 days ago",
  },
  {
    id: "a4",
    type: "donation_sent",
    user: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    amount: 20,
    time: "1 week ago",
  },
  {
    id: "a5",
    type: "purchase",
    amount: 100,
    wldAmount: 1,
    time: "2 weeks ago",
  },
]

// Modificar la función ActivityScreen para mostrar el balance actual
export default function ActivityScreen() {
  const { balance } = useAuth() // Obtener el balance del contexto

  return (
    <div className="h-full overflow-auto pb-20">
      <div className="bg-primary p-4">
        <h1 className="text-white font-bold text-xl mb-4">Activity</h1>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available Balance</p>
              <div className="flex items-center mt-1">
                <BanknoteIcon className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl font-bold">{balance} DROPS</span>
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">Buy More</button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Transaction History</h2>
          <button className="text-primary text-sm font-medium">Filter</button>
        </div>

        <div className="space-y-3">
          {ACTIVITIES.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm">
              {activity.type === "donation_sent" && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
                    <ArrowUp className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Donation to {activity.user.name}</p>
                      <p className="text-red-500 font-medium">-{activity.amount} DROPS</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )}

              {activity.type === "donation_received" && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                    <ArrowDown className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Donation from {activity.user.name}</p>
                      <p className="text-green-500 font-medium">+{activity.amount} DROPS</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )}

              {activity.type === "purchase" && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                    <BanknoteIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Purchased BEANS</p>
                      <p className="text-green-500 font-medium">+{activity.amount} BEANS</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <p className="text-xs text-gray-500">-{activity.wldAmount} WLD</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

