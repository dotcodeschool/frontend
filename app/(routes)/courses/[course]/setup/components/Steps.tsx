"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  VStack,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { HiOutlineCheckCircle } from "react-icons/hi";
import PrimaryButton from "@/app/ui/components/primary-button";
import { SetupQuestion } from "@/app/lib/types";

const RepoSetupStep = ({
  title,
  code,
}: {
  title: string;
  code: React.ReactElement | string;
}) => {
  return (
    <Box bg="gray.800" p={4} borderRadius="md" w="full">
      <Heading size="sm" mb={2}>
        {title}
      </Heading>
      {code}
    </Box>
  );
};

export default function StepsComponent({
  questions,
  startingLessonUrl,
}: {
  questions: SetupQuestion[];
  startingLessonUrl: string;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [gitPushReceived, setGitPushReceived] = useState(false);

  const handleOptionClick = (option: string) => {
    setAnswers({ ...answers, [questions[currentStep].id]: option });
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Form submitted:", answers);
      // Here you would typically send the answers to your backend
    }
  };

  // Simulate receiving a git push after 10 seconds
  setTimeout(() => {
    setGitPushReceived(true);
  }, 10000);

  const currentQuestion = questions[currentStep];

  return (
    <Card maxW="lg" width="full" mx="auto" mt={24}>
      <CardHeader>
        <Heading size="lg">Course Setup</Heading>
      </CardHeader>
      <CardBody>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Heading size="md" mb={2}>
            {currentQuestion.question}
          </Heading>
          <Text color="gray.400" mb={6}>
            {currentQuestion.description}
          </Text>
          {!currentQuestion.isCustom ? (
            <VStack spacing={4}>
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  width="full"
                  justifyContent="flex-start"
                  height="auto"
                  py={3}
                  px={4}
                  _hover={{ bg: "gray.800", color: "white" }}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </VStack>
          ) : (
            <VStack spacing={6} alignItems="start" w="full">
              {currentQuestion.steps?.map((step, index) => (
                <RepoSetupStep
                  key={index}
                  title={step.title}
                  code={step.code}
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
              {gitPushReceived && (
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
      </CardBody>
      <CardFooter justifyContent="space-between">
        <Text fontSize="sm" color="gray.500">
          Step {currentStep + 1} of {questions.length}
        </Text>
      </CardFooter>
    </Card>
  );
}
