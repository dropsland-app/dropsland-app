import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseEther,
  formatEther,
  type WalletClient,
  type PublicClient,
} from "viem";
import { worldchain } from "viem/chains"; // Or worldchainSepolia for dev

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const BEANS_TOKEN_ADDRESS = "0x..."; // Replace with real address
const BEANS_PLATFORM_ADDRESS = "0x..."; // Replace with real address

// Define ABIs as const to get Type Safety/Autocompletion in Viem
const BEANS_TOKEN_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const BEANS_PLATFORM_ABI = [
  {
    inputs: [
      { name: "creatorId", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "message", type: "string" },
      { name: "isAnonymous", type: "bool" },
    ],
    name: "donateToCreator",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "handle", type: "string" },
      { name: "category", type: "string" },
      { name: "description", type: "string" },
    ],
    name: "registerAsCreator",
    outputs: [{ name: "creatorId", type: "string" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "creatorId", type: "string" }],
    name: "getCreatorInfo",
    outputs: [
      { name: "walletAddress", type: "address" },
      { name: "totalReceived", type: "uint256" },
      { name: "supportersCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

// Helper to get a Viem Wallet Client (Authenticated Actions)
const getWalletClient = async (wallets: any[]): Promise<WalletClient> => {
  const embeddedWallet = wallets.find((w) => w.walletClientType === "privy");
  if (!embeddedWallet) throw new Error("No Privy wallet connected");

  await embeddedWallet.switchChain(worldchain.id);
  const provider = await embeddedWallet.getEthereumProvider();

  return createWalletClient({
    account: embeddedWallet.address as `0x${string}`,
    chain: worldchain,
    transport: custom(provider),
  });
};

// Helper to get a Viem Public Client (Read-Only Actions)
// We use a public RPC for reads so we don't need the user's wallet for basic data
const getPublicClient = (): PublicClient => {
  return createPublicClient({
    chain: worldchain,
    transport: http(), // Uses default public RPC, or add your Alchemy/Infura URL here
  });
};

// ------------------------------------------------------------------
// PUBLIC ACTIONS
// ------------------------------------------------------------------

export const checkBEANSBalance = async (wallets: any[]): Promise<number> => {
  try {
    const walletClient = await getWalletClient(wallets);
    const [address] = await walletClient.getAddresses();
    const publicClient = getPublicClient();

    // Viem Read Contract
    const balance = await publicClient.readContract({
      address: BEANS_TOKEN_ADDRESS,
      abi: BEANS_TOKEN_ABI,
      functionName: "balanceOf",
      args: [address],
    });

    return Number(formatEther(balance));
  } catch (error) {
    console.error("Error checking balance:", error);
    return 0;
  }
};

export const donateToCreator = async (
  wallets: any[],
  creatorId: string,
  amount: number,
  message: string,
  isAnonymous: boolean,
): Promise<boolean> => {
  try {
    const walletClient = await getWalletClient(wallets);
    const publicClient = getPublicClient();
    const [account] = await walletClient.getAddresses();
    const amountWei = parseEther(amount.toString());

    // 1. Approve Logic
    console.log("Approving tokens...");
    const approveHash = await walletClient.writeContract({
      address: BEANS_TOKEN_ADDRESS,
      abi: BEANS_TOKEN_ABI,
      functionName: "approve",
      args: [BEANS_PLATFORM_ADDRESS, amountWei],
      account,
    });
    // Wait for approval to be mined
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // 2. Donate Logic
    console.log("Executing donation...");
    const donateHash = await walletClient.writeContract({
      address: BEANS_PLATFORM_ADDRESS,
      abi: BEANS_PLATFORM_ABI,
      functionName: "donateToCreator",
      args: [creatorId, amountWei, message, isAnonymous],
      account,
    });
    // Wait for donation to be mined
    await publicClient.waitForTransactionReceipt({ hash: donateHash });

    return true;
  } catch (error) {
    console.error("Donation failed:", error);
    throw error;
  }
};

export const registerAsCreator = async (
  wallets: any[],
  name: string,
  handle: string,
  category: string,
  description: string,
): Promise<string> => {
  try {
    const walletClient = await getWalletClient(wallets);
    const publicClient = getPublicClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: BEANS_PLATFORM_ADDRESS,
      abi: BEANS_PLATFORM_ABI,
      functionName: "registerAsCreator",
      args: [name, handle, category, description],
      account,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    // In a real app, you'd decode logs here to find the creatorId
    return handle;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

export const getCreatorInfo = async (creatorId: string) => {
  try {
    const publicClient = getPublicClient();

    const result = await publicClient.readContract({
      address: BEANS_PLATFORM_ADDRESS,
      abi: BEANS_PLATFORM_ABI,
      functionName: "getCreatorInfo",
      args: [creatorId],
    });

    return {
      walletAddress: result[0],
      totalReceived: Number(formatEther(result[1])),
      supportersCount: Number(result[2]),
    };
  } catch (error) {
    console.error("Error fetching creator info:", error);
    return null;
  }
};
