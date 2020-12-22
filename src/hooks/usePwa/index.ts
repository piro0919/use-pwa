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
  enabledPwa: boolean;
  handleClickOnInstallPrompt: NonNullable<
    ComponentPropsWithoutRef<"button">["onClick"]
  >;
  userChoice?: PromiseType<BeforeInstallPromptEvent["userChoice"]>;
};

function usePwa(): Pwa {
  const beforeinstallprompt = useRef<BeforeInstallPromptEvent>();
  const [userChoice, setUserChoice] = useState<Pwa["userChoice"]>();
  const [enabledPwa, setEnabledPwa] = useState<Pwa["enabledPwa"]>(false);
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
    setEnabledPwa(
      "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window
    );
  }, []);

  return { enabledPwa, handleClickOnInstallPrompt, userChoice };
}

export default usePwa;
