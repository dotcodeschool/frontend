import { create } from 'zustand'
import type { ProgressState, CourseProgress, SyncStatus } from '../types'
import { loadProgress, saveProgress } from './local-storage'
import { mergeProgress } from './merge'

type ProgressStore = {
  progress: ProgressState
  syncStatus: SyncStatus
  isAuthenticated: boolean

  // Actions
  init: () => void
  setAuthenticated: (auth: boolean) => void
  setSyncStatus: (status: SyncStatus) => void
  markLessonDone: (courseSlug: string, lessonSlug: string) => void
  setForkUrl: (courseSlug: string, forkUrl: string) => void
  mergeRemote: (remote: ProgressState) => void
  isLessonComplete: (courseSlug: string, lessonSlug: string) => boolean
  getCourseProgress: (courseSlug: string) => CourseProgress | undefined
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: { courses: {} },
  syncStatus: 'local',
  isAuthenticated: false,

  init: () => {
    const progress = loadProgress()
    set({ progress })
  },

  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  setSyncStatus: (status) => set({ syncStatus: status }),

  markLessonDone: (courseSlug, lessonSlug) => {
    const { progress } = get()
    const now = new Date().toISOString()

    const course = progress.courses[courseSlug] ?? {
      courseSlug,
      lessons: {},
      lastUpdated: now,
    }

    // Don't overwrite existing completion
    if (course.lessons[lessonSlug]?.completed) return

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
              source: 'manual',
            },
          },
          lastUpdated: now,
        },
      },
    }

    saveProgress(updated)
    set({ progress: updated })
  },

  setForkUrl: (courseSlug, forkUrl) => {
    const { progress } = get()
    const now = new Date().toISOString()

    const course = progress.courses[courseSlug] ?? {
      courseSlug,
      lessons: {},
      lastUpdated: now,
    }

    const updated: ProgressState = {
      courses: {
        ...progress.courses,
        [courseSlug]: { ...course, forkUrl, lastUpdated: now },
      },
    }

    saveProgress(updated)
    set({ progress: updated })
  },

  mergeRemote: (remote) => {
    const { progress } = get()
    const merged = mergeProgress(progress, remote)
    saveProgress(merged)
    set({ progress: merged })
  },

  isLessonComplete: (courseSlug, lessonSlug) => {
    return get().progress.courses[courseSlug]?.lessons[lessonSlug]?.completed ?? false
  },

  getCourseProgress: (courseSlug) => {
    return get().progress.courses[courseSlug]
  },
}))
