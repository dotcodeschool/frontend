"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ObjectId, WithId } from "mongodb";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { Repository } from "@/lib/db/models";
import { AnswerOptions, SetupQuestion, RepositorySetup } from "@/lib/types";

import { createRepository } from "../helpers";
import { useRepositorySetup } from "../hooks";

import { RepositorySteps } from "./RepositoryStepBlocks";
import { SetupStep } from "./SetupStep";
import { StepsComponentSkeleton } from "./StepComponentSkeleton";

type StepsComponentProps = {
  questions: SetupQuestion[];
  startingLessonUrl: string;
  courseSlug: string;
  initialRepo: WithId<Repository> | null;
  userId: ObjectId;
  repositorySetup: RepositorySetup;
  courseId: ObjectId;
};

type RepositorySetupContext = {
  session: Session | null;
  answers: Record<string, AnswerOptions["value"]>;
  courseSlug: string;
  setShowRepositorySetup: (show: boolean) => void;
  setLoadingRepo: (loading: boolean) => void;
  setRepoName: (name: string) => void;
  toast: ReturnType<typeof useToast>;
};

const handleRepositorySetup = async (context: RepositorySetupContext) => {
  const {
    setShowRepositorySetup,
    setLoadingRepo,
    session,
    answers,
    courseSlug,
    setRepoName,
    toast,
  } = context;

  setShowRepositorySetup(true);
  setLoadingRepo(true);

  try {
    await handleCreateRepository(
      session,
      answers,
      courseSlug,
      setRepoName,
      toast,
    );
  } catch (error) {
    console.error("Repository setup failed:", error);
  } finally {
    setLoadingRepo(false);
  }
};

const handleCreateRepository = async (
  session: Session | null,
  answers: Record<string, AnswerOptions["value"]>,
  courseSlug: string,
  setRepoName: (name: string) => void,
  toast: ReturnType<typeof useToast>,
) => {
  if (!session) {
    toast({
      title: "Session error",
      description: "No active session found",
      status: "error",
      duration: 5000,
      isClosable: true,
    });

    throw new Error("No active session");
  }

  try {
    const createdRepo = await createRepository(session, answers, courseSlug);
    if (typeof createdRepo?.repo_name === "string") {
      setRepoName(createdRepo.repo_name);
      toast({
        title: "Repository created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      throw new Error("Invalid repository name received");
    }
  } catch (error) {
    console.error("Failed to create repository:", error);
    toast({
      title: "Failed to create repository",
      description:
        error instanceof Error ? error.message : "Unknown error occurred",
      status: "error",
      duration: 5000,
      isClosable: true,
    });

    throw error;
  }
};

const useOptionClickHandler =
  ({
    questions,
    currentStep,
    setCurrentStep,
    answers,
    setAnswers,
    handleRepositorySetup,
    session,
    courseSlug,
    setShowRepositorySetup,
    setLoadingRepo,
    setRepoName,
    toast,
  }: {
    questions: SetupQuestion[];
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    answers: Record<string, AnswerOptions["value"]>;
    setAnswers: React.Dispatch<
      React.SetStateAction<Record<string, AnswerOptions["value"]>>
    >;
    handleRepositorySetup: (context: RepositorySetupContext) => Promise<void>;
    session: Session | null;
    courseSlug: string;
    setShowRepositorySetup: (show: boolean) => void;
    setLoadingRepo: (loading: boolean) => void;
    setRepoName: (name: string) => void;
    toast: ReturnType<typeof useToast>;
  }) =>
  (option: AnswerOptions) => {
    const updatedAnswers = {
      ...answers,
      [questions[currentStep].id]: option.value,
    };
    setAnswers(updatedAnswers);

    if (currentStep >= questions.length - 1) {
      void handleRepositorySetup({
        session,
        answers: updatedAnswers,
        courseSlug,
        setShowRepositorySetup,
        setLoadingRepo,
        setRepoName,
        toast,
      });
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

const StepsComponent: React.FC<StepsComponentProps> = ({
  questions,
  startingLessonUrl,
  courseSlug,
  initialRepo,
  repositorySetup,
}) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, AnswerOptions["value"]>
  >({});

  const {
    showRepositorySetup,
    setShowRepositorySetup,
    loadingRepo,
    setLoadingRepo,
    setRepoName,
    repoSetupSteps,
    gitPushReceived,
  } = useRepositorySetup(initialRepo, repositorySetup, courseSlug);

  const handleOptionClick = useOptionClickHandler({
    questions,
    currentStep,
    setCurrentStep,
    answers,
    setAnswers,
    handleRepositorySetup,
    session,
    courseSlug,
    setShowRepositorySetup,
    setLoadingRepo,
    setRepoName,
    toast,
  });

  if (isLoading || !session) {
    return <StepsComponentSkeleton />;
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
          <RepositorySteps
            gitPushReceived={gitPushReceived}
            isLoading={loadingRepo}
            startingLessonUrl={startingLessonUrl}
            steps={repoSetupSteps}
          />
        ) : (
          <SetupStep
            onOptionClick={(option) => {
              handleOptionClick(option);

              return Promise.resolve();
            }}
            step={currentQuestion}
          />
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
