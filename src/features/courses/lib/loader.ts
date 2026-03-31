import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { marked } from "marked"
import type {
  CourseSummary, Course, Section, LessonSummary, Lesson, LessonFiles, CodeFile,
  CourseSlug, SectionSlug, LessonSlug,
} from "../types"

const CONTENT_DIR = path.join(process.cwd(), "content/courses")

const IGNORED_FILES = new Set([
  "Cargo.lock", ".gitignore", ".DS_Store", "target", "node_modules", "bun.lockb", "readmeTitle",
])

const EXCLUDED_DIRS = new Set(["course-template", "sample-course"])

function parseFrontmatter(filePath: string): { data: Record<string, any>; content: string } {
  const raw = fs.readFileSync(filePath, "utf8")
  return matter(raw)
}

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

export function getCourses(): CourseSummary[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const dirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith(".") && !d.name.startsWith("_") && !EXCLUDED_DIRS.has(d.name))
    .map(d => d.name)

  const courses: CourseSummary[] = []

  for (const slug of dirs) {
    const mdxPath = path.join(CONTENT_DIR, slug, `${slug}.mdx`)
    if (!fs.existsSync(mdxPath)) continue

    const { data } = parseFrontmatter(mdxPath)
    courses.push({
      slug: slug as CourseSlug,
      title: data.title ?? slug,
      author: data.author ?? "Unknown",
      description: data.description ?? "",
      level: data.level ?? "Beginner",
      language: data.language ?? "Unknown",
      order: data.order ?? 999,
    })
  }

  return courses.sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

export function getCourse(slug: CourseSlug): Course | null {
  const courseDir = path.join(CONTENT_DIR, slug)
  const mdxPath = path.join(courseDir, `${slug}.mdx`)

  if (!fs.existsSync(mdxPath)) return null

  const { data } = parseFrontmatter(mdxPath)
  const sectionsDir = path.join(courseDir, "sections")

  if (!fs.existsSync(sectionsDir)) return null

  const sectionDirs = fs.readdirSync(sectionsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("."))
    .map(d => d.name)

  const sections: Section[] = []

  for (const sectionSlug of sectionDirs) {
    const sectionMdxPath = path.join(sectionsDir, sectionSlug, `${sectionSlug}.mdx`)
    if (!fs.existsSync(sectionMdxPath)) continue

    const { data: sData } = parseFrontmatter(sectionMdxPath)
    const lessonsDir = path.join(sectionsDir, sectionSlug, "lessons")

    const lessons: LessonSummary[] = []

    if (fs.existsSync(lessonsDir)) {
      const lessonDirs = fs.readdirSync(lessonsDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith("."))
        .map(d => d.name)

      for (const lessonSlug of lessonDirs) {
        const lessonMdxPath = path.join(lessonsDir, lessonSlug, `${lessonSlug}.mdx`)
        if (!fs.existsSync(lessonMdxPath)) continue

        const { data: lData } = parseFrontmatter(lessonMdxPath)
        lessons.push({
          slug: lessonSlug as LessonSlug,
          title: lData.title ?? lessonSlug,
          order: lData.order ?? 0,
        })
      }

      lessons.sort((a, b) => a.order - b.order)
    }

    sections.push({
      slug: sectionSlug as SectionSlug,
      title: sData.title ?? sectionSlug,
      order: sData.order ?? 0,
      description: sData.description,
      lessons,
    })
  }

  sections.sort((a, b) => a.order - b.order)

  return {
    slug: slug as CourseSlug,
    title: data.title ?? slug,
    author: data.author ?? "Unknown",
    authorUrl: data.author_url,
    description: data.description ?? "",
    level: data.level ?? "Beginner",
    language: data.language ?? "Unknown",
    githubUrl: data.github_url,
    isGitorial: data.is_gitorial ?? false,
    estimatedTime: data.estimated_time,
    tags: data.tags ?? [],
    prerequisites: data.prerequisites ?? [],
    whatYoullLearn: data.what_youll_learn ?? [],
    lastUpdated: data.last_updated,
    sections,
  }
}

export function getLesson(
  courseSlug: CourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug,
): Lesson | null {
  const lessonDir = path.join(CONTENT_DIR, courseSlug, "sections", sectionSlug, "lessons", lessonSlug)
  const mdxPath = path.join(lessonDir, `${lessonSlug}.mdx`)

  if (!fs.existsSync(mdxPath)) return null

  const { data, content } = parseFrontmatter(mdxPath)
  const filesDir = path.join(lessonDir, "files")

  let files: LessonFiles | null = null

  if (fs.existsSync(filesDir)) {
    files = {
      template: readFilesRecursively(path.join(filesDir, "template"), path.join(filesDir, "template")),
      solution: readFilesRecursively(path.join(filesDir, "solution"), path.join(filesDir, "solution")),
      source: readFilesRecursively(path.join(filesDir, "source"), path.join(filesDir, "source")),
    }

    // If all arrays are empty, set files to null
    if (files.template.length === 0 && files.solution.length === 0 && files.source.length === 0) {
      files = null
    }
  }

  return {
    slug: lessonSlug as LessonSlug,
    title: data.title ?? lessonSlug,
    order: data.order ?? 0,
    content: marked.parse(content) as string,
    commitHash: data.commit_hash,
    lastUpdated: data.last_updated,
    files,
  }
}
