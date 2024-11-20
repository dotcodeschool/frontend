"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import { PracticeFrequencyOptions } from "@/lib/types";

import { CourseReminderItem } from "./CourseReminderItem";
import { GlobalNotifications } from "./GlobalNotifications";

type CourseReminder = {
  courseId: string;
  courseName: string;
  enabled: boolean;
  frequency: PracticeFrequencyOptions;
};

const INITIAL_COURSE_REMINDERS: CourseReminder[] = [
  {
    courseId: "1",
    courseName: "React Fundamentals",
    enabled: true,
    frequency: "every_day",
  },
  {
    courseId: "2",
    courseName: "Advanced JavaScript",
    enabled: false,
    frequency: "every_day",
  },
];

export const NotificationPreferences = () => {
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);
  const [newCourseAlerts, setNewCourseAlerts] = useState(true);
  const [courseReminders, setCourseReminders] = useState<CourseReminder[]>(
    INITIAL_COURSE_REMINDERS,
  );

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
    // TODO: Implement save functionality
    console.log({
      milestoneAlerts,
      newCourseAlerts,
      courseReminders,
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
          <VStack
            align="stretch"
            divider={<Box borderBottom="1px" borderColor="whiteAlpha.300" />}
            spacing={6}
          >
            {courseReminders.map((course) => (
              <CourseReminderItem
                course={course}
                key={course.courseId}
                onFrequencyChange={handleFrequencyChange}
                onToggle={handleReminderToggle}
              />
            ))}
          </VStack>
        </Box>

        <Flex justify="flex-end">
          <Button colorScheme="green" onClick={handleSavePreferences} size="md">
            Save Preferences
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
};
