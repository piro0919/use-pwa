"use client";

import { useSyncExternalStore } from "react";

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

type Snapshot = {
  canInstall: boolean;
  isInstalled: boolean;
  isIos: boolean;
  isSupported: boolean;
};

// Every hook instance reads this one store, so installing from one
// component clears `canInstall` in all of them.

// What the server renders, and what the first client render must match
// during hydration: nothing is known until the browser is asked.
const SERVER_SNAPSHOT: Snapshot = Object.freeze({
  canInstall: false,
  isInstalled: false,
  isIos: false,
  isSupported: false,
});

let capturedEvent: BeforeInstallPromptEvent | null = null;
// Cached so useSyncExternalStore sees the same object until something
// actually changes. Built lazily: the browser is only asked on the client.
let snapshot: Snapshot | null = null;
const listeners = new Set<() => void>();

function readSnapshot(): Snapshot {
  if (!snapshot) {
    snapshot = {
      canInstall: capturedEvent !== null,
      isInstalled: detectInstalled(),
      isIos: detectIos(),
      isSupported: "BeforeInstallPromptEvent" in window,
    };
  }

  return snapshot;
}

function update(patch: Partial<Snapshot>): void {
  const current = readSnapshot();
  const changed = (Object.keys(patch) as (keyof Snapshot)[]).some(
    (key) => patch[key] !== current[key],
  );

  if (!changed) {
    return;
  }

  snapshot = { ...current, ...patch };

  for (const listener of listeners) {
    listener();
  }
}

function discardEvent(): void {
  capturedEvent = null;
  update({ canInstall: false });
}

const detect = (): void => update({ isInstalled: detectInstalled() });

// `appinstalled` lets us drop the install button without a reload. Like
// `beforeinstallprompt`, it is a Chromium-family event, so the browsers
// that can reach install() are the ones that report back.
const handleAppInstalled = (): void => {
  capturedEvent = null;
  update({ canInstall: false, isInstalled: true });
};

let queries: MediaQueryList[] = [];

// Listeners for installed state live only while some component is
// mounted; the beforeinstallprompt one below lives for the page.
function subscribeStore(listener: () => void): () => void {
  listeners.add(listener);

  if (listeners.size === 1) {
    window.addEventListener("appinstalled", handleAppInstalled);

    // The display mode changes at runtime — entering or leaving
    // fullscreen, or launching the installed app from the same page.
    queries = DISPLAY_MODES.map((mode) =>
      window.matchMedia(`(display-mode: ${mode})`),
    );

    for (const query of queries) {
      subscribe(query, detect);
    }

    // Nothing was listening while no component was mounted.
    detect();
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      window.removeEventListener("appinstalled", handleAppInstalled);

      for (const query of queries) {
        unsubscribe(query, detect);
      }

      queries = [];
    }
  };
}

const getServerSnapshot = (): Snapshot => SERVER_SNAPSHOT;

// Capture the event at module load time, before React hydrates: the
// browser fires it once, often before any effect could listen.
// preventDefault() suppresses the browser's own mini-infobar so the app
// decides when to prompt. This is the package's import-time side effect.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    capturedEvent = event;
    update({ canInstall: true });
  });
}

async function install(): Promise<UserChoice | undefined> {
  const event = capturedEvent;

  if (!event) {
    return undefined;
  }

  let choice: UserChoice;

  try {
    await event.prompt();
    choice = await event.userChoice;
  } catch {
    // The browser refuses a second `prompt()` on the same event. We keep
    // the event after a dismissal (see below), so a caller that re-prompts
    // without waiting for a fresh browser event lands here. Drop the spent
    // event rather than surfacing a rejection.
    if (capturedEvent === event) {
      discardEvent();
    }

    return undefined;
  }

  // beforeinstallprompt is one-shot per page load: the same event cannot
  // be prompted again after it resolves. We clear only on `accepted` so
  // callers can re-prompt after a dismissal (the next genuine browser
  // event replaces it).
  if (choice.outcome === "accepted" && capturedEvent === event) {
    discardEvent();
  }

  return choice;
}

export default function usePwa(): PwaData {
  // On hydration React renders SERVER_SNAPSHOT first and then the real
  // one, so server and client markup agree.
  const { canInstall, isInstalled, isIos, isSupported } = useSyncExternalStore(
    subscribeStore,
    readSnapshot,
    getServerSnapshot,
  );

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
