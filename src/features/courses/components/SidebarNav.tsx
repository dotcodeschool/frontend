import { useState } from 'react'
import { IoChevronDown, IoChevronUp, IoArrowBack } from 'react-icons/io5'
import type { Course, SectionSlug, LessonSlug } from '../types'

interface Props {
  course: Course
  currentSection: SectionSlug
  currentLesson?: LessonSlug
}

export default function SidebarNav({ course, currentSection, currentLesson }: Props) {
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    return new Set([currentSection])
  })

  const toggleSection = (slug: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  return (
    <nav className="flex flex-col h-full bg-surface overflow-y-auto">
      {/* Back to Course */}
      <a
        href={`/courses/${course.slug}`}
        className="flex items-center gap-1.5 px-4 py-3 text-xs text-content-muted hover:text-content-secondary transition-colors no-underline border-b border-border"
      >
        <IoArrowBack className="text-sm" />
        Back to Course
      </a>

      {/* Sections */}
      <div className="py-2">
        {course.sections.map((section) => {
          const isOpen = openSections.has(section.slug)

          return (
            <div key={section.slug}>
              {/* Section header — clickable to toggle */}
              <button
                onClick={() => toggleSection(section.slug)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-left group"
              >
                <span className="text-xs font-semibold text-content-muted tracking-wide truncate pr-2">
                  {section.title}
                </span>
                {isOpen ? (
                  <IoChevronUp className="text-content-faint text-xs shrink-0" />
                ) : (
                  <IoChevronDown className="text-content-faint text-xs shrink-0" />
                )}
              </button>

              {/* Lesson list — collapsed/expanded */}
              {isOpen && (
                <div className="pb-1">
                  {section.lessons.map((lesson) => {
                    const isActive = section.slug === currentSection && lesson.slug === currentLesson
                    const href = `/courses/${course.slug}/${section.slug}/${lesson.slug}`

                    return (
                      <a
                        key={lesson.slug}
                        href={href}
                        className={`flex items-center gap-2 py-1.5 px-4 pl-7 text-[13px] rounded mx-1 transition-colors no-underline ${
                          isActive
                            ? 'text-accent bg-accent-bg'
                            : 'text-content-muted hover:text-content-secondary hover:bg-elevated'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isActive ? 'bg-accent' : 'bg-content-faint'
                          }`}
                        />
                        {lesson.title}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
