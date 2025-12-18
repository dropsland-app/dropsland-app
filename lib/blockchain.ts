import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  type WalletClient,
  type PublicClient,
} from "viem";
import { CHAIN } from "@/config/chain";

// Helper to get a Viem Wallet Client (Authenticated Actions)
export const getWalletClient = async (
  wallets: any[],
): Promise<WalletClient> => {
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  if (!embeddedWallet) throw new Error("No Privy wallet connected");

  // Switch to the active chain configured in the app
  await embeddedWallet.switchChain(CHAIN.id);
  const provider = await embeddedWallet.getEthereumProvider();

  return createWalletClient({
    account: embeddedWallet.address as `0x${string}`,
    chain: CHAIN,
    transport: custom(provider),
  });
};

// Helper to get a Viem Public Client (Read-Only Actions)
export const getPublicClient = () => {
  return createPublicClient({
    chain: CHAIN,
    transport: http(),
  });
};
