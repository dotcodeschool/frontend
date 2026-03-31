import type { LessonFiles, DiffFile } from '../../types'
import { useEditorStore } from './editor-store'
import { EditorTabs } from './EditorTabs'
import { EditorPanel } from './EditorPanel'
import { DiffViewer } from './DiffViewer'

interface Props {
  files: LessonFiles
  diff: DiffFile[]
  readOnly?: boolean
}

export default function CodeEditor({ files, diff, readOnly = false }: Props) {
  const { showDiff } = useEditorStore()

  // Determine which files to show in the editor
  const editorFiles = files.template.length > 0
    ? files.template
    : files.source.length > 0
      ? files.source
      : files.solution

  if (editorFiles.length === 0) return null

  return (
    <div className="flex flex-col h-full bg-code border-l border-border">
      <EditorTabs files={editorFiles} diff={diff} />
      <div className="flex-1 min-h-0">
        {showDiff ? (
          <DiffViewer diff={diff} />
        ) : (
          <EditorPanel files={editorFiles} readOnly={readOnly} />
        )}
      </div>
    </div>
  )
}
