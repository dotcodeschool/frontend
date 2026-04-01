import type { ProgressState, CourseProgress, LessonProgress } from '../types'

export function mergeProgress(local: ProgressState, remote: ProgressState): ProgressState {
  const merged: ProgressState = { courses: {} }
  const allSlugs = new Set([
    ...Object.keys(local.courses),
    ...Object.keys(remote.courses),
  ])

  for (const slug of allSlugs) {
    const localCourse = local.courses[slug]
    const remoteCourse = remote.courses[slug]

    if (!localCourse) {
      merged.courses[slug] = remoteCourse!
    } else if (!remoteCourse) {
      merged.courses[slug] = localCourse
    } else {
      merged.courses[slug] = mergeCourseProgress(localCourse, remoteCourse)
    }
  }

  return merged
}

function mergeCourseProgress(a: CourseProgress, b: CourseProgress): CourseProgress {
  const lessons: Record<string, LessonProgress> = {}
  const allLessons = new Set([
    ...Object.keys(a.lessons),
    ...Object.keys(b.lessons),
  ])

  for (const lessonSlug of allLessons) {
    const aLesson = a.lessons[lessonSlug]
    const bLesson = b.lessons[lessonSlug]

    if (!aLesson) {
      lessons[lessonSlug] = bLesson!
    } else if (!bLesson) {
      lessons[lessonSlug] = aLesson
    } else {
      // Both exist — completed wins; if both completed, latest timestamp wins
      if (aLesson.completed && !bLesson.completed) {
        lessons[lessonSlug] = aLesson
      } else if (!aLesson.completed && bLesson.completed) {
        lessons[lessonSlug] = bLesson
      } else {
        // Both completed or both incomplete — take the latest
        lessons[lessonSlug] = aLesson.completedAt >= bLesson.completedAt ? aLesson : bLesson
      }
    }
  }

  const forkUrl = a.forkUrl || b.forkUrl
  const lastUpdated = a.lastUpdated >= b.lastUpdated ? a.lastUpdated : b.lastUpdated

  return {
    courseSlug: a.courseSlug,
    forkUrl,
    lessons,
    lastUpdated,
  }
}
