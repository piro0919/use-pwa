import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function useBoolean(initialValue: boolean) {
  const [value, setValue] = useState(initialValue);
  const setTrue = useCallback(() => setValue(true), []);

  return { value, setTrue };
}

type UserChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

type BeforeInstallPromptEvent = Event & {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<UserChoice>;
  prompt(): Promise<void>;
};

export type PwaData = {
  appinstalled: boolean;
  canInstallprompt: boolean;
  enabledA2hs: boolean;
  enabledPwa: boolean;
  enabledUpdate: boolean;
  isLoading: boolean;
  isPwa: boolean;
  showInstallPrompt: () => void;
  unregister?: () => Promise<boolean>;
  userChoice?: UserChoice;
};

export default function usePwa(): PwaData {
  const beforeinstallprompt = useRef<BeforeInstallPromptEvent>();
  const { value: appinstalled, setTrue: onAppinstalled } = useBoolean(false);
  const { value: canInstallprompt, setTrue: onCanInstallprompt } =
    useBoolean(false);
  const { value: enabledA2hs, setTrue: onEnabledA2hs } = useBoolean(false);
  const { value: enabledPwa, setTrue: onEnabledPwa } = useBoolean(false);
  const { value: enabledUpdate, setTrue: onEnabledUpdate } = useBoolean(false);
  const { value: isPwa, setTrue: onIsPwa } = useBoolean(false);
  const [userChoice, setUserChoice] = useState<UserChoice>();
  const handleAppinstalled = useCallback(
    () => onAppinstalled(),
    [onAppinstalled]
  );
  const handleBeforeinstallprompt = useCallback<
    (event: BeforeInstallPromptEvent) => void
  >(
    (event) => {
      beforeinstallprompt.current = event;

      onCanInstallprompt();
    },
    [onCanInstallprompt]
  );
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const unregister =
    registration &&
    (async () => {
      const result = await registration.unregister();

      return result;
    });
  const showInstallPrompt = useCallback(async () => {
    if (!beforeinstallprompt.current) {
      return;
    }

    await beforeinstallprompt.current.prompt();

    const userChoice = await beforeinstallprompt.current.userChoice;

    setUserChoice(userChoice);
  }, []);
  const [completed, setCompleted] = useState({
    appinstalled: false,
    beforeinstallprompt: false,
    enabledA2hs: false,
    enabledPwa: false,
    enabledUpdate: false,
    isPwa: false,
  });
  const isLoading = useMemo(
    () => Object.values(completed).includes(false),
    [completed]
  );

  useEffect(() => {
    window.addEventListener("appinstalled", handleAppinstalled);

    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      appinstalled: true,
    }));

    return () => window.removeEventListener("appinstalled", handleAppinstalled);
  }, [handleAppinstalled]);

  useEffect(() => {
    // @ts-ignore
    window.addEventListener("beforeinstallprompt", handleBeforeinstallprompt);

    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      beforeinstallprompt: true,
    }));

    return () =>
      // @ts-ignore
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeinstallprompt
      );
  }, [handleBeforeinstallprompt]);

  useEffect(() => {
    try {
      const lownerUserAgent = window.navigator.userAgent.toLowerCase();

      if (
        !lownerUserAgent.includes("iphone") &&
        !lownerUserAgent.includes("ipad")
      ) {
        return;
      }

      onEnabledA2hs();
    } finally {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        enabledA2hs: true,
      }));
    }
  }, [onEnabledA2hs]);

  useEffect(() => {
    try {
      if (
        !("serviceWorker" in window.navigator) ||
        !("BeforeInstallPromptEvent" in window)
      ) {
        return;
      }

      onEnabledPwa();
    } finally {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        enabledPwa: true,
      }));
    }
  }, [onEnabledPwa]);

  useEffect(() => {
    const callback = async () => {
      if (!("serviceWorker" in window.navigator)) {
        return;
      }

      const registration =
        await window.navigator.serviceWorker.getRegistration();

      setRegistration(registration);
    };

    callback();
  }, []);

  useEffect(() => {
    const callback = async () => {
      try {
        if (!registration) {
          return;
        }

        registration.onupdatefound = async () => {
          await registration.update();

          onEnabledUpdate();
        };
      } finally {
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          enabledUpdate: true,
        }));
      }
    };

    callback();
  }, [onEnabledUpdate, registration]);

  useEffect(() => {
    try {
      // Android Trusted Web App
      if (window.document.referrer.includes("android-app://")) {
        onIsPwa();

        return;
      }

      // Chrome PWA (supporting fullscreen, standalone, minimal-ui)
      if (
        ["fullscreen", "standalone", "minimal-ui"].some(
          (displayMode) =>
            window.matchMedia("(display-mode: " + displayMode + ")").matches
        )
      ) {
        onIsPwa();

        return;
      }

      // NOT iOS PWA Standalone
      if (!("standalone" in window.navigator) || !window.navigator.standalone) {
        return;
      }

      onIsPwa();
    } finally {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        isPwa: true,
      }));
    }
  }, [onIsPwa]);

  return {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledPwa,
    enabledUpdate,
    isLoading,
    isPwa,
    unregister,
    showInstallPrompt,
    userChoice,
  };
}
