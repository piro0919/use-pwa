import usePwa from "hooks/usePwa";
import { FC } from "react";

const App: FC = () => {
  const {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    handleClickOnInstallPrompt,
    handleClickOnUnregister,
    isPwa,
    onupdatefound,
    userChoice,
  } = usePwa({ scriptURL: "/service-worker.js" });

  return (
    <div>
      {enabledPwa ? (
        <button
          disabled={!canInstallprompt || appinstalled}
          onClick={handleClickOnInstallPrompt}
        >
          Install Pwa
        </button>
      ) : (
        "Not compatible with pwa."
      )}
      <br />
      {onupdatefound ? (
        <button onClick={handleClickOnUnregister}>Update Pwa</button>
      ) : (
        "Update does not exist."
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
        {`isPwa: ${isPwa}`}
        <br />
        {`onupdatefound: ${onupdatefound}`}
        <br />
        {`userChoice: ${JSON.stringify(userChoice)}`}
      </div>
    </div>
  );
};

export default App;
