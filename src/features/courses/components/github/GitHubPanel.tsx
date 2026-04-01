import { useEffect, useState } from "react";

import { useProgressStore } from "@/features/progress/lib/progress-store";

import { CIStatus } from "./CIStatus";
import { ForkButton } from "./ForkButton";
import { TestOutput } from "./TestOutput";

interface Props {
  courseSlug: string;
  githubUrl?: string;
}

export function GitHubPanel({ courseSlug, githubUrl }: Props) {
  const { isAuthenticated, getCourseProgress, init } = useProgressStore();
  const [ready, setReady] = useState(false);
  const [latestRunId, setLatestRunId] = useState<number | null>(null);

  useEffect(() => {
    init();
    setReady(true);
  }, []);

  if (!ready || !githubUrl) return null;

  const courseProgress = getCourseProgress(courseSlug);
  const forkUrl = courseProgress?.forkUrl;

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-semibold text-content-muted uppercase tracking-wider">
        GitHub
      </p>
      <ForkButton courseSlug={courseSlug} githubUrl={githubUrl} />
      {forkUrl && (
        <>
          <CIStatus forkUrl={forkUrl} onRunReady={setLatestRunId} />
          <TestOutput forkUrl={forkUrl} runId={latestRunId} />
        </>
      )}
    </div>
  );
}
