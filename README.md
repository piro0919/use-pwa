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
  const { enabledPwa, handleClickOnInstallPrompt, userChoice } = usePwa();

  return (
    <div>
      {enabledPwa ? (
        <button onClick={handleClickOnInstallPrompt}>click!</button>
      ) : (
        "Not compatible with pwa."
      )}
      <div>
        {`enabledPwa: ${enabledPwa}`}
        <br />
        {`userChoice: ${JSON.stringify(userChoice)}`}
      </div>
    </div>
  );
};

export default App;
```
