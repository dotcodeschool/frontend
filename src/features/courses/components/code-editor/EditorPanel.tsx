import { lazy, Suspense } from 'react'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'

const Editor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })))

interface Props {
  files: CodeFile[]
  readOnly: boolean
}

export function EditorPanel({ files, readOnly }: Props) {
  const { activeTab, getFileContent, setFileContent } = useEditorStore()
  const file = files[activeTab]

  if (!file) return null

  const content = getFileContent(file)

  return (
    <Suspense fallback={<div className="flex-1 bg-code" />}>
      <Editor
        key={file.path}
        language={file.language}
        value={content}
        theme="vs-dark"
        onChange={(value) => {
          if (value !== undefined && !readOnly) {
            setFileContent(file.path, value)
          }
        }}
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
