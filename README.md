# use-pwa

use-pwa is pop-up handler for pwa.

## Features

- TypeScript support
- SSR support

## Installation

`npm i --save use-pwa`

## Example

[Example](https://use-pwa.kk-web.link/)

## Usage

[Example Code](https://github.com/piro0919/use-pwa/blob/master/src/App.tsx)

## Arguments

| Prop      |       Type        | Required | Remarks                                                                                 |
| --------- | :---------------: | :------: | --------------------------------------------------------------------------------------- |
| scriptURL | String &#124; URL |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register) |

## Return

| Return                     |   Type   | Optional | Remarks                                                                                        |
| -------------------------- | :------: | :------: | ---------------------------------------------------------------------------------------------- |
| appinstalled               | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/appinstalled_event)              |
| canInstallprompt           | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)               |
| enabledA2hs                | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen)    |
| enabledPwa                 | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)               |
| handleClickOnInstallPrompt | Function |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent/prompt)        |
| handleClickOnUnregister    | Function |    ✓     | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/getRegistration) |
| isPwa                      | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)                    |
| onupdatefound              | Boolean  |          | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)        |
| userChoice                 |  Object  |    ✓     | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)               |
