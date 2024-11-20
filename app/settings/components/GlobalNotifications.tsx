import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";

type GlobalNotificationProps = {
  milestoneAlerts: boolean;
  newCourseAlerts: boolean;
  onMilestoneChange: (value: boolean) => void;
  onNewCourseChange: (value: boolean) => void;
};

export const GlobalNotifications = ({
  milestoneAlerts,
  newCourseAlerts,
  onMilestoneChange,
  onNewCourseChange,
}: GlobalNotificationProps) => (
  <Box bg="gray.700" p={6} rounded="lg" shadow="sm">
    <Heading as="h2" mb={4} size="md">
      Global Notifications
    </Heading>

    <Stack spacing={6}>
      <FormControl
        alignItems="center"
        display="flex"
        justifyContent="space-between"
      >
        <Box>
          <FormLabel htmlFor="milestone-alerts" mb={0}>
            Milestone Alerts
          </FormLabel>
          <Text color="gray.400" fontSize="sm">
            Get notified when you reach important course milestones
          </Text>
        </Box>
        <Switch
          colorScheme="green"
          id="milestone-alerts"
          isChecked={milestoneAlerts}
          onChange={(e) => onMilestoneChange(e.target.checked)}
        />
      </FormControl>

      <FormControl
        alignItems="center"
        display="flex"
        justifyContent="space-between"
      >
        <Box>
          <FormLabel htmlFor="new-course-alerts" mb={0}>
            New Course Launches
          </FormLabel>
          <Text color="gray.400" fontSize="sm">
            Stay updated when new courses become available
          </Text>
        </Box>
        <Switch
          colorScheme="green"
          id="new-course-alerts"
          isChecked={newCourseAlerts}
          onChange={(e) => onNewCourseChange(e.target.checked)}
        />
      </FormControl>
    </Stack>
  </Box>
);
