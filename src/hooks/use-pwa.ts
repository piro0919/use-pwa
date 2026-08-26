"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type UserChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<UserChoice>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

// Capture event at module load time (before React hydration)
let capturedEvent: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    capturedEvent = event as BeforeInstallPromptEvent;
  });
}

// Chrome PWA display modes that mean "running as an installed app"
const DISPLAY_MODES = ["fullscreen", "standalone", "minimal-ui"] as const;

function detectInstalled(): boolean {
  // Android Trusted Web App
  if (document.referrer.includes("android-app://")) {
    return true;
  }

  const isDisplayModePwa = DISPLAY_MODES.some(
    (mode) => window.matchMedia(`(display-mode: ${mode})`).matches,
  );

  if (isDisplayModePwa) {
    return true;
  }

  // iOS PWA Standalone
  return Boolean(navigator.standalone);
}

function detectIos(): boolean {
  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/.test(ua)) {
    return true;
  }

  // iPadOS 13+ sends a user agent byte-identical to a Mac's, so the
  // touch count is the only thing separating an iPad from a Mac.
  return ua.includes("Macintosh") && navigator.maxTouchPoints > 1;
}

// Safari before 14 only has the deprecated addListener/removeListener.
function subscribe(query: MediaQueryList, listener: () => void): void {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
  } else {
    query.addListener(listener);
  }
}

function unsubscribe(query: MediaQueryList, listener: () => void): void {
  if (typeof query.removeEventListener === "function") {
    query.removeEventListener("change", listener);
  } else {
    query.removeListener(listener);
  }
}

export type PwaData = {
  canInstall: boolean;
  install: () => Promise<UserChoice | undefined>;
  isInstalled: boolean;
  isSupported: boolean;
  needsManualInstall: boolean;
};

export default function usePwa(): PwaData {
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(capturedEvent);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isIos, setIsIos] = useState(false);

  const discardEvent = useCallback((): void => {
    setCanInstall(false);
    promptEvent.current = null;
    capturedEvent = null;
  }, []);

  const install = useCallback(async (): Promise<UserChoice | undefined> => {
    const event = promptEvent.current;

    if (!event) {
      return undefined;
    }

    let choice: UserChoice;

    try {
      await event.prompt();
      choice = await event.userChoice;
    } catch {
      // The browser refuses a second `prompt()` on the same event. We
      // keep the event after a dismissal (see below), so a caller that
      // re-prompts without waiting for a fresh browser event lands
      // here. Drop the spent event rather than surfacing a rejection.
      discardEvent();

      return undefined;
    }

    // beforeinstallprompt is one-shot per page load: the same event
    // cannot be prompted again after it resolves. We clear only on
    // `accepted` so callers can re-prompt after a dismissal (the next
    // genuine browser event will repopulate state via the effect
    // below).
    if (choice.outcome === "accepted") {
      discardEvent();
    }

    return choice;
  }, [discardEvent]);

  // Check for captured event and listen for future events
  useEffect(() => {
    // Use captured event if available
    if (capturedEvent) {
      promptEvent.current = capturedEvent;
      setCanInstall(true);
    }

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      promptEvent.current = event;
      capturedEvent = event;
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // Detect if running as installed PWA, and keep following it
  useEffect(() => {
    const detect = (): void => setIsInstalled(detectInstalled());

    detect();

    // `appinstalled` lets us drop the install button without a reload.
    // Like `beforeinstallprompt`, it is a Chromium-family event, so the
    // browsers that can reach install() are the ones that report back.
    const handleAppInstalled = (): void => {
      setIsInstalled(true);
      discardEvent();
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // The display mode changes at runtime — entering or leaving
    // fullscreen, or launching the installed app from the same page.
    const queries = DISPLAY_MODES.map((mode) =>
      window.matchMedia(`(display-mode: ${mode})`),
    );

    for (const query of queries) {
      subscribe(query, detect);
    }

    return () => {
      window.removeEventListener("appinstalled", handleAppInstalled);

      for (const query of queries) {
        unsubscribe(query, detect);
      }
    };
  }, [discardEvent]);

  // Detect PWA support
  useEffect(() => {
    if ("BeforeInstallPromptEvent" in window) {
      setIsSupported(true);
    }
  }, []);

  // Detect iOS, where installing is a manual gesture. Kept out of the
  // first render so server and client markup agree.
  useEffect(() => {
    setIsIos(detectIos());
  }, []);

  return {
    canInstall,
    install,
    isInstalled,
    isSupported,
    // Nothing can be prompted, but the platform can still take the app
    // onto the home screen if the user does it by hand.
    needsManualInstall: isIos && !isInstalled && !canInstall,
  };
}
