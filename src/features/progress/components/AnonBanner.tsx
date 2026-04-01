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
    <div className="flex flex-col gap-2 px-3 py-3 bg-accent-bg rounded-md text-xs">
      <p className="text-content-secondary">
        Progress is saved on this device only.{" "}
        <a
          href="/auth/login"
          className="text-accent hover:text-accent-dim no-underline"
        >
          Sign in
        </a>{" "}
        to sync across devices.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("dcs:anon-banner-dismissed", "true");
            } catch {}
          }}
          className="text-content-muted hover:text-content-secondary transition-colors"
        >
          Don't show again
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-content-muted hover:text-content-secondary transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
