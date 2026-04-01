import type { CodeFile, DiffFile } from '../../types'
import { useEditorStore } from './editor-store'
import { EditorTabs } from './EditorTabs'
import { EditorPanel } from './EditorPanel'
import { DiffViewer } from './DiffViewer'
import { FullscreenModal } from './FullscreenModal'
import { AnswerToolbar } from './AnswerToolbar'

interface Props {
  files: CodeFile[]
  diff: DiffFile[]
  solutionFiles?: CodeFile[]
  readOnly?: boolean
}

export default function CodeEditor({ files, diff, solutionFiles, readOnly = false }: Props) {
  const { showDiff, showSolution, isFullscreen, toggleFullscreen, activeTab, getFileContent } = useEditorStore()

  if (files.length === 0) return null

  const hasSolution = solutionFiles && solutionFiles.length > 0 && !readOnly

  // Build solution diff for the current file (user's edits vs solution)
  const solutionDiff: DiffFile[] = showSolution && hasSolution
    ? (() => {
        const currentFile = files[activeTab]
        if (!currentFile) return []
        const solution = solutionFiles.find(s => s.path === currentFile.path)
        if (!solution) return []
        return [{
          path: currentFile.path,
          language: currentFile.language,
          original: getFileContent(currentFile),
          modified: solution.content,
        }]
      })()
    : []

  const editorContent = (
    <div className="flex flex-col h-full bg-code border-l border-border">
      <EditorTabs files={files} diff={diff} />
      {hasSolution && (
        <AnswerToolbar editorFiles={files} solutionFiles={solutionFiles} />
      )}
      <div className="flex-1 min-h-0">
        {showSolution && solutionDiff.length > 0 ? (
          <DiffViewer diff={solutionDiff} />
        ) : showDiff ? (
          <DiffViewer diff={diff} />
        ) : (
          <EditorPanel files={files} readOnly={readOnly} />
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Normal editor */}
      <div className={`h-full ${isFullscreen ? 'invisible' : ''}`}>
        {editorContent}
      </div>

      {/* Fullscreen modal */}
      <FullscreenModal isOpen={isFullscreen} onClose={toggleFullscreen}>
        {editorContent}
      </FullscreenModal>
    </>
  )
}
