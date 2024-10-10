import { ObjectId } from "mongodb";

export type { MDXComponents as TypeMDXComponents } from "mdx/types";

export type {
  Accountability,
  AnswerOptions,
  PracticeFrequency,
  PracticeFrequencyOptions,
  Relationship,
  RepositorySetup,
  SetupQuestion,
  UserInfo,
};

type PracticeFrequencyOptions = "every_day" | "once_a_week" | "once_a_month";

type PracticeFrequency = {
  value: PracticeFrequencyOptions;
  display: "Every day" | "Once a week" | "Once a month";
};

type Accountability = {
  value: boolean;
  display: "Yes please" | "I'll pass";
};

type AnswerOptions = PracticeFrequency | Accountability;

type SetupQuestion = {
  id: string;
  kind: "setup_question";
  question: string;
  description: string;
  options: AnswerOptions[];
};

type RepositorySetupStep = { title: string; code: React.ReactElement | string };

type RepositorySetup = {
  id: string;
  kind: "repo_setup";
  title: string;
  description: string;
  steps: RepositorySetupStep[];
};

type Relationship = {
  id: ObjectId;
  type: string;
};

type UserInfo = {
  email: string;
  name: string;
  image?: string;
};

export * from "./contentfulUtils";
export * from "./schema";
export * from "./typeFile";
export * from "./typeProgress";
