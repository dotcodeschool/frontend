import { CourseOverview } from "@/lib/types";
import { getLocalCourses } from "./getLocalCourses";

/**
 * Gets course catalog from local MDX files
 */
const getCourseCatalog = async (): Promise<CourseOverview[]> => {
  try {
    return await getLocalCourses();
  } catch (error) {
    console.error("Error in getCourseCatalog:", error);
    return [];
  }
};

export { getCourseCatalog };
