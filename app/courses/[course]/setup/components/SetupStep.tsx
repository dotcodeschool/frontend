import { Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ObjectId, WithId } from "mongodb";
import React, { useEffect, useState } from "react";

import { Repository } from "@/lib/db/models";
import { AnswerOptions, RepositorySetup, SetupQuestion } from "@/lib/types";

import { QuestionOptions } from "./QuestionOptions";
import { RepositorySteps } from "./RepositoryStepBlocks";
import { RepoStepLoadingSkeleton } from "./RepoStepLoadingSkeleton";

type SetupStepProps = {
  step: SetupQuestion | RepositorySetup;
  onOptionClick?: (option: AnswerOptions) => void;
  isLoading?: boolean;
  gitPushReceived?: boolean;
  startingLessonUrl?: string;
  repoSetupComplete?: boolean;
  courseSlug?: string;
  userId?: ObjectId;
  courseId?: ObjectId;
  initialRepo?: WithId<Repository> | null;
};

const checkSetupQuestion = (
  step: SetupQuestion | RepositorySetup,
): step is SetupQuestion => step.kind === "setup_question";

export const SetupStep: React.FC<SetupStepProps> = ({
  step,
  onOptionClick,
  isLoading,
  gitPushReceived = false,
  startingLessonUrl,
  repoSetupComplete = false,
  courseSlug,
  userId,
  courseId,
  initialRepo,
}) => {
  const [repo, setRepo] = useState<WithId<Repository> | null>(
    initialRepo ?? null,
  );
  const loadingText = `We're setting up your repository... It shouldn't take too long.`;

  useEffect(() => {
    if (initialRepo) {
      setRepo(initialRepo);
    }
  }, [initialRepo]);

  const isSetupQuestion = checkSetupQuestion(step);

  const renderContent = () => {
    if (isSetupQuestion) {
      return (
        <QuestionOptions onOptionClick={onOptionClick} options={step.options} />
      );
    }

    if (isLoading || !courseSlug || !repo) {
      return <RepoStepLoadingSkeleton />;
    }

    return (
      <RepositorySteps
        gitPushReceived={gitPushReceived}
        repoSetupComplete={repoSetupComplete}
        startingLessonUrl={startingLessonUrl}
        steps={(step as RepositorySetup).steps}
      />
    );
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
      key={step.id}
      transition={{ duration: 0.3 }}
    >
      <Heading mb={2} size="md">
        {isSetupQuestion ? step.question : step.title}
      </Heading>
      <Text color="gray.400" mb={6}>
        {isLoading || !repo ? loadingText : step.description}
      </Text>
      {renderContent()}
    </motion.div>
  );
};
