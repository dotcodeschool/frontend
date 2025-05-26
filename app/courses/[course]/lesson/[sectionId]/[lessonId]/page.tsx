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
import { getChangedFiles } from "./utils/getChangedFiles";

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

    // Get lesson files if they exist - only show files that have changed
    let sourceFiles = null;
    let templateFiles = null;
    let solutionFiles = null;
    let shouldShowEditor = false;

    if (lesson.hasFiles) {
      // Get files that have changed compared to the previous lesson
      const fileData = await getChangedFiles(
        course,
        sectionId,
        lessonId,
        section.lessons,
      );

      sourceFiles = fileData.sourceFiles;
      templateFiles = fileData.templateFiles;
      solutionFiles = fileData.solutionFiles;
      shouldShowEditor = fileData.shouldShowEditor;
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
    // If this is the first lesson of the section, previous should go to the previous section
    // If this is the last lesson of the section, next should go to the next section
    const isFirstLesson = currentLessonIndex === 0;
    const isLastLesson = currentLessonIndex === section.lessons.length - 1;

    const prevLink = isFirstLesson
      ? `/courses/${course}/lesson/${sectionId}`
      : `/courses/${course}/lesson/${sectionId}/${prevLesson.id}`;

    const nextLink = isLastLesson
      ? nextSection
        ? `/courses/${course}/lesson/${nextSection.id}`
        : `/courses/${course}`
      : `/courses/${course}/lesson/${sectionId}/${nextLesson.id}`;

    const prevTitle = isFirstLesson
      ? section.title // Use current section title when going back to section page
      : prevLesson.title;

    const nextTitle = isLastLesson
      ? nextSection
        ? nextSection.title
        : "Finish Course"
      : nextLesson.title;

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
      last_updated: lesson.last_updated, // Add last_updated from lesson metadata
      sourceFiles,
      templateFiles,
      solutionFiles,
      shouldShowEditor, // Add flag to control whether to show the editor
      navigation: {
        prev: prevLink ? { link: prevLink, title: prevTitle } : null,
        next: { link: nextLink, title: nextTitle },
        courseLink: `/courses/${course}`,
      },
      courseSlug: course,
      currentSectionId: sectionId,
      currentLessonId: lessonId,
      sections: mdxCourse.sections,
      githubUrl: mdxCourse.githubUrl,
      isGitorial: mdxCourse.isGitorial,
      commitHash: lesson.commit_hash,
    };

    console.log(
      "/lesson/[sectionId]/[lessonId] files: ",
      sourceFiles,
      templateFiles,
      solutionFiles,
    );

    return (
      <Box
        minH="100vh"
        overflow="auto"
        position="relative"
        pb={{ base: "70px", md: 0 }} // Add padding at the bottom for the fixed navigation bar
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
