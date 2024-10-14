import { ObjectId, WithId } from "mongodb";

import { Repository } from "@/lib/db/models";
import {
  PracticeFrequencyOptions,
  RepositorySetup,
  SetupQuestion,
} from "@/lib/types";

type CreateRepoRequest = {
  repoTemplate: string;
  userId: ObjectId;
  expectedPracticeFrequency: PracticeFrequencyOptions;
  isReminderEnabled: boolean;
};

type StepsComponentProps = {
  questions: SetupQuestion[];
  startingLessonUrl: string;
  courseSlug: string;
  userId: ObjectId;
  courseId: ObjectId;
  repositorySetup: RepositorySetup;
  initialRepo: WithId<Repository> | null;
};

export type { CreateRepoRequest, StepsComponentProps };
