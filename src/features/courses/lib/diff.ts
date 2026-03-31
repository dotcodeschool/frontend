import { diffLines } from "diff"
import type { CourseSlug, SectionSlug, LessonSlug, DiffFile } from "../types"
import { getCourse, getLesson } from "./loader"

function findPreviousLesson(
  courseSlug: CourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug,
): { sectionSlug: SectionSlug; lessonSlug: LessonSlug } | null {
  const course = getCourse(courseSlug)
  if (!course) return null

  const flat: { sectionSlug: SectionSlug; lessonSlug: LessonSlug }[] = []
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      flat.push({ sectionSlug: section.slug, lessonSlug: lesson.slug })
    }
  }

  const currentIndex = flat.findIndex(
    l => l.sectionSlug === sectionSlug && l.lessonSlug === lessonSlug,
  )

  return currentIndex > 0 ? flat[currentIndex - 1] : null
}

function getFilesForLesson(
  courseSlug: string,
  sectionSlug: string,
  lessonSlug: string,
): Map<string, { content: string; language: string }> {
  const lesson = getLesson(courseSlug as CourseSlug, sectionSlug as SectionSlug, lessonSlug as LessonSlug)
  if (!lesson?.files) return new Map()

  const fileMap = new Map<string, { content: string; language: string }>()

  // Prefer solution > source > template as the "final state" of a lesson
  const fileSets = [lesson.files.solution, lesson.files.source, lesson.files.template]
  for (const fileSet of fileSets) {
    if (fileSet.length > 0) {
      for (const file of fileSet) {
        fileMap.set(file.path, { content: file.content, language: file.language })
      }
      break
    }
  }

  return fileMap
}

export function getDiff(
  courseSlug: CourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug,
): DiffFile[] {
  const prev = findPreviousLesson(courseSlug, sectionSlug, lessonSlug)
  if (!prev) return []

  const prevFiles = getFilesForLesson(courseSlug, prev.sectionSlug, prev.lessonSlug)
  const currentLesson = getLesson(courseSlug, sectionSlug, lessonSlug)
  if (!currentLesson?.files) return []

  // Current lesson's "starting" files — template or source
  const currentFiles = new Map<string, { content: string; language: string }>()
  const currentFileSet = currentLesson.files.template.length > 0
    ? currentLesson.files.template
    : currentLesson.files.source
  for (const file of currentFileSet) {
    currentFiles.set(file.path, { content: file.content, language: file.language })
  }

  const diffs: DiffFile[] = []

  for (const [filePath, current] of currentFiles) {
    const prevFile = prevFiles.get(filePath)
    const original = prevFile?.content ?? ""
    const modified = current.content

    // Only include if there are actual differences
    const changes = diffLines(original.trim(), modified.trim(), { ignoreWhitespace: true })
    const hasChanges = changes.some(part => part.added || part.removed)

    if (hasChanges || !prevFile) {
      diffs.push({
        path: filePath,
        language: current.language,
        original,
        modified,
      })
    }
  }

  return diffs
}
