import React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import { motion } from "framer-motion";
import PrimaryButton from "@/app/ui/components/primary-button";
import { AnswerOptions, RepositorySetup, SetupQuestion } from "@/app/lib/types";

interface SetupStepProps {
  step: SetupQuestion | RepositorySetup;
  // eslint-disable-next-line no-unused-vars
  onOptionClick?: (option: AnswerOptions) => void;
  isRepositorySetup?: boolean;
  gitPushReceived?: boolean;
  startingLessonUrl?: string;
}

const RepoSetupStep = ({
  title,
  code,
}: {
  title: string;
  code: React.ReactElement | string;
}) => (
  <Box bg="gray.800" p={4} borderRadius="md" w="full">
    <Heading size="sm" mb={2}>
      {title}
    </Heading>
    {code}
  </Box>
);

export const SetupStep: React.FC<SetupStepProps> = ({
  step,
  onOptionClick,
  isRepositorySetup = false,
  gitPushReceived = false,
  startingLessonUrl,
}) => {
  return (
    <motion.div
      key={step.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Heading size="md" mb={2}>
        {isRepositorySetup
          ? (step as RepositorySetup).title
          : (step as SetupQuestion).question}
      </Heading>
      <Text color="gray.400" mb={6}>
        {step.description}
      </Text>
      {!isRepositorySetup ? (
        <VStack spacing={4}>
          {(step as SetupQuestion).options?.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              width="full"
              justifyContent="flex-start"
              height="auto"
              py={3}
              px={4}
              _hover={{ bg: "gray.800", color: "white" }}
              onClick={() => onOptionClick && onOptionClick(option)}
            >
              {option.display}
            </Button>
          ))}
        </VStack>
      ) : (
        <VStack spacing={6} alignItems="start" w="full">
          {(
            step as {
              steps: { title: string; code: React.ReactElement | string }[];
            }
          ).steps.map((repoStep, index) => (
            <RepoSetupStep
              key={index}
              title={repoStep.title}
              code={repoStep.code}
            />
          ))}
          <HStack
            gap={1}
            w="full"
            bg="whiteAlpha.100"
            color="blue.300"
            p={4}
            borderRadius="md"
            fontWeight="500"
          >
            {gitPushReceived ? (
              <>
                <HiOutlineCheckCircle height="20px" width="20px" />
                <Text>
                  Git push received! The first stage is now activated.
                </Text>
              </>
            ) : (
              <>
                <Spinner mr={2} size="sm" speed="0.8s" />
                <Text>Listening for a git push...</Text>
              </>
            )}
          </HStack>
          {gitPushReceived && startingLessonUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PrimaryButton w="full" as="a" href={startingLessonUrl}>
                Continue
              </PrimaryButton>
            </motion.div>
          )}
        </VStack>
      )}
    </motion.div>
  );
};
