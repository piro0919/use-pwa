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
