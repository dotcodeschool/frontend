interface QuizOption {
  label: string;
  correct: boolean;
}

export function generateQuizId(
  question: string,
  options: QuizOption[],
): string {
  const str =
    question + "|" + options.map((o) => `${o.label}:${o.correct}`).join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function generateTFQuizId(question: string, correct: boolean): string {
  return generateQuizId(question, [
    { label: "True", correct },
    { label: "False", correct: !correct },
  ]);
}

export function generateFIBQuizId(question: string, answers: string[]): string {
  return generateQuizId(
    question,
    answers.map((a) => ({ label: a, correct: true })),
  );
}
