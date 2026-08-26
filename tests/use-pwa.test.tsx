import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value: "",
  });
  delete (window.navigator as { standalone?: boolean }).standalone;
  setUserAgent(DESKTOP_UA);
  setMaxTouchPoints(0);
});

const DESKTOP_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
// iPadOS sends this byte-for-byte identical to a Mac.
const MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15";

function setUserAgent(value: string): void {
  Object.defineProperty(window.navigator, "userAgent", {
    configurable: true,
    value,
  });
}

function setMaxTouchPoints(value: number): void {
  Object.defineProperty(window.navigator, "maxTouchPoints", {
    configurable: true,
    value,
  });
}

type FakePromptEvent = Event & {
  platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function fireBeforeInstallPrompt({
  outcome,
  prompt = () => Promise.resolve(),
}: {
  outcome: "accepted" | "dismissed";
  prompt?: () => Promise<void>;
}): FakePromptEvent {
  const event = new Event("beforeinstallprompt") as FakePromptEvent;

  event.platforms = ["web"];
  event.prompt = prompt;
  event.userChoice = Promise.resolve({ outcome, platform: "web" });

  window.dispatchEvent(event);

  return event;
}

type ControllableMatchMedia = {
  restore: () => void;
  setStandalone: (value: boolean) => void;
};

/** Replaces window.matchMedia with one whose display-mode can be flipped. */
function mockMatchMedia(): ControllableMatchMedia {
  const original = window.matchMedia;
  const listeners = new Set<() => void>();
  let standalone = false;

  window.matchMedia = (query: string) =>
    ({
      addEventListener: (_: string, listener: () => void) => {
        listeners.add(listener);
      },
      addListener: (listener: () => void) => {
        listeners.add(listener);
      },
      dispatchEvent: () => false,
      matches: standalone && query.includes("standalone"),
      media: query,
      onchange: null,
      removeEventListener: (_: string, listener: () => void) => {
        listeners.delete(listener);
      },
      removeListener: (listener: () => void) => {
        listeners.delete(listener);
      },
    }) as unknown as MediaQueryList;

  return {
    restore: () => {
      window.matchMedia = original;
    },
    setStandalone: (value: boolean) => {
      standalone = value;

      act(() => {
        for (const listener of listeners) {
          listener();
        }
      });
    },
  };
}

describe("usePwa", () => {
  it("returns the expected shape", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    expect(result.current).toMatchObject({
      canInstall: expect.any(Boolean),
      install: expect.any(Function),
      isInstalled: expect.any(Boolean),
      isSupported: expect.any(Boolean),
      needsManualInstall: expect.any(Boolean),
    });
  });

  it("detects PWA installed via standalone display-mode", async () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = (query: string) =>
      ({
        matches: query.includes("standalone"),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        onchange: null,
        dispatchEvent: () => false,
      }) as MediaQueryList;

    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    expect(result.current.isInstalled).toBe(true);

    window.matchMedia = originalMatchMedia;
  });

  it("detects PWA installed via Android TWA referrer", async () => {
    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "android-app://com.example.app",
    });
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    expect(result.current.isInstalled).toBe(true);
  });

  it("detects PWA installed via iOS navigator.standalone", async () => {
    (window.navigator as { standalone?: boolean }).standalone = true;
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    expect(result.current.isInstalled).toBe(true);
  });

  it("install() resolves to undefined when there is no captured event", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    const choice = await result.current.install();
    expect(choice).toBeUndefined();
  });

  it("install() keeps the event so a dismissal can be re-prompted", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    const prompt = vi.fn(() => Promise.resolve());

    act(() => {
      fireBeforeInstallPrompt({ outcome: "dismissed", prompt });
    });

    expect(result.current.canInstall).toBe(true);

    const choice = await act(() => result.current.install());

    expect(choice).toEqual({ outcome: "dismissed", platform: "web" });
    expect(result.current.canInstall).toBe(true);
  });

  it("install() clears the event once the user accepts", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    act(() => {
      fireBeforeInstallPrompt({ outcome: "accepted" });
    });

    const choice = await act(() => result.current.install());

    expect(choice).toEqual({ outcome: "accepted", platform: "web" });
    expect(result.current.canInstall).toBe(false);
    expect(await act(() => result.current.install())).toBeUndefined();
  });

  it("install() swallows the rejection when the spent event is prompted again", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    // Chrome refuses a second prompt() on an already-used event.
    let prompted = false;
    const prompt = vi.fn(() => {
      if (prompted) {
        return Promise.reject(new Error("already prompted"));
      }

      prompted = true;

      return Promise.resolve();
    });

    act(() => {
      fireBeforeInstallPrompt({ outcome: "dismissed", prompt });
    });

    await act(() => result.current.install());

    const second = await act(() => result.current.install());

    expect(second).toBeUndefined();
    expect(prompt).toHaveBeenCalledTimes(2);
    expect(result.current.canInstall).toBe(false);
  });

  it("flips isInstalled on the appinstalled event without a reload", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    act(() => {
      fireBeforeInstallPrompt({ outcome: "accepted" });
    });

    expect(result.current.isInstalled).toBe(false);
    expect(result.current.canInstall).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.canInstall).toBe(false);
  });

  it("re-evaluates isInstalled when the display mode changes", async () => {
    const matchMedia = mockMatchMedia();

    try {
      const { default: usePwa } = await import("../src/hooks/use-pwa");
      const { result } = renderHook(() => usePwa());

      expect(result.current.isInstalled).toBe(false);

      matchMedia.setStandalone(true);

      expect(result.current.isInstalled).toBe(true);

      matchMedia.setStandalone(false);

      expect(result.current.isInstalled).toBe(false);
    } finally {
      matchMedia.restore();
    }
  });

  it("removes the listeners it added on unmount, keeping the module-level one", async () => {
    const added = vi.spyOn(window, "addEventListener");
    const removed = vi.spyOn(window, "removeEventListener");

    try {
      // Importing here registers the module-level beforeinstallprompt
      // listener, which is deliberately never removed: it has to outlive
      // any component so the event is not lost before hydration.
      const { default: usePwa } = await import("../src/hooks/use-pwa");
      const count = (spy: typeof added, type: string): number =>
        spy.mock.calls.filter(([name]) => name === type).length;
      const { unmount } = renderHook(() => usePwa());

      expect(count(added, "beforeinstallprompt")).toBe(2);
      expect(count(added, "appinstalled")).toBe(1);
      expect(count(removed, "beforeinstallprompt")).toBe(0);

      unmount();

      expect(count(removed, "beforeinstallprompt")).toBe(1);
      expect(count(removed, "appinstalled")).toBe(1);
    } finally {
      added.mockRestore();
      removed.mockRestore();
    }
  });
  it("asks for a manual install on iPhone", async () => {
    setUserAgent(IPHONE_UA);

    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    expect(result.current.needsManualInstall).toBe(true);
  });

  it("asks for a manual install on iPadOS, which claims to be a Mac", async () => {
    setUserAgent(MAC_UA);
    setMaxTouchPoints(10);

    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    expect(result.current.needsManualInstall).toBe(true);
  });

  it("leaves a real Mac alone", async () => {
    setUserAgent(MAC_UA);
    setMaxTouchPoints(0);

    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    expect(result.current.needsManualInstall).toBe(false);
  });

  it("drops needsManualInstall once the iOS app is installed", async () => {
    setUserAgent(IPHONE_UA);
    (window.navigator as { standalone?: boolean }).standalone = true;

    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.needsManualInstall).toBe(false);
  });

  it("prefers the real prompt over the manual hint when both look possible", async () => {
    setUserAgent(IPHONE_UA);

    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());

    expect(result.current.needsManualInstall).toBe(true);

    act(() => {
      fireBeforeInstallPrompt({ outcome: "accepted" });
    });

    expect(result.current.canInstall).toBe(true);
    expect(result.current.needsManualInstall).toBe(false);
  });
});
