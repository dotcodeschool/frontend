import { useToast } from "@chakra-ui/react";
import { useState } from "react";

import { PracticeFrequencyOptions } from "@/lib/types";

type CourseReminder = {
  courseId: string;
  courseName: string;
  enabled: boolean;
  frequency: PracticeFrequencyOptions;
};

type SaveNotificationsProps = {
  courseReminders: CourseReminder[];
  milestoneAlerts: boolean;
  newCourseAlerts: boolean;
};

export const useSaveNotifications = () => {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const savePreferences = async ({
    courseReminders,
    milestoneAlerts,
    newCourseAlerts,
  }: SaveNotificationsProps) => {
    setIsSaving(true);

    try {
      const [reposResponse, prefsResponse] = await Promise.all([
        fetch("/api/user-repositories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseReminders }),
        }),
        fetch("/api/user-preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ milestoneAlerts, newCourseAlerts }),
        }),
      ]);

      if (!reposResponse.ok || !prefsResponse.ok) {
        throw new Error("Failed to save preferences");
      }

      toast({
        title: "Success",
        description: "Your preferences have been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
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

  return { savePreferences, isSaving };
};
