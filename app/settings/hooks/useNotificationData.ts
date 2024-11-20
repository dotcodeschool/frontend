import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { PracticeFrequencyOptions } from "@/lib/types";

type CourseReminder = {
  courseId: string;
  courseName: string;
  enabled: boolean;
  frequency: PracticeFrequencyOptions;
};

export const useNotificationData = () => {
  const [milestoneAlerts, setMilestoneAlerts] = useState(false);
  const [newCourseAlerts, setNewCourseAlerts] = useState(false);
  const [courseReminders, setCourseReminders] = useState<CourseReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reposResponse, prefsResponse] = await Promise.all([
          fetch("/api/user-repositories"),
          fetch("/api/user-preferences"),
        ]);

        if (!reposResponse.ok || !prefsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [reposData, prefsData] = await Promise.all([
          reposResponse.json(),
          prefsResponse.json(),
        ]);

        setCourseReminders(reposData);
        setMilestoneAlerts(prefsData.milestoneAlerts);
        setNewCourseAlerts(prefsData.newCourseAlerts);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error loading preferences",
          description: "Failed to load your preferences. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, [toast]);

  return {
    milestoneAlerts,
    setMilestoneAlerts,
    newCourseAlerts,
    setNewCourseAlerts,
    courseReminders,
    setCourseReminders,
    isLoading,
  };
};
