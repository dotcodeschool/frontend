import { getContentfulData } from "@/lib/api/contentful";
import { CourseOverview } from "@/lib/types";

import { QUERY_COURSE_CATALOG } from "../queries";
import { getLocalCourses } from "./getLocalCourses";

// Extended CourseOverview type with formats information
interface ExtendedCourseOverview extends CourseOverview {
  formats?: {
    hasInBrowser: boolean;
    hasOnMachine: boolean;
    inBrowserSlug?: string;
    onMachineSlug?: string;
  };
}

/**
 * Gets course catalog from both Contentful and local MDX files
 * Combines them into a single array, with local courses taking precedence
 * if there are duplicates (based on slug)
 * Groups courses with different formats (in-browser and on-machine) together
 */
const getCourseCatalog = async (): Promise<Array<ExtendedCourseOverview>> => {
  try {
    // Get courses from Contentful
    const contentfulCourses = await getContentfulData<
      "courseModuleCollection",
      Array<CourseOverview>
    >(QUERY_COURSE_CATALOG, "courseModuleCollection");

    console.log(
      "Contentful courses:",
      contentfulCourses.map((c) => c.slug),
    );

    // Get courses from local MDX files
    const localCourses = await getLocalCourses();

    console.log(
      "Local courses:",
      localCourses.map((c) => c.slug),
    );

    // Create a map of courses by base name (without format prefix)
    const courseMap = new Map<string, ExtendedCourseOverview>();

    // Process Contentful courses
    contentfulCourses.forEach((course) => {
      if (!course.slug) return;

      const isInBrowser = course.slug.startsWith("in-browser-");
      const baseName = isInBrowser
        ? course.slug.replace("in-browser-", "")
        : course.slug;

      if (courseMap.has(baseName)) {
        // Course already exists in the map, update formats information
        const existingCourse = courseMap.get(baseName)!;

        if (isInBrowser) {
          existingCourse.formats = {
            hasInBrowser: true,
            hasOnMachine: existingCourse.formats?.hasOnMachine || false,
            inBrowserSlug: course.slug,
            onMachineSlug: existingCourse.formats?.onMachineSlug,
          };
        } else {
          existingCourse.formats = {
            hasInBrowser: existingCourse.formats?.hasInBrowser || false,
            hasOnMachine: true,
            inBrowserSlug: existingCourse.formats?.inBrowserSlug,
            onMachineSlug: course.slug,
          };
        }
      } else {
        // Add new course to the map
        const formats = {
          hasInBrowser: isInBrowser,
          hasOnMachine: !isInBrowser,
          inBrowserSlug: isInBrowser ? course.slug : undefined,
          onMachineSlug: !isInBrowser ? course.slug : undefined,
        };

        courseMap.set(baseName, { ...course, formats });
      }
    });

    // Add local courses to the map (overriding Contentful courses with the same slug)
    localCourses.forEach((course) => {
      if (course.slug) {
        // For local courses, we don't have format information, so just add them as is
        // If a course with the same slug already exists, it will be overridden
        const existingCourse = courseMap.get(course.slug);
        if (existingCourse) {
          courseMap.set(course.slug, {
            ...course,
            formats: existingCourse.formats,
          });
        } else {
          courseMap.set(course.slug, {
            ...course,
            formats: {
              hasInBrowser: false,
              hasOnMachine: true,
              onMachineSlug: course.slug,
            },
          });
        }
      }
    });

    // Convert the map back to an array
    const allCourses = Array.from(courseMap.values());
    console.log(
      "Combined courses:",
      allCourses.map((c) => c.slug),
    );

    // Filter out the sample course from the displayed courses
    // but keep it accessible via direct URL
    const filteredCourses = allCourses.filter(
      (course) => course.slug !== "sample-course",
    );
    console.log(
      "Filtered courses (sample course hidden):",
      filteredCourses.map((c) => c.slug),
    );

    return filteredCourses;
  } catch (error) {
    console.error("Error fetching course catalog:", error);

    // If Contentful fails, fall back to local courses only
    return getLocalCourses();
  }
};

export { getCourseCatalog };
