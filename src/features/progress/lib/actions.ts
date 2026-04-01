type ActionsResult = {
  hasWorkflows: boolean
  latestRun: {
    id: number
    conclusion: string
    createdAt: string
    headSha: string
  } | null
  totalRuns: number
}

export async function fetchActionsProgress(forkUrl: string): Promise<ActionsResult> {
  const res = await fetch(`/api/courses/progress?forkUrl=${encodeURIComponent(forkUrl)}`)
  if (!res.ok) throw new Error('Failed to fetch actions progress')
  return res.json()
}
