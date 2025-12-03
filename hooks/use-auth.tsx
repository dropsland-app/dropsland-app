"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"

// Add user type to the interface
type UserType = "fan" | "artist"

interface UserData {
  username: string
  type: UserType
  isVerified?: boolean
}

interface AuthContextType {
  user: string | null
  userData: UserData | null
  isAuthenticated: boolean
  balance: number
  donated: number
  login: (username: string) => void
  logout: () => void
  updateBalance: (newBalance: number) => void
  addToBalance: (amount: number) => void
  addToDonated: (amount: number) => void
  isArtist: () => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAuthenticated: false,
  balance: 0,
  donated: 0,
  login: () => {},
  logout: () => {},
  updateBalance: () => {},
  addToBalance: () => {},
  addToDonated: () => {},
  isArtist: () => false,
})

// Define user data for different accounts
const USER_DATA: Record<string, UserData> = {
  juampi: {
    username: "iamjuampi",
    type: "artist",
    isVerified: true,
  },
  banger: {
    username: "banger",
    type: "artist",
    isVerified: true,
  },
  nicolamarti: {
    username: "Nicola Marti",
    type: "artist",
    isVerified: true,
  },
  axs: {
    username: "AXS",
    type: "artist",
    isVerified: true,
  },
  flush: {
    username: "FLUSH",
    type: "artist",
    isVerified: false,
  },
  daniloDR: {
    username: "DaniløDR",
    type: "artist",
    isVerified: false,
  },
  spitflux: {
    username: "Spitflux",
    type: "artist",
    isVerified: false,
  },
  kr4d: {
    username: "Kr4D",
    type: "artist",
    isVerified: false,
  },
  fan: {
    username: "musicfan",
    type: "fan",
  },
  user: {
    username: "musicfan",
    type: "fan",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initial balance value
  const [balance, setBalance] = useState(125)
  const [donated, setDonated] = useState(75)
  const [user, setUser] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("beans_user")
    if (storedUser) {
      setUser(storedUser)
      setUserData(USER_DATA[storedUser] || { username: storedUser, type: "fan" })
      setIsAuthenticated(true)

      // Retrieve saved balance if it exists
      const storedBalance = localStorage.getItem("beans_balance")
      if (storedBalance) {
        setBalance(Number(storedBalance))
      }

      // Retrieve saved donated value if it exists
      const storedDonated = localStorage.getItem("beans_donated")
      if (storedDonated) {
        setDonated(Number(storedDonated))
      }
    }
  }, [])

  const login = useCallback((username: string) => {
    setUser(username)
    setUserData(USER_DATA[username] || { username, type: "fan" })
    setIsAuthenticated(true)
    localStorage.setItem("beans_user", username)

    // Set initial balance if it doesn't exist
    if (!localStorage.getItem("beans_balance")) {
      localStorage.setItem("beans_balance", "125")
    }

    // Set initial donated value if it doesn't exist
    if (!localStorage.getItem("beans_donated")) {
      localStorage.setItem("beans_donated", "75")
    }
  }, [])

  const logout = () => {
    setUser(null)
    setUserData(null)
    setIsAuthenticated(false)
    localStorage.removeItem("beans_user")
    // We don't remove balance or donated value to keep them between sessions
  }

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance)
    localStorage.setItem("beans_balance", newBalance.toString())
  }

  const addToBalance = (amount: number) => {
    const newBalance = balance + amount
    updateBalance(newBalance)
  }

  // New function to update donated value
  const addToDonated = (amount: number) => {
    const newDonated = donated + amount
    setDonated(newDonated)
    localStorage.setItem("beans_donated", newDonated.toString())
  }

  // Helper function to check if user is an artist
  const isArtist = () => {
    return userData?.type === "artist"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated,
        balance,
        donated,
        login,
        logout,
        updateBalance,
        addToBalance,
        addToDonated,
        isArtist,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
