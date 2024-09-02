"use client";

import { IProgressData } from "@/app/lib/types/IProgress";
import { forEach, isEmpty, isString } from "lodash";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Progress, Text } from "@chakra-ui/react";

const ProgressProvider = createContext({});

export default function ProgressBar({
  index,
  numOfLessons,
  slug,
}: {
  index: number;
  numOfLessons: number;
  slug: string;
}) {
  const [progress, setProgress] = useState(0);
  const progressData = useContext(ProgressProvider);

  const countCompletedChapters = useCallback(
    (courseId: string, lessonId?: string, progressData?: IProgressData) => {
      // Count the completed chapters
      let count = 0;
      const progressDataParsed = isString(progressData)
        ? JSON.parse(progressData)
        : progressData;
      if (lessonId) {
        // Count the completed chapters for a specific lesson
        forEach(progressDataParsed[courseId]?.[lessonId], (chapter) => {
          if (chapter) {
            count++;
          }
        });
      } else {
        // Count the completed chapters for the entire course
        for (const lessonId in progressDataParsed[courseId] || {}) {
          count += countCompletedChapters(courseId, lessonId);
        }
      }

      return count;
    },
    [],
  );

  useEffect(() => {
    if (!isEmpty(progressData)) {
      const completedChaptersCount = countCompletedChapters(
        slug,
        `${index + 1}`,
        progressData,
      );

      const _progress = Number(
        ((completedChaptersCount / numOfLessons) * 100).toFixed(0),
      );
      setProgress(_progress);
    }
  }, [slug, index, progressData, numOfLessons, countCompletedChapters]);

  return (
    <ProgressProvider.Provider value={progressData}>
      <Progress
        colorScheme="green"
        w="full"
        value={progress}
        size="sm"
        rounded="full"
      />
      <Text fontSize="sm" fontWeight="500" color="gray.400">
        {progress}% Complete
      </Text>
    </ProgressProvider.Provider>
  );
}
