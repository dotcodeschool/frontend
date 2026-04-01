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

  const match = forkUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return json({ error: "Invalid forkUrl" }, 400);

  const [, owner, repo] = match;
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Get latest runs (any status, not just completed)
    const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 5,
    });

    const latestRun = runs.workflow_runs[0] ?? null;

    return json({
      hasWorkflows: runs.total_count > 0,
      latestRun: latestRun
        ? {
            id: latestRun.id,
            status: latestRun.status,
            conclusion: latestRun.conclusion,
            createdAt: latestRun.created_at,
            headSha: latestRun.head_sha,
            htmlUrl: latestRun.html_url,
          }
        : null,
      totalRuns: runs.total_count,
    });
  } catch {
    return json({ error: "Failed to fetch workflow status" }, 500);
  }
};
