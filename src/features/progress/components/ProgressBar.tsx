import { useEffect, useState } from 'react'
import { useProgressStore } from '../lib/progress-store'

interface Props {
  courseSlug: string
  totalLessons: number
  lessonSlugs: string[]
}

export function ProgressBar({ courseSlug, totalLessons, lessonSlugs }: Props) {
  const { progress, init } = useProgressStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    init()
    setReady(true)
  }, [])

  if (!ready || totalLessons === 0) return null

  const courseProgress = progress.courses[courseSlug]
  const completedCount = lessonSlugs.filter(
    (slug) => courseProgress?.lessons[slug]?.completed
  ).length

  if (completedCount === 0) return null

  const percent = Math.round((completedCount / totalLessons) * 100)

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-content-muted whitespace-nowrap">
        {completedCount}/{totalLessons}
      </span>
    </div>
  )
}
