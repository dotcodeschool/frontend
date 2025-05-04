"use client";

import React, { useState, useEffect } from "react";
import { useQuizGroup } from "./QuizGroup";
import {
  Box,
  Text,
  Button,
  Flex,
  useColorModeValue,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SlideFade,
  ButtonGroup,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { generateQuizId } from "./utils/hashQuiz";

export type TrueFalseQuizProps = {
  question: string;
  correct: boolean;
  explanation: string | React.ReactNode;
};

export const TrueFalseQuiz: React.FC<TrueFalseQuizProps> = ({
  question,
  correct,
  explanation,
}) => {
  const [selectedOption, setSelectedOption] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [quizId, setQuizId] = useState<string>("");
  
  // Try to use QuizGroup context if available
  let quizGroupContext;
  try {
    // This will throw an error if not used within a QuizGroup
    quizGroupContext = useQuizGroup();
  } catch (error) {
    // Not within a QuizGroup, continue without that functionality
    quizGroupContext = undefined;
  }

  // Colors for theming
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  const correctBgColor = useColorModeValue("green.50", "green.900");
  const incorrectBgColor = useColorModeValue("red.50", "red.900");
  const textColor = useColorModeValue("gray.800", "white");

  // Generate a unique ID for this quiz based on the question and correct answer
  useEffect(() => {
    const id = generateQuizId(question, [
      { label: "True", correct },
      { label: "False", correct: !correct },
    ]);
    setQuizId(id);

    // Register with QuizGroup if available
    if (quizGroupContext) {
      quizGroupContext.registerQuiz(id);
    }

    // Check if this quiz has been attempted before
    const attemptedQuizzes = JSON.parse(
      localStorage.getItem("attemptedQuizzes") || "{}"
    );
    
    if (attemptedQuizzes[id]) {
      setHasAttempted(true);
      setSelectedOption(attemptedQuizzes[id].selectedOption);
      setIsSubmitted(true);
      setIsCorrect(attemptedQuizzes[id].isCorrect);
      
      // Update QuizGroup score if available
      if (quizGroupContext) {
        quizGroupContext.updateScore(id, attemptedQuizzes[id].isCorrect);
      }
    }
  }, [question, correct, quizGroupContext]);

  const handleOptionChange = (value: boolean) => {
    if (!isSubmitted) {
      setSelectedOption(value);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;

    const isAnswerCorrect = selectedOption === correct;
    
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
    
    // Save to localStorage
    const attemptedQuizzes = JSON.parse(
      localStorage.getItem("attemptedQuizzes") || "{}"
    );
    
    attemptedQuizzes[quizId] = {
      selectedOption,
      isCorrect: isAnswerCorrect,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem("attemptedQuizzes", JSON.stringify(attemptedQuizzes));
    
    // Update QuizGroup score if available
    if (quizGroupContext) {
      quizGroupContext.updateScore(quizId, isAnswerCorrect);
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      p={6}
      mb={8}
      bg={bgColor}
      boxShadow="md"
      position="relative"
      overflow="hidden"
    >
      {/* Quiz header */}
      <Heading as="h3" size="md" mb={4} color={textColor}>
        {question}
      </Heading>

      {/* True/False options */}
      <ButtonGroup spacing={4} mb={6} width="100%">
        <Button
          colorScheme={
            isSubmitted
              ? selectedOption === true
                ? correct
                  ? "green"
                  : "red"
                : correct
                ? "green"
                : "gray"
              : selectedOption === true
              ? "blue"
              : "gray"
          }
          variant={selectedOption === true ? "solid" : "outline"}
          onClick={() => handleOptionChange(true)}
          isDisabled={isSubmitted}
          flex="1"
        >
          True
          {isSubmitted && correct && (
            <CheckCircleIcon ml={2} color="green.500" />
          )}
          {isSubmitted && !correct && selectedOption === true && (
            <WarningIcon ml={2} color="red.500" />
          )}
        </Button>
        <Button
          colorScheme={
            isSubmitted
              ? selectedOption === false
                ? !correct
                  ? "green"
                  : "red"
                : !correct
                ? "green"
                : "gray"
              : selectedOption === false
              ? "blue"
              : "gray"
          }
          variant={selectedOption === false ? "solid" : "outline"}
          onClick={() => handleOptionChange(false)}
          isDisabled={isSubmitted}
          flex="1"
        >
          False
          {isSubmitted && !correct && (
            <CheckCircleIcon ml={2} color="green.500" />
          )}
          {isSubmitted && correct && selectedOption === false && (
            <WarningIcon ml={2} color="red.500" />
          )}
        </Button>
      </ButtonGroup>

      {/* Submit button */}
      {!isSubmitted ? (
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={selectedOption === null}
          width={{ base: "100%", md: "auto" }}
        >
          Submit Answer
        </Button>
      ) : (
        <SlideFade in={isSubmitted} offsetY="20px">
          <Alert
            status={isCorrect ? "success" : "error"}
            variant="subtle"
            flexDirection="column"
            alignItems="flex-start"
            borderRadius="md"
            p={4}
            mt={4}
          >
            <Flex>
              <AlertIcon boxSize="24px" mr={2} />
              <AlertTitle fontSize="lg">
                {isCorrect ? "Correct!" : "Not quite right"}
              </AlertTitle>
            </Flex>
            <AlertDescription mt={2}>
              {typeof explanation === "string" ? (
                <Text>{explanation}</Text>
              ) : (
                explanation
              )}
            </AlertDescription>
          </Alert>
        </SlideFade>
      )}

      {/* Already attempted message */}
      {hasAttempted && (
        <Text
          fontSize="sm"
          color="gray.500"
          mt={4}
          fontStyle="italic"
          textAlign="right"
        >
          You've already answered this question
        </Text>
      )}
    </Box>
  );
};

export default TrueFalseQuiz;
