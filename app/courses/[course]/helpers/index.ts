import { Session } from "next-auth";

import { getUserRepo } from "@/lib/api";
import { getContentfulData } from "@/lib/api/contentful";

import { QUERY_LESSONS_COLLECTION_ID_AND_TOTAL } from "../../../../queries";
import { CourseDetails, CourseQuery, LessonIdAndTotalData } from "../types";

const getCourseDetails = async (
  slug: string,
  queryFields: CourseQuery,
): Promise<CourseDetails | null> => {
  const QUERY_COURSE_OVERVIEW: string = `query {
    courseModuleCollection(where: { slug: "${slug}" }) {
      items ${queryFields}
    }
  }`;

  const courseData: CourseDetails[] = await getContentfulData<
    "courseModuleCollection",
    Array<CourseDetails>
  >(QUERY_COURSE_OVERVIEW, "courseModuleCollection");

  const result = courseData.find((course) => course.slug === slug) ?? null;

  return result;
};

const getLessonCollectionIdAndTotal = async (sectionId: string) => {
  const QUERY = `query {
    section(id: \"${sectionId}\") ${QUERY_LESSONS_COLLECTION_ID_AND_TOTAL}
  }`;

  const { lessonsCollection }: LessonIdAndTotalData = await getContentfulData(
    QUERY,
    "section",
  );

  return lessonsCollection;
};

const getLessonCollectionTotal = async (sectionId: string) => {
  const lessonsData = await getLessonCollectionIdAndTotal(sectionId);

  return lessonsData.total;
};

const getStartCourseUrl = async (
  format: string | null,
  slug: string,
  sessionContext?: Session,
) => {
  const setupUrl = `/courses/${slug}/setup`;
  const repoSetupUrl = `${setupUrl}?step=repo_test`;
  const lessonsUrl = `/courses/${slug}/lesson/1/chapter/1`;
  const isNotOnMachineCourse = format !== "onMachineCourse";

  if (isNotOnMachineCourse) {
    return lessonsUrl;
  }

  const repo = await getUserRepo(slug, sessionContext);

  if (!repo?.test_ok) {
    return repoSetupUrl;
  }

  return lessonsUrl;
};

export {
  getCourseDetails,
  getLessonCollectionIdAndTotal,
  getLessonCollectionTotal,
  getStartCourseUrl,
};
