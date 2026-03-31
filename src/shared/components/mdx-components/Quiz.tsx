import { useState, useEffect, useContext } from 'react'
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { generateQuizId } from './quiz-utils'
import { QuizGroupContext } from './QuizGroup'

interface QuizOption {
  label: string
  correct: boolean
}

interface Props {
  question: string
  type: 'multipleChoice' | 'trueFalse' | 'fillInTheBlank'
  options: QuizOption[]
  explanation: string | React.ReactNode
}

export function Quiz({ question, options, explanation }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)
  const quizId = generateQuizId(question, options)
  const groupCtx = useContext(QuizGroupContext)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('attemptedQuizzes') ?? '{}')
      if (stored[quizId]) {
        setSelected(stored[quizId].selectedOption)
        setIsCorrect(stored[quizId].isCorrect)
        setSubmitted(true)
        setHasAttempted(true)
      }
    } catch {}
    groupCtx?.registerQuiz(quizId)
  }, [quizId])

  const handleSubmit = () => {
    const correct = options.find(o => o.label === selected)?.correct ?? false
    setIsCorrect(correct)
    setSubmitted(true)
    try {
      const stored = JSON.parse(localStorage.getItem('attemptedQuizzes') ?? '{}')
      stored[quizId] = { selectedOption: selected, isCorrect: correct, timestamp: Date.now() }
      localStorage.setItem('attemptedQuizzes', JSON.stringify(stored))
    } catch {}
    groupCtx?.updateScore(quizId, correct)
  }

  return (
    <div className="border border-border rounded-lg p-6 my-6">
      <h4 className="font-heading text-lg font-semibold text-content-primary mb-4">{question}</h4>
      <div className="space-y-2 mb-4">
        {options.map((opt) => {
          const isSelected = selected === opt.label
          let optClasses = 'border border-border rounded-lg px-4 py-3 cursor-pointer transition-all text-sm'
          if (submitted) {
            if (opt.correct) optClasses += ' border-green-500 bg-green-500/10'
            else if (isSelected && !opt.correct) optClasses += ' border-red-500 bg-red-500/10'
            else optClasses += ' opacity-60'
          } else {
            optClasses += isSelected ? ' border-accent bg-accent-bg' : ' hover:border-content-faint'
          }
          return (
            <label key={opt.label} className={optClasses}>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name={quizId}
                  value={opt.label}
                  checked={isSelected}
                  onChange={() => !submitted && setSelected(opt.label)}
                  disabled={submitted}
                  className="accent-accent"
                />
                <span className="text-content-secondary flex-1">{opt.label}</span>
                {submitted && opt.correct && <FaCheckCircle className="text-green-500 w-4 h-4" />}
                {submitted && isSelected && !opt.correct && <FaExclamationTriangle className="text-red-500 w-4 h-4" />}
              </div>
            </label>
          )
        })}
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="bg-accent text-[var(--bg-base)] px-6 py-2 rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Submit
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="font-semibold mb-1 text-content-primary">{isCorrect ? 'Correct!' : 'Incorrect'}</div>
          <div className="text-content-secondary">{explanation}</div>
        </div>
      )}
      {hasAttempted && submitted && (
        <p className="text-content-faint text-xs italic mt-3">You've already answered this question.</p>
      )}
    </div>
  )
}
