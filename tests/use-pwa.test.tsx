import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value: "",
  });
  delete (window.navigator as { standalone?: boolean }).standalone;
});

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

describe("usePwa", () => {
  it("returns the expected shape", async () => {
    const { default: usePwa } = await import("../src/hooks/use-pwa");
    const { result } = renderHook(() => usePwa());
    expect(result.current).toMatchObject({
      canInstall: expect.any(Boolean),
      install: expect.any(Function),
      isInstalled: expect.any(Boolean),
      isSupported: expect.any(Boolean),
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
});
