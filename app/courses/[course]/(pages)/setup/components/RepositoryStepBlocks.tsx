import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi";

import { RepositorySetup } from "@/lib/types";

import { MotionButtonPrimary } from "./MotionButtonPrimary";
import { RepoSetupStep } from "./RepoSetupStep";
import { RepoStepLoadingSkeleton } from "./RepoStepLoadingSkeleton";

const RepositorySteps = ({
  steps,
  gitPushReceived,
  startingLessonUrl,
  isLoading,
}: {
  steps: RepositorySetup;
  gitPushReceived: boolean;
  startingLessonUrl?: string;
  isLoading: boolean;
}) =>
  isLoading ? (
    <RepoStepLoadingSkeleton />
  ) : (
    <VStack alignItems="start" spacing={6} w="full">
      {steps.steps.map((repoStep, index) => (
        <RepoSetupStep
          code={repoStep.code}
          key={index}
          title={repoStep.title}
        />
      ))}
      <HStack
        bg="whiteAlpha.100"
        borderRadius="md"
        color="blue.300"
        fontWeight="500"
        gap={1}
        p={4}
        w="full"
      >
        {gitPushReceived ? (
          <>
            <HiOutlineCheckCircle height="20px" width="20px" />
            <Text>Git push received! The first stage is now activated.</Text>
          </>
        ) : (
          <>
            <Spinner mr={2} size="sm" speed="0.8s" />
            <Text>Listening for a git push...</Text>
          </>
        )}
      </HStack>
      {gitPushReceived && startingLessonUrl ? (
        <MotionButtonPrimary as="a" href={startingLessonUrl} w="full">
          Continue
        </MotionButtonPrimary>
      ) : null}
    </VStack>
  );

export { RepositorySteps };
