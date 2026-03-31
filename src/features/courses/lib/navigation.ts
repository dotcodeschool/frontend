import type { CourseSlug, SectionSlug, LessonSlug, Navigation, NavLink } from "../types"
import { getCourse } from "./loader"

export function getNavigation(
  courseSlug: CourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug,
): Navigation {
  const course = getCourse(courseSlug)
  const courseHref = `/courses/${courseSlug}`

  if (!course) return { prev: null, next: null, courseHref }

  // Flatten all lessons into a global ordered list
  const flat: { sectionSlug: SectionSlug; lessonSlug: LessonSlug; title: string }[] = []
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      flat.push({ sectionSlug: section.slug, lessonSlug: lesson.slug, title: lesson.title })
    }
  }

  const currentIndex = flat.findIndex(
    l => l.sectionSlug === sectionSlug && l.lessonSlug === lessonSlug,
  )

  const toNavLink = (item: typeof flat[number]): NavLink => ({
    slug: item.lessonSlug,
    title: item.title,
    href: `/courses/${courseSlug}/${item.sectionSlug}/${item.lessonSlug}`,
  })

  return {
    prev: currentIndex > 0 ? toNavLink(flat[currentIndex - 1]) : null,
    next: currentIndex < flat.length - 1 ? toNavLink(flat[currentIndex + 1]) : null,
    courseHref,
  }
}
