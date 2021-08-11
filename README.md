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

## Usage

[Example Code](https://github.com/piro0919/use-pwa/blob/master/src/App.tsx)

## Return

| Return            |   Type   | Optional | Remarks                                                                                     |
| ----------------- | :------: | :------: | ------------------------------------------------------------------------------------------- |
| appinstalled      | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/appinstalled_event)           |
| canInstallprompt  | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)            |
| enabledA2hs       | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen) |
| enabledPwa        | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)            |
| enabledUpdate     | Boolean  |          | [MDN](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerRegistration/update)       |
| isLoading         | Boolean  |          |                                                                                             |
| isPwa             | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)                 |
| showInstallPrompt | Function |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent/prompt)     |
| unregister        | Function |          | [MDN](https://developer.mozilla.org/ja/docs/Web/API/ServiceWorkerRegistration/unregister)   |
| userChoice        |  Object  |    ✓     | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)            |
