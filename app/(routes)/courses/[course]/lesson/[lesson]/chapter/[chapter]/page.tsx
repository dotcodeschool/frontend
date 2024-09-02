import { Box, Grid, GridItem, IconButton, Link, Text } from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { endsWith, isEmpty } from "lodash";
import MDXComponents from "@/app/ui/components/lessons-interface/mdx-components";
import Navbar from "@/app/ui/components/navbar";
import BottomNavbar from "@/app/ui/components/lessons-interface/bottom-navbar";
import { EditorComponents } from "@/app/ui/components/lessons-interface/EditorComponents";
import "@/app/ui/styles/resizer.css";

import { getContentById, getContentByType } from "@/app/api/get-content/route";
import {
  TypeCourseModuleSkeleton,
  TypeLessonFields,
  TypeSectionFields,
  TypeSectionSkeleton,
} from "@/app/lib/types/contentful";
import { EntryCollection } from "contentful";
import { notFound } from "next/navigation";
import { TypeFile } from "@/app/lib/types/TypeFile";

async function fetchFile(file: any) {
  if (typeof file !== "object" || !file.fields) {
    throw new Error("File is not an object or file.fields is null");
  }

  const { url, fileName } = file.fields.file;
  const response = await fetch(`https:${url}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return {
    fileName,
    code: await response.text(),
  };
}

export default async function CourseModule({
  params,
}: {
  params: {
    course: string;
    lesson: string;
    chapter: string;
  };
}) {
  const { course, lesson, chapter } = params;
  const courses: EntryCollection<TypeCourseModuleSkeleton> =
    await getContentByType("courseModule");

  const courseData = courses.items.find(
    (course) => course.fields.slug === params.course,
  );
  if (!courseData) {
    notFound();
  }

  const sections: TypeSectionFields[] = await Promise.all(
    (courseData.fields.sections as unknown as TypeSectionSkeleton[]).map(
      async (section) => {
        const lessons = await Promise.all(
          section.fields.lessons.map(async (lesson) => {
            return await getContentById(lesson.sys.id);
          }),
        );
        return {
          ...section.fields,
          lessons,
        };
      },
    ),
  );

  const sectionData = sections[Number(lesson) - 1];
  if (!sectionData) {
    notFound();
  }

  const lessons: TypeLessonFields[] = sectionData.lessons.map((lesson) => {
    return lesson.fields as TypeLessonFields;
  });

  if (!lessons) {
    notFound();
  }

  const lessonData: TypeLessonFields = lessons[
    Number(chapter) - 1
  ] as TypeLessonFields;
  if (!lessonData) {
    notFound();
  }

  const { source, template, solution } = lessonData.files.fields;

  const readOnly = isEmpty(solution);
  const startingFiles = !isEmpty(source) ? source : template;
  const startingFilesWithCode = await Promise.all(startingFiles.map(fetchFile));
  const startingFilesWithCodeAndLanguage = startingFilesWithCode.map(
    (file: TypeFile) => ({
      ...file,
      language: endsWith(file.fileName, ".diff") ? "diff" : "rust",
    }),
  );

  const prev: string | undefined =
    chapter === "1" && lesson === "1"
      ? undefined
      : chapter === "1"
        ? `${course}/lesson/${Number(lesson) - 1}/chapter/${sections[Number(lesson) - 2].lessons.length}`
        : `${course}/lesson/${lesson}/chapter/${Number(chapter) - 1}`;

  const next: string | undefined =
    chapter === sections[Number(lesson) - 1].lessons.length.toString() &&
    lesson === sections.length.toString()
      ? undefined
      : chapter === sections[Number(lesson) - 1].lessons.length.toString()
        ? `${course}/lesson/${Number(lesson) + 1}/chapter/1`
        : `${course}/lesson/${lesson}/chapter/${Number(chapter) + 1}`;

  return (
    <Box
      h="100vh"
      position="relative"
      overflow={{ base: "auto", md: "hidden" }}
    >
      <Navbar
        cta={false}
        isLessonInterface
        lessonDetails={{
          courseId: course,
          lessonId: lesson,
          chapterId: chapter,
          chapters: lessons,
          githubUrl: courseData.fields.githubUrl.toString(),
        }}
      />
      <Box>
        <IconButton
          as={Link}
          display={{ base: "block", md: "none" }}
          aria-label="Submit Feedback"
          variant="solid"
          colorScheme="blue"
          icon={
            <Text fontSize="xl" w="full" textAlign="center" pt="2">
              ✍️
            </Text>
          }
          position="fixed"
          bottom={20}
          right={4}
          zIndex={100}
          href={`${courseData.fields.githubUrl.toString()}/issues/new?assignees=&labels=feedback&template=feedback.md&title=Dot+Code+School+Suggestion:+Feedback+for+Section+${lesson}+-+Chapter+${chapter}:+${lessonData.lessonName}`}
          isExternal
          _hover={{ textDecor: "none" }}
        />
        <Box display={{ base: "none", md: "block" }}>
          <EditorComponents
            showHints={!!solution}
            isAnswerOpen={false}
            readOnly={readOnly}
            incorrectFiles={[]}
            solution={solution}
            editorContent={startingFilesWithCodeAndLanguage}
            mdxContent={
              <MDXRemote
                source={lessonData.lessonContent.toString()}
                components={MDXComponents as any}
              />
            }
          />
        </Box>
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={1}
          pb={24}
          display={{ base: "block", md: "none" }}
        >
          <GridItem colSpan={[12, 5]} overflowY="auto" px={6} pt={4}>
            <MDXRemote
              source={lessonData.lessonContent.toString()}
              components={MDXComponents as any}
            />
          </GridItem>
          <GridItem colSpan={[12, 7]} overflow="clip">
            <EditorComponents
              showHints={!!solution}
              isAnswerOpen={false}
              readOnly={readOnly}
              incorrectFiles={[]}
              solution={solution}
              editorContent={startingFilesWithCodeAndLanguage}
            />
          </GridItem>
        </Grid>
      </Box>
      <BottomNavbar
        prev={prev}
        next={next}
        courseId={course}
        lessonId={lesson}
        chapterId={chapter}
        current={`${course}/lesson/${lesson}/chapter/${chapter}`}
        sections={sections}
      />
    </Box>
  );
}
