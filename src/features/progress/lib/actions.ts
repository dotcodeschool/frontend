export type RunStatus = "queued" | "in_progress" | "completed";
export type RunConclusion = "success" | "failure" | "cancelled" | null;

export type ActionsResult = {
  hasWorkflows: boolean;
  latestRun: {
    id: number;
    status: RunStatus;
    conclusion: RunConclusion;
    createdAt: string;
    headSha: string;
    htmlUrl: string;
  } | null;
  totalRuns: number;
};

export type LogStep = {
  name: string;
  conclusion: "success" | "failure" | "skipped";
  duration: string;
  output: string;
};

export type LogJob = {
  name: string;
  conclusion: "success" | "failure" | "cancelled";
  steps: LogStep[];
};

export type LogsResult = {
  jobs: LogJob[];
};

export async function fetchActionsProgress(
  forkUrl: string,
): Promise<ActionsResult> {
  const res = await fetch(
    `/api/courses/progress?forkUrl=${encodeURIComponent(forkUrl)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch actions progress");
  return res.json();
}

export async function fetchActionLogs(
  forkUrl: string,
  runId: number,
): Promise<LogsResult> {
  const res = await fetch(
    `/api/courses/logs?forkUrl=${encodeURIComponent(forkUrl)}&runId=${runId}`,
  );
  if (!res.ok) throw new Error("Failed to fetch action logs");
  return res.json();
}
