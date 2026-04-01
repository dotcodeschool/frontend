import { useState, useRef, useEffect } from 'react'
import { IoInformationCircleOutline } from 'react-icons/io5'

interface Props {
  prerequisites: string[]
}

export default function PrerequisitesPopover({ prerequisites }: Props) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={popoverRef} className="relative inline-block">
      <button
        onClick={() => setOpen(prev => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-content-muted hover:text-content-secondary transition-colors ml-1 align-middle"
        aria-label="Show prerequisites"
      >
        <IoInformationCircleOutline className="text-sm" />
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-elevated border border-border rounded-lg p-3 shadow-lg z-10">
          <p className="text-content-muted text-xs mb-2">
            We suggest you complete the following courses before you get started:
          </p>
          <ul className="space-y-1">
            {prerequisites.map((prereq) => (
              <li key={prereq} className="flex items-start gap-2 text-sm text-content-secondary">
                <span className="text-success mt-0.5 shrink-0">✓</span>
                {prereq}
              </li>
            ))}
          </ul>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-elevated border-r border-b border-border rotate-45" />
        </div>
      )}
    </div>
  )
}
