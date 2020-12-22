# use-pwa

use-pwa is pop-up handler for pwa.

## Features

- TypeScript support

## Installation

`npm i --save use-pwa`

## Usage

```tsx
import usePwa from "hooks/usePwa";
import { FC, useEffect } from "react";

const App: FC = () => {
  const {
    enabledPwa,
    handleClickOnInstallPrompt,
    installablePwa,
    userChoice,
  } = usePwa();

  useEffect(() => {
    console.log(userChoice);
  }, [userChoice]);

  return (
    <div>
      {enabledPwa && installablePwa ? (
        <button onClick={handleClickOnInstallPrompt}>click!</button>
      ) : (
        "Not compatible with pwa."
      )}
    </div>
  );
};

export default App;
```
