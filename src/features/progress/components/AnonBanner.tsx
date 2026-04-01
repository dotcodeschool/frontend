import { useEffect, useState } from "react";

import { useProgressStore } from "../lib/progress-store";

export function AnonBanner() {
  const { isAuthenticated, progress, init } = useProgressStore();
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    init();
    setReady(true);
    try {
      setDismissed(
        localStorage.getItem("dcs:anon-banner-dismissed") === "true",
      );
    } catch {
      // localStorage unavailable (private browsing, quota exceeded)
    }
  }, []);

  if (!ready || isAuthenticated || dismissed) return null;

  // Only show if they have some progress
  const hasProgress = Object.keys(progress.courses).length > 0;

  if (!hasProgress) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-accent-bg rounded-md text-xs">
      <span className="text-content-secondary">
        Progress saved on this device only.{" "}
        <a
          href="/auth/login"
          className="text-accent hover:text-accent-dim no-underline"
        >
          Sign in
        </a>{" "}
        to sync across devices.
      </span>
      <button
        onClick={() => {
          setDismissed(true);
          try {
            localStorage.setItem("dcs:anon-banner-dismissed", "true");
          } catch {}
        }}
        className="text-content-muted hover:text-content-secondary ml-auto"
        aria-label="Dismiss"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
