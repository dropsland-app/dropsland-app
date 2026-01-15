"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { getProfile, createProfile } from "@/lib/api/profiles";

// 1. Updated Interface to include 'role'
interface UserData {
  username: string;
  type: "fan" | "artist"; // Kept for backward compatibility with existing UI
  role: "FAN" | "DJ" | "STAFF"; // Source of truth for permissions
  isVerified?: boolean;
  walletAddress?: string;
  avatar?: string;
}

interface AuthContextType {
  user: any; // Raw Privy user
  userData: UserData | null; // App-specific data
  isAuthenticated: boolean;
  balance: number;
  donated: number;
  login: () => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
  addToBalance: (amount: number) => void;
  addToDonated: (amount: number) => void;
  isArtist: () => boolean;
  isStaff: () => boolean; // 2. Added helper for Staff
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
  isStaff: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { login, logout: privyLogout, user, authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  // Local state
  const [balance, setBalance] = useState(0);
  const [donated, setDonated] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (ready && authenticated && user) {
        const wallet =
          wallets.find((w) => w.walletClientType === "privy") || wallets[0];
        const address = wallet?.address || user.wallet?.address;

        if (address) {
          // 1. Try to get existing profile
          let profile = await getProfile(address);

          // 2. If no profile exists, create a default one (Defaulting to FAN)
          if (!profile) {
            const { data } = await createProfile(
              address,
              `User-${address.slice(0, 4)}`,
            );
            profile = data;
          }

          // 3. Set real data with Role Mapping
          if (profile) {
            setUserData({
              username: profile.username,
              // Map legacy 'type' for older components (Only DJ is 'artist', Staff uses 'fan' view base)
              type: profile.role === "DJ" ? "artist" : "fan",
              // Set explicit role
              role: (profile.role as "FAN" | "DJ" | "STAFF") || "FAN",
              // DJs and Staff are verified
              isVerified: ["DJ", "STAFF", "ORGANIZER"].includes(profile.role),
              walletAddress: profile.wallet_address,
              avatar: profile.avatar_url || undefined,
            });
          } else {
            console.warn("Could not load or create profile");
          }

          // Initialize mock balances
          setBalance(125);
          setDonated(75);
        }
      } else {
        // If not authenticated, clear everything
        setUserData(null);
        setBalance(0);
        setDonated(0);
      }
    };

    loadUser();
  }, [ready, authenticated, user, wallets]);

  // Helper functions
  const updateBalance = (newBalance: number) => setBalance(newBalance);
  const addToBalance = (amount: number) => setBalance((prev) => prev + amount);
  const addToDonated = (amount: number) => setDonated((prev) => prev + amount);

  // Role checks
  const isArtist = () => userData?.role === "DJ";
  const isStaff = () => userData?.role === "STAFF";

  // Enhanced logout with localStorage cleanup
  const logout = () => {
    localStorage.removeItem("user_role");
    privyLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        isAuthenticated: authenticated,
        balance,
        donated,
        login,
        logout,
        updateBalance,
        addToBalance,
        addToDonated,
        isArtist,
        isStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
