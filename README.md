# use-pwa

React hook for detecting and handling PWA (Progressive Web App) installation.

[Demo](https://use-pwa.kkweb.io/)

## Why use-pwa

Other PWA install hooks miss the `beforeinstallprompt` event when it fires before React hydration. `use-pwa` captures the event at module load time, so the install button shows up reliably even on the first paint.

> Note on iOS: `isSupported` is `false` because iOS does not expose `BeforeInstallPromptEvent`. "Add to Home Screen" there is a manual user gesture, not programmatic. Use `needsManualInstall` to show your own instructions instead of an install button. Since iOS 16.4 this covers Chrome, Edge, Firefox and DuckDuckGo too, not just Safari — but not in-app browsers such as Instagram or LINE, which report the same platform yet cannot add to the home screen.

## Installation

```bash
npm install use-pwa
```

## Usage

```tsx
import usePwa from "use-pwa";

function App() {
  const { canInstall, install, isInstalled, needsManualInstall } = usePwa();

  if (isInstalled) {
    return null;
  }

  if (needsManualInstall) {
    return <p>Tap the share button, then Add to Home Screen.</p>;
  }

  return (
    <button disabled={!canInstall} onClick={install}>
      Install PWA
    </button>
  );
}
```

## API

### `usePwa(): PwaData`

| Property | Type | Description |
|----------|------|-------------|
| `canInstall` | `boolean` | `true` when install prompt is available |
| `install` | `() => Promise<UserChoice \| undefined>` | Triggers the install prompt. Never rejects; resolves with `undefined` when no prompt is available |
| `isInstalled` | `boolean` | `true` when running as installed PWA. Updates live, without a reload |
| `isSupported` | `boolean` | `true` when browser supports PWA installation |
| `needsManualInstall` | `boolean` | `true` when the platform can only install by hand — iOS and iPadOS. Mutually exclusive with `canInstall` |

### `UserChoice`

Returned by `install()` when the user responds to the prompt:

| Property | Type | Description |
|----------|------|-------------|
| `outcome` | `"accepted" \| "dismissed"` | User's choice |
| `platform` | `string` | Platform string |

## Features

- Simple 5-property API
- Detects PWA install prompts
- Browser support detection, with an iOS manual-install signal
- Standalone mode detection, kept up to date after install
- SSR compatible
- TypeScript support

## License

MIT
