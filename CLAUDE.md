# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**use-pwa** is a React hook library for detecting and handling Progressive Web App (PWA) installation states. Its differentiator: it captures `beforeinstallprompt` at module load time, before React hydration, so the install button is reliable on first paint — many other PWA hooks miss this event.

- **npm package:** use-pwa
- **Demo site:** <https://use-pwa.kkweb.io>

## Tech Stack

- React 19 (peer: React >= 17)
- TypeScript 5
- Next.js 16 (App Router) — demo only
- Biome (linter/formatter)
- tsup (library build)
- Vitest + jsdom — tests
- Serwist (Service Worker for demo site)
- Vercel (deployment)

## Project Structure

```text
src/
├── index.ts                  # npm package entry point
├── hooks/use-pwa.ts          # Main hook implementation
└── app/                      # Next.js App Router (demo site)
    ├── layout.tsx
    ├── page.tsx
    ├── sw.ts                 # Serwist Service Worker
    └── globals.css

tests/use-pwa.test.tsx        # Vitest smoke tests
public/                       # PWA manifest etc.
dist/                         # Compiled npm package output (ESM/CJS)
```

## Commands

```bash
npm run dev           # Start Next.js development server
npm run build         # Build Next.js demo site (includes SW)
npm run build:lib     # Build npm package with tsup
npm run test          # Run Vitest
npm run lint          # Biome check
npm run format        # Biome format --write
```

## Hook API

```ts
const { canInstall, install, isInstalled, isSupported } = usePwa();
```

| Property      | Type                                    | Description                                                                 |
| ------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| `canInstall`  | `boolean`                               | Browser has fired `beforeinstallprompt`; calling `install()` is meaningful. |
| `install`     | `() => Promise<UserChoice \| undefined>` | Triggers the native install prompt. Resolves with the user's choice.        |
| `isInstalled` | `boolean`                               | The page is currently running as an installed PWA.                          |
| `isSupported` | `boolean`                               | `BeforeInstallPromptEvent` is available in this browser.                    |

`UserChoice = { outcome: "accepted" \| "dismissed"; platform: string }`.

### Detection details

- **Installed** is detected via: (a) Android TWA referrer (`android-app://`), (b) Chrome-family display modes (`fullscreen` / `standalone` / `minimal-ui`), and (c) iOS `navigator.standalone`.
- **isSupported = false on iOS Safari** by design — iOS doesn't expose `BeforeInstallPromptEvent`. "Add to Home Screen" on iOS is a manual user gesture, not programmatic.
- After `install()` resolves with `accepted` we clear the captured event. On `dismissed` we keep it so callers can re-prompt; the next genuine `beforeinstallprompt` from the browser will repopulate state via the effect.

## Notes

- Serwist is disabled in development (`NODE_ENV !== "production"`) because it doesn't support Turbopack yet.
- Service Worker (`public/sw.js`) is generated at build time and gitignored.
- `beforeinstallprompt` is captured at module load time (`src/hooks/use-pwa.ts`) so the event is not lost when it fires before React hydration.
