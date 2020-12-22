"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function usePwa() {
    var beforeinstallprompt = react_1.useRef();
    var _a = react_1.useState(), userChoice = _a[0], setUserChoice = _a[1];
    var _b = react_1.useState(false), enabledPwa = _b[0], setEnabledPwa = _b[1];
    var _c = react_1.useState(false), installablePwa = _c[0], setInstallablePwa = _c[1];
    var handleClickOnInstallPrompt = react_1.useCallback(function () {
        if (!beforeinstallprompt.current) {
            return;
        }
        beforeinstallprompt.current
            .prompt()
            .then(function () {
            if (!beforeinstallprompt.current) {
                return;
            }
            return beforeinstallprompt.current.userChoice;
        })
            .then(function (userChoice) {
            setUserChoice(userChoice);
        });
    }, []);
    var handleBeforeInstallPrompt = react_1.useCallback(function (event) {
        beforeinstallprompt.current = event;
        setInstallablePwa(true);
    }, []);
    var handleAppinstalled = react_1.useCallback(function () {
        setInstallablePwa(false);
    }, []);
    react_1.useEffect(function () {
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        return function () {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, [handleBeforeInstallPrompt]);
    react_1.useEffect(function () {
        setEnabledPwa("serviceWorker" in navigator && "BeforeInstallPromptEvent" in window);
    }, []);
    react_1.useEffect(function () {
        window.addEventListener("appinstalled", handleAppinstalled);
        return function () {
            window.removeEventListener("appinstalled", handleAppinstalled);
        };
    }, [handleAppinstalled]);
    return { enabledPwa: enabledPwa, handleClickOnInstallPrompt: handleClickOnInstallPrompt, installablePwa: installablePwa, userChoice: userChoice };
}
exports.default = usePwa;
//# sourceMappingURL=index.js.map