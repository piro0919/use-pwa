import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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
  const [isPwa, setIsPwa] = useState<Pwa["isPwa"]>(false);
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
      "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window
    );
  }, []);

  useEffect(() => {
    setIsPwa(
      "standalone" in navigator ||
        window.matchMedia("(display-mode: standalone)").matches
    );
  }, []);

  return {
    appinstalled,
    enabledPwa,
    handleClickOnInstallPrompt,
    isPwa,
    userChoice,
  };
}

export default usePwa;
