import {
  QUERY_COURSE_INFORMATION,
  QUERY_LESSON_INFORMATION,
  QUERY_SECTION_INFORMATION,
} from "@/app/courses/[course]/queries";
import { CourseDetails } from "@/app/courses/[course]/types";
import { getContentfulData } from "@/lib/api/contentful";
import { ExtractedData, QueryResult } from "@/lib/types";

const getCourseData = async (courseSlug: string) =>
  await getContentfulData<"courseModuleCollection", CourseDetails>(
    QUERY_COURSE_INFORMATION,
    "courseModuleCollection",
    { courseSlug },
  );

const getSectionData = async (courseSlug: string, sectionIndex: number) =>
  await getContentfulData<
    "courseModuleCollection",
    ExtractedData<QueryResult<"courseModuleCollection">>
  >(QUERY_SECTION_INFORMATION, "courseModuleCollection", {
    courseSlug,
    sectionIndex,
  });

const getLessonData = async (
  courseSlug: string,
  sectionIndex: number,
  lessonIndex: number,
) =>
  await getContentfulData<
    "courseModuleCollection",
    ExtractedData<QueryResult<"courseModuleCollection">>
  >(QUERY_LESSON_INFORMATION, "courseModuleCollection", {
    courseSlug,
    sectionIndex,
    lessonIndex,
  });

export { getCourseData, getLessonData, getSectionData };
