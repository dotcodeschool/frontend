import { getContentfulData } from "@/lib/api/contentful";
import { CourseOverview } from "@/lib/types";

import { QUERY_COURSE_CATALOG } from "../queries";
import { getLocalCourses } from "./getLocalCourses";

/**
 * Gets course catalog from both Contentful and local MDX files
 * Combines them into a single array, with local courses taking precedence
 * if there are duplicates (based on slug)
 */
const getCourseCatalog = async (): Promise<Array<CourseOverview>> => {
  try {
    // Get courses from Contentful
    const contentfulCourses = await getContentfulData<"courseModuleCollection", Array<CourseOverview>>(
      QUERY_COURSE_CATALOG,
      "courseModuleCollection",
    );
    
    console.log('Contentful courses:', contentfulCourses.map(c => c.slug));
    
    // Get courses from local MDX files
    const localCourses = await getLocalCourses();
    
    console.log('Local courses:', localCourses.map(c => c.slug));
    
    // Create a map of courses by slug for easy lookup
    const courseMap = new Map<string, CourseOverview>();
    
    // Add Contentful courses to the map
    contentfulCourses.forEach(course => {
      if (course.slug) {
        courseMap.set(course.slug, course);
      }
    });
    
    // Add local courses to the map (overriding Contentful courses with the same slug)
    localCourses.forEach(course => {
      if (course.slug) {
        courseMap.set(course.slug, course);
      }
    });
    
    // Convert the map back to an array
    const allCourses = Array.from(courseMap.values());
    console.log('Combined courses:', allCourses.map(c => c.slug));
    
    return allCourses;
  } catch (error) {
    console.error("Error fetching course catalog:", error);
    
    // If Contentful fails, fall back to local courses only
    return getLocalCourses();
  }
};

export { getCourseCatalog };
