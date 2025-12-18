import { base, baseSepolia, optimism, optimismSepolia } from "viem/chains";

// === Env config
export type AppEnv = "development" | "staging" | "production";
export const APP_ENV = (process.env.NEXT_PUBLIC_APP_ENV ??
  "development") as AppEnv;
export const IS_PROD = APP_ENV === "production";

// === Privy
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
export const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;
export const PRIVY_JWKS_ENDPOINT = process.env.NEXT_PUBLIC_PRIVY_JWKS_ENDPOINT;
export const PRIVY_SECRET = process.env.PRIVY_SECRET;

// === Pinata
export const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
export const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
export const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL;
export const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
export const PINATA_GROUP_ID = process.env.NEXT_PUBLIC_PINATA_GROUP_ID;

// === Chains Config
const CHAIN_CONFIG = {
  base: {
    mainnet: base,
    testnet: baseSepolia,
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
} as const;

export type AppChain = "base" | "optimism";
export const APP_CHAIN = (process.env.NEXT_PUBLIC_APP_CHAIN ??
  "base") as AppChain;

const activeChainConfig = CHAIN_CONFIG[APP_CHAIN];

export const CHAIN = IS_PROD
  ? activeChainConfig.mainnet
  : activeChainConfig.testnet;
export const CHAIN_ID = CHAIN.id;

// === Contracts
export const DROPSLAND_EVENTS_CONTRACT = IS_PROD
  ? process.env.NEXT_PUBLIC_BASE_DROPSLAND_EVENTS_CONTRACT_MAINNET!
  : process.env.NEXT_PUBLIC_BASE_DROPSLAND_EVENTS_CONTRACT_TESTNET!;

export const DROPSLAND_CREATORS_CONTRACT = IS_PROD
  ? process.env.NEXT_PUBLIC_BASE_DROPSLAND_CREATORS_CONTRACT_MAINNET!
  : process.env.NEXT_PUBLIC_BASE_DROPSLAND_CREATORS_CONTRACT_TESTNET!;
