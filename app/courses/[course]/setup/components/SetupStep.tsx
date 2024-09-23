import { Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";

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
};

// typeguard to narrow step type
const checkSetupQuestion = (
  step: SetupQuestion | RepositorySetup,
): step is SetupQuestion => step.kind === "setup_question";

export const SetupStep: React.FC<SetupStepProps> = ({
  step,
  onOptionClick,
  isLoading,
  gitPushReceived = false,
  startingLessonUrl,
}) => {
  const loadingText = `
  We're setting up your repository... It shouldn't take too long.`;
  const isSetupQuestion = checkSetupQuestion(step);
  const renderContent = () => {
    if (isSetupQuestion) {
      return (
        <QuestionOptions onOptionClick={onOptionClick} options={step.options} />
      );
    }

    if (isLoading) {
      return <RepoStepLoadingSkeleton />;
    }

    return (
      <RepositorySteps
        gitPushReceived={gitPushReceived}
        startingLessonUrl={startingLessonUrl}
        steps={step.steps}
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
        {isLoading ? loadingText : step.description}
      </Text>
      {renderContent()}
    </motion.div>
  );
};
