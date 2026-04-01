import { useContext, useEffect, useState } from "react";

import { generateFIBQuizId } from "./quiz-utils";
import { QuizGroupContext } from "./QuizGroup";

interface Props {
  question: string;
  answers: string[];
  caseSensitive?: boolean;
  explanation: string | React.ReactNode;
  placeholder?: string;
}

export function FillInTheBlankQuiz({
  question,
  answers,
  caseSensitive = false,
  explanation,
  placeholder = "Type your answer here",
}: Props) {
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const quizId = generateFIBQuizId(question, answers);
  const groupCtx = useContext(QuizGroupContext);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("attemptedQuizzes") ?? "{}",
      );
      if (stored[quizId]) {
        setUserAnswer(stored[quizId].selectedOption);
        setIsCorrect(stored[quizId].isCorrect);
        setSubmitted(true);
        setHasAttempted(true);
      }
    } catch {}
    groupCtx?.registerQuiz(quizId);
  }, [quizId, groupCtx]);

  const checkAnswer = (input: string) => {
    return answers.some((a) =>
      caseSensitive
        ? a === input.trim()
        : a.toLowerCase() === input.trim().toLowerCase(),
    );
  };

  const handleSubmit = () => {
    const result = checkAnswer(userAnswer);
    setIsCorrect(result);
    setSubmitted(true);
    try {
      const stored = JSON.parse(
        localStorage.getItem("attemptedQuizzes") ?? "{}",
      );
      stored[quizId] = {
        selectedOption: userAnswer,
        isCorrect: result,
        timestamp: Date.now(),
      };
      localStorage.setItem("attemptedQuizzes", JSON.stringify(stored));
    } catch {}
    groupCtx?.updateScore(quizId, result);
  };

  return (
    <div className="border border-border rounded-lg p-6 my-6">
      <h4 className="font-heading text-lg font-semibold text-content-primary mb-4">
        {question}
      </h4>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => !submitted && setUserAnswer(e.target.value)}
        disabled={submitted}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-transparent text-content-primary mb-4 transition-colors ${
          submitted
            ? isCorrect
              ? "border-green-500"
              : "border-red-500"
            : "border-border focus:border-accent focus:outline-none"
        }`}
      />
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim()}
          className="bg-accent text-[var(--bg-base)] px-6 py-2 rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      ) : (
        <div
          className={`mt-4 p-4 rounded-lg text-sm ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}
        >
          <div className="font-semibold mb-1 text-content-primary">
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          {!isCorrect && (
            <p className="text-content-muted mb-2">
              Acceptable answers: {answers.join(", ")}
            </p>
          )}
          <div className="text-content-secondary">{explanation}</div>
        </div>
      )}
      {hasAttempted && submitted && (
        <p className="text-content-muted text-xs italic mt-3">
          You've already answered this question.
        </p>
      )}
    </div>
  );
}
