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
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { generateQuizId } from "./utils/hashQuiz";

export type FillInTheBlankQuizProps = {
  question: string;
  answers: string[];
  caseSensitive?: boolean;
  explanation: string | React.ReactNode;
  placeholder?: string;
};

export const FillInTheBlankQuiz: React.FC<FillInTheBlankQuizProps> = ({
  question,
  answers,
  caseSensitive = false,
  explanation,
  placeholder = "Type your answer here",
}) => {
  const [userAnswer, setUserAnswer] = useState<string>("");
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
  const textColor = useColorModeValue("gray.800", "white");
  const inputBgColor = useColorModeValue("white", "gray.700");

  // Generate a unique ID for this quiz based on the question and answers
  useEffect(() => {
    // Create a format that can be used with the existing hash function
    const options = answers.map(answer => ({
      label: answer,
      correct: true
    }));
    
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
      setUserAnswer(attemptedQuizzes[id].userAnswer);
      setIsSubmitted(true);
      setIsCorrect(attemptedQuizzes[id].isCorrect);
      
      // Update QuizGroup score if available
      if (quizGroupContext) {
        quizGroupContext.updateScore(id, attemptedQuizzes[id].isCorrect);
      }
    }
  }, [question, answers, quizGroupContext]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSubmitted) {
      setUserAnswer(e.target.value);
    }
  };

  const checkAnswer = (input: string): boolean => {
    if (!caseSensitive) {
      input = input.toLowerCase();
    }
    
    return answers.some(answer => {
      const correctAnswer = caseSensitive ? answer : answer.toLowerCase();
      return input === correctAnswer;
    });
  };

  const handleSubmit = () => {
    if (!userAnswer || isSubmitted) return;

    const isAnswerCorrect = checkAnswer(userAnswer);
    
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
    
    // Save to localStorage
    const attemptedQuizzes = JSON.parse(
      localStorage.getItem("attemptedQuizzes") || "{}"
    );
    
    attemptedQuizzes[quizId] = {
      userAnswer,
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

      {/* Input field */}
      <FormControl mb={6}>
        <Input
          value={userAnswer}
          onChange={handleInputChange}
          placeholder={placeholder}
          size="md"
          bg={inputBgColor}
          isDisabled={isSubmitted}
          borderColor={
            isSubmitted
              ? isCorrect
                ? "green.500"
                : "red.500"
              : "gray.300"
          }
          _hover={{
            borderColor: isSubmitted
              ? isCorrect
                ? "green.500"
                : "red.500"
              : "blue.300",
          }}
        />
      </FormControl>

      {/* Submit button */}
      {!isSubmitted ? (
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={!userAnswer}
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
              {!isCorrect && (
                <Text mb={2}>
                  Acceptable answers: {answers.join(", ")}
                </Text>
              )}
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

export default FillInTheBlankQuiz;
