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

const GIST_FILENAME = "dotcodeschool-progress.json";
const GIST_DESCRIPTION = "Dot Code School — course progress";
const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1MB

async function findProgressGist(octokit: Octokit): Promise<string | null> {
  // Paginate through gists to avoid missing the progress gist
  for (let page = 1; page <= 5; page++) {
    const { data: gists } = await octokit.rest.gists.list({
      per_page: 100,
      page,
    });
    const gist = gists.find((g) => g.files && GIST_FILENAME in g.files);
    if (gist) return gist.id;
    if (gists.length < 100) break; // No more pages
  }
  return null;
}

function isValidProgressState(
  body: unknown,
): body is { courses: Record<string, unknown> } {
  if (typeof body !== "object" || body === null) return false;
  if (!("courses" in body) || typeof (body as any).courses !== "object")
    return false;
  return true;
}

// GET — read progress from gist
export const GET: APIRoute = async (context) => {
  const session = await getSession(context.request);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    const gistId = await findProgressGist(octokit);
    if (!gistId) return json({ courses: {} });

    const { data: gist } = await octokit.rest.gists.get({ gist_id: gistId });
    const content = gist.files?.[GIST_FILENAME]?.content ?? '{"courses":{}}';
    return new Response(content, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return json({ error: "Failed to read progress" }, 500);
  }
};

// POST — write progress to gist
export const POST: APIRoute = async (context) => {
  const session = await getSession(context.request);
  if (!session) return json({ error: "Unauthorized" }, 401);

  const octokit = new Octokit({ auth: session.accessToken });

  const contentLength = context.request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
    return json({ error: "Payload too large" }, 413);
  }

  const body = await context.request.json();

  if (!isValidProgressState(body)) {
    return json({ error: "Invalid progress data" }, 400);
  }

  try {
    const gistId = await findProgressGist(octokit);

    if (gistId) {
      await octokit.rest.gists.update({
        gist_id: gistId,
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(body, null, 2) },
        },
      });
    } else {
      await octokit.rest.gists.create({
        description: GIST_DESCRIPTION,
        public: false,
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(body, null, 2) },
        },
      });
    }

    return json({ ok: true });
  } catch {
    return json({ error: "Failed to save progress" }, 500);
  }
};
