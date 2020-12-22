import { ComponentPropsWithoutRef } from "react";
declare type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never;
declare type BeforeInstallPromptEvent = Event & {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: "accepted" | "dismissed";
        platform: string;
    }>;
    prompt(): Promise<void>;
};
export declare type Pwa = {
    enabledPwa: boolean;
    handleClickOnInstallPrompt: NonNullable<ComponentPropsWithoutRef<"button">["onClick"]>;
    installablePwa: boolean;
    userChoice?: PromiseType<BeforeInstallPromptEvent["userChoice"]>;
};
declare function usePwa(): Pwa;
export default usePwa;
//# sourceMappingURL=index.d.ts.map