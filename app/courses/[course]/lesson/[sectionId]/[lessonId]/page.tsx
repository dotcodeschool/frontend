import "@/styles/resizer.css";

import { Box, Divider } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import fs from "fs";
import path from "path";

import { Navbar } from "@/components";
import { bundleMdxContent } from "@/lib/mdx-bundle";

import { getMdxCourseDetails } from "../../../helpers/getMdxCourseDetails";
import dynamic from "next/dynamic";
import { getLanguageFromFileName } from "./utils/getLanguageFromFileName";

// Dynamically import components to avoid SSR issues
const MdxLessonView = dynamic(() =>
  import("./components/MdxLessonView").then((mod) => mod.MdxLessonView),
);
const LessonSkeleton = dynamic(() =>
  import("./components/LessonSkeleton").then((mod) => mod.LessonSkeleton),
);

type LessonPageProps = {
  params: {
    course: string;
    sectionId: string;
    lessonId: string;
  };
};

const LessonPage = async ({ params }: LessonPageProps) => {
  const { course, sectionId, lessonId } = params;

  try {
    // Get course details
    const mdxCourse = await getMdxCourseDetails(course);

    if (!mdxCourse) {
      return notFound();
    }

    // Find the section
    const section = mdxCourse.sections.find((s) => s.id === sectionId);

    if (!section) {
      return notFound();
    }

    // Find the lesson
    const lesson = section.lessons.find((l) => l.id === lessonId);

    if (!lesson) {
      return notFound();
    }

    // Get lesson files if they exist
    let sourceFiles = null;
    let templateFiles = null;
    let solutionFiles = null;

    if (lesson.hasFiles) {
      const filesDir = path.join(
        process.cwd(),
        "content/courses",
        course,
        "sections",
        sectionId,
        "lessons",
        lessonId,
        "files",
      );

      if (
        lesson.fileType === "source" &&
        fs.existsSync(path.join(filesDir, "source"))
      ) {
        sourceFiles = fs
          .readdirSync(path.join(filesDir, "source"))
          .filter((file) => !file.startsWith("."))
          .map((file) => ({
            fileName: file,
            path: `/content/courses/${course}/sections/${sectionId}/lessons/${lessonId}/files/source/${file}`,
            code: fs.readFileSync(path.join(filesDir, "source", file), "utf8"),
            language: getLanguageFromFileName(file),
          }));
      } else if (lesson.fileType === "template-solution") {
        if (fs.existsSync(path.join(filesDir, "template"))) {
          templateFiles = fs
            .readdirSync(path.join(filesDir, "template"))
            .filter((file) => !file.startsWith("."))
            .map((file) => ({
              fileName: file,
              path: `/content/courses/${course}/sections/${sectionId}/lessons/${lessonId}/files/template/${file}`,
              code: fs.readFileSync(
                path.join(filesDir, "template", file),
                "utf8",
              ),
              language: getLanguageFromFileName(file),
            }));
        }

        if (fs.existsSync(path.join(filesDir, "solution"))) {
          solutionFiles = fs
            .readdirSync(path.join(filesDir, "solution"))
            .filter((file) => !file.startsWith("."))
            .map((file) => ({
              fileName: file,
              path: `/content/courses/${course}/sections/${sectionId}/lessons/${lessonId}/files/solution/${file}`,
              code: fs.readFileSync(
                path.join(filesDir, "solution", file),
                "utf8",
              ),
              language: getLanguageFromFileName(file),
            }));
        }
      }
    }

    // Find next and previous lessons
    const currentLessonIndex = section.lessons.findIndex(
      (l) => l.id === lessonId,
    );
    const nextLesson = section.lessons[currentLessonIndex + 1];
    const prevLesson = section.lessons[currentLessonIndex - 1];

    // If there's no next lesson in this section, check if there's a next section
    let nextSection = null;
    let nextSectionFirstLesson = null;

    if (!nextLesson) {
      const currentSectionIndex = mdxCourse.sections.findIndex(
        (s) => s.id === sectionId,
      );
      nextSection = mdxCourse.sections[currentSectionIndex + 1];

      if (nextSection && nextSection.lessons.length > 0) {
        nextSectionFirstLesson = nextSection.lessons[0];
      }
    }

    // If there's no previous lesson in this section, check if there's a previous section
    let prevSection = null;
    let prevSectionLastLesson = null;

    if (!prevLesson) {
      const currentSectionIndex = mdxCourse.sections.findIndex(
        (s) => s.id === sectionId,
      );
      prevSection = mdxCourse.sections[currentSectionIndex - 1];

      if (prevSection && prevSection.lessons.length > 0) {
        prevSectionLastLesson =
          prevSection.lessons[prevSection.lessons.length - 1];
      }
    }

    // Prepare navigation links
    const prevLink = prevLesson
      ? `/courses/${course}/lesson/${sectionId}/${prevLesson.id}`
      : prevSectionLastLesson && prevSection
        ? `/courses/${course}/lesson/${prevSection.id}/${prevSectionLastLesson.id}`
        : null;

    const nextLink = nextLesson
      ? `/courses/${course}/lesson/${sectionId}/${nextLesson.id}`
      : nextSectionFirstLesson && nextSection
        ? `/courses/${course}/lesson/${nextSection.id}/${nextSectionFirstLesson.id}`
        : `/courses/${course}`;

    const prevTitle = prevLesson
      ? prevLesson.title
      : prevSectionLastLesson
        ? prevSectionLastLesson.title
        : null;

    const nextTitle = nextLesson
      ? nextLesson.title
      : nextSectionFirstLesson
        ? nextSectionFirstLesson.title
        : "Finish Course";

    // Bundle the MDX content
    let bundledContent = "";
    try {
      const result = await bundleMdxContent(lesson.content);
      bundledContent = result.code;
    } catch (error) {
      console.error("Error bundling MDX content:", error);
      // Provide a fallback if bundling fails
      bundledContent = `export default function MDXContent() { return <pre>${JSON.stringify(lesson.content)}</pre>; }`;
    }

    // Prepare lesson data for the view component
    const lessonData = {
      title: lesson.title,
      author: mdxCourse.author,
      content: bundledContent,
      sourceFiles,
      templateFiles,
      solutionFiles,
      navigation: {
        prev: prevLink ? { link: prevLink, title: prevTitle } : null,
        next: { link: nextLink, title: nextTitle },
        courseLink: `/courses/${course}`,
      },
      courseSlug: course,
      currentSectionId: sectionId,
      currentLessonId: lessonId,
      sections: mdxCourse.sections,
    };

    return (
      <Box
        h="100vh"
        overflow={{ base: "auto", md: "hidden" }}
        position="relative"
      >
        <Box mx={4}>
          <Navbar cta={false} />
        </Box>
        <Divider />
        <Suspense fallback={<LessonSkeleton />}>
          <MdxLessonView lessonData={lessonData} />
        </Suspense>
      </Box>
    );
  } catch (error) {
    console.error("Error loading lesson:", error);
    return <LessonSkeleton />;
  }
};

export default LessonPage;
