import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CourseOverview } from "@/lib/types";

/**
 * Reads local course files from the content/courses directory
 */
export const getLocalCourses = async (): Promise<CourseOverview[]> => {
  const coursesDirectory = path.join(process.cwd(), "content/courses");

  if (!fs.existsSync(coursesDirectory)) {
    return [];
  }

  const courseDirectories = fs
    .readdirSync(coursesDirectory, { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        !dirent.name.startsWith(".") &&
        !dirent.name.startsWith("_") &&
        dirent.name !== "course-template" &&
        dirent.name !== "sample-course",
    )
    .map((dirent) => dirent.name);

  const courses: CourseOverview[] = [];

  for (const courseSlug of courseDirectories) {
    const mdxFilePath = path.join(coursesDirectory, courseSlug, `${courseSlug}.mdx`);

    if (!fs.existsSync(mdxFilePath)) {
      continue;
    }

    const fileContents = fs.readFileSync(mdxFilePath, "utf8");
    const { data } = matter(fileContents);

    courses.push({
      slug: data.slug || courseSlug,
      title: data.title || courseSlug,
      description: data.description || "",
      level: data.level || "Beginner",
      language: data.language || "Unknown",
      author: data.author || "Unknown",
    });
  }

  return courses;
};
