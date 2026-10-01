# Changelog

## Unreleased

- **BREAKING:** the `react` peer range is now `^18.0.0 || ^19.0.0` (was `>=17.0.0`). State is shared through `useSyncExternalStore`, which React 17 does not have.
- State is shared between every component that calls `usePwa()`. Installing from one component now clears `canInstall` in the others too; previously each instance kept its own copy.
- A component that mounts after the event was captured, outside hydration, now reports `canInstall` and `isInstalled` on its first render instead of one render later. Hydration still renders the all-`false` server values first.
- `package.json` now declares `"sideEffects": true`. Importing the package registers a `beforeinstallprompt` listener that calls `preventDefault()`, and `false` allowed bundlers to drop that. The README now documents this side effect and that it suppresses the browser's mini-infobar.
