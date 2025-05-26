"use client";

import {
  Box,
  Flex,
  Text,
  useDisclosure,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Link,
  HStack,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { IoMenu, IoPencil } from "react-icons/io5";
import { FaTwitter, FaFacebook, FaLinkedin, FaShareAlt } from "react-icons/fa";
import { usePathname } from "next/navigation";

import { TypeFile } from "@/lib/types";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

import { LessonNavigation } from "./LessonNavigation";
import { SidebarNavigation } from "./SidebarNavigation";

// Dynamically import SplitPane to avoid SSR issues
const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

// Import components from the Contentful course implementation
import { EditorComponents } from "../../../../(pages)/section/[section]/lesson/[lesson]/components/EditorComponents";
import { LinkIcon } from "@chakra-ui/icons";

type LessonData = {
  title: string;
  author: string;
  content: string;
  last_updated?: string; // Optional last updated date
  sourceFiles: TypeFile[] | null;
  templateFiles: TypeFile[] | null;
  solutionFiles: TypeFile[] | null;
  shouldShowEditor?: boolean; // Flag to control whether to show the editor
  navigation: {
    prev: { link: string; title: string } | null;
    next: { link: string; title: string };
    courseLink: string;
  };
  githubUrl?: string;
  commitHash?: string;
  isGitorial?: boolean;
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
    last_updated,
    sourceFiles,
    templateFiles,
    solutionFiles,
    shouldShowEditor = true, // Default to true for backward compatibility
    navigation,
    courseSlug,
    currentSectionId,
    currentLessonId,
    sections,
    githubUrl,
    commitHash,
    isGitorial,
  } = lessonData;

  // For mobile sidebar
  const { isOpen, onOpen, onClose } = useDisclosure();

  // For share functionality
  const pathname = usePathname();
  const toast = useToast();
  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${pathname}` : "";

  // GitHub edit URL - using the format that automatically handles forking for users without write access
  const githubEditUrl = `https://github.com/dotcodeschool/frontend/edit/master/content/courses/${courseSlug}/sections/${currentSectionId}/lessons/${currentLessonId}/${currentLessonId}.mdx`;

  // Share handlers
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: "Link copied",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(`Check out "${title}" on @dotcodeschool`)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(facebookUrl, "_blank");
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(linkedInUrl, "_blank");
  };

  // Determine if we have files to display and should show the editor
  const hasFiles = shouldShowEditor && (sourceFiles || templateFiles);

  // Determine which files to display in the editor
  const editorFiles = sourceFiles || templateFiles || [];
  const isReadOnly = !!sourceFiles; // Read-only if we're showing source files
  const showHints = !!templateFiles && !!solutionFiles; // Show hints if we have template and solution files

  const gitorialUrl = React.useMemo(
    () => (isGitorial ? githubUrl : undefined),
    [isGitorial, githubUrl],
  );

  return (
    <Box
      minH={{ base: "auto", md: "calc(100vh - 60px)" }}
      overflow={{ base: "visible", md: "hidden" }}
      position="relative"
    >
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
        bg="gray.700"
        zIndex={20}
        transform={isOpen ? "translateX(0)" : "translateX(-100%)"}
        transition="transform 0.3s ease"
        boxShadow={isOpen ? "lg" : "none"}
        display={{ base: "block", md: "none" }}
      >
        <Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            pb={4}
            pt={8}
            px={4}
            borderRight="1px solid"
            borderColor="whiteAlpha.200"
          >
            Course Navigation
          </Text>
          <SidebarNavigation
            courseSlug={courseSlug}
            sections={sections}
            currentSectionId={currentSectionId}
            currentLessonId={currentLessonId}
            courseLink={navigation.courseLink}
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

      {/* Mobile content view */}
      <Box display={{ base: "block", md: "none" }} pt={12} px={4} pb={20}>
        <Text as="h1" fontSize="xl" fontWeight="bold" mb={4}>
          {title}
        </Text>
        <Box className="mdx-content">
          <MDXBundlerRenderer code={content} />
        </Box>

        {last_updated && (
          <Text fontSize="sm" color="gray.500" mt={8} mb={4}>
            Last updated:{" "}
            {new Date(last_updated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        )}
        {/* Edit and Share buttons for mobile */}
        <HStack mt={6} mb={6} spacing={4} justifyContent="flex-end">
          <Tooltip label="Edit this page on GitHub">
            <Link href={githubEditUrl} isExternal>
              <IconButton
                aria-label="Edit this page"
                icon={<IoPencil />}
                size="sm"
                colorScheme="gray"
                variant="outline"
              />
            </Link>
          </Tooltip>

          <Menu>
            <Tooltip label="Share this page">
              <MenuButton
                as={IconButton}
                aria-label="Share this page"
                icon={<FaShareAlt />}
                size="sm"
                colorScheme="gray"
                variant="outline"
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                icon={<FaTwitter color="#1DA1F2" />}
                onClick={handleShareTwitter}
              >
                Twitter
              </MenuItem>
              <MenuItem
                icon={<FaFacebook color="#4267B2" />}
                onClick={handleShareFacebook}
              >
                Facebook
              </MenuItem>
              <MenuItem
                icon={<FaLinkedin color="#0077B5" />}
                onClick={handleShareLinkedIn}
              >
                LinkedIn
              </MenuItem>
              <Divider />
              <MenuItem icon={<LinkIcon />} onClick={handleCopyLink}>
                Copy link
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        {/* Mobile editor (if files exist) */}
        {hasFiles && (
          <Box mt={6} border="1px" borderColor="gray.200" borderRadius="md">
            <EditorComponents
              editorContent={editorFiles}
              mdxContent={null}
              readOnly={isReadOnly}
              showHints={showHints}
              solution={solutionFiles || []}
            />
          </Box>
        )}

        {/* Navigation buttons for mobile */}
        <LessonNavigation next={navigation.next} prev={navigation.prev} />
      </Box>

      {/* Desktop sidebar and content - always visible on desktop */}
      <Flex h="full" display={{ base: "none", md: "flex" }}>
        <Box w="250px">
          <SidebarNavigation
            courseSlug={courseSlug}
            sections={sections}
            currentSectionId={currentSectionId}
            currentLessonId={currentLessonId}
            courseLink={navigation.courseLink}
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
                h="calc(100vh - 110px)"
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

                  {last_updated && (
                    <Text fontSize="sm" color="gray.500" mt={8} mb={4}>
                      Last updated:{" "}
                      {new Date(last_updated).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  )}

                  {/* Edit and Share buttons for desktop with files */}
                  <HStack mt={8} spacing={4} justifyContent="flex-end">
                    <Tooltip label="Edit this page on GitHub">
                      <Link href={githubEditUrl} isExternal>
                        <IconButton
                          aria-label="Edit this page"
                          icon={<IoPencil />}
                          size="sm"
                          colorScheme="gray"
                          variant="outline"
                        />
                      </Link>
                    </Tooltip>

                    <Menu>
                      <Tooltip label="Share this page">
                        <MenuButton
                          as={IconButton}
                          aria-label="Share this page"
                          icon={<FaShareAlt />}
                          size="sm"
                          colorScheme="gray"
                          variant="outline"
                        />
                      </Tooltip>
                      <MenuList>
                        <MenuItem
                          icon={<FaTwitter color="#1DA1F2" />}
                          onClick={handleShareTwitter}
                        >
                          Twitter
                        </MenuItem>
                        <MenuItem
                          icon={<FaFacebook color="#4267B2" />}
                          onClick={handleShareFacebook}
                        >
                          Facebook
                        </MenuItem>
                        <MenuItem
                          icon={<FaLinkedin color="#0077B5" />}
                          onClick={handleShareLinkedIn}
                        >
                          LinkedIn
                        </MenuItem>
                        <Divider />
                        <MenuItem icon={<LinkIcon />} onClick={handleCopyLink}>
                          Copy link
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
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
                  gitorialUrl={gitorialUrl}
                  commitHash={commitHash}
                />
              </Flex>
            </Box>
          ) : (
            // If no files, show the MDX content centered with sufficient margins
            <Box
              h="calc(100vh - 110px)"
              overflowY="auto"
              p={6}
              pl={12} // Extra padding for the back button
              pb={20} // Extra padding for the navigation bar
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

                {last_updated && (
                  <Text fontSize="sm" color="gray.500" mt={8} mb={4}>
                    Last updated:{" "}
                    {new Date(last_updated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                )}

                {/* Edit and Share buttons for mobile */}
                <HStack mt={8} spacing={4} justifyContent="flex-end">
                  <Tooltip label="Edit this page on GitHub">
                    <Link href={githubEditUrl} isExternal>
                      <IconButton
                        aria-label="Edit this page"
                        icon={<IoPencil />}
                        size="sm"
                        colorScheme="gray"
                        variant="outline"
                      />
                    </Link>
                  </Tooltip>

                  <Menu>
                    <Tooltip label="Share this page">
                      <MenuButton
                        as={IconButton}
                        aria-label="Share this page"
                        icon={<FaShareAlt />}
                        size="sm"
                        colorScheme="gray"
                        variant="outline"
                      />
                    </Tooltip>
                    <MenuList>
                      <MenuItem
                        icon={<FaTwitter color="#1DA1F2" />}
                        onClick={handleShareTwitter}
                      >
                        Twitter
                      </MenuItem>
                      <MenuItem
                        icon={<FaFacebook color="#4267B2" />}
                        onClick={handleShareFacebook}
                      >
                        Facebook
                      </MenuItem>
                      <MenuItem
                        icon={<FaLinkedin color="#0077B5" />}
                        onClick={handleShareLinkedIn}
                      >
                        LinkedIn
                      </MenuItem>
                      <Divider />
                      <MenuItem icon={<LinkIcon />} onClick={handleCopyLink}>
                        Copy link
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
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
