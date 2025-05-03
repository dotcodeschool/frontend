"use client";

import { Box, Flex, Link, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { IoArrowBack } from "react-icons/io5";

import { TypeFile } from "@/lib/types";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { LessonNavigation } from "./LessonNavigation";

// Dynamically import SplitPane to avoid SSR issues
const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

// Import components from the Contentful course implementation
import { EditorComponents } from "../../../../(pages)/section/[section]/lesson/[lesson]/components/EditorComponents";

type LessonData = {
  title: string;
  content: string;
  sourceFiles: TypeFile[] | null;
  templateFiles: TypeFile[] | null;
  solutionFiles: TypeFile[] | null;
  navigation: {
    prev: { link: string; title: string } | null;
    next: { link: string; title: string };
    courseLink: string;
  };
};

type MdxLessonViewProps = {
  lessonData: LessonData;
};

const MdxLessonView = ({ lessonData }: MdxLessonViewProps) => {
  const {
    title,
    content,
    sourceFiles,
    templateFiles,
    solutionFiles,
    navigation,
  } = lessonData;

  // Determine if we have files to display
  const hasFiles = sourceFiles || templateFiles;

  // Determine which files to display in the editor
  const editorFiles = sourceFiles || templateFiles || [];
  const isReadOnly = !!sourceFiles; // Read-only if we're showing source files
  const showHints = !!templateFiles && !!solutionFiles; // Show hints if we have template and solution files

  return (
    <Box h="calc(100vh - 80px)" overflow="hidden" position="relative">
      {/* Back to course link */}
      <Box position="absolute" left={4} top={4} zIndex={10}>
        <Link color="green.500" fontSize="2xl" href={navigation.courseLink}>
          <IoArrowBack />
        </Link>
      </Box>

      {hasFiles ? (
        <Box
          as={SplitPane}
          defaultSize="50%"
          maxSize={-200}
          minSize={200}
          split="vertical"
          style={{ position: "relative" }}
        >
          {/* Left side - MDX content */}
          <Box
            h="calc(100vh - 140px)"
            overflowY="auto"
            p={6}
            pl={12} // Extra padding for the back button
            sx={{
              "::-webkit-scrollbar": {
                width: "2px",
              },
              ":hover::-webkit-scrollbar-thumb": {
                background: "whiteAlpha.300",
              },
            }}
          >
            <Box pt={8}>
              <Text as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
                {title}
              </Text>
              <Box className="mdx-content">
                <MDXBundlerRenderer code={content} />
              </Box>
            </Box>
          </Box>

          {/* Right side - Editor */}
          <Flex direction="column" h="full">
            <EditorComponents
              editorContent={editorFiles}
              mdxContent={null}
              readOnly={isReadOnly}
              showHints={showHints}
              solution={solutionFiles || []}
            />
          </Flex>
        </Box>
      ) : (
        // If no files, show the MDX content centered with sufficient margins
        <Box
          h="calc(100vh - 140px)"
          overflowY="auto"
          p={6}
          pl={12} // Extra padding for the back button
        >
          <Box 
            pt={8} 
            maxW="4xl" 
            mx="auto" // Center the content horizontally
            px={[4, 6, 8]} // Responsive padding on the sides
          >
            <Text as="h1" fontSize="2xl" fontWeight="bold" mb={4}>
              {title}
            </Text>
            <Box className="mdx-content">
              <MDXBundlerRenderer code={content} />
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation buttons */}
      <LessonNavigation next={navigation.next} prev={navigation.prev} />
    </Box>
  );
};

export { MdxLessonView };
