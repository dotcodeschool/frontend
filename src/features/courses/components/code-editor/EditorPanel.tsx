import { lazy, Suspense, useRef } from 'react'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'
import { DCS_THEME_NAME, dcsDarkTheme } from './editor-theme'

const Editor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })))

interface Props {
  files: CodeFile[]
  readOnly: boolean
}

export function EditorPanel({ files, readOnly }: Props) {
  const { activeTab, getFileContent, setFileContent } = useEditorStore()
  const themeRegistered = useRef(false)
  const file = files[activeTab]

  if (!file) return null

  const content = getFileContent(file)

  const handleBeforeMount = (monaco: any) => {
    if (!themeRegistered.current) {
      monaco.editor.defineTheme(DCS_THEME_NAME, dcsDarkTheme)
      themeRegistered.current = true
    }
  }

  return (
    <Suspense fallback={<div className="flex-1 bg-code" />}>
      <Editor
        key={file.path}
        language={file.language}
        value={content}
        theme={DCS_THEME_NAME}
        beforeMount={handleBeforeMount}
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
