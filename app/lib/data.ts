export const questions = [
  {
    id: "practice-cadence",
    question: "How often do you intend to practice?",
    description:
      "Learners that maintain a consistent cadence are most likely to meet their learning objectives.",
    options: [
      "Every day",
      "Few times a week",
      "Once a week",
      "Few times a month",
      "Once a month",
    ],
  },
  {
    id: "accountability",
    question: "Would you like us to email you occasional friendly nudges?",
    description:
      "This helps you stay accountable, as well as provides tips on maximising your learning experience.",
    options: ["Yes please", "I'll pass"],
  },
  {
    id: "repository-setup",
    question: "Repository Setup",
    description:
      "We've prepared a starter repository with some Rust code for you.",
    isCustom: true,
    steps: [
      {
        title: "1. Clone the repository",
        code: "```bash\ngit clone https://git.dotcodeschool.com/c03cd646f5dd167f dotcodeschool-rust-state-machine\ncd codecrafters-git-rust\n```",
      },
      {
        title: "2. Push an empty commit",
        code: "```bash\ngit commit --allow-empty -m 'test'\ngit push origin master\n```",
      },
    ],
  },
];
