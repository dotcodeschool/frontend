import { IoCheckmarkCircle, IoCloseCircle, IoEye, IoEyeOff } from 'react-icons/io5'
import type { CodeFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  editorFiles: CodeFile[]
  solutionFiles: CodeFile[]
}

// Hardcoded dark colors so toolbar stays dark in light mode
const muted = '#6b7394'
const secondary = '#9ba3be'

export function AnswerToolbar({ editorFiles, solutionFiles }: Props) {
  const { doesAnswerMatch, showSolution, checkAnswer, toggleSolution, resetAnswer } = useEditorStore()

  const handleCheck = () => {
    checkAnswer(editorFiles, solutionFiles)
  }

  return (
    <div className="flex flex-col border-b border-white/[0.06] shrink-0" style={{ background: '#111318' }}>
      <div className="flex items-center gap-2 px-3 py-1.5">
        <button
          onClick={handleCheck}
          className="text-xs font-medium px-3 py-1 rounded hover:opacity-90 transition-opacity"
          style={{ background: '#6b8aed', color: '#0a0c10' }}
        >
          Check Answer
        </button>

        {doesAnswerMatch !== null && (
          <>
            {doesAnswerMatch ? (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#4ade80' }}>
                <IoCheckmarkCircle className="text-sm" />
                Correct!
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs" style={{ color: '#f87171' }}>
                <IoCloseCircle className="text-sm" />
                Doesn't match
              </span>
            )}

            <button
              onClick={toggleSolution}
              className="flex items-center gap-1 text-xs transition-colors ml-auto"
              style={{ color: muted }}
              onMouseEnter={(e) => { e.currentTarget.style.color = secondary }}
              onMouseLeave={(e) => { e.currentTarget.style.color = muted }}
            >
              {showSolution ? <IoEyeOff className="text-sm" /> : <IoEye className="text-sm" />}
              {showSolution ? 'Hide Solution' : 'View Solution'}
            </button>

            <button
              onClick={resetAnswer}
              className="text-xs transition-colors"
              style={{ color: muted }}
              onMouseEnter={(e) => { e.currentTarget.style.color = secondary }}
              onMouseLeave={(e) => { e.currentTarget.style.color = muted }}
            >
              Reset
            </button>
          </>
        )}
      </div>

      {doesAnswerMatch === false && !showSolution && (
        <div className="px-3 pb-1.5 text-[11px] leading-relaxed" style={{ color: muted }}>
          Note: Minor differences like trailing commas, print statements, or formatting may cause a mismatch even if your solution is technically correct.
        </div>
      )}
    </div>
  )
}
