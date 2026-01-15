import { base, baseSepolia, optimism, optimismSepolia } from "viem/chains";
import { Network } from "alchemy-sdk";
import { APP_CHAIN, IS_PROD, AppChain } from "./app";

const CHAINS: Record<AppChain, any> = {
  base: {
    mainnet: base,
    testnet: baseSepolia,
    alchemy: {
      mainnet: Network.BASE_MAINNET,
      testnet: Network.BASE_SEPOLIA,
    },
    contracts: {
      events: {
        mainnet:
          process.env.NEXT_PUBLIC_BASE_DROPSLAND_EVENTS_CONTRACT_MAINNET!,
        testnet:
          process.env.NEXT_PUBLIC_BASE_DROPSLAND_EVENTS_CONTRACT_TESTNET!,
      },
      creators: {
        mainnet:
          process.env.NEXT_PUBLIC_BASE_DROPSLAND_CREATORS_CONTRACT_MAINNET!,
        testnet:
          process.env.NEXT_PUBLIC_BASE_DROPSLAND_CREATORS_CONTRACT_TESTNET!,
      },
    },
  },

  optimism: {
    mainnet: optimism,
    testnet: optimismSepolia,
    alchemy: {
      mainnet: Network.OPT_MAINNET,
      testnet: Network.OPT_SEPOLIA,
    },
    contracts: {
      events: {
        mainnet:
          process.env.NEXT_PUBLIC_OPTIMISM_DROPSLAND_EVENTS_CONTRACT_MAINNET!,
        testnet:
          process.env.NEXT_PUBLIC_OPTIMISM_DROPSLAND_EVENTS_CONTRACT_TESTNET!,
      },
      creators: {
        mainnet:
          process.env.NEXT_PUBLIC_OPTIMISM_DROPSLAND_CREATORS_CONTRACT_MAINNET!,
        testnet:
          process.env.NEXT_PUBLIC_OPTIMISM_DROPSLAND_CREATORS_CONTRACT_TESTNET!,
      },
    },
  },
};

const active = CHAINS[APP_CHAIN];

export const CHAIN = IS_PROD ? active.mainnet : active.testnet;
export const CHAIN_ID = CHAIN.id;

// === NEW EXPORT: ALCHEMY NETWORK ===
export const ALCHEMY_NETWORK = IS_PROD
  ? active.alchemy.mainnet
  : active.alchemy.testnet;

// ... rest of your exports (CONTRACTS, DROPSLAND_EVENTS_CONTRACT, etc.)
export const DROPSLAND_EVENTS_CONTRACT = IS_PROD
  ? active.contracts.events.mainnet
  : active.contracts.events.testnet;

export const DROPSLAND_CREATORS_CONTRACT = IS_PROD
  ? active.contracts.creators.mainnet
  : active.contracts.creators.testnet;
