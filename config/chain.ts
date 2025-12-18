import { base, baseSepolia, optimism, optimismSepolia } from "viem/chains";
import { APP_CHAIN, IS_PROD, AppChain } from "./app";

const CHAINS: Record<AppChain, any> = {
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
                    process.env
                        .NEXT_PUBLIC_OPTIMISM_DROPSLAND_EVENTS_CONTRACT_MAINNET!,
                testnet:
                    process.env
                        .NEXT_PUBLIC_OPTIMISM_DROPSLAND_EVENTS_CONTRACT_TESTNET!,
            },
            creators: {
                mainnet:
                    process.env
                        .NEXT_PUBLIC_OPTIMISM_DROPSLAND_CREATORS_CONTRACT_MAINNET!,
                testnet:
                    process.env
                        .NEXT_PUBLIC_OPTIMISM_DROPSLAND_CREATORS_CONTRACT_TESTNET!,
            },
        },
    },
};

const active = CHAINS[APP_CHAIN];

export const CHAIN = IS_PROD ? active.mainnet : active.testnet;
export const CHAIN_ID = CHAIN.id;

export const CONTRACTS = IS_PROD
    ? active.contracts.mainnet
    : active.contracts.testnet;

// === Contracts (explicit named exports)
export const DROPSLAND_EVENTS_CONTRACT = IS_PROD
    ? active.contracts.events.mainnet
    : active.contracts.events.testnet;

export const DROPSLAND_CREATORS_CONTRACT = IS_PROD
    ? active.contracts.creators.mainnet
    : active.contracts.creators.testnet;
