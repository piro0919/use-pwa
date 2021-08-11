import usePwa from "hooks/usePwa";
import { FC, useCallback } from "react";

const App: FC = () => {
  const {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    enabledUpdate,
    isLoading,
    isPwa,
    showInstallPrompt,
    unregister,
    userChoice,
  } = usePwa();
  const handleClick = useCallback(async () => {
    const result = await unregister();

    if (result) {
      alert("The update was successful, restart the app.");

      window.location.reload();

      return;
    }

    alert("Update failed.");
  }, [unregister]);

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
      <br />
      {enabledUpdate && isPwa ? (
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
        {`enabledUpdate: ${enabledUpdate}`}
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
