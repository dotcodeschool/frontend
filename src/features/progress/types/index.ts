export type LessonProgress = {
  completed: boolean
  completedAt: string // ISO timestamp
  source: 'manual' | 'test'
}

export type CourseProgress = {
  courseSlug: string
  forkUrl?: string
  lessons: Record<string, LessonProgress>
  lastUpdated: string // ISO timestamp
}

export type ProgressState = {
  courses: Record<string, CourseProgress>
}

export type SyncStatus = 'synced' | 'local' | 'syncing' | 'failed'
