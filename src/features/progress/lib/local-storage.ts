import type { ProgressState } from "../types";

const STORAGE_KEY = "dcs:progress";

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { courses: {} };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { courses: {} };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { courses: {} };
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}
