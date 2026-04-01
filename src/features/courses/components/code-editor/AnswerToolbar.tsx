import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  editorFiles: CodeFile[]
  solutionFiles: CodeFile[]
}

export function AnswerToolbar({ editorFiles, solutionFiles }: Props) {
  const { doesAnswerMatch, checkAnswer, resetAnswer } = useEditorStore()

  const handleCheck = () => {
    checkAnswer(editorFiles, solutionFiles)
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border-b border-border shrink-0">
      <button
        onClick={handleCheck}
        className="text-xs font-medium px-3 py-1 rounded bg-accent hover:opacity-90 transition-opacity"
        style={{ color: 'var(--bg-base)' }}
      >
        Check Answer
      </button>

      {doesAnswerMatch !== null && (
        <>
          {doesAnswerMatch ? (
            <span className="flex items-center gap-1 text-xs text-success">
              <IoCheckmarkCircle className="text-sm" />
              Correct!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <IoCloseCircle className="text-sm" />
              Some files don't match
            </span>
          )}
          <button
            onClick={resetAnswer}
            className="text-xs text-content-muted hover:text-content-secondary transition-colors ml-auto"
          >
            Reset
          </button>
        </>
      )}
    </div>
  )
}
