import { Progress, Text } from "@chakra-ui/react";

import { auth } from "@/auth";
import { getProgressData } from "@/lib/api";

import { getLessonCollectionTotal } from "../../helpers";

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

  let completedLessonsCount = 0;
  const courseProgress = progressData?.[slug];
  if (courseProgress) {
    console.log("index", index);
    console.log(
      "courseProgress",
      Object.entries(Object.entries(courseProgress)[index][1]).length,
    );
    completedLessonsCount = Object.entries(
      Object.entries(courseProgress)[index][1],
    ).length;
  }
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
