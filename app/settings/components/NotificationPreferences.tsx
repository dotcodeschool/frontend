"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  VStack,
} from "@chakra-ui/react";

import { PracticeFrequencyOptions } from "@/lib/types";

import { useNotificationData } from "../hooks/useNotificationData";
import { useSaveNotifications } from "../hooks/useSaveNotifications";

import { CourseReminderList } from "./CourseReminderList";
import { GlobalNotifications } from "./GlobalNotifications";

export const NotificationPreferences = () => {
  const {
    milestoneAlerts,
    setMilestoneAlerts,
    newCourseAlerts,
    setNewCourseAlerts,
    courseReminders,
    setCourseReminders,
    isLoading,
  } = useNotificationData();

  const { savePreferences, isSaving } = useSaveNotifications();

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

  const handleSavePreferences = () => {
    void savePreferences({
      courseReminders,
      milestoneAlerts,
      newCourseAlerts,
    });
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
          <CourseReminderList
            courseReminders={courseReminders}
            isLoading={isLoading}
            onFrequencyChange={handleFrequencyChange}
            onToggle={handleReminderToggle}
          />
        </Box>

        <Flex justify="flex-end">
          <Button
            colorScheme="green"
            isDisabled={isLoading}
            isLoading={isSaving}
            loadingText="Saving..."
            onClick={handleSavePreferences}
            size="md"
          >
            Save Preferences
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};
