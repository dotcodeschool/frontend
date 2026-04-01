import type { APIRoute } from "astro";
import { Octokit } from "octokit";

import { getSession } from "@/features/auth/lib/session";

export const prerender = false;

const VALID_REPO = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async (context) => {
  const session = await getSession(context.request);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const { repo } = await context.request.json();

  if (!repo || typeof repo !== "string" || !VALID_REPO.test(repo)) {
    return json({ error: "Invalid repo format. Expected owner/repo" }, 400);
  }

  const [owner, repoName] = repo.split("/");
  const octokit = new Octokit({ auth: session.accessToken });

  try {
    // Check if fork already exists
    const { data: user } = await octokit.rest.users.getAuthenticated();

    try {
      const { data: existingRepo } = await octokit.rest.repos.get({
        owner: user.login,
        repo: repoName,
      });

      // Check if it's actually a fork of the right repo
      if (existingRepo.fork && existingRepo.parent?.full_name === repo) {
        return json({ forkUrl: existingRepo.html_url, alreadyExists: true });
      }
    } catch {
      // Repo doesn't exist under user's account — proceed to fork
    }

    // Create the fork
    const { data: fork } = await octokit.rest.repos.createFork({
      owner,
      repo: repoName,
    });

    return json({ forkUrl: fork.html_url, alreadyExists: false });
  } catch {
    return json(
      {
        error: "Failed to fork repository",
        fallbackUrl: `https://github.com/${repo}/fork`,
      },
      500,
    );
  }
};
