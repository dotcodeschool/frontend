import { getContentfulData } from "@/lib/api/contentful";
import { CourseOverview } from "@/lib/types";

import { QUERY_COURSE_CATALOG } from "../queries";

const getCourseCatalog = () =>
  getContentfulData<"courseModuleCollection", Array<CourseOverview>>(
    QUERY_COURSE_CATALOG,
    "courseModuleCollection",
  );

export { getCourseCatalog };
