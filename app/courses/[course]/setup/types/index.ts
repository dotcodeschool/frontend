import { ObjectId, WithId } from "mongodb";

import { Repository } from "@/lib/db/models";
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
  repo: WithId<Repository> | null;
};

export type { CreateRepoRequest, StepsComponentProps };
