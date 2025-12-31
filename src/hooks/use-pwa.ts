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

export type PwaData = {
  canInstall: boolean;
  install: () => Promise<UserChoice | undefined>;
  isInstalled: boolean;
  isSupported: boolean;
};

export default function usePwa(): PwaData {
  const promptEvent = useRef<BeforeInstallPromptEvent | null>(capturedEvent);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const install = useCallback(async (): Promise<UserChoice | undefined> => {
    if (!promptEvent.current) {
      return undefined;
    }

    await promptEvent.current.prompt();
    const choice = await promptEvent.current.userChoice;

    if (choice.outcome === "accepted") {
      setCanInstall(false);
      promptEvent.current = null;
      capturedEvent = null;
    }

    return choice;
  }, []);

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

  // Detect if running as installed PWA
  useEffect(() => {
    // Android Trusted Web App
    if (document.referrer.includes("android-app://")) {
      setIsInstalled(true);
      return;
    }

    // Chrome PWA (supporting fullscreen, standalone, minimal-ui)
    const displayModes = ["fullscreen", "standalone", "minimal-ui"] as const;
    const isDisplayModePwa = displayModes.some(
      (mode) => window.matchMedia(`(display-mode: ${mode})`).matches,
    );

    if (isDisplayModePwa) {
      setIsInstalled(true);
      return;
    }

    // iOS PWA Standalone
    if (navigator.standalone) {
      setIsInstalled(true);
    }
  }, []);

  // Detect PWA support
  useEffect(() => {
    if ("BeforeInstallPromptEvent" in window) {
      setIsSupported(true);
    }
  }, []);

  return {
    canInstall,
    install,
    isInstalled,
    isSupported,
  };
}
