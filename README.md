# use-pwa

use-pwa is pop-up handler for pwa.

## Features

- TypeScript support

## Installation

`npm i --save use-pwa`

## Usage

```tsx
import usePwa from "hooks/usePwa";
import { FC } from "react";

const App: FC = () => {
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    handleClickOnInstallPrompt,
    isPwa,
    userChoice,
  } = usePwa();

  return (
    <div>
      {enabledPwa ? (
        <button
          disabled={!canInstallprompt}
          onClick={handleClickOnInstallPrompt}
        >
          Install Pwa
        </button>
      ) : (
        "Not compatible with pwa."
      )}
      <div>
        {`appinstalled: ${appinstalled}`}
        <br />
        {`canInstallprompt: ${canInstallprompt}`}
        <br />
        {`enabledPwa: ${enabledPwa}`}
        <br />
        {`isPwa: ${isPwa}`}
        <br />
        {`userChoice: ${JSON.stringify(userChoice)}`}
      </div>
    </div>
  );
};

export default App;
```

## Return

| Key                        | Type                                                                           | Description                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| appinstalled               | boolean                                                                        | [Window.onappinstalled](https://developer.mozilla.org/en-US/docs/Web/API/Window/onappinstalled)                                  |
| canInstallprompt           | boolean                                                                        | [BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)                            |
| enabledPwa                 | boolean                                                                        | BeforeInstallPromptEvent and [Navigator.serviceWorker](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker) |
| handleClickOnInstallPrompt | (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void               | -                                                                                                                                |
| isPwa                      | boolean                                                                        | [display-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode)                                             |
| userChoice                 | { outcome: "accepted" &#124; "dismissed"; platform: string; } &#124; undefined | [BeforeInstallPromptEvent Properties](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent#Properties)      |
