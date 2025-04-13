"use client";

import { useEffect, useState } from "react";
import { Progress, Text } from "@chakra-ui/react";
import { useProgress } from "@/lib/hooks/useProgress";

const ProgressBarClient = ({
  index,
  sectionId,
  slug,
  totalLessons,
}: {
  index: number;
  sectionId: string;
  slug: string;
  totalLessons: number;
}) => {
  const { progress } = useProgress();
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!progress || !slug) return;

    let completedLessons = 0;
    
    // We'll use the numeric index + 1 as the section identifier, since section IDs start at 1
    const sectionKey = String(index + 1);
    
    // For rust-state-machine course, use the correct lesson counts
    const correctLessonCounts: Record<string, number> = slug === 'rust-state-machine' ? {
      '1': 3,  // Chapter 1 has 3 lessons
      '2': 5,  // Chapter 2 has 5 lessons
      '3': 5,  // Chapter 3 has 5 lessons
      '4': 7,  // Chapter 4 has 7 lessons
      '5': 7,  // Chapter 5 has 7 lessons
      '6': 5,  // Chapter 6 has 5 lessons
      '7': 4   // Chapter 7 has 4 lessons
    } : {};
    
    // Use correct lesson count for rust-state-machine, otherwise use server value
    const actualTotalLessons = 
      (slug === 'rust-state-machine' && sectionKey in correctLessonCounts) 
        ? correctLessonCounts[sectionKey] 
        : totalLessons;
    
    // Get section progress from client-side state
    const courseProgress = progress[slug];
    
    if (courseProgress && typeof courseProgress === "object") {
      const sectionProgress = courseProgress[sectionKey];
      
      if (sectionProgress && typeof sectionProgress === "object") {
        // Count true values in section progress
        Object.entries(sectionProgress).forEach(([lessonId, completed]) => {
          if (completed === true) {
            completedLessons++;
          }
        });
      }
    }
    
    // Calculate progress percentage based on current progress data and correct lesson counts
    const calculatedProgress = actualTotalLessons > 0 
      ? Math.round((completedLessons / actualTotalLessons) * 100) 
      : 0;
    
    setProgressPercent(calculatedProgress);
  }, [progress, slug, index, totalLessons]);

  return (
    <>
      <Progress
        colorScheme="green"
        rounded="full"
        size="sm"
        value={progressPercent}
        w="full"
      />
      <Text color="gray.400" fontSize="sm" fontWeight="500">
        {progressPercent}% Complete
      </Text>
    </>
  );
};

export { ProgressBarClient };