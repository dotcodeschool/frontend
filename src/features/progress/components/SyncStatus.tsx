import { useEffect, useState } from "react";

import { useProgressStore } from "../lib/progress-store";

export function SyncStatus() {
  const { syncStatus, isAuthenticated, progress, init } = useProgressStore();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    init();
    setReady(true);
  }, []);

  // Only show after a status change triggered by user action, not on initial load
  useEffect(() => {
    if (!hasInteracted && syncStatus === "local") return;
    setHasInteracted(true);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [syncStatus]);

  if (!ready) return null;

  // Don't show if no progress exists or nothing to display
  const hasProgress = Object.keys(progress.courses).length > 0;
  if (!hasProgress) return null;
  if (!visible && syncStatus !== "syncing") return null;

  const config = {
    synced: {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      text: "Progress saved",
    },
    local: {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-content-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth={2} />
          <path strokeLinecap="round" strokeWidth={2} d="M8 12h8" />
        </svg>
      ),
      text: isAuthenticated
        ? "Saved locally — will sync when online"
        : "Saved on this device",
    },
    syncing: {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-accent animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      text: "Saving progress...",
    },
    failed: {
      icon: (
        <svg
          className="w-3.5 h-3.5 text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      text: "Couldn't save — will retry",
    },
  } as const;

  const { icon, text } = config[syncStatus];

  return (
    <div
      className="flex items-center gap-1.5 text-xs"
      title={syncStatus === "syncing" ? "Please don't close this tab" : text}
    >
      {icon}
      <span className="text-content-muted hidden sm:inline">{text}</span>
    </div>
  );
}
