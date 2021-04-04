import usePwa from "hooks/usePwa";
import { FC, useCallback } from "react";

const App: FC = () => {
  const {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    isPwa,
    onupdatefound,
    showInstallPrompt,
    unregister,
    userChoice,
  } = usePwa({ scriptURL: "/service-worker.js" });
  const handleClick = useCallback(async () => {
    const result = await unregister();

    alert(String(result));
  }, [unregister]);

  return (
    <div>
      {enabledPwa ? (
        <button
          disabled={!canInstallprompt || appinstalled}
          onClick={showInstallPrompt}
        >
          Install Pwa
        </button>
      ) : (
        "Not compatible with pwa."
      )}
      <br />
      {isPwa && onupdatefound ? (
        <button onClick={handleClick}>Update Pwa</button>
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
