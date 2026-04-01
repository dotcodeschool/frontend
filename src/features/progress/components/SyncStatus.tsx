import { useEffect, useState } from "react";

import { useProgressStore } from "../lib/progress-store";

export function SyncStatus() {
  const { syncStatus, isAuthenticated, progress, userDidInteract, init } =
    useProgressStore();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    init();
    setReady(true);
  }, []);

  // Only show after the user explicitly marks a lesson done
  useEffect(() => {
    if (!userDidInteract) return;
    setVisible(true);

    // "synced" fades after 3 seconds, other states stay visible
    if (syncStatus === "synced") {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus, userDidInteract]);

  if (!ready) return null;
  if (!userDidInteract) return null;

  const hasProgress = Object.keys(progress.courses).length > 0;
  if (!hasProgress) return null;
  if (!visible && syncStatus !== "syncing" && syncStatus !== "local")
    return null;

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
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 4V1L8 5l4 4V6a6 6 0 016 6 6 6 0 01-.7 2.8l1.5 1.5A8 8 0 0012 4zM12 18a6 6 0 01-6-6 6 6 0 01.7-2.8L5.2 7.7A8 8 0 0012 20v3l4-4-4-4v3z" />
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
