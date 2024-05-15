# use-pwa

use-pwa is install and update handler for pwa.

## Features

- TypeScript support
- SSR support
- Update support

## Installation

`npm i --save use-pwa`

## Example

[Example](https://use-pwa.kk-web.link/)

### Before Installation

| OS      | Browser | appinstalled  | canInstallprompt | enabledA2hs | enabledPwa | isPwa   | userChoice        |
| ------- | ------- | ------------- | ---------------- | ----------- | ---------- | ------- | ----------------- |
| Mac     | Chrome  | `false`       | `true`           | `false`     | `true`     | `false` | `undefined`       |
| 〃      | Safari  | `false`       | `false`          | `false`     | `false`    | `false` | `undefined`       |
| 〃      | Firefox | `false`       | `false`          | `false`     | `false`    | `false` | `undefined`       |
| Android | Chrome  | `false` (\*1) | `true`           | `false`     | `true`     | `false` | `undefined` (\*2) |
| 〃      | Brave   | `false` (\*1) | `true`           | `false`     | `true`     | `false` | `undefined` (\*2) |
| iOS     | Safari  | `false`       | `false`          | `true`      | `false`    | `false` | `undefined`       |
| 〃      | Brave   | `false`       | `false`          | `true`      | `false`    | `false` | `undefined`       |

1. Changes to `true` only immediately after installation.
2. Changes to `object` only immediately after installation.

### After Installation

| OS      | Browser     | appinstalled  | canInstallprompt | enabledA2hs | enabledPwa | isPwa        | userChoice  |
| ------- | ----------- | ------------- | ---------------- | ----------- | ---------- | ------------ | ----------- |
| Mac     | PWA         | `false` (\*1) | `false` (\*1)    | `false`     | `true`     | `true` (\*2) | `undefined` |
| 〃      | Chrome      | `false`       | `false`          | `false`     | `true`     | `false`      | `undefined` |
| Android | PWA(Chrome) | `false`       | `false`          | `false`     | `true`     | `true`       | `undefined` |
| 〃      | Chrome      | `false`       | `false`          | `false`     | `true`     | `false`      | `undefined` |
| 〃      | PWA(Brave)  | `false`       | `false`          | `false`     | `true`     | `true`       | `undefined` |
| 〃      | Brave       | `false`       | `true`           | `false`     | `true`     | `false`      | `undefined` |
| iOS     | PWA         | `false`       | `false`          | `true`      | `false`    | `true`       | `undefined` |
| 〃      | Safari      | `false`       | `false`          | `true`      | `false`    | `false`      | `undefined` |

1. `true` is set only at first startup.
2. `false` is set only at first startup.

## Usage

[Example Code](https://github.com/piro0919/use-pwa/blob/master/src/App.tsx)

## Return

| Return            |   Type   | Optional | Remarks                                                                                     |
| ----------------- | :------: | :------: | ------------------------------------------------------------------------------------------- |
| appinstalled      | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/appinstalled_event)           |
| canInstallprompt  | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)            |
| enabledA2hs       | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen) |
| enabledPwa        | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)            |
| isLoading         | Boolean  |          |                                                                                             |
| isPwa             | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)                 |
| showInstallPrompt | Function |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent/prompt)     |
| userChoice        |  Object  |    ✓     | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)            |
