import usePwa from "hooks/usePwa";
import { FC } from "react";

const App: FC = () => {
  const {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    isLoading,
    isPwa,
    showInstallPrompt,
    userChoice,
  } = usePwa();

  return (
    <div>
      {enabledPwa && !isPwa ? (
        <button
          disabled={!canInstallprompt || appinstalled}
          onClick={showInstallPrompt}
        >
          Install Pwa
        </button>
      ) : (
        "Not compatible with pwa."
      )}
      <hr />
      <div>
        {`appinstalled: ${appinstalled}`}
        <br />
        {`canInstallprompt: ${canInstallprompt}`}
        <br />
        {`enabledA2hs: ${enabledA2hs}`}
        <br />
        {`enabledPwa: ${enabledPwa}`}
        <br />
        {`isLoading: ${isLoading}`}
        <br />
        {`isPwa: ${isPwa}`}
        <br />
        {`userChoice: ${JSON.stringify(userChoice)}`}
      </div>
    </div>
  );
};

export default App;
