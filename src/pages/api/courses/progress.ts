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

export const GET: APIRoute = async (context) => {
  const session = await getSession(context.request);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const url = new URL(context.request.url);
  const forkUrl = url.searchParams.get("forkUrl");

  if (!forkUrl) return json({ error: "Missing forkUrl parameter" }, 400);

  // Parse owner/repo from forkUrl
  const match = forkUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return json({ error: "Invalid forkUrl" }, 400);

  const [, owner, repo] = match;
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Get the latest workflow runs
    const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 10,
      status: "completed",
    });

    // Get the latest successful run
    const latestSuccess = runs.workflow_runs.find(
      (run) => run.conclusion === "success",
    );

    return json({
      hasWorkflows: runs.total_count > 0,
      latestRun: latestSuccess
        ? {
            id: latestSuccess.id,
            conclusion: latestSuccess.conclusion,
            createdAt: latestSuccess.created_at,
            headSha: latestSuccess.head_sha,
          }
        : null,
      totalRuns: runs.total_count,
    });
  } catch {
    return json({ error: "Failed to fetch workflow status" }, 500);
  }
};
