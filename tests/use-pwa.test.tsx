import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  Object.defineProperty(document, "referrer", {
    configurable: true,
    value: "",
  });
  // @ts-expect-error reset between tests
  delete (window.navigator as { standalone?: boolean }).standalone;
});

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
});
