import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

import type { CourseSlug, Section } from "../types";

interface Props {
  sections: Section[];
  courseSlug: CourseSlug;
}

export default function CourseAccordion({ sections, courseSlug }: Props) {
  const [openSections, setOpenSections] = useState<Set<number>>(
    () => new Set(sections.map((_, i) => i)),
  );

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {sections.map((section, sIndex) => {
        const isOpen = openSections.has(sIndex);

        return (
          <div
            key={section.slug}
            className="border border-border rounded-lg overflow-hidden"
          >
            {/* Section header */}
            <button
              onClick={() => toggleSection(sIndex)}
              className="flex items-center gap-3 w-full bg-surface px-4 py-3 hover:bg-elevated transition-colors text-left"
            >
              <span
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold shrink-0"
                style={{ color: "var(--bg-base)" }}
              >
                {sIndex + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading text-sm font-semibold text-content-primary truncate">
                  {section.title}
                </h3>
                <p className="text-content-muted text-xs">
                  {section.lessons.length}{" "}
                  {section.lessons.length === 1 ? "lesson" : "lessons"}
                </p>
              </div>
              {isOpen ? (
                <IoChevronUp className="text-content-faint text-sm shrink-0" />
              ) : (
                <IoChevronDown className="text-content-faint text-sm shrink-0" />
              )}
            </button>

            {/* Lesson list */}
            {isOpen && (
              <div className="bg-base">
                {section.lessons.map((lesson) => {
                  const href = `/courses/${courseSlug}/${section.slug}/${lesson.slug}`;

                  return (
                    <a
                      key={lesson.slug}
                      href={href}
                      className="flex items-center gap-3 px-4 py-2.5 pl-16 text-sm text-content-muted hover:text-content-secondary hover:bg-elevated transition-colors no-underline border-t border-border"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-content-faint shrink-0" />
                      <span className="flex-1">{lesson.title}</span>
                      {lesson.fileType && (
                        <span className="text-xs text-content-muted shrink-0">
                          {lesson.fileType === "exercise"
                            ? "Exercise"
                            : "Source Files"}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
