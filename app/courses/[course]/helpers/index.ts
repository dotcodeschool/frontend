import { getContentfulData } from "@/lib/api/contentful";

import { QUERY_LESSONS_COLLECTION_ID_AND_TOTAL } from "../queries";
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

  console.log(lessonsData.items[0].sys.id);

  return lessonsData.total;
};

export {
  getCourseDetails,
  getLessonCollectionIdAndTotal,
  getLessonCollectionTotal,
};
