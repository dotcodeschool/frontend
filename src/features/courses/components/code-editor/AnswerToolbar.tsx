import { IoCheckmarkCircle, IoCloseCircle, IoEye, IoEyeOff } from 'react-icons/io5'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  editorFiles: CodeFile[]
  solutionFiles: CodeFile[]
}

export function AnswerToolbar({ editorFiles, solutionFiles }: Props) {
  const { doesAnswerMatch, showSolution, checkAnswer, toggleSolution, resetAnswer } = useEditorStore()

  const handleCheck = () => {
    checkAnswer(editorFiles, solutionFiles)
  }

  return (
    <div className="flex flex-col bg-surface border-b border-border shrink-0">
      <div className="flex items-center gap-2 px-3 py-1.5">
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
                Doesn't match
              </span>
            )}

            <button
              onClick={toggleSolution}
              className="flex items-center gap-1 text-xs text-content-muted hover:text-content-secondary transition-colors ml-auto"
            >
              {showSolution ? <IoEyeOff className="text-sm" /> : <IoEye className="text-sm" />}
              {showSolution ? 'Hide Solution' : 'View Solution'}
            </button>

            <button
              onClick={resetAnswer}
              className="text-xs text-content-muted hover:text-content-secondary transition-colors"
            >
              Reset
            </button>
          </>
        )}
      </div>

      {doesAnswerMatch === false && !showSolution && (
        <div className="px-3 pb-1.5 text-[11px] text-content-muted leading-relaxed">
          Note: Minor differences like trailing commas, print statements, or formatting may cause a mismatch even if your solution is technically correct.
        </div>
      )}
    </div>
  )
}
