import { useCallback, useEffect, useRef, useState } from "react"

import {
  type ActionsResult,
  fetchActionsProgress,
} from "@/features/progress/lib/actions"

interface Props {
  forkUrl: string
  onRunReady?: (runId: number) => void
}

const POLL_INTERVAL = 15_000

export function CIStatus({ forkUrl, onRunReady }: Props) {
  const [result, setResult] = useState<ActionsResult | null>(null)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const data = await fetchActionsProgress(forkUrl)
      setResult(data)
      if (data.latestRun) {
        onRunReady?.(data.latestRun.id)
      }
      return data
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [forkUrl, onRunReady])

  useEffect(() => {
    fetchStatus()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fetchStatus])

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    const isRunning =
      result?.latestRun?.status === "queued" ||
      result?.latestRun?.status === "in_progress"

    if (isRunning) {
      intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [result?.latestRun?.status, fetchStatus])

  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        fetchStatus().then((data) => {
          const isRunning =
            data?.latestRun?.status === "queued" ||
            data?.latestRun?.status === "in_progress"
          if (isRunning && !intervalRef.current) {
            intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL)
          }
        })
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility)
  }, [fetchStatus])

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-content-muted">
        <div className="w-3 h-3 rounded-full bg-elevated animate-pulse" />
        Checking CI...
      </div>
    )
  }

  if (!result || !result.hasWorkflows) {
    return (
      <p className="text-xs text-content-muted">No CI runs yet</p>
    )
  }

  const run = result.latestRun
  if (!run) {
    return (
      <p className="text-xs text-content-muted">No CI runs yet</p>
    )
  }

  const isRunning = run.status === "queued" || run.status === "in_progress"

  return (
    <div className="flex items-center gap-2">
      <a
        href={run.htmlUrl}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1.5 text-xs no-underline hover:opacity-80 transition-opacity"
      >
        {isRunning ? (
          <>
            <svg
              className="w-3.5 h-3.5 text-accent animate-spin"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 4V1L8 5l4 4V6a6 6 0 016 6 6 6 0 01-.7 2.8l1.5 1.5A8 8 0 0012 4zM12 18a6 6 0 01-6-6 6 6 0 01.7-2.8L5.2 7.7A8 8 0 0012 20v3l4-4-4-4v3z" />
            </svg>
            <span className="text-accent">Running...</span>
          </>
        ) : run.conclusion === "success" ? (
          <>
            <svg
              className="w-3.5 h-3.5 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-success">Tests passing</span>
          </>
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="text-red-400">Tests failing</span>
          </>
        )}
      </a>
      <button
        onClick={() => fetchStatus()}
        className="p-0.5 text-content-faint hover:text-content-muted transition-colors"
        title="Refresh CI status"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 4V1L8 5l4 4V6a6 6 0 016 6 6 6 0 01-.7 2.8l1.5 1.5A8 8 0 0012 4zM12 18a6 6 0 01-6-6 6 6 0 01.7-2.8L5.2 7.7A8 8 0 0012 20v3l4-4-4-4v3z" />
        </svg>
      </button>
    </div>
  )
}
