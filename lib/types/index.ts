export type { MDXComponents as TypeMDXComponents } from "mdx/types";

export type {
  Accountability,
  AnswerOptions,
  PracticeFrequency,
  PracticeFrequencyOptions,
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

export type RepositorySetupStep = {
  title: string;
  code: string | React.ReactElement;
};

type RepositorySetup = {
  id: string;
  kind: string;
  title: string;
  description: string;
  steps: RepositorySetupStep[];
};

type UserInfo = {
  email: string;
  name: string;
  image?: string;
};

// Simplified types replacing the deleted Contentful GraphQL codegen schema

export type Maybe<T> = T | null;

export type Sys = {
  id: string;
};

export type Author = {
  name?: Maybe<string>;
  url?: Maybe<string>;
};

export type Lesson = {
  slug?: Maybe<string>;
  title?: Maybe<string>;
  content?: Maybe<string>;
  sys: Sys;
};

export type SectionLessonsCollection = {
  items: Array<Maybe<Lesson>>;
  total: number;
};

export type Section = {
  title?: Maybe<string>;
  description?: Maybe<string>;
  lessonsCollection?: Maybe<SectionLessonsCollection>;
  sys: Sys;
};

export type CourseModuleSectionsCollection = {
  items: Array<Maybe<Section>>;
  total: number;
};

export type OnMachineCourse = {
  gitRepoTemplate?: Maybe<string>;
};

export type CourseModule = {
  title?: Maybe<string>;
  description?: Maybe<string>;
  author?: Maybe<Author>;
  format?: Maybe<string>;
  formatData?: Maybe<OnMachineCourse>;
  githubUrl?: Maybe<string>;
  language?: Maybe<string>;
  level?: Maybe<string>;
  sectionsCollection?: Maybe<CourseModuleSectionsCollection>;
  slug?: Maybe<string>;
  sys: Sys;
};

export type CourseOverview = {
  slug: string;
  title: string;
  description: string;
  level: string;
  language: string;
  author?: string;
  formats?: {
    hasInBrowser: boolean;
    hasOnMachine: boolean;
    inBrowserSlug?: string;
    onMachineSlug?: string;
  };
};

export * from "./typeFile";
export * from "./typeProgress";
