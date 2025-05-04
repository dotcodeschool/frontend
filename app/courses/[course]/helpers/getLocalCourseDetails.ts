import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CourseDetails } from "../types";

/**
 * Gets course details from local MDX files
 * @param slug The course slug
 * @returns CourseDetails object or null if not found
 */
export const getLocalCourseDetails = async (
  slug: string,
): Promise<CourseDetails | null> => {
  const courseDir = path.join(process.cwd(), "content/courses", slug);

  // Skip if the directory doesn't exist
  if (!fs.existsSync(courseDir)) {
    return null;
  }

  const mdxFilePath = path.join(courseDir, `${slug}.mdx`);

  // Skip if the MDX file doesn't exist
  if (!fs.existsSync(mdxFilePath)) {
    return null;
  }

  // Read and parse the MDX file
  const fileContents = fs.readFileSync(mdxFilePath, "utf8");
  const { data } = matter(fileContents);

  // Get all sections from the sections directory
  const sectionsDir = path.join(courseDir, "sections");
  if (!fs.existsSync(sectionsDir)) {
    return null;
  }

  const sectionDirs = fs
    .readdirSync(sectionsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
    .map((dirent) => dirent.name);

  // Process each section
  const sections = [];
  for (const sectionSlug of sectionDirs) {
    const sectionDir = path.join(sectionsDir, sectionSlug);
    const sectionMdxPath = path.join(sectionDir, `${sectionSlug}.mdx`);

    // Skip if the section MDX file doesn't exist
    if (!fs.existsSync(sectionMdxPath)) {
      continue;
    }

    // Read and parse the section MDX file
    const sectionFileContents = fs.readFileSync(sectionMdxPath, "utf8");
    const { data: sectionData } = matter(sectionFileContents);

    // Get all lessons from the lessons directory
    const lessonsDir = path.join(sectionDir, "lessons");
    if (!fs.existsSync(lessonsDir)) {
      continue;
    }

    const lessonDirs = fs
      .readdirSync(lessonsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
      .map((dirent) => dirent.name);

    // Process each lesson
    const lessons = [];
    for (const lessonSlug of lessonDirs) {
      const lessonDir = path.join(lessonsDir, lessonSlug);
      const lessonMdxPath = path.join(lessonDir, `${lessonSlug}.mdx`);

      // Skip if the lesson MDX file doesn't exist
      if (!fs.existsSync(lessonMdxPath)) {
        continue;
      }

      // Read and parse the lesson MDX file
      const lessonFileContents = fs.readFileSync(lessonMdxPath, "utf8");
      const { data: lessonData } = matter(lessonFileContents);

      lessons.push({
        _id: lessonSlug,
        sys: { id: lessonSlug, environmentId: "master", spaceId: "local" },
        contentfulMetadata: { tags: [] },
        title: lessonData.title || lessonSlug,
        slug: lessonData.slug || lessonSlug,
        order: lessonData.order || 0,
      });
    }

    // Sort lessons by order
    lessons.sort((a, b) => a.order - b.order);

    sections.push({
      _id: sectionSlug,
      sys: {
        id: sectionSlug,
        environmentId: "master",
        spaceId: "local",
      },
      contentfulMetadata: { tags: [] },
      title: sectionData.title || sectionSlug,
      slug: sectionData.slug || sectionSlug,
      order: sectionData.order || 0,
      lessonsCollection: {
        items: lessons,
        total: lessons.length,
        limit: lessons.length,
        skip: 0,
      },
    });
  }

  // Sort sections by order
  sections.sort((a, b) => a.order - b.order);

  // Create the course details object
  const courseDetails: CourseDetails = {
    title: data.title || slug,
    description: data.description || "",
    author: data.author || "Unknown",
    level: data.level || "Beginner",
    language: data.language || "Unknown",
    format: "mdxCourse", // New format for MDX courses
    slug: data.slug || slug,
    githubUrl: data.github_url || "",
    sectionsCollection: {
      items: sections,
      total: sections.length,
      limit: sections.length,
      skip: 0,
    },
  };

  return courseDetails;
};
