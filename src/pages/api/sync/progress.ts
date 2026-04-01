import type { APIRoute } from 'astro'
import { getSession } from '@/features/auth/lib/session'
import { Octokit } from 'octokit'

export const prerender = false

const GIST_FILENAME = 'dotcodeschool-progress.json'
const GIST_DESCRIPTION = 'Dot Code School — course progress'

async function findProgressGist(octokit: Octokit): Promise<string | null> {
  const { data: gists } = await octokit.rest.gists.list({ per_page: 100 })
  const gist = gists.find(
    (g) => g.files && GIST_FILENAME in g.files
  )
  return gist?.id ?? null
}

// GET — read progress from gist
export const GET: APIRoute = async (context) => {
  const session = await getSession(context.request)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const octokit = new Octokit({ auth: session.accessToken })

  try {
    const gistId = await findProgressGist(octokit)
    if (!gistId) {
      return new Response(JSON.stringify({ courses: {} }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { data: gist } = await octokit.rest.gists.get({ gist_id: gistId })
    const content = gist.files?.[GIST_FILENAME]?.content ?? '{"courses":{}}'
    return new Response(content, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to read progress' }), { status: 500 })
  }
}

// POST — write progress to gist
export const POST: APIRoute = async (context) => {
  const session = await getSession(context.request)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const octokit = new Octokit({ auth: session.accessToken })
  const body = await context.request.json()

  try {
    const gistId = await findProgressGist(octokit)

    if (gistId) {
      await octokit.rest.gists.update({
        gist_id: gistId,
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(body, null, 2) },
        },
      })
    } else {
      await octokit.rest.gists.create({
        description: GIST_DESCRIPTION,
        public: false,
        files: {
          [GIST_FILENAME]: { content: JSON.stringify(body, null, 2) },
        },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to save progress' }), { status: 500 })
  }
}
