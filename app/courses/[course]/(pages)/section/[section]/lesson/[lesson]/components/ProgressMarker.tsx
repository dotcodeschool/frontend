"use client";

import { Heading, HStack, Switch, Text, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/hooks/useProgress";

type ProgressMarkerProps = {
  courseId: string;
  sectionId: string;
  lessonId: string;
};

export const ProgressMarker = ({ courseId, sectionId, lessonId }: ProgressMarkerProps) => {
  const toast = useToast();
  const { progress, saveProgress, isLoading } = useProgress();
  const [isComplete, setIsComplete] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Check if the lesson is already marked as complete
  useEffect(() => {
    try {
      console.log("Current progress:", progress);
      console.log(`Checking completion status for: ${courseId}/${sectionId}/${lessonId}`);
      
      const isLessonComplete = Boolean(
        progress?.[courseId]?.[sectionId]?.[lessonId]
      );
      
      console.log("Lesson completion status:", isLessonComplete);
      setIsComplete(isLessonComplete);
    } catch (error) {
      console.error("Error checking completion status:", error);
    }
  }, [progress, courseId, sectionId, lessonId]);

  const handleToggle = async () => {
    setUpdating(true);
    try {
      console.log(`Toggling progress for: ${courseId}/${sectionId}/${lessonId}`);
      console.log("Current completion status:", isComplete);
      
      // Call saveProgress which will update the database
      await saveProgress(courseId, sectionId, lessonId);
      
      // Toggle local state
      const newStatus = !isComplete;
      setIsComplete(newStatus);
      
      toast({
        title: newStatus ? "Lesson marked as complete" : "Progress updated",
        status: newStatus ? "success" : "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error toggling progress:", error);
      toast({
        title: "Failed to update progress",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <HStack
      borderY="1px dashed gray"
      justify="center"
      maxW="md"
      mt={8}
      mx="auto"
      py={8}
      spacing={4}
      wrap="wrap"
    >
      <Heading as="h3" fontWeight="bold" size="md" textAlign="center">
        Finished this lesson?
      </Heading>
      <HStack>
        <Switch 
          colorScheme="green" 
          isChecked={isComplete}
          isDisabled={updating || isLoading}
          onChange={handleToggle}
        />
        <Text>{isComplete ? "Completed" : "Mark as complete"}</Text>
      </HStack>
    </HStack>
  );
};