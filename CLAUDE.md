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
const { canInstall, install, isInstalled, isSupported, needsManualInstall } =
  usePwa();
```

| Property      | Type                                    | Description                                                                 |
| ------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| `canInstall`  | `boolean`                               | Browser has fired `beforeinstallprompt`; calling `install()` is meaningful. |
| `install`     | `() => Promise<UserChoice \| undefined>` | Triggers the native install prompt. Resolves with the user's choice.        |
| `isInstalled` | `boolean`                               | The page is currently running as an installed PWA.                          |
| `isSupported` | `boolean`                               | `BeforeInstallPromptEvent` is available in this browser.                    |
| `needsManualInstall` | `boolean`                        | Installing is only possible by hand — iOS/iPadOS. Never true alongside `canInstall` or `isInstalled`. |

`UserChoice = { outcome: "accepted" \| "dismissed"; platform: string }`.

### Detection details

- **Installed** is detected via: (a) Android TWA referrer (`android-app://`), (b) Chrome-family display modes (`fullscreen` / `standalone` / `minimal-ui`), and (c) iOS `navigator.standalone`.
- `isInstalled` keeps following those signals after mount: we listen for `appinstalled` and subscribe to each `display-mode` media query, so the install button disappears without a reload. `appinstalled` is Chromium-family only, same as `beforeinstallprompt`.
- **`needsManualInstall`** is derived, not stored: `isIos && !isInstalled && !canInstall`. iOS detection is UA-based, and iPadOS 13+ sends a Mac user agent, so `navigator.maxTouchPoints > 1` is what separates an iPad from a Mac. Since iOS 16.4 third-party browsers can also Add to Home Screen, so we do not narrow this to Safari. In-app browsers (Instagram, LINE) are a known false positive.
- **isSupported = false on iOS Safari** by design — iOS doesn't expose `BeforeInstallPromptEvent`. "Add to Home Screen" on iOS is a manual user gesture, not programmatic.
- `install()` never rejects. If the browser refuses a second `prompt()` on an already-used event, we drop the event and resolve with `undefined`.
- After `install()` resolves with `accepted` we clear the captured event. On `dismissed` we keep it so callers can re-prompt; the next genuine `beforeinstallprompt` from the browser will repopulate state via the effect.

## Considered and rejected

- **`navigator.getInstalledRelatedApps()`** (Aug 2026). It would report whether a
  paired native app is already installed. Rejected because it is async: every
  other property here is synchronous or event-driven, so adding it means either
  reporting `false` during the pending window or reintroducing the `isLoading`
  flag that v3 deleted. It also only ever returns anything for callers who set up
  `related_applications` plus digital asset links, while the code ships to
  everyone — a single hook gets no tree-shaking.
- **`BeforeInstallPromptEvent.platforms`** (Aug 2026). Cheap to expose, since the
  captured event already carries it. Rejected because MDN marks it non-standard
  and explicitly advises against production use; exposing it would make its
  removal our breaking change.

## Notes

- Serwist is disabled in development (`NODE_ENV !== "production"`) because it doesn't support Turbopack yet.
- Service Worker (`public/sw.js`) is generated at build time and gitignored.
- `beforeinstallprompt` is captured at module load time (`src/hooks/use-pwa.ts`) so the event is not lost when it fires before React hydration.
