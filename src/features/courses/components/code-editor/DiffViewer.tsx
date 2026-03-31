import { DiffEditor } from '@monaco-editor/react'
import type { DiffFile } from '../../types'

interface Props {
  diff: DiffFile[]
}

export function DiffViewer({ diff }: Props) {
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
    <DiffEditor
      original={combined.original}
      modified={combined.modified}
      language={combined.language}
      theme="vs-dark"
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        renderSideBySide: true,
        scrollBeyondLastLine: false,
        padding: { top: 12 },
      }}
    />
  )
}
