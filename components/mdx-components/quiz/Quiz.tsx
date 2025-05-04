"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuizGroup } from "./QuizGroup";
import {
  Box,
  Text,
  VStack,
  Button,
  RadioGroup,
  Radio,
  Flex,
  useColorModeValue,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  SlideFade,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { generateQuizId } from "./utils/hashQuiz";

export type QuizOption = {
  label: string;
  correct: boolean;
};

export type QuizProps = {
  question: string;
  type: "multipleChoice" | "trueFalse" | "fillInTheBlank";
  options: QuizOption[];
  explanation: string | React.ReactNode;
};

export const Quiz: React.FC<QuizProps> = ({
  question,
  type = "multipleChoice",
  options,
  explanation,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<QuizOption[]>([]);
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

  // Generate a unique ID for this quiz based on the question and options
  useEffect(() => {
    const id = generateQuizId(question, options);
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
  }, [question, options, quizGroupContext]);

  // Set options
  useEffect(() => {
    setShuffledOptions([...options]);
  }, [options]);

  const handleOptionChange = (value: string) => {
    if (!isSubmitted) {
      setSelectedOption(value);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;

    const selectedIdx = parseInt(selectedOption, 10);
    const isAnswerCorrect = shuffledOptions[selectedIdx].correct;
    
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

      {/* Options */}
      <RadioGroup
        onChange={handleOptionChange}
        value={selectedOption || ""}
        mb={6}
      >
        <VStack align="stretch" spacing={3}>
          {shuffledOptions.map((option, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={3}
              cursor={isSubmitted ? "default" : "pointer"}
              borderColor={
                isSubmitted
                  ? selectedOption === index.toString()
                    ? option.correct
                      ? "green.500"
                      : "red.500"
                    : option.correct
                    ? "green.500"
                    : borderColor
                  : borderColor
              }
              bg={
                isSubmitted
                  ? selectedOption === index.toString()
                    ? option.correct
                      ? correctBgColor
                      : incorrectBgColor
                    : option.correct
                    ? correctBgColor
                    : bgColor
                  : bgColor
              }
              _hover={
                !isSubmitted
                  ? {
                      bg: hoverBgColor,
                      borderColor: "blue.300",
                    }
                  : {}
              }
              transition="all 0.2s"
            >
              <Radio
                value={index.toString()}
                isDisabled={isSubmitted}
                colorScheme={
                  isSubmitted
                    ? option.correct
                      ? "green"
                      : selectedOption === index.toString()
                      ? "red"
                      : "gray"
                    : "blue"
                }
              >
                <Flex align="center">
                  <Text>{option.label}</Text>
                  {isSubmitted && option.correct && (
                    <CheckCircleIcon ml={2} color="green.500" />
                  )}
                  {isSubmitted &&
                    !option.correct &&
                    selectedOption === index.toString() && (
                      <WarningIcon ml={2} color="red.500" />
                    )}
                </Flex>
              </Radio>
            </Box>
          ))}
        </VStack>
      </RadioGroup>

      {/* Submit button */}
      {!isSubmitted ? (
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={!selectedOption}
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

export default Quiz;
