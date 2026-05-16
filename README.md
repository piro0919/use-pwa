# use-pwa

React hook for detecting and handling PWA (Progressive Web App) installation.

[Demo](https://use-pwa.kkweb.io/)

## Why use-pwa

Other PWA install hooks miss the `beforeinstallprompt` event when it fires before React hydration. `use-pwa` captures the event at module load time, so the install button shows up reliably even on the first paint.

> Note on iOS Safari: `isSupported` is `false` because iOS does not expose `BeforeInstallPromptEvent`. "Add to Home Screen" on iOS is a manual user gesture, not programmatic — this is by design.

## Installation

```bash
npm install use-pwa
```

## Usage

```tsx
import usePwa from "use-pwa";

function App() {
  const { canInstall, install, isInstalled, isSupported } = usePwa();

  if (!isSupported || isInstalled) {
    return null;
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
| `install` | `() => Promise<UserChoice \| undefined>` | Triggers the install prompt |
| `isInstalled` | `boolean` | `true` when running as installed PWA |
| `isSupported` | `boolean` | `true` when browser supports PWA installation |

### `UserChoice`

Returned by `install()` when the user responds to the prompt:

| Property | Type | Description |
|----------|------|-------------|
| `outcome` | `"accepted" \| "dismissed"` | User's choice |
| `platform` | `string` | Platform string |

## Features

- Simple 4-property API
- Detects PWA install prompts
- Browser support detection
- Standalone mode detection
- SSR compatible
- TypeScript support

## License

MIT
