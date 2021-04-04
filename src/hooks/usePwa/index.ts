import { useCallback, useEffect, useRef, useState } from "react";
import { detect } from "detect-browser";

type PromiseType<T extends Promise<any>> = T extends Promise<infer P>
  ? P
  : never;

type BeforeInstallPromptEvent = Event & {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
};

export type PwaParams = {
  scriptURL: string | URL;
};

export type PwaData = {
  appinstalled: boolean;
  canInstallprompt: boolean;
  enabledA2hs: boolean;
  enabledPwa: boolean;
  handleClickOnInstallPrompt: () => void;
  handleClickOnUnregister: () => void;
  isPwa: boolean;
  onupdatefound: boolean;
  userChoice?: PromiseType<BeforeInstallPromptEvent["userChoice"]>;
};

function usePwa(pwaParams?: PwaParams): PwaData {
  const beforeinstallprompt = useRef<BeforeInstallPromptEvent>();
  const [appinstalled, setAppinstalled] = useState(false);
  const [canInstallprompt, setCanInstallprompt] = useState(false);
  const [enabledA2hs, setEnabledA2hs] = useState(false);
  const [enabledPwa, setEnabledPwa] = useState(false);
  const [userChoice, setUserChoice] = useState<PwaData["userChoice"]>();
  const handleClickOnInstallPrompt = useCallback(async () => {
    if (!beforeinstallprompt.current) {
      return;
    }

    await beforeinstallprompt.current.prompt();

    if (!beforeinstallprompt.current) {
      return;
    }

    const userChoice = await beforeinstallprompt.current.userChoice;

    setUserChoice(userChoice);
  }, []);
  const handleClickOnUnregister = useCallback(async () => {
    if (!("serviceWorker" in window.navigator)) {
      return;
    }

    const registration = await window.navigator.serviceWorker.getRegistration();

    if (!registration) {
      return;
    }

    await registration.unregister();
  }, []);
  const [isPwa, setIsPwa] = useState(false);
  const [onupdatefound, setOnupdatefound] = useState(false);
  const handleBeforeInstallPrompt = useCallback<
    (event: BeforeInstallPromptEvent) => void
  >((event) => {
    beforeinstallprompt.current = event;

    setCanInstallprompt(true);
  }, []);
  const handleAppinstalled = useCallback(() => {
    setAppinstalled(true);
  }, []);

  useEffect(() => {
    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as any
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as any
      );
    };
  }, [handleBeforeInstallPrompt]);

  useEffect(() => {
    window.addEventListener("appinstalled", handleAppinstalled);

    return () => {
      window.removeEventListener("appinstalled", handleAppinstalled);
    };
  }, [handleAppinstalled]);

  useEffect(() => {
    setEnabledPwa(
      "serviceWorker" in window.navigator &&
        "BeforeInstallPromptEvent" in window
    );
  }, []);

  useEffect(() => {
    setIsPwa(
      "standalone" in window.navigator ||
        window.matchMedia("(display-mode: standalone)").matches
    );
  }, []);

  useEffect(() => {
    const browser = detect();

    if (!browser) {
      return;
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos =
      userAgent.indexOf("iphone") >= 0 ||
      userAgent.indexOf("ipad") >= 0 ||
      (userAgent.indexOf("macintosh") >= 0 && "ontouchend" in document);
    const { name } = browser;

    setEnabledA2hs(isIos && name === "ios");
  }, []);

  useEffect(() => {
    const callback = async () => {
      const { scriptURL } = pwaParams || {};

      if (!scriptURL || !("serviceWorker" in window.navigator)) {
        return;
      }

      try {
        const registration = await window.navigator.serviceWorker.register(
          scriptURL
        );

        registration.onupdatefound = () => {
          registration.update();

          setOnupdatefound(true);
        };
      } catch (error) {
        console.log("Registration failed with " + error);
      }
    };

    callback();
  }, [pwaParams]);

  return {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    handleClickOnInstallPrompt,
    handleClickOnUnregister,
    isPwa,
    onupdatefound,
    userChoice,
  };
}

export default usePwa;
