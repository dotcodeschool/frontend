"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";

import {
  AnswerOptions,
  PracticeFrequencyOptions,
  SetupQuestion,
} from "@/lib/types";

import { createRepository } from "../helpers";
import { StepsComponentProps } from "../types";

import { SetupStep } from "./SetupStep";
import { StepsComponentSkeleton } from "./StepComponentSkeleton";

type UseInitialStateProps = {
  repo: { test_ok?: boolean } | null;
  questions: SetupQuestion[];
};

const updateAnswers = (
  questions: { id: string }[],
  currentStep: number,
  answers: Record<string, boolean | PracticeFrequencyOptions>,
  option: AnswerOptions,
): Record<string, boolean | PracticeFrequencyOptions> => ({
  ...answers,
  [questions[currentStep].id]: option.value,
});

const handleFinalStep = async (
  session: Session,
  setLoadingRepo: (value: boolean) => void,
  setShowRepositorySetup: (value: boolean) => void,
  updatedAnswers: Record<string, boolean | PracticeFrequencyOptions>,
  courseSlug: string,
): Promise<void> => {
  setLoadingRepo(true);
  setShowRepositorySetup(true);
  const repo = await createRepository(session, updatedAnswers, courseSlug);
  if (repo) {
    setLoadingRepo(false);
  }
};

const useInitialState = ({ repo, questions }: UseInitialStateProps) => {
  const [currentStep, setCurrentStep] = useState(repo ? questions.length : 0);
  const [answers, setAnswers] = useState<
    Record<string, boolean | PracticeFrequencyOptions>
  >({});
  const [showRepositorySetup, setShowRepositorySetup] = useState(Boolean(repo));
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [gitPushReceived, setGitPushReceived] = useState(
    repo?.test_ok ?? false,
  );

  return {
    currentStep,
    setCurrentStep,
    answers,
    setAnswers,
    showRepositorySetup,
    setShowRepositorySetup,
    loadingRepo,
    setLoadingRepo,
    gitPushReceived,
    setGitPushReceived,
  };
};

const StepsComponent = ({
  questions,
  repositorySetup,
  startingLessonUrl,
  courseSlug,
  repo,
}: StepsComponentProps) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const {
    currentStep,
    setCurrentStep,
    answers,
    setAnswers,
    showRepositorySetup,
    setShowRepositorySetup,
    loadingRepo,
    setLoadingRepo,
    gitPushReceived,
    setGitPushReceived,
  } = useInitialState({ repo, questions });

  if (isLoading) {
    return <StepsComponentSkeleton />;
  }

  if (!session) {
    throw new Error("No session found!");
  }

  const handleOptionClick = async (option: AnswerOptions) => {
    const updatedAnswers = updateAnswers(
      questions,
      currentStep,
      answers,
      option,
    );
    setAnswers(updatedAnswers);

    if (isLastStep()) {
      await handleFinalStep(
        session,
        setLoadingRepo,
        setShowRepositorySetup,
        updatedAnswers,
        courseSlug,
      );
    } else {
      goToNextStep();
    }
  };

  const isLastStep = () => currentStep >= questions.length - 1;

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const currentQuestion = questions[currentStep];
  const currentStepLabel = `Step ${currentStep + 1} of ${questions.length}`;

  return (
    <Card maxW="lg" mt={24} mx="auto" width="full">
      <CardHeader>
        <Heading size="lg">Course Setup</Heading>
      </CardHeader>
      <CardBody>
        {showRepositorySetup ? (
          <SetupStep
            gitPushReceived={gitPushReceived}
            isLoading={loadingRepo}
            startingLessonUrl={startingLessonUrl}
            step={repositorySetup}
          />
        ) : (
          <SetupStep onOptionClick={handleOptionClick} step={currentQuestion} />
        )}
      </CardBody>
      <CardFooter justifyContent="space-between">
        <Text color="gray.500" fontSize="sm">
          {showRepositorySetup ? "Final Step" : currentStepLabel}
        </Text>
      </CardFooter>
    </Card>
  );
};

export { StepsComponent };
