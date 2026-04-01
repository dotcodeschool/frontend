import { create } from "zustand";

import type { CourseProgress, ProgressState, SyncStatus } from "../types";
import { debouncedSync, fetchRemoteProgress, pushProgress } from "./gist-sync";
import { loadProgress, saveProgress } from "./local-storage";
import { mergeProgress } from "./merge";

type ProgressStore = {
  progress: ProgressState;
  syncStatus: SyncStatus;
  isAuthenticated: boolean;

  // Actions
  init: () => void;
  setAuthenticated: (auth: boolean) => void;
  setSyncStatus: (status: SyncStatus) => void;
  markLessonDone: (courseSlug: string, lessonSlug: string) => void;
  setForkUrl: (courseSlug: string, forkUrl: string) => void;
  mergeRemote: (remote: ProgressState) => void;
  syncWithRemote: () => Promise<void>;
  queueSync: () => void;
  isLessonComplete: (courseSlug: string, lessonSlug: string) => boolean;
  getCourseProgress: (courseSlug: string) => CourseProgress | undefined;
};

let _initialized = false;

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: { courses: {} },
  syncStatus: "local",
  isAuthenticated: false,

  init: () => {
    // Always load from localStorage (idempotent)
    const progress = loadProgress();
    set({ progress });

    // Only run auth check and event listeners once
    if (_initialized) return;
    _initialized = true;

    // Check auth status and sync
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          set({ isAuthenticated: true });
          get().syncWithRemote();
        }
      })
      .catch(() => {});

    // Sync when coming back online
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        if (get().isAuthenticated) {
          get().syncWithRemote();
        }
      });
    }
  },

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setSyncStatus: (status) => set({ syncStatus: status }),

  markLessonDone: (courseSlug, lessonSlug) => {
    const { progress } = get();
    const now = new Date().toISOString();

    const course = progress.courses[courseSlug] ?? {
      courseSlug,
      lessons: {},
      lastUpdated: now,
    };

    // Don't overwrite existing completion
    if (course.lessons[lessonSlug]?.completed) return;

    const updated: ProgressState = {
      courses: {
        ...progress.courses,
        [courseSlug]: {
          ...course,
          lessons: {
            ...course.lessons,
            [lessonSlug]: {
              completed: true,
              completedAt: now,
              source: "manual",
            },
          },
          lastUpdated: now,
        },
      },
    };

    saveProgress(updated);
    set({ progress: updated });
    get().queueSync();
  },

  setForkUrl: (courseSlug, forkUrl) => {
    const { progress } = get();
    const now = new Date().toISOString();

    const course = progress.courses[courseSlug] ?? {
      courseSlug,
      lessons: {},
      lastUpdated: now,
    };

    const updated: ProgressState = {
      courses: {
        ...progress.courses,
        [courseSlug]: { ...course, forkUrl, lastUpdated: now },
      },
    };

    saveProgress(updated);
    set({ progress: updated });
  },

  mergeRemote: (remote) => {
    const { progress } = get();
    const merged = mergeProgress(progress, remote);
    saveProgress(merged);
    set({ progress: merged });
  },

  syncWithRemote: async () => {
    const { isAuthenticated } = get();
    if (!isAuthenticated || typeof window === "undefined" || !navigator.onLine)
      return;

    set({ syncStatus: "syncing" });
    try {
      const remote = await fetchRemoteProgress();
      const { progress } = get();
      const merged = mergeProgress(progress, remote);
      saveProgress(merged);
      await pushProgress(merged);
      set({ progress: merged, syncStatus: "synced" });
    } catch {
      set({ syncStatus: "failed" });
    }
  },

  queueSync: () => {
    const { isAuthenticated } = get();
    if (!isAuthenticated) return;

    debouncedSync(
      () => get().progress,
      () => set({ syncStatus: "syncing" }),
      () => set({ syncStatus: "synced" }),
      () => set({ syncStatus: "failed" }),
    );
  },

  isLessonComplete: (courseSlug, lessonSlug) => {
    return (
      get().progress.courses[courseSlug]?.lessons[lessonSlug]?.completed ??
      false
    );
  },

  getCourseProgress: (courseSlug) => {
    return get().progress.courses[courseSlug];
  },
}));
