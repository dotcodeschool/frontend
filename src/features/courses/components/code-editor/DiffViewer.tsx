import { lazy, Suspense, useRef } from 'react'
import type { DiffFile } from '../../types'
import { DCS_THEME_NAME, dcsDarkTheme } from './editor-theme'

const DiffEditor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.DiffEditor })))

interface Props {
  diff: DiffFile[]
}

export function DiffViewer({ diff }: Props) {
  const themeRegistered = useRef(false)
  if (diff.length === 0) return null

  // For now, show the first diff file. Could add tabs later.
  // Concatenate all diffs into one view with file headers
  const combined = diff.length === 1
    ? diff[0]
    : {
        original: diff.map(d => `// --- ${d.path} ---\n${d.original}`).join('\n\n'),
        modified: diff.map(d => `// --- ${d.path} ---\n${d.modified}`).join('\n\n'),
        language: diff[0].language,
      }

  return (
    <Suspense fallback={<div className="flex-1 bg-code" />}>
      <DiffEditor
        original={combined.original}
        modified={combined.modified}
        language={combined.language}
        theme={DCS_THEME_NAME}
        beforeMount={(monaco) => {
          if (!themeRegistered.current) {
            monaco.editor.defineTheme(DCS_THEME_NAME, dcsDarkTheme as any)
            themeRegistered.current = true
          }
        }}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 13,
          renderSideBySide: true,
          scrollBeyondLastLine: false,
          padding: { top: 12 },
        }}
      />
    </Suspense>
  )
}
