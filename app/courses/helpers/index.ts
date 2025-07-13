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

// Type for tracking course variants
interface CourseVariants {
  local?: CourseOverview;
  contentful?: CourseOverview;
  localIsInBrowser?: boolean;
  contentfulIsInBrowser?: boolean;
}

/**
 * Gets course catalog from both Contentful and local MDX files
 * Combines them into a single array, preferring local courses
 * unless a Contentful version has both formats available
 */
const getCourseCatalog = async (): Promise<Array<ExtendedCourseOverview>> => {
  try {
    // Get courses from both sources
    const localCourses = await getLocalCourses();
    const contentfulCourses = await getContentfulData<
      "courseModuleCollection",
      Array<CourseOverview>
    >(QUERY_COURSE_CATALOG, "courseModuleCollection");

    console.log(
      "Local courses:",
      localCourses.map((c) => c.slug),
    );

    // Create maps to track course variants
    const courseMap = new Map<string, ExtendedCourseOverview>();
    const variantMap = new Map<string, CourseVariants>();

    // Map local courses
    localCourses.forEach((course) => {
      if (course.slug) {
        const isInBrowser = course.slug.startsWith("in-browser-");
        const baseSlug = isInBrowser
          ? course.slug.replace("in-browser-", "")
          : course.slug;

        variantMap.set(baseSlug, {
          local: course,
          localIsInBrowser: isInBrowser,
        });
      }
    });

    // Map Contentful courses and check for variants
    contentfulCourses.forEach((course) => {
      if (course.slug) {
        const isInBrowser = course.slug.startsWith("in-browser-");
        const baseSlug = isInBrowser
          ? course.slug.replace("in-browser-", "")
          : course.slug;

        const existing = variantMap.get(baseSlug) || {};
        variantMap.set(baseSlug, {
          ...existing,
          contentful: course,
          contentfulIsInBrowser: isInBrowser,
        });
      }
    });

    // Second pass: Create final course entries
    variantMap.forEach((variants, baseSlug) => {
      const { local, contentful, localIsInBrowser, contentfulIsInBrowser } =
        variants;

      // Case 1: Course exists in both places with different formats
      if (local && contentful) {
        const mainCourse = contentful; // Use Contentful as base for metadata
        courseMap.set(baseSlug, {
          ...mainCourse,
          formats: {
            hasInBrowser: Boolean(localIsInBrowser || contentfulIsInBrowser),
            hasOnMachine: Boolean(!localIsInBrowser || !contentfulIsInBrowser),
            inBrowserSlug: localIsInBrowser
              ? local.slug
              : contentfulIsInBrowser
                ? contentful.slug
                : undefined,
            onMachineSlug: !localIsInBrowser
              ? local.slug
              : !contentfulIsInBrowser
                ? contentful.slug
                : undefined,
          },
        } as ExtendedCourseOverview);
      }
      // Case 2: Course exists only locally
      else if (local) {
        courseMap.set(baseSlug, {
          ...local,
          formats: {
            hasInBrowser: Boolean(localIsInBrowser),
            hasOnMachine: !localIsInBrowser,
            inBrowserSlug: localIsInBrowser ? local.slug : undefined,
            onMachineSlug: !localIsInBrowser ? local.slug : undefined,
          },
        } as ExtendedCourseOverview);
      }
      // Case 3: Course exists only in Contentful
      else if (contentful) {
        courseMap.set(baseSlug, {
          ...contentful,
          formats: {
            hasInBrowser: Boolean(contentfulIsInBrowser),
            hasOnMachine: !contentfulIsInBrowser,
            inBrowserSlug: contentfulIsInBrowser ? contentful.slug : undefined,
            onMachineSlug: !contentfulIsInBrowser ? contentful.slug : undefined,
          },
        } as ExtendedCourseOverview);
      }
    });

    // Convert the map back to an array and filter out sample course
    const allCourses = Array.from(courseMap.values());
    const filteredCourses = allCourses.filter(
      (course) => course.slug !== "sample-course",
    );

    return filteredCourses;
  } catch (error) {
    console.error("Error in getCourseCatalog:", error);
    return [];
  }
};

export { getCourseCatalog };
