(this["webpackJsonpuse-pwa"]=this["webpackJsonpuse-pwa"]||[]).push([[0],{14:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n(7),c=n.n(a),o=n(2),i=n.n(o),s=n(4),u=n(3),l=n(5);function d(e){var t=Object(r.useState)(e),n=Object(l.a)(t,2),a=n[0],c=n[1];return{value:a,setTrue:Object(r.useCallback)((function(){return c(!0)}),[])}}var f=n(1),b=function(){var e=function(){var e=Object(r.useRef)(),t=d(!1),n=t.value,a=t.setTrue,c=d(!1),o=c.value,f=c.setTrue,b=d(!1),p=b.value,w=b.setTrue,j=d(!1),v=j.value,h=j.setTrue,O=d(!1),g=O.value,m=O.setTrue,k=d(!1),x=k.value,P=k.setTrue,y=Object(r.useState)(),C=Object(l.a)(y,2),E=C[0],T=C[1],L=Object(r.useCallback)((function(){return a()}),[a]),S=Object(r.useCallback)((function(t){e.current=t,f()}),[f]),U=Object(r.useState)(),W=Object(l.a)(U,2),I=W[0],A=W[1],B=I&&Object(s.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I.unregister();case 2:return t=e.sent,e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)}))),F=Object(r.useCallback)(Object(s.a)(i.a.mark((function t(){var n;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.current){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,e.current.prompt();case 4:return t.next=6,e.current.userChoice;case 6:n=t.sent,T(n);case 8:case"end":return t.stop()}}),t)}))),[]),N=Object(r.useState)({appinstalled:!1,beforeinstallprompt:!1,enabledA2hs:!1,enabledPwa:!1,enabledUpdate:!1,isPwa:!1}),J=Object(l.a)(N,2),M=J[0],R=J[1],D=Object(r.useMemo)((function(){return Object.values(M).includes(!1)}),[M]);return Object(r.useEffect)((function(){return window.addEventListener("appinstalled",L),R((function(e){return Object(u.a)(Object(u.a)({},e),{},{appinstalled:!0})})),function(){return window.removeEventListener("appinstalled",L)}}),[L]),Object(r.useEffect)((function(){return window.addEventListener("beforeinstallprompt",S),R((function(e){return Object(u.a)(Object(u.a)({},e),{},{beforeinstallprompt:!0})})),function(){return window.removeEventListener("beforeinstallprompt",S)}}),[S]),Object(r.useEffect)((function(){try{if(!("standalone"in window.navigator))return;w()}finally{R((function(e){return Object(u.a)(Object(u.a)({},e),{},{enabledA2hs:!0})}))}}),[w]),Object(r.useEffect)((function(){try{if(!("serviceWorker"in window.navigator)||!("BeforeInstallPromptEvent"in window))return;h()}finally{R((function(e){return Object(u.a)(Object(u.a)({},e),{},{enabledPwa:!0})}))}}),[h]),Object(r.useEffect)((function(){!function(){var e=Object(s.a)(i.a.mark((function e(){var t,n,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("serviceWorker"in window.navigator){e.next=2;break}return e.abrupt("return");case 2:return t=window,n=t.navigator.serviceWorker,e.next=5,n.getRegistration();case 5:r=e.sent,A(r);case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()()}),[]),Object(r.useEffect)((function(){!function(){var e=Object(s.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,I){e.next=3;break}return e.abrupt("return");case 3:I.onupdatefound=Object(s.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I.update();case 2:m();case 3:case"end":return e.stop()}}),e)})));case 4:return e.prev=4,R((function(e){return Object(u.a)(Object(u.a)({},e),{},{enabledUpdate:!0})})),e.finish(4);case 7:case"end":return e.stop()}}),e,null,[[0,,4,7]])})));return function(){return e.apply(this,arguments)}}()()}),[m,I]),Object(r.useEffect)((function(){try{if(window.document.referrer.includes("android-app://"))return void P();if(["fullscreen","standalone","minimal-ui"].some((function(e){return window.matchMedia("(display-mode: "+e+")").matches})))return void P();if(!("standalone"in window.navigator)||!window.navigator.standalone)return;P()}finally{R((function(e){return Object(u.a)(Object(u.a)({},e),{},{isPwa:!0})}))}}),[P]),{appinstalled:n,canInstallprompt:o,enabledA2hs:p,enabledPwa:v,enabledUpdate:g,isLoading:D,isPwa:x,unregister:B,showInstallPrompt:F,userChoice:E}}(),t=e.appinstalled,n=e.canInstallprompt,a=e.enabledA2hs,c=e.enabledPwa,o=e.enabledUpdate,b=e.isLoading,p=e.isPwa,w=e.showInstallPrompt,j=e.unregister,v=e.userChoice,h=Object(r.useCallback)(Object(s.a)(i.a.mark((function e(){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(j){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,j();case 4:if(e.sent){e.next=8;break}return alert("Update failed."),e.abrupt("return");case 8:alert("The update was successful, restart the app."),window.location.reload();case 10:case"end":return e.stop()}}),e)}))),[j]);return Object(f.jsxs)("div",{children:[c&&!p?Object(f.jsx)("button",{disabled:!n||t,onClick:w,children:"Install Pwa"}):"Not compatible with pwa.",Object(f.jsx)("br",{}),o&&p?Object(f.jsx)("button",{onClick:h,children:"Update Pwa"}):"Update does not exist.",Object(f.jsx)("hr",{}),Object(f.jsxs)("div",{children:["appinstalled: ".concat(t),Object(f.jsx)("br",{}),"canInstallprompt: ".concat(n),Object(f.jsx)("br",{}),"enabledA2hs: ".concat(a),Object(f.jsx)("br",{}),"enabledPwa: ".concat(c),Object(f.jsx)("br",{}),"enabledUpdate: ".concat(o),Object(f.jsx)("br",{}),"isLoading: ".concat(b),Object(f.jsx)("br",{}),"isPwa: ".concat(p),Object(f.jsx)("br",{}),"userChoice: ".concat(JSON.stringify(v))]})]})},p=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function w(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}var j=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,15)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,o=t.getTTFB;n(e),r(e),a(e),c(e),o(e)}))};c.a.render(Object(f.jsx)(r.StrictMode,{children:Object(f.jsx)(b,{})}),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");p?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var r=n.headers.get("content-type");404===n.status||null!=r&&-1===r.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):w(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA")}))):w(t,e)}))}}(),j()}},[[14,1,2]]]);
//# sourceMappingURL=main.2713dc64.chunk.js.map