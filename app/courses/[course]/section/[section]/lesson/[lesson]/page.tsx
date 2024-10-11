/** eslint-disable complexity */
import "@/styles/resizer.css";

import { Box, Grid, GridItem } from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote/rsc";

import {
  QUERY_COURSE_INFORMATION,
  QUERY_LESSON_INFORMATION,
  QUERY_SECTION_INFORMATION,
} from "@/app/courses/[course]/queries";
import { MDXComponents } from "@/components";
import { getContentfulData } from "@/lib/api/contentful";
import { TypeMDXComponents, TypeFile } from "@/lib/types";
import { ExtractedData, QueryResult } from "@/lib/types/contentfulUtils";
import { CourseModule, Lesson, Section, Asset } from "@/lib/types/schema";

import { EditorComponents, BottomNavbar } from "./components";
import { IconButtonFeedback } from "./components/IconButtonFeedback";
import { CourseDetails } from "@/app/courses/[course]/types";
import { getCourseData, getLessonData, getSectionData } from "./helpers";

export { generateMetadata } from "./metadata";

const constructFeedbackUrl = (
  githubUrl: string,
  course: string,
  section: string,
  lesson: string,
  lessonTitle: string,
) => {
  const encodedTitle = encodeURIComponent(`
    Dot Code School Suggestion: Feedback for Section ${section} - Lesson ${lesson}: ${lessonTitle}`);

  return `${githubUrl}/issues/new?assignees=&labels=feedback&template=feedback.md&title=${encodedTitle}`;
};

const LessonPage = async ({
  params,
}: {
  params: {
    course: string;
    section: string;
    lesson: string;
  };
}) => {
  const { course, section, lesson } = params;

  const sectionIndex = parseInt(section) - 1;
  const lessonIndex = parseInt(lesson) - 1;
  const courseData = await getCourseData(course);

  const sectionData = await getSectionData(course, sectionIndex);

  const lessonData = await getLessonData(course, sectionIndex, lessonIndex);

  const feedbackUrl = constructFeedbackUrl(
    courseData.githubUrl ?? "https://github.com/dotcodeschool/frontend",
    course,
    section,
    lesson,
    lessonData.title,
  );

  return (
    <Box
      h="100vh"
      overflow={{ base: "auto", md: "hidden" }}
      position="relative"
    >
      <Box>
        <IconButtonFeedback url={feedbackUrl} />
        <Box display={{ base: "none", md: "block" }}>
          <EditorComponents
            editorContent={startingFilesWithCodeAndLanguage}
            mdxContent={
              <MDXRemote
                components={MDXComponents}
                source={lessonData.content || ""}
              />
            }
            readOnly={readOnly}
            showHints={!readOnly}
            solution={solution}
          />
        </Box>
        <Grid
          display={{ base: "block", md: "none" }}
          gap={1}
          pb={24}
          templateColumns="repeat(12, 1fr)"
        >
          <GridItem colSpan={[12, 5]} overflowY="auto" pt={4} px={6}>
            <MDXRemote
              components={MDXComponents}
              source={lessonData.content || ""}
            />
          </GridItem>
          <GridItem colSpan={[12, 7]} overflow="clip">
            <EditorComponents
              editorContent={startingFilesWithCodeAndLanguage}
              readOnly={readOnly}
              showHints={!readOnly}
              solution={solution}
            />
          </GridItem>
        </Grid>
      </Box>
      <BottomNavbar
        chapterId={lesson}
        courseId={course}
        current={`${course}/section/${section}/lesson/${lesson}`}
        lessonId={lesson}
        next={next}
        prev={prev}
        sections={sectionsWithLessons}
      />
    </Box>
  );
};

export default LessonPage;
