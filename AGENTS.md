# Repository Guidelines

## Project Overview
**Dropsland** is a Web3-native mobile application designed to connect the music ecosystem (DJs, events, fans) through verifiable digital ownership. It bridges the gap between IRL event attendance and persistent digital value using NFTs.

**Core Value Proposition:**
*   **For Fans:** Verifiable ownership of event attendance, perks, and merch.
*   **For Organizers:** Direct engagement channels and efficient, tokenized redemption systems.
*   **For DJs:** A platform to surface content and connect with their community on-chain.

## Tech Stack
*   **Framework:** Next.js (App Router, TypeScript)
*   **Styling:** Tailwind CSS, Radix UI (shadcn/ui components)
*   **Blockchain Interaction:** Viem, Wagmi (likely via Privy), Alchemy SDK
*   **Smart Contracts:** Hardhat, Solidity 0.8.28
*   **Authentication:** Privy (`@privy-io/react-auth`)
*   **Database:** Supabase (inferred)

## Project Structure & Module Organization
- Next.js app-router lives in `app/` (routes, layouts, loading states). Global styles in `app/globals.css`.
- Shared UI and logic sit in `components/`, `hooks/`, `lib/`, `types/`, and `util/`. Assets (images, icons) belong in `public/`.
- Smart contracts and Hardhat configuration are under `contracts/`, `ignition/`, `scripts/`, and `hardhat.config.ts`; contract tests reside in `test/`.
- Configuration is centralized in `config/`, with Tailwind/PostCSS at `postcss.config.mjs` and `next.config.mjs`.
- Environment examples are in `env.example`; copy to `.env.local` (app) and `.env` (tooling) as needed.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies; keep `pnpm-lock.yaml` in sync.
- `pnpm dev` — run the Next.js dev server.
- `pnpm build` — production build of the web app.
- `pnpm lint` — typecheck via `tsc` then run `next lint`.
- `pnpm hardhat test` — execute contract tests in `test/`; add `--network <name>` when targeting a configured chain.
- `pnpm hardhat compile` — compile contracts; run before deploying or updating ABIs.

## Coding Style & Naming Conventions
- Language: TypeScript + React server/client components. Prefer functional components and hooks; avoid default exports for shared utilities.
- Formatting: 2-space indentation, trailing commas; follow existing JSX/Tailwind class ordering. Run `pnpm lint` before pushing.
- Naming: components in `PascalCase`, hooks/utilities in `camelCase`, types/interfaces prefixed with `T`/`I` only when clarifying intent. Keep route segment folders lowercase.
- File organization: co-locate feature-specific helpers with their route/component when possible; keep reusable primitives in `components/` or `lib/`.

## Testing Guidelines
- Contract tests use Hardhat/viem in `test/`. Name new specs `<ContractName>.ts` or `<feature>.spec.ts`.
- For app-layer changes, add lightweight integration/unit coverage where feasible (Playwright/React Testing Library not yet configured—add per feature if needed).
- Require green `pnpm lint` and `pnpm hardhat test` before opening a PR. Add regression cases when fixing bugs.

## Commit & Pull Request Guidelines
- Follow the existing conventional style: `feat(): ...`, `fix(): ...`, `refactor(): ...`, `chore(): ...`. Keep scope concise; present-tense, imperative.
- PRs should include: purpose/summary, linked issue, test evidence (`pnpm lint`, `pnpm hardhat test`), and screenshots or recordings for UI changes.
- Keep PRs focused and small; note any follow-ups explicitly.

## Environment & Security Notes
- Never commit secrets; use `.env.local` / `.env` with `.gitignore`. Reference `env.example` when adding new vars.
- Wallet/chain RPC keys and app auth secrets must be set in deployment environments; prefer provider URLs via env vars.
- Validate ABI changes against frontend consumers in `lib/` and `app/` before deploying. Track contract addresses in `config/` or deployment outputs in `artifacts/`/`cache/`.

## Important
- Ensure all tests pass locally before pushing.
- Keep the codebase clean and organized.
- Follow the established coding standards and conventions.
- Always use `pnpm lint` before finishing changes.
