# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**use-pwa** is a React hook library for detecting and handling Progressive Web App (PWA) installation states. It provides developers with easy access to PWA lifecycle events and capabilities across different browsers and platforms.

- **npm package:** use-pwa

## Tech Stack

- React 19
- TypeScript 5
- Next.js 16 (App Router)
- Biome (linter/formatter)
- tsup (library build)
- Serwist (Service Worker for demo site)
- Vercel (deployment)

## Project Structure

```
src/
├── index.ts                 # npm package entry point
├── hooks/usePwa/index.ts    # Main hook implementation
└── app/                     # Next.js App Router (demo site)
    ├── layout.tsx
    ├── page.tsx
    ├── sw.ts                # Serwist Service Worker
    └── globals.css

public/
└── manifest.json            # PWA manifest

dist/                        # Compiled npm package output (ESM/CJS)
```

## Commands

```bash
npm run dev         # Start Next.js development server
npm run build       # Build Next.js demo site (includes SW)
npm run build:lib   # Build npm package with tsup
npm run lint        # Run Biome linter
npm run format      # Format code with Biome
```

## Key Files

- `src/index.ts` - Package entry point (re-exports hook)
- `src/hooks/usePwa/index.ts` - Main hook implementation
- `src/app/sw.ts` - Serwist Service Worker configuration
- `next.config.ts` - Next.js config with Serwist integration
- `tsup.config.ts` - Library build configuration
- `tsconfig.build.json` - TypeScript config for library build

## Hook API

The `usePwa` hook returns:

```typescript
{
  appinstalled: boolean;        // PWA installation event fired
  canInstallprompt: boolean;    // Install prompt available
  enabledA2hs: boolean;         // iOS "Add to Home Screen" available
  enabledPwa: boolean;          // PWA support available
  isLoading: boolean;           // Still checking PWA capabilities
  isPwa: boolean;               // Running as standalone PWA
  showInstallPrompt: () => void; // Trigger install prompt
  userChoice?: UserChoice;      // User's install decision
}
```

## Notes

- Serwist is disabled in development (`NODE_ENV !== "production"`) because it doesn't support Turbopack yet
- Service Worker (`public/sw.js`) is generated at build time and gitignored
