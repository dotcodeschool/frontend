import { useEffect, useState } from "react";

import { useProgressStore } from "../lib/progress-store";

interface Props {
  courseSlug: string;
  lessonSlug: string;
}

export function LessonCheckbox({ courseSlug, lessonSlug }: Props) {
  const { markLessonDone, isLessonComplete, init } = useProgressStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    init();
    setReady(true);
  }, []);

  if (!ready) return null;

  const completed = isLessonComplete(courseSlug, lessonSlug);

  return (
    <button
      onClick={() => markLessonDone(courseSlug, lessonSlug)}
      disabled={completed}
      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-md transition-colors ${
        completed
          ? "text-success cursor-default"
          : "text-content-muted hover:text-content-secondary border border-border hover:border-content-muted"
      }`}
      title={completed ? "Lesson completed" : "Mark as done"}
    >
      {completed ? (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          Done
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" strokeWidth={2} />
          </svg>
          Mark as done
        </>
      )}
    </button>
  );
}
