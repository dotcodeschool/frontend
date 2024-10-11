import {
  QUERY_COURSE_INFORMATION,
  QUERY_LESSON_INFORMATION,
  QUERY_SECTION_INFORMATION,
} from "@/app/courses/[course]/queries";
import { CourseDetails } from "@/app/courses/[course]/types";
import { getContentfulData } from "@/lib/api/contentful";
import {
  ExtractedData,
  QueryResult,
  Section,
  TypeFile,
  Lesson,
} from "@/lib/types";

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

const constructFeedbackUrl = (
  githubUrl: string,
  course: string,
  section: string,
  lesson: string,
  lessonTitle: string,
) => {
  const encodedTitle = encodeURIComponent(`
    Dot Code School Suggestion: Feedback for Section ${section} - Lesson ${lesson}: ${lessonTitle}`);

  return `${githubUrl}/issues/new?assignees=&labels=feedback&template=feedback.md&title=${encodedTitle}`;
};

const getStartingFiles = (lesson: Lesson) => {
  const startingFiles: TypeFile[] = lesson.files?.sourceCollection
    ? lesson.files.sourceCollection.items.map((file) => {
        startingFiles.push({
          fileName: file?.title ?? "",
          code: "TODO",
          language: file?.fileName?.split(".").pop() ?? "rust",
        });
      })
    : lesson.files?.templateCollection?.items.map((file) => {
        startingFiles.push({
          fileName: file?.title ?? "",
          code: "TODO",
          language: file?.fileName?.split(".").pop() ?? "rust",
        });
      });

  return startingFiles;
};

const getSolutionFiles = (lesson: Lesson) => {
  const collection = lesson.files?.solutionCollection;
  const solutionFiles: TypeFile[] =
    collection && collection.items.length > 0
      ? collection.items.map((file) => ({
          fileName: file?.title ?? "",
          code: "TODO",
          language: file?.fileName?.split(".").pop() ?? "rust",
        }))
      : [];

  return solutionFiles;
};

const getNavigation = (
  course: string,
  section: string,
  lesson: string,
  sectionIndex: number,
  lessonIndex: number,
  sectionData: any,
  courseData: any,
) => {
  const prev = getPreviousNavigation(
    course,
    section,
    lesson,
    sectionIndex,
    lessonIndex,
    sectionData,
  );
  const next = getNextNavigation(
    course,
    section,
    lesson,
    sectionIndex,
    lessonIndex,
    sectionData,
    courseData,
  );

  return { prev, next };
};

const getPreviousNavigation = (
  course: string,
  section: string,
  lesson: string,
  sectionIndex: number,
  lessonIndex: number,
  sectionData: any,
) => {
  if (lessonIndex > 0) {
    return `${course}/section/${section}/lesson/${lessonIndex}`;
  } else if (sectionIndex > 0) {
    return `${course}/section/${sectionIndex}/lesson/${sectionData.lessonsCollection.total}`;
  }

  return undefined;
};

const getNextNavigation = (
  course: string,
  section: string,
  lesson: string,
  sectionIndex: number,
  lessonIndex: number,
  sectionData: any,
  courseData: any,
) => {
  if (lessonIndex < sectionData.lessonsCollection.total - 1) {
    return `${course}/section/${section}/lesson/${lessonIndex + 2}`;
  } else if (sectionIndex < (courseData.sectionsCollection?.total ?? 0) - 1) {
    return `${course}/section/${sectionIndex + 2}/lesson/1`;
  }

  return undefined;
};

const getLessonPageData = async (params: {
  course: string;
  section: string;
  lesson: string;
}) => {
  const { course, section, lesson } = params;
  const sectionIndex = parseInt(section) - 1;
  const lessonIndex = parseInt(lesson) - 1;

  const courseData = await getCourseData(course);
  const sectionData = await getSectionData(course, sectionIndex);
  const lessonData = await getLessonData(course, sectionIndex, lessonIndex);

  const startingFiles = getStartingFiles(lessonData);
  const solution = getSolutionFiles(lessonData);
  const readOnly = solution.length === 0;

  const feedbackUrl = constructFeedbackUrl(
    courseData.githubUrl ?? "https://github.com/dotcodeschool/frontend",
    course,
    section,
    lesson,
    lessonData.title,
  );

  const { prev, next } = getNavigation(
    course,
    section,
    lesson,
    sectionIndex,
    lessonIndex,
    sectionData,
    courseData,
  );

  return {
    lessonData,
    startingFiles,
    solution,
    readOnly,
    feedbackUrl,
    prev,
    next,
  };
};

export { getCourseData, getLessonData, getLessonPageData, getSectionData };
