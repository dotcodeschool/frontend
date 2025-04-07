// app/courses/[course]/(pages)/setup/components/types/index.ts
import { WithId } from "mongodb";

import { Repository } from "@/lib/db/models";
import {
  PracticeFrequencyOptions,
  RepositorySetup,
  SetupQuestion,
} from "@/lib/types";

type CreateRepoRequest = {
  repoTemplate: string;
  userId: string;
  expectedPracticeFrequency: PracticeFrequencyOptions;
  isReminderEnabled: boolean;
};

type StepsComponentProps = {
  questions: SetupQuestion[];
  startingLessonUrl: string;
  courseSlug: string;
  userId: string;
  courseId: string;
  repositorySetup: RepositorySetup;
  initialRepo: WithId<Repository> | null;
};

export type { CreateRepoRequest, StepsComponentProps };