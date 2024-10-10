import { SetupQuestion } from "@/lib/types";

export const questions: SetupQuestion[] = [
  {
    id: "practice_frequency",
    kind: "setup_question",
    question: "How often do you intend to practice?",
    description: `Learners that maintain a consistent cadence are most likely to meet their learning objectives.`,
    options: [
      {
        value: "every_day",
        display: "Every day",
      },
      {
        value: "once_a_week",
        display: "Once a week",
      },
      {
        value: "once_a_month",
        display: "Once a month",
      },
    ],
  },
  {
    id: "accountability",
    kind: "setup_question",
    question: "Would you like us to email you occasional friendly nudges?",
    description: `This helps you stay accountable, as well as provides tips on maximising your learning experience.`,
    options: [
      {
        value: true,
        display: "Yes please",
      },
      {
        value: false,
        display: "I'll pass",
      },
    ],
  },
];
