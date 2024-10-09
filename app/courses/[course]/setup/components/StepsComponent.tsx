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
import { useCallback, useState } from "react";

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

const handleCreateRepository = async (
  session: Session,
  answers: Record<string, AnswerOptions["value"]>,
  courseSlug: string,
  setRepoName: (name: string) => void,
  toast: ReturnType<typeof useToast>,
) => {
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
    repoName,
    setRepoName,
    repoSetupSteps,
  } = useRepositorySetup(initialRepo, repositorySetup, courseSlug);

  const handleOptionClick = useCallback(
    async (option: AnswerOptions) => {
      const updatedAnswers = {
        ...answers,
        [questions[currentStep].id]: option.value,
      };
      setAnswers(updatedAnswers);

      if (currentStep >= questions.length - 1) {
        setShowRepositorySetup(true);
        setLoadingRepo(true);

        try {
          await handleCreateRepository(
            session,
            updatedAnswers,
            courseSlug,
            setRepoName,
            toast,
          );
        } catch (error) {
          // Error is already handled in handleCreateRepository
          console.error("Repository creation failed:", error);
        } finally {
          setLoadingRepo(false);
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    },
    [
      answers,
      courseSlug,
      currentStep,
      questions,
      session,
      setLoadingRepo,
      setRepoName,
      setShowRepositorySetup,
      toast,
    ],
  );

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
            gitPushReceived={false}
            isLoading={loadingRepo}
            repoSetupComplete={false}
            startingLessonUrl={startingLessonUrl}
            steps={repoSetupSteps}
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
