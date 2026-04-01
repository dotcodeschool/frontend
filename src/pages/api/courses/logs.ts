import type { APIRoute } from "astro";
import { Octokit } from "octokit";

import { getSession } from "@/features/auth/lib/session";

export const prerender = false;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function formatDuration(startedAt: string, completedAt: string): string {
  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();
  const seconds = Math.round((end - start) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

export const GET: APIRoute = async (context) => {
  const session = await getSession(context.request);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const url = new URL(context.request.url);
  const forkUrl = url.searchParams.get("forkUrl");
  const runId = url.searchParams.get("runId");

  if (!forkUrl) return json({ error: "Missing forkUrl parameter" }, 400);
  if (!runId) return json({ error: "Missing runId parameter" }, 400);

  const match = forkUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return json({ error: "Invalid forkUrl" }, 400);

  const [, owner, repo] = match;
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Get jobs for this workflow run
    const { data: jobsData } =
      await octokit.rest.actions.listJobsForWorkflowRun({
        owner,
        repo,
        run_id: parseInt(runId),
      });

    const jobs = await Promise.all(
      jobsData.jobs.map(async (job) => {
        // Fetch logs for each job
        let logText: string;
        try {
          const { data } =
            await octokit.rest.actions.downloadJobLogsForWorkflowRun({
              owner,
              repo,
              job_id: job.id,
            });
          logText = typeof data === "string" ? data : String(data);
        } catch {
          logText = "(logs unavailable)";
        }

        // Parse log text into sections by step
        // GitHub Actions logs have timestamps and step markers like:
        // 2024-01-01T00:00:00.0000000Z ##[group]Run step-name
        const logLines = logText.split("\n");
        const stepLogs = new Map<string, string[]>();
        let currentStep = "__preamble__";

        for (const line of logLines) {
          const groupMatch = line.match(/##\[group\](.+)/);
          if (groupMatch) {
            currentStep = groupMatch[1].trim();
            if (!stepLogs.has(currentStep)) {
              stepLogs.set(currentStep, []);
            }
            continue;
          }
          if (line.includes("##[endgroup]")) {
            currentStep = "__preamble__";
            continue;
          }
          // Strip timestamp prefix (e.g., "2024-01-01T00:00:00.0000000Z ")
          const cleaned = line.replace(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z\s*/,
            "",
          );
          if (!stepLogs.has(currentStep)) {
            stepLogs.set(currentStep, []);
          }
          stepLogs.get(currentStep)!.push(cleaned);
        }

        // Map job steps to structured output
        const steps = (job.steps ?? []).map((step) => {
          const stepOutput = stepLogs.get(step.name) ?? [];
          return {
            name: step.name,
            conclusion: (step.conclusion ?? "skipped") as
              | "success"
              | "failure"
              | "skipped",
            duration: formatDuration(
              step.started_at ?? step.completed_at ?? "",
              step.completed_at ?? "",
            ),
            output: stepOutput.join("\n"),
          };
        });

        return {
          name: job.name,
          conclusion: (job.conclusion ?? "cancelled") as
            | "success"
            | "failure"
            | "cancelled",
          steps,
        };
      }),
    );

    return json({ jobs });
  } catch {
    return json({ error: "Failed to fetch logs" }, 500);
  }
};
