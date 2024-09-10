"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
} from "@chakra-ui/react";
import { AnswerOptions, SetupQuestion } from "@/app/lib/types";
import { SetupStep } from "./SetupStep";

export default function StepsComponent({
  questions,
  repositorySetup,
  startingLessonUrl,
}: {
  questions: SetupQuestion[];
  repositorySetup: {
    id: string;
    title: string;
    description: string;
    steps: { title: string; code: React.ReactElement | string }[];
  };
  startingLessonUrl: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showRepositorySetup, setShowRepositorySetup] = useState(false);
  const [gitPushReceived, setGitPushReceived] = useState(false);

  const handleOptionClick = (option: AnswerOptions) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option.value });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowRepositorySetup(true);
    }
  };

  console.log("Answers:", answers);

  // Simulate receiving a git push after 10 seconds
  if (showRepositorySetup) {
    setTimeout(() => {
      setGitPushReceived(true);
    }, 10000);
  }

  const currentQuestion = questions[currentStep];

  return (
    <Card maxW="lg" width="full" mx="auto" mt={24}>
      <CardHeader>
        <Heading size="lg">Course Setup</Heading>
      </CardHeader>
      <CardBody>
        {!showRepositorySetup ? (
          <SetupStep step={currentQuestion} onOptionClick={handleOptionClick} />
        ) : (
          <SetupStep
            step={repositorySetup}
            isRepositorySetup={true}
            gitPushReceived={gitPushReceived}
            startingLessonUrl={startingLessonUrl}
          />
        )}
      </CardBody>
      <CardFooter justifyContent="space-between">
        <Text fontSize="sm" color="gray.500">
          {!showRepositorySetup
            ? `Step ${currentStep + 1} of ${questions.length}`
            : "Final Step"}
        </Text>
      </CardFooter>
    </Card>
  );
}
