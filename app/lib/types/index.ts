export interface PracticeFrequency {
  value: "every_day" | "once_a_week" | "once_a_month";
  display: "Every day" | "Once a week" | "Once a month";
}

export interface Accountability {
  value: boolean;
  display: "Yes please" | "I'll pass";
}

export type AnswerOptions = PracticeFrequency | Accountability;

export interface SetupQuestion {
  id: string;
  question: string;
  description: string;
  options: AnswerOptions[];
}

export interface RepositorySetup {
  id: string;
  title: string;
  description: string;
  steps: { title: string; code: React.ReactElement | string }[];
}
