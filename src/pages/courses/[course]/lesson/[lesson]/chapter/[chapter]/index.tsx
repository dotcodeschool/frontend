// TODO: Refactoring

import {
  Box,
  Grid,
  GridItem,
  IconButton,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import _, { endsWith, find, flatMapDeep, isEmpty, map, nth } from "lodash";
import { serialize } from "next-mdx-remote/serialize";
import stripComments from "strip-comments";

import { getContentById, getContentByType } from "@/pages/api/get-content";
import MDXComponents from "@/components/lessons-interface/mdx-components";
import Navbar from "@/components/navbar";
import BottomNavbar from "@/components/lessons-interface/bottom-navbar";
import { useEffect, useState } from "react";
import EditorTabs from "@/components/lessons-interface/editor-tabs";

// TODO: Move to type.ts file
type File = {
  fileName: string;
  code: string;
  language: string;
};

interface Files {
  source: File[];
  template: File[];
  solution: File[];
}

interface Props {
  courseId: string;
  lessonId: string;
  chapterId: string;
  mdxSource: MDXRemoteSerializeResult;
  files: Files;
  current: string;
  prev: string;
  next: string;
  chapters: any[];
  githubUrl: string;
}

export default function CourseModule({
  courseId,
  lessonId,
  chapterId,
  mdxSource,
  files,
  current,
  prev,
  next,
  chapters,
  githubUrl,
}: Props) {
  const { source, template, solution } = files;

  const readOnly = isEmpty(solution);
  const startingFiles = !isEmpty(source) ? source : template;
  const rawFiles = startingFiles.map((file) => ({
    ...file,
    language: endsWith(file.fileName, ".diff") ? "diff" : "rust",
  }));

  const currentChapter = chapters[Number(chapterId) - 1]?.title;
  const toast = useToast();

  const [editorContent, setEditorContent] = useState(rawFiles);
  const [doesMatch, setDoesMatch] = useState(false);
  const [isAnswerOpen, setIsAnswerOpen] = useState(false);
  const [incorrectFiles, setIncorrectFiles] = useState<File[]>([]);
  const [checkedAnswer, setCheckedAnswer] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const toggleAnswer = () => {
    const incorrect: File[] = [];
    const _doesMatchArr = map(rawFiles, (file, index) => {
      if (file.fileName.endsWith(".diff")) return true;
      const solutionFile = solution[index];
      // Remove comments and whitespace
      const fileCodeWithoutComments = stripComments(file.code);
      const fileContent = fileCodeWithoutComments.replace(/\s+/g, " ").trim();

      const solutionCodeWithoutComments = stripComments(solutionFile.code);
      const solutionContent = solutionCodeWithoutComments
        .replace(/\s+/g, " ")
        .trim();

      const isFileCorrect = fileContent === solutionContent;
      if (!isFileCorrect) {
        incorrect.push(file);
      }
      return isFileCorrect;
    });
    const _doesMatch = _doesMatchArr.every((doesMatch) => doesMatch);
    if (!_doesMatch && !isAnswerOpen) {
      setShowHints(true);
      toast.closeAll();
      toast({
        title: "Your solution doesn't match ours",
        description:
          "This doesn't mean you're wrong! We just might have different ways of solving the problem.",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }
    setIncorrectFiles(incorrect);
    setDoesMatch(_doesMatch);
    setCheckedAnswer(true);
    setIsAnswerOpen(!isAnswerOpen);
  };

  useEffect(() => {
    if (checkedAnswer) {
      if (doesMatch) {
        toast.closeAll();
        toast({
          title: "Correct!",
          description: "You have passed the lesson",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [checkedAnswer, doesMatch, toast]);

  return (
    <Box h="100vh" position="relative">
      <Box h="95vh" px={[6, 12]} mx="auto">
        <Navbar
          cta={false}
          isLessonInterface
          lessonDetails={{
            courseId,
            lessonId,
            chapterId,
            chapters,
            githubUrl,
          }}
        />
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
          href={`${githubUrl}/issues/new?assignees=&labels=feedback&template=feedback.md&title=Dot+Code+School+Suggestion:+Feedback+for+Section+${lessonId}+-+Chapter+${chapterId}:+${currentChapter}`}
          isExternal
          _hover={{ textDecor: "none" }}
        />

        <Grid templateColumns="repeat(12, 1fr)" gap={1} pb={24}>
          <GridItem
            colSpan={[12, 5]}
            h={["fit-content", "80vh"]}
            overflowY="auto"
            pr={6}
            pt={4}
            sx={{
              "::-webkit-scrollbar": {
                width: "6px",
                borderRadius: "8px",
              },
              "::-webkit-scrollbar-thumb": {
                width: "6px",
                borderRadius: "8px",
              },
              ":hover::-webkit-scrollbar-thumb": { background: "gray.700" },
            }}
          >
            <MDXRemote {...mdxSource} components={MDXComponents} />
          </GridItem>
          <GridItem colSpan={[12, 7]} overflow="clip">
            <EditorTabs
              showHints={showHints}
              isAnswerOpen={isAnswerOpen}
              readOnly={readOnly}
              incorrectFiles={incorrectFiles}
              solution={solution}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </GridItem>
        </Grid>
      </Box>
      <BottomNavbar
        prev={prev}
        next={next}
        courseId={courseId}
        lessonId={lessonId}
        chapterId={chapterId}
        current={current}
        chapters={chapters}
        doesMatch={doesMatch}
        isOpen={isAnswerOpen}
        {...(!isEmpty(solution) && { toggleAnswer })}
      />
    </Box>
  );
}

async function fetchEntry(id: string) {
  const entry = await getContentById(id);
  if (!entry) {
    throw new Error(`Entry with id ${id} not found`);
  }

  return entry;
}

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

export async function getStaticProps({
  params,
}: {
  params: { course: string; lesson: string; chapter: string };
}) {
  const { course, lesson, chapter } = params;
  const parsedLesson = Number(lesson);
  const parsedChapter = Number(chapter);
  const res = await getContentByType("courseModule");
  const _course = find(res.items, (item) => {
    const slug = item.fields.slug;
    if (!slug || typeof slug !== "string") {
      throw new Error("Module name is undefined");
    }
    return slug === course;
  });
  const modules: any = _course?.fields.sections;

  const githubUrl = _course?.fields.githubUrl;

  const lessonModule: any = nth(modules, parsedLesson - 1);

  const chapters = lessonModule?.fields.lessons;

  const entries: any = await Promise.all(
    map(chapters, (chapter) => fetchEntry(chapter.sys.id)),
  ).catch(console.error);

  const entry = entries[parsedChapter - 1];

  const files = entry.fields.files;

  const source = await Promise.all(map(files.fields.source, fetchFile)).catch(
    console.error,
  );
  const template = await Promise.all(
    map(files.fields.template, fetchFile),
  ).catch(console.error);
  const solution = await Promise.all(
    map(files.fields.solution, fetchFile),
  ).catch(console.error);

  const lessonContent: any = entry.fields.lessonContent;

  const mdxSource = await serialize(lessonContent);

  const current = `${course}/lesson/${parsedLesson}/chapter/${parsedChapter}`;

  const prev =
    parsedChapter > 1
      ? `${course}/lesson/${parsedLesson}/chapter/${parsedChapter - 1}`
      : null;
  const next =
    parsedChapter < chapters.length
      ? `${course}/lesson/${parsedLesson}/chapter/${parsedChapter + 1}`
      : null;

  const _chapters = entries.map((entry: any, index: number) => ({
    id: entry.sys.id,
    index,
    lesson: `${course}/lesson/${parsedLesson}/chapter/${index + 1}`,
    title: entry.fields.lessonName,
  }));

  return {
    props: {
      courseId: course,
      lessonId: lesson,
      chapterId: chapter,
      mdxSource,
      files: { source, template, solution },
      current,
      prev,
      next,
      chapters: _chapters,
      githubUrl,
    },
  };
}

// Validates and returns the lessons array
function getSections(entry: any) {
  const sections = entry.fields.sections;
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    throw new Error(
      "Failed to fetch the entry from Contentful or sections array is null or empty",
    );
  }
  return sections;
}

// Maps lessons to modules
function mapSectionsToLessons(sections: any[]) {
  return sections.map((section, index) => {
    if (!section) {
      throw new Error("Lesson is undefined");
    }

    return {
      section: `${index + 1}`,
      id: section.sys.id,
      title: section.fields.title,
      description: section.fields.description,
    };
  });
}

export async function getStaticPaths() {
  const courseModules = await getContentByType("courseModule");
  const paths = await Promise.all(
    courseModules.items.map(async (item: any) => {
      const sections = getSections(item);
      const modules = mapSectionsToLessons(sections);

      return Promise.all(
        modules.map(async (module) => {
          const chapters = await getContentById(module.id);
          const _chapters: any = chapters.fields.lessons;
          return map(_chapters, (chapter, index) => {
            return {
              params: {
                course: item.fields.slug,
                lesson: module.section,
                chapter: `${index + 1}`,
              },
            };
          });
        }),
      );
    }),
  );

  const flattenedPaths = flatMapDeep(paths);

  return {
    paths: flattenedPaths,
    fallback: false,
  };
}
