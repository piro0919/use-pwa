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
