export type CourseSlug = string & { readonly __brand: "CourseSlug" }
export type SectionSlug = string & { readonly __brand: "SectionSlug" }
export type LessonSlug = string & { readonly __brand: "LessonSlug" }

export const asCourseSlug = (s: string): CourseSlug => s as CourseSlug
export const asSectionSlug = (s: string): SectionSlug => s as SectionSlug
export const asLessonSlug = (s: string): LessonSlug => s as LessonSlug

export type CourseSummary = {
  slug: CourseSlug
  title: string
  author: string
  description: string
  level: string
  language: string
  order?: number
}

export type Course = {
  slug: CourseSlug
  title: string
  author: string
  authorUrl?: string
  description: string
  level: string
  language: string
  githubUrl?: string
  isGitorial?: boolean
  estimatedTime?: number
  tags?: string[]
  prerequisites?: string[]
  whatYoullLearn?: string[]
  lastUpdated?: string
  sections: Section[]
}

export type Section = {
  slug: SectionSlug
  title: string
  order: number
  description?: string
  content?: string
  lessons: LessonSummary[]
}

export type LessonSummary = {
  slug: LessonSlug
  title: string
  order: number
}

export type Lesson = {
  slug: LessonSlug
  title: string
  order: number
  code: string
  commitHash?: string
  lastUpdated?: string
  files: LessonFiles | null
}

export type LessonFiles = {
  template: CodeFile[]
  solution: CodeFile[]
  source: CodeFile[]
}

export type CodeFile = {
  path: string
  content: string
  language: string
}

export type Navigation = {
  prev: NavLink | null
  next: NavLink | null
  courseHref: string
}

export type NavLink = {
  slug: string
  title: string
  href: string
}

export type DiffFile = {
  path: string
  language: string
  original: string
  modified: string
}
