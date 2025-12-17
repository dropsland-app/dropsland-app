"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";

// Define the shape of your user data
interface UserData {
  username: string;
  type: "fan" | "artist";
  isVerified?: boolean;
  walletAddress?: string;
}

interface AuthContextType {
  user: any; // Raw Privy user
  userData: UserData | null; // App-specific mock data
  isAuthenticated: boolean;
  balance: number;
  donated: number;
  login: () => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addToBalance: (amount: number) => void;
  addToDonated: (amount: number) => void;
  isArtist: () => boolean;
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
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { login, logout, user, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  // Local state to mimic your old database/mock data
  const [balance, setBalance] = useState(0);
  const [donated, setDonated] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // 1. If Privy says we are authenticated, we load the "Mock" profile
    if (ready && authenticated && user) {
      const wallet =
        wallets.find((w) => w.walletClientType === "privy") || wallets[0];
      const address = wallet?.address || user.wallet?.address;

      // --- MOCK LOGIC START ---
      // For this demo, we treat EVERY logged-in user as the artist "Juampi"
      // so you can see the full dashboard. In a real app, you'd check user.id.
      setUserData({
        username: "iamjuampi",
        type: "artist",
        isVerified: true,
        walletAddress: address,
      });

      // Initialize mock balances so the wallet isn't empty
      setBalance(125);
      setDonated(75);
      // --- MOCK LOGIC END ---
    } else {
      // If not authenticated, clear everything
      setUserData(null);
      setBalance(0);
      setDonated(0);
    }
  }, [ready, authenticated, user, wallets]);

  // Helper functions to keep existing components happy
  const updateBalance = (newBalance: number) => setBalance(newBalance);
  const addToBalance = (amount: number) => setBalance((prev) => prev + amount);
  const addToDonated = (amount: number) => setDonated((prev) => prev + amount);
  const isArtist = () => userData?.type === "artist";

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated: authenticated,
        balance,
        donated,
        login, // This now triggers the Privy Modal
        logout,
        updateBalance,
        addToBalance,
        addToDonated,
        isArtist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
