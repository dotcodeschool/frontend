import { QUERY_COURSE_OVERVIEW_FIELDS } from "../queries";
import { CourseDetails, CourseQuery } from "../types";
import { getContentfulData } from "@/lib/api/contentful";

const getCourseDetails = async (
  slug: string,
  query: CourseQuery,
): Promise<CourseDetails | null> => {
  const QUERY_COURSE_OVERVIEW: string = `query {
    courseModuleCollection(where: { slug: "${slug}" }) {
      items ${QUERY_COURSE_OVERVIEW_FIELDS}
    }
  }`;

  const courseData: CourseDetails[] = await getContentfulData<
    "courseModuleCollection",
    Array<CourseDetails>
  >(QUERY_COURSE_OVERVIEW, "courseModuleCollection");

  const result = courseData.find((course) => course.slug === slug) ?? null;

  return result;
};

export { getCourseDetails };
