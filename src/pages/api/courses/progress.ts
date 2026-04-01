import type { APIRoute } from 'astro'
import { getSession } from '@/features/auth/lib/session'
import { Octokit } from 'octokit'

export const prerender = false

export const GET: APIRoute = async (context) => {
  const session = await getSession(context.request)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const url = new URL(context.request.url)
  const forkUrl = url.searchParams.get('forkUrl')

  if (!forkUrl) {
    return new Response(JSON.stringify({ error: 'Missing forkUrl parameter' }), { status: 400 })
  }

  // Parse owner/repo from forkUrl
  const match = forkUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) {
    return new Response(JSON.stringify({ error: 'Invalid forkUrl' }), { status: 400 })
  }

  const [, owner, repo] = match
  const octokit = new Octokit({ auth: session.accessToken })

  try {
    // Get the latest workflow runs
    const { data: runs } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: 10,
      status: 'completed',
    })

    // Get the latest successful run
    const latestSuccess = runs.workflow_runs.find((run) => run.conclusion === 'success')

    return new Response(JSON.stringify({
      hasWorkflows: runs.total_count > 0,
      latestRun: latestSuccess ? {
        id: latestSuccess.id,
        conclusion: latestSuccess.conclusion,
        createdAt: latestSuccess.created_at,
        headSha: latestSuccess.head_sha,
      } : null,
      totalRuns: runs.total_count,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch workflow status' }), {
      status: 500,
    })
  }
}
