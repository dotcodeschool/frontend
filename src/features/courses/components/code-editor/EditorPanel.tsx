import { lazy, Suspense } from 'react'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'

const Editor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })))

interface Props {
  files: CodeFile[]
  readOnly: boolean
}

export function EditorPanel({ files, readOnly }: Props) {
  const { activeTab } = useEditorStore()
  const file = files[activeTab]

  if (!file) return null

  return (
    <Suspense fallback={<div className="flex-1 bg-code" />}>
      <Editor
        language={file.language}
        value={file.content}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 12 },
        }}
      />
    </Suspense>
  )
}
