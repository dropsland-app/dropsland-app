import { Network, Alchemy, type OwnedNft } from "alchemy-sdk";
import { DROPSLAND_EVENTS_CONTRACT } from "@/config/chain";

// Configuration for Alchemy
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.BASE_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// --- App's Internal Type ---
export interface RewardItem {
  id: string;
  balance: number;
  uri: string;
  metadata: {
    name: string;
    description?: string;
    image?: string;
    attributes?: any[];
  };
}

// --- Mapping Function ---
const mapAlchemyToReward = (nft: OwnedNft): RewardItem => {
  // 1. Resolve the best possible image URL
  const imageUrl =
    nft.image.cachedUrl ||
    nft.image.originalUrl ||
    nft.image.pngUrl ||
    "/placeholder.jpg";

  // 2. Safely extract attributes from raw metadata
  const rawAttributes = nft.raw?.metadata?.attributes;
  const attributes = Array.isArray(rawAttributes) ? rawAttributes : [];

  // 3. Construct and return the typed object
  return {
    id: nft.tokenId,
    balance: Number(nft.balance), // Convert string balance to number
    uri: nft.tokenUri || "", // Handle undefined URI
    metadata: {
      name: nft.name || `Item #${nft.tokenId}`,
      description: nft.description || "",
      image: imageUrl,
      attributes: attributes,
    },
  };
};

export const getUserRewards = async (
  walletAddress: string,
): Promise<RewardItem[]> => {
  try {
    const response = await alchemy.nft.getNftsForOwner(walletAddress, {
      contractAddresses: [DROPSLAND_EVENTS_CONTRACT],
    });

    // Use the mapper function
    return response.ownedNfts.map(mapAlchemyToReward);
  } catch (error) {
    console.error("Error fetching rewards via Alchemy:", error);
    return [];
  }
};
