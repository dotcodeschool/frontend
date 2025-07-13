import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CourseOverview } from "@/lib/types";

// Extended type for local courses that includes format information
interface LocalCourseOverview extends CourseOverview {
  formats: {
    hasInBrowser: boolean;
    hasOnMachine: boolean;
    inBrowserSlug?: string;
    onMachineSlug?: string;
  };
}

/**
 * Reads local course files from the content/courses directory
 * and returns them in the same format as the Contentful API
 */
export const getLocalCourses = async (): Promise<CourseOverview[]> => {
  const coursesDirectory = path.join(process.cwd(), "content/courses");

  console.log("Looking for courses in:", coursesDirectory);

  // Skip if the directory doesn't exist
  if (!fs.existsSync(coursesDirectory)) {
    console.log("Courses directory does not exist");
    return [];
  }

  // Get all directories in the courses folder (excluding files and special directories)
  const allDirectories = fs.readdirSync(coursesDirectory, {
    withFileTypes: true,
  });
  console.log(
    "All directories in courses folder:",
    allDirectories.map((d) => d.name),
  );

  const courseDirectories = allDirectories
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        !dirent.name.startsWith(".") &&
        !dirent.name.startsWith("_") && // Skip directories starting with underscore
        dirent.name !== "course-template", // Skip the template directory
    )
    .map((dirent) => dirent.name);

  console.log("Found course directories:", courseDirectories);

  // Create a map to group course variants together
  const courseMap = new Map<string, LocalCourseOverview>();

  // Process each course directory
  for (const courseSlug of courseDirectories) {
    const courseDir = path.join(coursesDirectory, courseSlug);
    const mdxFilePath = path.join(courseDir, `${courseSlug}.mdx`);

    // Skip if the MDX file doesn't exist
    if (!fs.existsSync(mdxFilePath)) {
      console.warn(`MDX file does not exist for course: ${courseSlug}`);
      continue;
    }

    // Read and parse the MDX file
    const fileContents = fs.readFileSync(mdxFilePath, "utf8");
    const { data } = matter(fileContents);

    // Determine if this is an in-browser variant
    const isInBrowser = courseSlug.startsWith("in-browser-");
    const baseSlug = isInBrowser
      ? courseSlug.replace("in-browser-", "")
      : courseSlug;

    // Extract the required fields for CourseOverview
    const course: LocalCourseOverview = {
      slug: data.slug || courseSlug,
      title: data.title || courseSlug,
      description: data.description || "",
      level: data.level || "Beginner",
      language: data.language || "Unknown",
      author: data.author || "Unknown",
      formats: {
        hasInBrowser: isInBrowser,
        hasOnMachine: !isInBrowser,
        inBrowserSlug: isInBrowser ? courseSlug : undefined,
        onMachineSlug: !isInBrowser ? courseSlug : undefined,
      },
    };

    // Check if we already have a variant of this course
    const existingCourse = courseMap.get(baseSlug);
    if (existingCourse) {
      // Update formats information
      const formats = {
        hasInBrowser: existingCourse.formats.hasInBrowser || isInBrowser,
        hasOnMachine: existingCourse.formats.hasOnMachine || !isInBrowser,
        inBrowserSlug: isInBrowser
          ? courseSlug
          : existingCourse.formats.inBrowserSlug,
        onMachineSlug: !isInBrowser
          ? courseSlug
          : existingCourse.formats.onMachineSlug,
      };

      // Prefer the on-machine (local) course metadata
      if (!isInBrowser) {
        courseMap.set(baseSlug, { ...course, formats });
      } else {
        courseMap.set(baseSlug, { ...existingCourse, formats });
      }
    } else {
      courseMap.set(baseSlug, course);
    }
  }

  // Convert map back to array and cast to CourseOverview[]
  // This is safe because CourseOverview is a subset of LocalCourseOverview
  return Array.from(courseMap.values()) as CourseOverview[];
};
