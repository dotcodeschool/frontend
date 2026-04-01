import { useState } from "react";

import { useProgressStore } from "@/features/progress/lib/progress-store";

interface Props {
  courseSlug: string;
  githubUrl: string;
}

export function ForkButton({ courseSlug, githubUrl }: Props) {
  const { isAuthenticated, getCourseProgress, setForkUrl } = useProgressStore();
  const [forking, setForking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const courseProgress = getCourseProgress(courseSlug);
  const forkUrl = courseProgress?.forkUrl;

  if (!isAuthenticated || !githubUrl) return null;

  // Extract owner/repo from githubUrl
  const repoMatch = githubUrl.match(/github\.com\/([^/]+\/[^/]+)/);
  const repo = repoMatch?.[1];
  if (!repo) return null;

  if (forkUrl) {
    const repoName = forkUrl.replace("https://github.com/", "");
    return (
      <div className="flex items-center gap-1.5 text-xs text-content-muted">
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
        </svg>
        <a
          href={forkUrl}
          target="_blank"
          rel="noopener"
          className="text-accent hover:text-accent-dim no-underline truncate"
        >
          {repoName}
        </a>
      </div>
    );
  }

  async function handleFork() {
    setForking(true);
    setError(null);
    setFallbackUrl(null);

    try {
      const res = await fetch("/api/courses/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to fork");
        setFallbackUrl(data.fallbackUrl ?? `https://github.com/${repo}/fork`);
        return;
      }

      setForkUrl(courseSlug, data.forkUrl);
    } catch {
      setError("Network error");
      setFallbackUrl(`https://github.com/${repo}/fork`);
    } finally {
      setForking(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleFork}
        disabled={forking}
        className="flex items-center gap-2 w-full text-xs font-medium px-3 py-2 rounded-md bg-accent text-[var(--bg-base)] hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
        </svg>
        {forking ? "Forking..." : "Start Coding on GitHub"}
      </button>
      {error && (
        <div className="mt-2 text-xs">
          <p className="text-amber-400">{error}</p>
          {fallbackUrl && (
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener"
              className="text-accent hover:text-accent-dim no-underline"
            >
              Fork on GitHub manually
            </a>
          )}
        </div>
      )}
    </div>
  );
}
