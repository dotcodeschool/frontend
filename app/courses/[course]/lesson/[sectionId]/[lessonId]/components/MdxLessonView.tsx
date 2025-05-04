"use client";

import {
  Box,
  Flex,
  Link,
  Text,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { IoArrowBack, IoMenu } from "react-icons/io5";

import { TypeFile } from "@/lib/types";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { LessonNavigation } from "./LessonNavigation";
import { SidebarNavigation } from "./SidebarNavigation";

// Dynamically import SplitPane to avoid SSR issues
const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

// Import components from the Contentful course implementation
import { EditorComponents } from "../../../../(pages)/section/[section]/lesson/[lesson]/components/EditorComponents";

type LessonData = {
  title: string;
  author: string;
  content: string;
  sourceFiles: TypeFile[] | null;
  templateFiles: TypeFile[] | null;
  solutionFiles: TypeFile[] | null;
  navigation: {
    prev: { link: string; title: string } | null;
    next: { link: string; title: string };
    courseLink: string;
  };
  courseSlug: string;
  currentSectionId: string;
  currentLessonId: string;
  sections: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      completed?: boolean;
    }>;
  }>;
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
    courseSlug,
    currentSectionId,
    currentLessonId,
    sections,
  } = lessonData;

  // For mobile sidebar
  const { isOpen, onOpen, onClose } = useDisclosure();

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

      {/* Mobile menu button */}
      <Box
        position="absolute"
        right={4}
        top={4}
        zIndex={10}
        display={{ base: "block", md: "none" }}
      >
        <IconButton
          aria-label="Open navigation"
          icon={<IoMenu />}
          onClick={onOpen}
          variant="ghost"
          colorScheme="green"
        />
      </Box>

      {/* Mobile sidebar drawer */}
      <Box
        position="fixed"
        top={0}
        left={0}
        h="100vh"
        w="80%"
        maxW="300px"
        bg="white"
        zIndex={20}
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s ease"
        boxShadow={isOpen ? "lg" : "none"}
        display={{ base: "block", md: "none" }}
      >
        <Box pt={8} px={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Course Navigation
          </Text>
          <SidebarNavigation
            courseSlug={courseSlug}
            sections={sections}
            currentSectionId={currentSectionId}
            currentLessonId={currentLessonId}
          />
        </Box>
      </Box>

      {/* Backdrop for mobile sidebar */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={15}
          onClick={onClose}
          display={{ base: "block", md: "none" }}
        />
      )}

      {/* Desktop sidebar - always visible */}
      <Flex h="full" display={{ base: "none", md: "flex" }}>
        <Box w="250px">
          <SidebarNavigation
            courseSlug={courseSlug}
            sections={sections}
            currentSectionId={currentSectionId}
            currentLessonId={currentLessonId}
          />
        </Box>
        <Box flex="1" overflow="hidden">
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
      </Flex>
    </Box>
  );
};

export { MdxLessonView };
