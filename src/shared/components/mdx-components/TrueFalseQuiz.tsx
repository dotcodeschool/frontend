import { useState, useEffect, useContext } from 'react'
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { generateTFQuizId } from './quiz-utils'
import { QuizGroupContext } from './QuizGroup'

interface Props {
  question: string
  correct: boolean
  explanation: string | React.ReactNode
}

export function TrueFalseQuiz({ question, correct, explanation }: Props) {
  const [selected, setSelected] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const quizId = generateTFQuizId(question, correct)
  const groupCtx = useContext(QuizGroupContext)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('attemptedQuizzes') ?? '{}')
      if (stored[quizId]) {
        setSelected(stored[quizId].selectedOption === 'true')
        setIsCorrect(stored[quizId].isCorrect)
        setSubmitted(true)
        setHasAttempted(true)
      }
    } catch {}
    groupCtx?.registerQuiz(quizId)
  }, [quizId, groupCtx])

  const handleSubmit = () => {
    const result = selected === correct
    setIsCorrect(result)
    setSubmitted(true)
    try {
      const stored = JSON.parse(localStorage.getItem('attemptedQuizzes') ?? '{}')
      stored[quizId] = { selectedOption: String(selected), isCorrect: result, timestamp: Date.now() }
      localStorage.setItem('attemptedQuizzes', JSON.stringify(stored))
    } catch {}
    groupCtx?.updateScore(quizId, result)
  }

  const btnClass = (value: boolean) => {
    let cls = 'flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border '
    if (submitted) {
      if (value === correct) cls += 'border-green-500 bg-green-500/10 text-green-400'
      else if (value === selected && value !== correct) cls += 'border-red-500 bg-red-500/10 text-red-400'
      else cls += 'border-border text-content-faint'
    } else {
      cls += selected === value ? 'border-accent bg-accent-bg text-accent' : 'border-border text-content-muted hover:border-content-faint'
    }
    return cls
  }

  return (
    <div className="border border-border rounded-lg p-6 my-6">
      <h4 className="font-heading text-lg font-semibold text-content-primary mb-4">{question}</h4>
      <div className="flex gap-3 mb-4">
        <button onClick={() => !submitted && setSelected(true)} disabled={submitted} className={btnClass(true)}>
          True {submitted && correct === true && <FaCheckCircle className="inline ml-1 w-3.5 h-3.5" />}
          {submitted && selected === true && !correct && <FaExclamationTriangle className="inline ml-1 w-3.5 h-3.5" />}
        </button>
        <button onClick={() => !submitted && setSelected(false)} disabled={submitted} className={btnClass(false)}>
          False {submitted && correct === false && <FaCheckCircle className="inline ml-1 w-3.5 h-3.5" />}
          {submitted && selected === false && correct && <FaExclamationTriangle className="inline ml-1 w-3.5 h-3.5" />}
        </button>
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={selected === null}
          className="bg-accent text-[var(--bg-base)] px-6 py-2 rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed">
          Submit
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="font-semibold mb-1 text-content-primary">{isCorrect ? 'Correct!' : 'Incorrect'}</div>
          <div className="text-content-secondary">{explanation}</div>
        </div>
      )}
      {hasAttempted && submitted && (
        <p className="text-content-muted text-xs italic mt-3">You've already answered this question.</p>
      )}
    </div>
  )
}
