import { useEffect, useState } from "react";
import {
  IoArrowBack,
  IoChevronDown,
  IoChevronUp,
  IoClose,
  IoMenu,
} from "react-icons/io5";

import { AnonBanner } from "@/features/progress/components/AnonBanner";
import { useProgressStore } from "@/features/progress/lib/progress-store";

import type { Course, LessonSlug, SectionSlug } from "../types";
import { GitHubPanel } from "./github/GitHubPanel";

interface Props {
  course: Course;
  currentSection: SectionSlug;
  currentLesson?: LessonSlug;
  mobile?: boolean;
}

function SidebarContent({
  course,
  currentSection,
  currentLesson,
  onNavigate,
}: {
  course: Course;
  currentSection: SectionSlug;
  currentLesson?: LessonSlug;
  onNavigate?: () => void;
}) {
  const { isLessonComplete, init } = useProgressStore();
  useEffect(() => {
    init();
  }, []);

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    return new Set([currentSection]);
  });

  const toggleSection = (slug: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <nav className="flex flex-col h-full bg-surface overflow-y-auto">
      {/* Back to Course */}
      <a
        href={`/courses/${course.slug}`}
        className="flex items-center gap-1.5 px-4 py-3 text-xs text-content-muted hover:text-content-secondary transition-colors no-underline border-b border-border"
        onClick={onNavigate}
      >
        <IoArrowBack className="text-sm" />
        Back to Course
      </a>

      {/* Sections */}
      <div className="py-2">
        {course.sections.map((section) => {
          const isOpen = openSections.has(section.slug);

          return (
            <div key={section.slug}>
              {/* Section header — title links to section page, chevron toggles lessons */}
              <div className="flex items-center px-4 py-2.5">
                <a
                  href={`/courses/${course.slug}/${section.slug}`}
                  onClick={onNavigate}
                  className="text-xs font-semibold text-content-muted tracking-wide truncate pr-2 no-underline hover:text-content-secondary transition-colors"
                >
                  {section.title}
                </a>
                <button
                  onClick={() => toggleSection(section.slug)}
                  className="ml-auto p-0.5 shrink-0"
                  aria-label={isOpen ? "Collapse section" : "Expand section"}
                >
                  {isOpen ? (
                    <IoChevronUp className="text-content-faint text-xs" />
                  ) : (
                    <IoChevronDown className="text-content-faint text-xs" />
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="pb-1">
                  {section.lessons.map((lesson) => {
                    const isActive =
                      section.slug === currentSection &&
                      lesson.slug === currentLesson;
                    const href = `/courses/${course.slug}/${section.slug}/${lesson.slug}`;

                    return (
                      <a
                        key={lesson.slug}
                        href={href}
                        onClick={onNavigate}
                        className={`flex items-center gap-2 py-1.5 px-4 pl-7 text-[13px] rounded mx-1 transition-colors no-underline ${
                          isActive
                            ? "text-accent bg-accent-bg"
                            : "text-content-muted hover:text-content-secondary hover:bg-elevated"
                        }`}
                      >
                        {isLessonComplete(course.slug, lesson.slug) ? (
                          <svg
                            className="w-3 h-3 text-success flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isActive ? "bg-accent" : "bg-content-faint"
                            }`}
                          />
                        )}
                        {lesson.title}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-auto border-t border-border">
        <div className="px-3 py-3">
          <GitHubPanel courseSlug={course.slug} githubUrl={course.githubUrl} />
        </div>
        <div className="px-3 py-3 border-t border-border">
          <AnonBanner />
        </div>
      </div>
    </nav>
  );
}

export function MobileSidebarToggle() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
      className="md:hidden p-2 text-content-muted hover:text-content-secondary transition-colors"
      aria-label="Open sidebar"
    >
      <IoMenu className="text-lg" />
    </button>
  );
}

export default function SidebarNav({
  course,
  currentSection,
  currentLesson,
  mobile,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handler = () => setDrawerOpen(true);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  if (mobile) {
    return (
      <>
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        <div
          className={`fixed top-0 left-0 h-full w-[280px] z-50 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-xs font-semibold text-content-muted">
              Navigation
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 text-content-muted hover:text-content-secondary transition-colors"
              aria-label="Close sidebar"
            >
              <IoClose className="text-base" />
            </button>
          </div>
          <SidebarContent
            course={course}
            currentSection={currentSection}
            currentLesson={currentLesson}
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </>
    );
  }

  return (
    <SidebarContent
      course={course}
      currentSection={currentSection}
      currentLesson={currentLesson}
    />
  );
}
