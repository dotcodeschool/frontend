import {
  QUERY_ALL_SECTIONS,
  QUERY_COURSE_INFORMATION,
  QUERY_LESSON_INFORMATION,
  QUERY_SECTION_INFORMATION,
} from "@/app/courses/[course]/queries";
import { CourseDetails } from "@/app/courses/[course]/types";
import { getContentfulData } from "@/lib/api/contentful";
import { Section, TypeFile, Lesson, Asset, Maybe } from "@/lib/types";

const getCourseData = async (courseSlug: string) =>
  await getContentfulData<"courseModuleCollection", CourseDetails>(
    QUERY_COURSE_INFORMATION,
    "courseModuleCollection",
    { courseSlug },
    "items.0",
  );

const getSectionData = async (courseSlug: string, sectionIndex: number) => {
  const result: Section[] = await getContentfulData<
    "courseModuleCollection",
    Section[]
  >(
    QUERY_SECTION_INFORMATION,
    "courseModuleCollection",
    {
      courseSlug,
      sectionIndex,
    },
    "items.0.sectionsCollection.items",
  );

  return result[0];
};

const getAllSections = async (courseSlug: string) => {
  const result = await getContentfulData<"courseModuleCollection", Section[]>(
    QUERY_ALL_SECTIONS,
    "courseModuleCollection",
    { courseSlug },
    "items.0.sectionsCollection.items",
  );

  return result;
};

const getLessonData = async (
  courseSlug: string,
  sectionIndex: number,
  lessonIndex: number,
) => {
  const result: Lesson[] = await getContentfulData<
    "courseModuleCollection",
    Lesson[]
  >(
    QUERY_LESSON_INFORMATION,
    "courseModuleCollection",
    {
      courseSlug,
      sectionIndex,
      lessonIndex,
    },
    "items.0.sectionsCollection.items.0.lessonsCollection.items",
  );

  return result[0];
};

const constructFeedbackUrl = (
  githubUrl: string,
  section: string,
  lesson: string,
  lessonTitle: string,
) => {
  const encodedTitle = encodeURIComponent(`
Dot Code School Suggestion: Feedback for Section ${section} - Lesson ${lesson}: ${lessonTitle}`);

  return `${githubUrl}/issues/new?assignees=&labels=feedback&template=feedback.md&title=${encodedTitle}`;
};

const getLanguage = (fileName: Maybe<string>) => {
  switch (fileName?.split(".").pop()) {
    case "rs":
      return "rust";

    case "toml":
      return "rust";

    default:
      return fileName?.split(".").pop() ?? "plaintext";
  }
};

const fetchFile = async (file: Maybe<Asset>) => {
  if (!file) {
    throw new Error("File not found");
  }
  const { url, fileName } = file;

  if (!url || !fileName) {
    throw new Error("File not found");
  }
  const language = getLanguage(fileName);

  const response = await fetch(url);
  const code = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return {
    fileName,
    code,
    language,
  };
};

const getStartingFiles = async (lesson: Lesson) => {
  let startingFiles: TypeFile[] = [];
  const source = lesson.files?.sourceCollection;
  const template = lesson.files?.templateCollection;

  if (source && source.items.length > 0) {
    startingFiles = await Promise.all(source.items.map(fetchFile));
  } else if (template && template.items.length > 0) {
    startingFiles = await Promise.all(template.items.map(fetchFile));
  }

  return startingFiles;
};

const getSolutionFiles = async (lesson: Lesson) => {
  const collection = lesson.files?.solutionCollection;
  let solutionFiles: TypeFile[] = [];

  if (collection && collection.items.length > 0) {
    solutionFiles = await Promise.all(collection.items.map(fetchFile));
  }

  return solutionFiles;
};

const getNavigation = async (
  course: string,
  sectionIndex: number,
  lessonIndex: number,
  sectionData: Pick<Section, "lessonsCollection">,
  courseData: CourseDetails,
) => {
  const previousSectionData = await getSectionData(course, sectionIndex - 1);
  const prev = getPreviousNavigation(
    course,
    sectionIndex,
    lessonIndex,
    sectionData,
    previousSectionData,
  );
  const next = getNextNavigation(
    course,
    sectionIndex,
    lessonIndex,
    sectionData,
    courseData,
  );

  return { prev, next };
};

const getPreviousNavigation = (
  course: string,
  sectionIndex: number,
  lessonIndex: number,
  sectionData: Pick<Section, "lessonsCollection">,
  previousSectionData?: Pick<Section, "lessonsCollection">,
) => {
  const total = sectionData.lessonsCollection?.total;

  if (!total) {
    return undefined;
  }

  if (lessonIndex > 0) {
    return `${course}/section/${sectionIndex + 1}/lesson/${lessonIndex}`;
  } else if (sectionIndex > 0) {
    const prevTotal = previousSectionData?.lessonsCollection?.total;
    const previousSectionTotal = prevTotal ?? 0;

    return `${course}/section/${sectionIndex}/lesson/${previousSectionTotal}`;
  }

  return undefined;
};

const getNextNavigation = (
  course: string,
  sectionIndex: number,
  lessonIndex: number,
  sectionData: Pick<Section, "lessonsCollection">,
  courseData: CourseDetails,
) => {
  const total = sectionData.lessonsCollection?.total;
  if (!total) {
    return undefined;
  }

  if (lessonIndex < total - 1) {
    return `${course}/section/${sectionIndex + 1}/lesson/${lessonIndex + 2}`;
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

  const startingFiles = await getStartingFiles(lessonData);
  const solution = await getSolutionFiles(lessonData);
  const { format, formatData } = courseData;
  const readOnly = solution.length === 0;

  const feedbackUrl = constructFeedbackUrl(
    courseData.githubUrl ?? "https://github.com/dotcodeschool/frontend",
    section,
    lesson,
    lessonData.title ?? "",
  );

  const { prev, next } = await getNavigation(
    course,
    sectionIndex,
    lessonIndex,
    sectionData,
    courseData,
  );

  const allSections = await getAllSections(course);

  return {
    lessonData,
    format,
    formatData,
    startingFiles,
    solution,
    readOnly,
    feedbackUrl,
    prev,
    next,
    sections: allSections,
  };
};

export { getCourseData, getLessonData, getLessonPageData, getSectionData };
