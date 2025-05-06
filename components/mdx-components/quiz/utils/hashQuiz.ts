import { QuizOption } from "../Quiz";

/**
 * Generates a unique ID for a quiz based on its question and options
 * This is used to track quiz attempts in localStorage
 *
 * @param question The quiz question
 * @param options The quiz options
 * @returns A string hash that uniquely identifies the quiz
 */
export function generateQuizId(
  question: string,
  options: QuizOption[],
): string {
  // Create a string representation of the quiz
  const optionsString = options
    .map((opt) => `${opt.label}:${opt.correct}`)
    .join("|");

  const quizString = `${question}|${optionsString}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < quizString.length; i++) {
    const char = quizString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to a string and ensure it's positive
  return Math.abs(hash).toString(16);
}
