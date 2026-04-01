import { createContext, type ReactNode, useState } from "react";

interface QuizGroupContextType {
  registerQuiz: (id: string) => void;
  updateScore: (id: string, isCorrect: boolean) => void;
}

export const QuizGroupContext = createContext<QuizGroupContextType | null>(
  null,
);

interface Props {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function QuizGroup({ title, description, children }: Props) {
  const [quizIds, setQuizIds] = useState<Set<string>>(new Set());
  const [scores, setScores] = useState<Record<string, boolean>>({});

  const registerQuiz = (id: string) => {
    setQuizIds((prev) => new Set(prev).add(id));
  };

  const updateScore = (id: string, isCorrect: boolean) => {
    setScores((prev) => ({ ...prev, [id]: isCorrect }));
  };

  const totalQuizzes = quizIds.size;
  const completed = Object.keys(scores).length;
  const correctCount = Object.values(scores).filter(Boolean).length;
  const progress = totalQuizzes > 0 ? (completed / totalQuizzes) * 100 : 0;
  const allDone = totalQuizzes > 0 && completed === totalQuizzes;

  const getPerformance = () => {
    const pct = totalQuizzes > 0 ? (correctCount / totalQuizzes) * 100 : 0;
    if (pct === 100) return "Perfect!";
    if (pct >= 80) return "Excellent!";
    if (pct >= 60) return "Good";
    return "Needs Review";
  };

  return (
    <QuizGroupContext.Provider value={{ registerQuiz, updateScore }}>
      <div className="border border-border rounded-lg p-6 my-8">
        {title && (
          <h3 className="font-heading text-xl font-semibold text-content-primary mb-1">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-content-muted text-sm mb-4">{description}</p>
        )}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-content-muted text-xs shrink-0">
            {completed}/{totalQuizzes} completed
          </span>
        </div>
        {children}
        {allDone && (
          <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-baseline gap-4">
              <div>
                <div className="text-content-muted text-xs">Final Score</div>
                <div className="text-2xl font-bold text-content-primary">
                  {correctCount}/{totalQuizzes}
                </div>
              </div>
              <div>
                <div className="text-content-muted text-xs">Performance</div>
                <div className="text-2xl font-bold text-content-primary">
                  {getPerformance()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </QuizGroupContext.Provider>
  );
}
