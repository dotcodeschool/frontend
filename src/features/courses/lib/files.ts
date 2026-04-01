import fs from "node:fs"
import path from "node:path"
import { diffLines } from "diff"
import type { CourseSlug, SectionSlug, LessonSlug, CodeFile, LessonFiles, DiffFile } from "../types"
import { getCourse } from "./loader"

const CONTENT_DIR = path.join(process.cwd(), "content/courses")

const IGNORED_FILES = new Set([
  "Cargo.lock", ".gitignore", ".DS_Store", "target", "node_modules", "bun.lockb", "readmeTitle",
])

function getLanguage(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase()
  const map: Record<string, string> = {
    js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
    html: "html", css: "css", json: "json", md: "markdown", mdx: "markdown",
    py: "python", rs: "rust", toml: "ini", go: "go", java: "java",
    c: "c", cpp: "cpp", cc: "cpp", sh: "shell",
  }
  return map[ext ?? ""] ?? "plaintext"
}

function readFilesRecursively(dir: string, baseDir: string): CodeFile[] {
  if (!fs.existsSync(dir)) return []

  const files: CodeFile[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (IGNORED_FILES.has(entry.name)) continue
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...readFilesRecursively(fullPath, baseDir))
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/")
      files.push({
        path: relativePath,
        content: fs.readFileSync(fullPath, "utf8"),
        language: getLanguage(entry.name),
      })
    }
  }

  return files
}

/**
 * Synchronously read a lesson's files without MDX compilation.
 */
export function getLessonFiles(
  courseSlug: CourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug,
): LessonFiles | null {
  const filesDir = path.join(
    CONTENT_DIR, courseSlug, "sections", sectionSlug, "lessons", lessonSlug, "files"
  )

  if (!fs.existsSync(filesDir)) return null

  const files: LessonFiles = {
    template: readFilesRecursively(path.join(filesDir, "template"), path.join(filesDir, "template")),
    solution: readFilesRecursively(path.join(filesDir, "solution"), path.join(filesDir, "solution")),
    source: readFilesRecursively(path.join(filesDir, "source"), path.join(filesDir, "source")),
  }

  if (files.template.length === 0 && files.solution.length === 0 && files.source.length === 0) {
    return null
  }

  return files
}

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

/**
 * Get only the files that changed relative to the previous lesson.
 * Returns filtered editor files, diff data, and solution files for answer checking.
 */
export function getChangedFiles(
  courseSlug: CourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug,
): { editorFiles: CodeFile[]; diffFiles: DiffFile[]; solutionFiles: CodeFile[]; readOnly: boolean } {
  const currentFiles = getLessonFiles(courseSlug, sectionSlug, lessonSlug)

  if (!currentFiles) {
    return { editorFiles: [], diffFiles: [], solutionFiles: [], readOnly: false }
  }

  const isSourceOnly = currentFiles.source.length > 0 && currentFiles.template.length === 0
  const rawEditorFiles = isSourceOnly ? currentFiles.source : currentFiles.template
  const solutionFiles = currentFiles.solution

  // Get previous lesson's "final state" files for comparison
  const prev = findPreviousLesson(courseSlug, sectionSlug, lessonSlug)
  if (!prev) {
    // First lesson — show all files, no diff
    return { editorFiles: rawEditorFiles, diffFiles: [], solutionFiles, readOnly: isSourceOnly }
  }

  const prevFiles = getLessonFiles(courseSlug, prev.sectionSlug, prev.lessonSlug)
  const prevFileMap = new Map<string, { content: string; language: string }>()

  if (prevFiles) {
    // Previous lesson's "final state": prefer solution > source > template
    const prevFileSet = prevFiles.solution.length > 0
      ? prevFiles.solution
      : prevFiles.source.length > 0
        ? prevFiles.source
        : prevFiles.template
    for (const file of prevFileSet) {
      prevFileMap.set(file.path, { content: file.content, language: file.language })
    }
  }

  // Filter: only include files that changed or are new
  const editorFiles: CodeFile[] = []
  const diffFiles: DiffFile[] = []

  for (const file of rawEditorFiles) {
    const prevFile = prevFileMap.get(file.path)
    const original = prevFile?.content ?? ""
    const modified = file.content

    const changes = diffLines(original.trim(), modified.trim(), { ignoreWhitespace: true })
    const hasChanges = changes.some(part => part.added || part.removed)

    if (hasChanges || !prevFile) {
      editorFiles.push(file)
      diffFiles.push({
        path: file.path,
        language: file.language,
        original,
        modified,
      })
    }
  }

  // If no files changed, show all files anyway so editor isn't empty
  if (editorFiles.length === 0) {
    return { editorFiles: rawEditorFiles, diffFiles: [], solutionFiles, readOnly: isSourceOnly }
  }

  return { editorFiles, diffFiles, solutionFiles, readOnly: isSourceOnly }
}
