import { Session } from "next-auth";
import fs from "fs";
import path from "path";

import { getUserRepo, getCourseFromDb } from "@/lib/api";
import { getContentfulData } from "@/lib/api/contentful";

import {
  QUERY_LESSONS_COLLECTION_ID_AND_TOTAL,
  QUERY_COURSE_INFORMATION,
  QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
} from "../../../../queries";
import { CourseDetails, CourseQuery, LessonIdAndTotalData } from "../types";
import { getMdxCourseDetails } from "./getMdxCourseDetails";

const getCourseDetails = async (
  slug: string,
  queryFields: CourseQuery,
): Promise<CourseDetails | null> => {
  // Check if this is a local MDX course
  const mdxCourseDir = path.join(process.cwd(), "content/courses", slug);
  if (fs.existsSync(mdxCourseDir)) {
    try {
      const mdxCourse = await getMdxCourseDetails(slug);
      if (mdxCourse) {
        // Convert to CourseDetails format
        return {
          title: mdxCourse.title,
          description: mdxCourse.description,
          author: mdxCourse.author,
          level: mdxCourse.level,
          language: mdxCourse.language,
          format: mdxCourse.format,
          slug: mdxCourse.slug,
          githubUrl: mdxCourse.githubUrl,
          sectionsCollection: {
            items: mdxCourse.sections.map((section) => ({
              _id: section.id,
              sys: {
                id: section.id,
                environmentId: "master",
                spaceId: "local",
              },
              contentfulMetadata: { tags: [] },
              title: section.title,
              lessonsCollection: {
                items: section.lessons.map((lesson) => ({
                  _id: lesson.id,
                  sys: {
                    id: lesson.id,
                    environmentId: "master",
                    spaceId: "local",
                  },
                  contentfulMetadata: { tags: [] },
                  title: lesson.title,
                  slug: lesson.slug,
                })),
                total: section.lessons.length,
                limit: section.lessons.length,
                skip: 0,
              },
            })),
            total: mdxCourse.sections.length,
            limit: mdxCourse.sections.length,
            skip: 0,
          },
        };
      }
    } catch (error) {
      console.error(`Error loading MDX course ${slug}:`, error);
    }
  }

  // Fall back to Contentful if not a local MDX course or if loading failed
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
  
  console.log("[getStartCourseUrl] format:", format, "slug:", slug, "sessionContext:", !!sessionContext);
  
  // Check if this is an in-browser course
  const isInBrowserCourse = format === "inBrowserCourse";
  console.log("[getStartCourseUrl] isInBrowserCourse:", isInBrowserCourse);

  // For in-browser courses, go directly to lessons
  if (isInBrowserCourse) {
    console.log("[getStartCourseUrl] In-browser course, redirecting to lessons");
    return lessonsUrl;
  }

  // For on-machine courses, check if repo is set up
  try {
    console.log("[getStartCourseUrl] On-machine course, checking repo");
    
    // Check if user is logged in
    if (!sessionContext || !sessionContext.user) {
      console.log("[getStartCourseUrl] No session context or user, redirecting to repo setup");
      return repoSetupUrl;
    }
    
    // Check if the course exists in the database
    const course = await getCourseFromDb(slug);
    if (!course) {
      console.error("[getStartCourseUrl] Course not found in database:", slug);
      console.log("[getStartCourseUrl] Redirecting to repo setup as fallback");
      return repoSetupUrl;
    }
    
    const repo = await getUserRepo(slug, sessionContext);
    console.log("[getStartCourseUrl] getUserRepo result:", repo);

    // If repo exists and is set up properly, go to lessons
    if (repo && repo.test_ok === true) {
      console.log("[getStartCourseUrl] Repo exists and is set up, redirecting to lessons");
      return lessonsUrl;
    }

    // Otherwise, go to repo setup
    console.log("[getStartCourseUrl] Repo doesn't exist or isn't set up, redirecting to repo setup");
    return repoSetupUrl;
  } catch (error) {
    console.error("[getStartCourseUrl] Error checking user repo:", error);
    // If there's an error, default to repo setup
    return repoSetupUrl;
  }
};

/**
 * Checks if both in-browser and on-machine formats are available for a course
 * @param slug The course slug
 * @returns An object containing information about available formats
 */
const checkAvailableFormats = async (
  slug: string,
): Promise<{
  hasInBrowser: boolean;
  hasOnMachine: boolean;
  currentFormat: string | null;
}> => {
  // Determine if this is an in-browser or on-machine course based on the slug
  const isInBrowser = slug.startsWith("in-browser-");
  const baseSlug = isInBrowser ? slug.replace("in-browser-", "") : slug;
  const alternateSlug = isInBrowser ? baseSlug : `in-browser-${baseSlug}`;

  // Check if the alternate format exists
  const alternateExists = await getCourseDetails(
    alternateSlug,
    QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
  );

  return {
    hasInBrowser: isInBrowser ? true : !!alternateExists,
    hasOnMachine: isInBrowser ? !!alternateExists : true,
    currentFormat: isInBrowser ? "inBrowserCourse" : "onMachineCourse",
  };
};

export {
  getCourseDetails,
  checkAvailableFormats,
  getLessonCollectionIdAndTotal,
  getLessonCollectionTotal,
  getStartCourseUrl,
};
