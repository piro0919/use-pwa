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

export type PwaData = {
  appinstalled: boolean;
  canInstallprompt: boolean;
  enabledA2hs: boolean;
  enabledPwa: boolean;
  enabledUpdate: boolean;
  isPwa: boolean;
  showInstallPrompt: () => void;
  unregister: () => Promise<boolean | undefined>;
  userChoice?: PromiseType<BeforeInstallPromptEvent["userChoice"]>;
};

function usePwa(): PwaData {
  const beforeinstallprompt = useRef<BeforeInstallPromptEvent>();
  const [appinstalled, setAppinstalled] = useState(false);
  const [canInstallprompt, setCanInstallprompt] = useState(false);
  const [enabledA2hs, setEnabledA2hs] = useState(false);
  const [enabledPwa, setEnabledPwa] = useState(false);
  const [isPwa, setIsPwa] = useState(false);
  const [enabledUpdate, setEnabledUpdate] = useState(false);
  const [userChoice, setUserChoice] = useState<PwaData["userChoice"]>();
  const showInstallPrompt = useCallback(async () => {
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
  const unregister = useCallback(async () => {
    if (!("serviceWorker" in window.navigator)) {
      return;
    }

    const registration = await window.navigator.serviceWorker.getRegistration();

    if (!registration) {
      return;
    }

    const result = await registration.unregister();

    return result;
  }, []);
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
      if (!("serviceWorker" in window.navigator)) {
        return;
      }

      const registration = await window.navigator.serviceWorker.getRegistration();

      if (!registration) {
        return;
      }

      registration.onupdatefound = async () => {
        await registration.update();

        setEnabledUpdate(true);
      };
    };

    callback();
  }, []);

  return {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledUpdate,
    enabledPwa,
    isPwa,
    showInstallPrompt,
    unregister,
    userChoice,
  };
}

export default usePwa;
