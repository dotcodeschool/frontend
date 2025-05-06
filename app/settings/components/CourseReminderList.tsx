import { Box, Flex, Spinner, VStack } from "@chakra-ui/react";

import { PracticeFrequencyOptions } from "@/lib/types";

import { CourseReminderItem } from "./CourseReminderItem";

type CourseReminder = {
  courseId: string;
  courseName: string;
  enabled: boolean;
  frequency: PracticeFrequencyOptions;
};

type CourseReminderListProps = {
  courseReminders: CourseReminder[];
  isLoading: boolean;
  onFrequencyChange: (
    courseId: string,
    frequency: PracticeFrequencyOptions,
  ) => void;
  onToggle: (courseId: string) => void;
};

export const CourseReminderList = ({
  courseReminders,
  isLoading,
  onFrequencyChange,
  onToggle,
}: CourseReminderListProps) => {
  if (isLoading) {
    return (
      <Flex justify="center" py={4}>
        <Spinner />
      </Flex>
    );
  }

  if (courseReminders.length === 0) {
    return (
      <Box color="gray.400" py={4} textAlign="center">
        No course reminders available
      </Box>
    );
  }

  return (
    <VStack
      align="stretch"
      divider={<Box borderBottom="1px" borderColor="whiteAlpha.300" />}
      spacing={6}
    >
      {courseReminders.map((course) => (
        <CourseReminderItem
          course={course}
          key={course.courseId}
          onFrequencyChange={onFrequencyChange}
          onToggle={onToggle}
        />
      ))}
    </VStack>
  );
};
