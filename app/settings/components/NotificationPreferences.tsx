"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { PracticeFrequencyOptions } from "@/lib/types";

import { CourseReminderItem } from "./CourseReminderItem";
import { GlobalNotifications } from "./GlobalNotifications";

type CourseReminder = {
  courseId: string;
  courseName: string;
  enabled: boolean;
  frequency: PracticeFrequencyOptions;
};

export const NotificationPreferences = () => {
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);
  const [newCourseAlerts, setNewCourseAlerts] = useState(true);
  const [courseReminders, setCourseReminders] = useState<CourseReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch("/api/user-repositories");
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
        const data = await response.json();
        setCourseReminders(data);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const handleFrequencyChange = (
    courseId: string,
    frequency: PracticeFrequencyOptions,
  ) => {
    setCourseReminders((prev) =>
      prev.map((reminder) =>
        reminder.courseId === courseId ? { ...reminder, frequency } : reminder,
      ),
    );
  };

  const handleReminderToggle = (courseId: string) => {
    setCourseReminders((prev) =>
      prev.map((reminder) =>
        reminder.courseId === courseId
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder,
      ),
    );
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user-repositories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseReminders }),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      toast({
        title: "Success",
        description: "Your preferences have been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error saving preferences",
        description: "Failed to save your preferences. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack align="stretch" spacing={8}>
        <GlobalNotifications
          milestoneAlerts={milestoneAlerts}
          newCourseAlerts={newCourseAlerts}
          onMilestoneChange={setMilestoneAlerts}
          onNewCourseChange={setNewCourseAlerts}
        />

        <Box bg="gray.700" p={6} rounded="lg" shadow="sm">
          <Heading as="h2" mb={4} size="md">
            Course Reminders
          </Heading>
          <VStack
            align="stretch"
            divider={<Box borderBottom="1px" borderColor="whiteAlpha.300" />}
            spacing={6}
          >
            {isLoading ? (
              <Flex justify="center" py={4}>
                <Spinner />
              </Flex>
            ) : courseReminders.length > 0 ? (
              courseReminders.map((course) => (
                <CourseReminderItem
                  course={course}
                  key={course.courseId}
                  onFrequencyChange={handleFrequencyChange}
                  onToggle={handleReminderToggle}
                />
              ))
            ) : (
              <Box py={4} textAlign="center" color="gray.400">
                No course reminders available
              </Box>
            )}
          </VStack>
        </Box>

        <Flex justify="flex-end">
          <Button 
            colorScheme="green" 
            onClick={handleSavePreferences} 
            size="md"
            isLoading={isSaving}
            loadingText="Saving..."
          >
            Save Preferences
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};
