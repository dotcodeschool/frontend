import { QUERY_COURSE_CATALOG } from "@/lib/api";
import { getContentfulData } from "@/lib/api/contentful";
import { CourseOverview } from "@/lib/types";

const getCourseCatalog = getContentfulData<
  "courseModuleCollection",
  Array<CourseOverview>
>(QUERY_COURSE_CATALOG, "courseModuleCollection");

export { getCourseCatalog };
