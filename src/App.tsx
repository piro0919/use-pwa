import usePwa from "hooks/usePwa";
import { FC } from "react";

const App: FC = () => {
  const {
    appinstalled,
    enabledPwa,
    handleClickOnInstallPrompt,
    isPwa,
    userChoice,
  } = usePwa();

  return (
    <div>
      {enabledPwa ? (
        <button onClick={handleClickOnInstallPrompt}>click!</button>
      ) : (
        "Not compatible with pwa."
      )}
      <div>
        {`appinstalled: ${appinstalled}`}
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
