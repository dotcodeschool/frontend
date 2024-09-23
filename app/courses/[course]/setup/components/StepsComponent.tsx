"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { AnswerOptions, PracticeFrequencyOptions } from "@/lib/types";

import { createRepository } from "../helpers";
import { StepsComponentProps } from "../types";

import { SetupStep } from "./SetupStep";

const StepsComponent = ({
  questions,
  repositorySetup,
  startingLessonUrl,
  courseSlug,
}: StepsComponentProps) => {
  const { data: session } = useSession();

  if (!session) {
    throw new Error("No session found!");
  }

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showRepositorySetup, setShowRepositorySetup] = useState(false);
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [gitPushReceived, setGitPushReceived] = useState(false);

  const handleOptionClick = async (option: AnswerOptions) => {
    const updatedAnswers = updateAnswers(option);
    if (isLastStep()) {
      await handleFinalStep(updatedAnswers);
    } else {
      goToNextStep();
    }
  };

  const updateAnswers = (option: AnswerOptions) => {
    const updatedAnswers = {
      ...answers,
      [questions[currentStep].id]: option.value,
    };
    setAnswers(updatedAnswers);

    return updatedAnswers;
  };

  const isLastStep = () => currentStep >= questions.length - 1;

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleFinalStep = async (
    updatedAnswers: Record<string, boolean | PracticeFrequencyOptions>,
  ) => {
    setLoadingRepo(true);
    setShowRepositorySetup(true);
    const repo = await createRepository(session, updatedAnswers, courseSlug);
    if (repo) {
      setLoadingRepo(false);
    }
  };

  // Simulate receiving a git push after 10 seconds
  if (showRepositorySetup) {
    setTimeout(() => {
      setLoadingRepo(false);
    }, 2000);
    setTimeout(() => {
      setGitPushReceived(true);
    }, 10000);
  }

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
