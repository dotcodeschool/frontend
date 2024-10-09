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
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Repository } from "@/lib/db/models";
import { AnswerOptions, SetupQuestion, RepositorySetup } from "@/lib/types";

import { createRepository } from "../helpers";

import { RepositorySteps } from "./RepositoryStepBlocks";
import { SetupStep } from "./SetupStep";
import { StepsComponentSkeleton } from "./StepComponentSkeleton";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { MDXComponents } from "@/components/mdx-components";

interface StepsComponentProps {
  questions: SetupQuestion[];
  startingLessonUrl: string;
  courseSlug: string;
  initialRepo: WithId<Repository> | null;
  userId: ObjectId;
  repositorySetup: RepositorySetup;
  courseId: ObjectId;
}

const StepsComponent: React.FC<StepsComponentProps> = ({
  questions,
  startingLessonUrl,
  courseSlug,
  initialRepo,
  userId,
  repositorySetup,
  courseId,
}) => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [showRepositorySetup, setShowRepositorySetup] = useState(
    Boolean(initialRepo),
  );
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [answers, setAnswers] = useState<
    Record<string, AnswerOptions["value"]>
  >({});
  const [repoName, setRepoName] = useState<string>();
  const [repo, setRepo] = useState<WithId<Repository> | null>(initialRepo);
  const [repoSetupSteps, setRepoSetupSteps] =
    useState<RepositorySetup>(repositorySetup);

  useEffect(() => {
    if (initialRepo) {
      setRepo(initialRepo);
      setShowRepositorySetup(true);
    } else if (repoName) {
      const x = async () => {
        const mdxSource = await serialize(`\`\`\`bash
        git clone https://git.dotcodeschool.com/${repoName} dotcodeschool-${courseSlug}\ncd dotcodeschool-${courseSlug}
        \`\`\``);
        const code = <MDXRemote {...mdxSource} components={MDXComponents} />;
        const updatedSteps = repositorySetup.steps.map((step, index) =>
          index === 1
            ? {
                title: step.title,
                code,
              }
            : step,
        );
        setRepoSetupSteps((prev) => ({
          ...prev,
          steps: updatedSteps,
        }));
      }
      x()
    }
  }, [initialRepo, repoName]);

  useEffect(() => {
    console.log("STATE repo:", repo);
  }, [repo]);

  if (isLoading || !session) {
    return <StepsComponentSkeleton />;
  }

  const handleOptionClick = async (option: AnswerOptions) => {
    const updatedAnswers = {
      ...answers,
      [questions[currentStep].id]: option.value,
    };
    setAnswers(updatedAnswers);

    if (currentStep >= questions.length - 1) {
      setShowRepositorySetup(true);
      setLoadingRepo(true);
      try {
        const createdRepo = await createRepository(
          session,
          updatedAnswers,
          courseSlug,
        );
        if (typeof createdRepo?.repo_name === "string") {
          setRepoName(createdRepo?.repo_name);
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
      } finally {
        setLoadingRepo(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
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
          <RepositorySteps
            gitPushReceived={false}
            repoSetupComplete={false}
            startingLessonUrl={startingLessonUrl}
            steps={repoSetupSteps}
            isLoading={loadingRepo}
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
