import Editor from '@monaco-editor/react'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  files: CodeFile[]
  readOnly: boolean
}

export function EditorPanel({ files, readOnly }: Props) {
  const { activeTab } = useEditorStore()
  const file = files[activeTab]

  if (!file) return null

  return (
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
  )
}
