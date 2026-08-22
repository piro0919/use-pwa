"use client";

import usePwa from "@/hooks/use-pwa";

type StepState = "done" | "current" | "todo";

function Step({
  label,
  note,
  state,
}: {
  label: string;
  note: string;
  state: StepState;
}) {
  return (
    <li className={`step ${state}`}>
      <span className="step-dot" />
      <span className="step-label">{label}</span>
      <span className="step-note">{note}</span>
    </li>
  );
}

export default function Home() {
  const { canInstall, install, isInstalled, isSupported } = usePwa();

  /* このフックが返すのは3つの真偽値だが、実際には順番のある道のりになる。
     いまどこにいるかを一本の線で見せる */
  const steps: { label: string; note: string; state: StepState }[] = [
    {
      label: "isSupported",
      note: "The browser fires beforeinstallprompt",
      state: isSupported ? "done" : "current",
    },
    {
      label: "canInstall",
      note: "The event arrived and was captured",
      state: canInstall ? "done" : isSupported ? "current" : "todo",
    },
    {
      label: "isInstalled",
      note: "Running from the home screen or dock",
      state: isInstalled ? "done" : canInstall ? "current" : "todo",
    },
  ];

  return (
    <main className="stage">
      <h1 className="name">use-pwa</h1>
      <p className="lead">
        React hook for PWA installation detection and handling. It captures{" "}
        <code>beforeinstallprompt</code> at module load, before hydration, so
        the button below is honest on first paint.
      </p>

      <ol className="track">
        {steps.map((s) => (
          <Step key={s.label} label={s.label} note={s.note} state={s.state} />
        ))}
      </ol>

      {isInstalled ? (
        <p className="verdict done">Running as an installed PWA.</p>
      ) : isSupported ? (
        <button
          className="install-button"
          disabled={!canInstall}
          onClick={install}
          type="button"
        >
          {canInstall ? "Install this page" : "Waiting for the prompt…"}
        </button>
      ) : (
        <p className="verdict off">
          This browser never fires the event. On iOS, Add to Home Screen is a
          manual gesture, so <code>isSupported</code> stays false by design.
        </p>
      )}

      <div className="foot">
        <code className="install">npm i use-pwa</code>
        <a
          className="github-link"
          href="https://github.com/piro0919/use-pwa"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub →
        </a>
      </div>
    </main>
  );
}
