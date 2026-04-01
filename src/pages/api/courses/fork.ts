import type { APIRoute } from 'astro'
import { getSession } from '@/features/auth/lib/session'
import { Octokit } from 'octokit'

export const prerender = false

export const POST: APIRoute = async (context) => {
  const session = await getSession(context.request)
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { repo } = await context.request.json()

  if (!repo || typeof repo !== 'string' || !repo.includes('/')) {
    return new Response(JSON.stringify({ error: 'Invalid repo format. Expected owner/repo' }), {
      status: 400,
    })
  }

  const [owner, repoName] = repo.split('/')
  const octokit = new Octokit({ auth: session.accessToken })

  try {
    // Check if fork already exists
    const { data: user } = await octokit.rest.users.getAuthenticated()

    try {
      const { data: existingRepo } = await octokit.rest.repos.get({
        owner: user.login,
        repo: repoName,
      })

      // Check if it's actually a fork of the right repo
      if (existingRepo.fork && existingRepo.parent?.full_name === repo) {
        return new Response(JSON.stringify({
          forkUrl: existingRepo.html_url,
          alreadyExists: true,
        }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch {
      // Repo doesn't exist under user's account — proceed to fork
    }

    // Create the fork
    const { data: fork } = await octokit.rest.repos.createFork({
      owner,
      repo: repoName,
    })

    return new Response(JSON.stringify({
      forkUrl: fork.html_url,
      alreadyExists: false,
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Failed to fork repository',
      fallbackUrl: `https://github.com/${repo}/fork`,
    }), { status: 500 })
  }
}
