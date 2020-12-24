import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

export type Pwa = {
  appinstalled: boolean;
  canInstallprompt: boolean;
  enabledA2hs: boolean;
  enabledPwa: boolean;
  handleClickOnInstallPrompt: NonNullable<
    ComponentPropsWithoutRef<"button">["onClick"]
  >;
  isPwa: boolean;
  userChoice?: PromiseType<BeforeInstallPromptEvent["userChoice"]>;
};

function usePwa(): Pwa {
  const beforeinstallprompt = useRef<BeforeInstallPromptEvent>();
  const [userChoice, setUserChoice] = useState<Pwa["userChoice"]>();
  const [enabledPwa, setEnabledPwa] = useState<Pwa["enabledPwa"]>(false);
  const [enabledA2hs, setEnabledA2hs] = useState<Pwa["enabledA2hs"]>(false);
  const [isPwa, setIsPwa] = useState<Pwa["isPwa"]>(false);
  const [canInstallprompt, setCanInstallprompt] = useState<
    Pwa["canInstallprompt"]
  >(false);
  const handleClickOnInstallPrompt = useCallback<
    Pwa["handleClickOnInstallPrompt"]
  >(() => {
    if (!beforeinstallprompt.current) {
      return;
    }

    beforeinstallprompt.current
      .prompt()
      .then(() => {
        if (!beforeinstallprompt.current) {
          return;
        }

        return beforeinstallprompt.current.userChoice;
      })
      .then((userChoice) => {
        setUserChoice(userChoice);
      });
  }, []);
  const handleBeforeInstallPrompt = useCallback<
    (event: BeforeInstallPromptEvent) => void
  >((event) => {
    beforeinstallprompt.current = event;

    setCanInstallprompt(true);
  }, []);
  const [appinstalled, setAppinstalled] = useState<Pwa["appinstalled"]>(false);
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

  return {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    handleClickOnInstallPrompt,
    isPwa,
    userChoice,
  };
}

export default usePwa;
