import { Box, Flex, Switch, Text } from "@chakra-ui/react";

import { PracticeFrequencyOptions } from "@/lib/types";

import { FrequencySelect } from "./FrequencySelect";

type CourseReminder = {
  courseId: string;
  courseName: string;
  enabled: boolean;
  frequency: PracticeFrequencyOptions;
};

type CourseReminderItemProps = {
  course: CourseReminder;
  onToggle: (courseId: string) => void;
  onFrequencyChange: (
    courseId: string,
    frequency: PracticeFrequencyOptions,
  ) => void;
};

export const CourseReminderItem = ({
  course,
  onToggle,
  onFrequencyChange,
}: CourseReminderItemProps) => (
  <Box>
    <Flex align="center" justify="space-between" mb={2}>
      <Text fontWeight="medium">{course.courseName}</Text>
      <Switch
        colorScheme="green"
        isChecked={course.enabled}
        onChange={() => onToggle(course.courseId)}
      />
    </Flex>

    {course.enabled ? (
      <FrequencySelect
        onChange={(frequency) => onFrequencyChange(course.courseId, frequency)}
        value={course.frequency}
      />
    ) : null}
  </Box>
);
