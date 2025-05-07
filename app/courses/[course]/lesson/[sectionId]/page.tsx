import "@/styles/resizer.css";

import { Box, Divider } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import fs from "fs";
import path from "path";

import { Navbar } from "@/components";
import { bundleMdxContent } from "@/lib/mdx-bundle";

import { getMdxCourseDetails } from "../../helpers/getMdxCourseDetails";
import dynamic from "next/dynamic";

// Import components from the lesson directory
import { SidebarNavigation } from "./[lessonId]/components/SidebarNavigation";
import { LessonNavigation } from "./[lessonId]/components/LessonNavigation";

// Dynamically import components to avoid SSR issues
const MdxSectionView = dynamic(() =>
  import("./components/MdxSectionView").then((mod) => mod.MdxSectionView),
);
const SectionSkeleton = dynamic(() =>
  import("./components/SectionSkeleton").then((mod) => mod.SectionSkeleton),
);

type SectionPageProps = {
  params: {
    course: string;
    sectionId: string;
  };
};

const SectionPage = async ({ params }: SectionPageProps) => {
  const { course, sectionId } = params;

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

    // Find the current section index
    const currentSectionIndex = mdxCourse.sections.findIndex(
      (s) => s.id === sectionId,
    );

    // Get the previous section (if any)
    const prevSection = mdxCourse.sections[currentSectionIndex - 1];

    // Get the next section (if any)
    const nextSection = mdxCourse.sections[currentSectionIndex + 1];

    // Get the first lesson of the current section (if any)
    const firstLessonOfCurrentSection =
      section.lessons.length > 0 ? section.lessons[0] : null;

    // Get the last lesson of the previous section (if any)
    const lastLessonOfPrevSection =
      prevSection && prevSection.lessons.length > 0
        ? prevSection.lessons[prevSection.lessons.length - 1]
        : null;

    // Get the first lesson of the next section (if any)
    const firstLessonOfNextSection =
      nextSection && nextSection.lessons.length > 0
        ? nextSection.lessons[0]
        : null;

    // Prepare navigation links
    // Previous link: Last lesson of previous section or null
    const prevLink = lastLessonOfPrevSection
      ? `/courses/${course}/lesson/${prevSection.id}/${lastLessonOfPrevSection.id}`
      : null;

    // Next link: First lesson of current section, or first lesson of next section, or course overview
    const nextLink = firstLessonOfCurrentSection
      ? `/courses/${course}/lesson/${sectionId}/${firstLessonOfCurrentSection.id}`
      : firstLessonOfNextSection
        ? `/courses/${course}/lesson/${nextSection.id}/${firstLessonOfNextSection.id}`
        : `/courses/${course}`;

    const prevTitle = lastLessonOfPrevSection
      ? lastLessonOfPrevSection.title
      : null;
    const nextTitle = firstLessonOfCurrentSection
      ? firstLessonOfCurrentSection.title
      : firstLessonOfNextSection
        ? firstLessonOfNextSection.title
        : "Finish Course";

    // Bundle the MDX content
    let bundledContent = "";
    try {
      const result = await bundleMdxContent(section.content);
      bundledContent = result.code;
    } catch (error) {
      console.error("Error bundling MDX content:", error);
      // Provide a fallback if bundling fails
      bundledContent = `export default function MDXContent() { return <pre>${JSON.stringify(section.content)}</pre>; }`;
    }

    // Prepare section data for the view component
    const sectionData = {
      title: section.title,
      author: mdxCourse.author,
      content: bundledContent,
      lessons: section.lessons,
      navigation: {
        prev: prevLink ? { link: prevLink, title: prevTitle } : null,
        next: { link: nextLink, title: nextTitle },
        courseLink: `/courses/${course}`,
      },
      courseSlug: course,
      currentSectionId: sectionId,
      sections: mdxCourse.sections,
    };

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
        <Suspense fallback={<SectionSkeleton />}>
          <MdxSectionView sectionData={sectionData} />
        </Suspense>
      </Box>
    );
  } catch (error) {
    console.error("Error loading section:", error);
    return <SectionSkeleton />;
  }
};

export default SectionPage;
