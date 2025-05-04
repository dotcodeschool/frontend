"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import {
  Box,
  Text,
  Progress,
  Flex,
  useColorModeValue,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Divider,
} from "@chakra-ui/react";

// Create a context for the quiz group
type QuizGroupContextType = {
  registerQuiz: (id: string) => void;
  updateScore: (id: string, isCorrect: boolean) => void;
};

const QuizGroupContext = createContext<QuizGroupContextType | undefined>(
  undefined,
);

export const useQuizGroup = () => {
  const context = useContext(QuizGroupContext);
  if (!context) {
    throw new Error("useQuizGroup must be used within a QuizGroupProvider");
  }
  return context;
};

export type QuizGroupProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export const QuizGroup: React.FC<QuizGroupProps> = ({
  title,
  description,
  children,
}) => {
  const [quizIds, setQuizIds] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);

  // Colors for theming
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const progressColorScheme = useColorModeValue("green", "green");
  const finalScoreBg = useColorModeValue("green.50", "green.900");

  // Register a quiz with the group
  const registerQuiz = (id: string) => {
    setQuizIds((prev) => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  };

  // Update the score for a quiz
  const updateScore = (id: string, isCorrect: boolean) => {
    setScores((prev) => ({
      ...prev,
      [id]: isCorrect,
    }));
  };

  // Calculate total score and completion status
  useEffect(() => {
    setTotalQuizzes(quizIds.length);

    const completed = Object.keys(scores).length;
    setCompletedQuizzes(completed);

    const correct = Object.values(scores).filter(Boolean).length;
    setTotalScore(correct);
  }, [quizIds, scores]);

  return (
    <QuizGroupContext.Provider value={{ registerQuiz, updateScore }}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        p={6}
        mb={8}
        bg={bgColor}
        boxShadow="lg"
      >
        {title && (
          <Heading as="h2" size="lg" mb={2} color={textColor}>
            {title}
          </Heading>
        )}

        {description && (
          <Text mb={4} color={textColor}>
            {description}
          </Text>
        )}

        <Box mb={6}>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="medium">
              Progress: {completedQuizzes} of {totalQuizzes} completed
            </Text>
            <Text fontWeight="bold">
              Score: {totalScore}/{totalQuizzes}
            </Text>
          </Flex>

          <Progress
            value={(completedQuizzes / totalQuizzes) * 100}
            colorScheme={progressColorScheme}
            size="sm"
            borderRadius="md"
          />
        </Box>

        <Divider mb={6} />

        <Box>{children}</Box>

        {/* Final score card */}
        {/* Get the color value at the component level, not inside a callback */}
        {/* This fixes the React hooks rule violation */}
        {completedQuizzes === totalQuizzes && totalQuizzes > 0 && (
          <Box mt={6} p={4} bg={finalScoreBg} borderRadius="md">
            <StatGroup>
              <Stat>
                <StatLabel>Final Score</StatLabel>
                <StatNumber>
                  {totalScore}/{totalQuizzes}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {Math.round((totalScore / totalQuizzes) * 100)}%
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Performance</StatLabel>
                <StatNumber>
                  {totalScore === totalQuizzes
                    ? "Perfect!"
                    : totalScore >= totalQuizzes * 0.8
                      ? "Excellent!"
                      : totalScore >= totalQuizzes * 0.6
                        ? "Good"
                        : "Needs Review"}
                </StatNumber>
                <StatHelpText>
                  {totalScore === totalQuizzes
                    ? "You got everything right!"
                    : totalScore >= totalQuizzes * 0.8
                      ? "Great job!"
                      : totalScore >= totalQuizzes * 0.6
                        ? "Keep it up!"
                        : "Try reviewing the material again"}
                </StatHelpText>
              </Stat>
            </StatGroup>
          </Box>
        )}
      </Box>
    </QuizGroupContext.Provider>
  );
};

export default QuizGroup;
