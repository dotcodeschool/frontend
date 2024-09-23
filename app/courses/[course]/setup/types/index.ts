import { ObjectId } from "mongodb";

import { PracticeFrequencyOptions, SetupQuestion } from "@/lib/types";

type CreateRepoRequest = {
  repoTemplate: string;
  userId: ObjectId;
  expectedPracticeFrequency: PracticeFrequencyOptions;
  isReminderEnabled: boolean;
};

type StepsComponentProps = {
  questions: SetupQuestion[];
  repositorySetup: {
    id: string;
    kind: "repo_setup";
    title: string;
    description: string;
    steps: { title: string; code: React.ReactElement | string }[];
  };
  startingLessonUrl: string;
  courseSlug: string;
};

export type { CreateRepoRequest, StepsComponentProps };
