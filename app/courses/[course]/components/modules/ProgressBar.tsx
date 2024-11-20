/* eslint-disable complexity, @typescript-eslint/no-explicit-any */
import { Progress, Text } from "@chakra-ui/react";

import { auth } from "@/auth";
import { getProgressData } from "@/lib/api";

import { getLessonCollectionTotal } from "../../helpers";

const calculateCompletedLessons = (
  courseProgress: Record<string, any> | undefined,
  index: number,
): number => {
  if (!courseProgress || typeof courseProgress !== "object") {
    return 0;
  }

  const progressEntries = Object.entries(courseProgress);
  if (index >= progressEntries.length) {
    return 0;
  }

  const sectionProgress = progressEntries[index][1];
  if (typeof sectionProgress !== "object" || sectionProgress === null) {
    return 0;
  }

  return Object.keys(sectionProgress).length;
};

const ProgressBar = async ({
  index,
  sectionId,
  slug,
}: {
  index: number;
  sectionId: string;
  slug: string;
}) => {
  const session = await auth();
  const numOfLessons = await getLessonCollectionTotal(sectionId);
  const progressData = await getProgressData(session);

  const completedLessonsCount = calculateCompletedLessons(
    progressData?.[slug],
    index,
  );
  const progress = (completedLessonsCount / numOfLessons) * 100;

  return (
    <>
      <Progress
        colorScheme="green"
        rounded="full"
        size="sm"
        value={progress}
        w="full"
      />
      <Text color="gray.400" fontSize="sm" fontWeight="500">
        {progress}% Complete
      </Text>
    </>
  );
};

export { ProgressBar };
