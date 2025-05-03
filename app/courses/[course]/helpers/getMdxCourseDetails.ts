import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Gets course details from local MDX files
 * @param slug The course slug
 * @returns Course details object or null if not found
 */
export const getMdxCourseDetails = async (slug: string) => {
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
  const { data, content } = matter(fileContents);

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
    const { data: sectionData, content: sectionContent } =
      matter(sectionFileContents);

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
      const { data: lessonData, content: lessonContent } =
        matter(lessonFileContents);

      // Check if the lesson has files
      const filesDir = path.join(lessonDir, "files");
      let hasFiles = false;
      let fileType = null;

      if (fs.existsSync(filesDir)) {
        hasFiles = true;

        // Determine file type (source or template/solution)
        if (fs.existsSync(path.join(filesDir, "source"))) {
          fileType = "source";
        } else if (
          fs.existsSync(path.join(filesDir, "template")) &&
          fs.existsSync(path.join(filesDir, "solution"))
        ) {
          fileType = "template-solution";
        }
      }

      lessons.push({
        id: lessonSlug,
        title: lessonData.title || lessonSlug,
        slug: lessonData.slug || lessonSlug,
        order: lessonData.order || 0,
        content: lessonContent,
        hasFiles,
        fileType,
      });
    }

    // Sort lessons by order
    lessons.sort((a, b) => a.order - b.order);

    sections.push({
      id: sectionSlug,
      title: sectionData.title || sectionSlug,
      slug: sectionData.slug || sectionSlug,
      order: sectionData.order || 0,
      content: sectionContent,
      lessons,
    });
  }

  // Sort sections by order
  sections.sort((a, b) => a.order - b.order);

  // Create the course details object
  const courseDetails = {
    title: data.title || slug,
    description: data.description || "",
    author: data.author_url
      ? { name: data.author || "Unknown", url: data.author_url }
      : data.author || "Unknown",
    level: data.level || "Beginner",
    language: data.language || "Unknown",
    format: "mdxCourse",
    slug: data.slug || slug,
    githubUrl: data.github_url || "",
    content,
    sections,
  };

  return courseDetails;
};
