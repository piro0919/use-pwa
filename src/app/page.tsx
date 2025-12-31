"use client";

import usePwa from "@/hooks/use-pwa";

function StatusItem({ label, value }: { label: string; value: boolean }) {
  return (
    <li className="status-item">
      <span className="status-label">{label}</span>
      <span className={`status-value ${value}`}>{String(value)}</span>
    </li>
  );
}

export default function Home() {
  const { canInstall, install, isInstalled, isSupported } = usePwa();

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">use-pwa</h1>
        <p className="description">
          React hook for PWA installation detection and handling
        </p>

        {isInstalled ? (
          <div className="message success">Running as installed PWA</div>
        ) : !isSupported ? (
          <div className="message warning">
            PWA installation not supported in this browser
          </div>
        ) : (
          <button
            className="install-button"
            disabled={!canInstall}
            onClick={install}
            type="button"
          >
            {canInstall ? "Install PWA" : "Waiting for install prompt..."}
          </button>
        )}

        <div className="status">
          <h2 className="status-title">State</h2>
          <ul className="status-list">
            <StatusItem label="isSupported" value={isSupported} />
            <StatusItem label="canInstall" value={canInstall} />
            <StatusItem label="isInstalled" value={isInstalled} />
          </ul>
        </div>
      </div>

      <a
        className="github-link"
        href="https://github.com/piro0919/use-pwa"
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub
      </a>
    </div>
  );
}
