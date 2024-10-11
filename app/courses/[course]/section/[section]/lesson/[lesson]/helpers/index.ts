import {
  QUERY_COURSE_INFORMATION,
  QUERY_LESSON_INFORMATION,
  QUERY_SECTION_INFORMATION,
} from "@/app/courses/[course]/queries";
import { CourseDetails } from "@/app/courses/[course]/types";
import { getContentfulData } from "@/lib/api/contentful";
import { ExtractedData, QueryResult, Section } from "@/lib/types";

const getCourseData = async (courseSlug: string) =>
  await getContentfulData<"courseModuleCollection", CourseDetails>(
    QUERY_COURSE_INFORMATION,
    "courseModuleCollection",
    { courseSlug },
    "items.0",
  );

const getSectionData = async (courseSlug: string, sectionIndex: number) => {
  const result = await getContentfulData<"courseModuleCollection", Section>(
    QUERY_SECTION_INFORMATION,
    "courseModuleCollection",
    {
      courseSlug,
      sectionIndex,
    },
    "items.0.sectionsCollection",
  );

  return result[0];
};

const getLessonData = async (
  courseSlug: string,
  sectionIndex: number,
  lessonIndex: number,
) => {
  const result = await getContentfulData<
    "courseModuleCollection",
    ExtractedData<QueryResult<"courseModuleCollection">>
  >(
    QUERY_LESSON_INFORMATION,
    "courseModuleCollection",
    {
      courseSlug,
      sectionIndex,
      lessonIndex,
    },
    "items.0.sectionsCollection.items.0.lessonsCollection",
  );

  return result[0];
};

export { getCourseData, getLessonData, getSectionData };
