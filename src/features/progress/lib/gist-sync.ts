import type { ProgressState } from '../types'

let syncTimer: ReturnType<typeof setTimeout> | null = null
const DEBOUNCE_MS = 3000

export async function fetchRemoteProgress(): Promise<ProgressState> {
  const res = await fetch('/api/sync/progress')
  if (!res.ok) throw new Error('Failed to fetch remote progress')
  return res.json()
}

export async function pushProgress(state: ProgressState): Promise<void> {
  const res = await fetch('/api/sync/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  if (!res.ok) throw new Error('Failed to push progress')
}

export function debouncedSync(
  getState: () => ProgressState,
  onSyncing: () => void,
  onSynced: () => void,
  onFailed: () => void,
): void {
  if (syncTimer) clearTimeout(syncTimer)

  syncTimer = setTimeout(async () => {
    onSyncing()
    try {
      await pushProgress(getState())
      onSynced()
    } catch {
      onFailed()
    }
  }, DEBOUNCE_MS)
}
