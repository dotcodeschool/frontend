import { Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { WithId } from "mongodb";
import React, { useEffect, useState } from "react";

import { Repository } from "@/lib/db/models";
import { AnswerOptions, SetupQuestion } from "@/lib/types";

import { QuestionOptions } from "./QuestionOptions";

type SetupStepProps = {
  step: SetupQuestion;
  onOptionClick?: (option: AnswerOptions) => void;
  isLoading?: boolean;
  initialRepo?: WithId<Repository> | null;
};

export const SetupStep: React.FC<SetupStepProps> = ({
  step,
  onOptionClick,
  isLoading,
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

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      initial={{ opacity: 0, y: 20 }}
      key={step.id}
      transition={{ duration: 0.3 }}
    >
      <Heading mb={2} size="md">
        {step.question}
      </Heading>
      <Text color="gray.400" mb={6}>
        {isLoading || !repo ? loadingText : step.description}
      </Text>
      <QuestionOptions onOptionClick={onOptionClick} options={step.options} />
    </motion.div>
  );
};
