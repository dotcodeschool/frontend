"use client";

import React from "react";
import {
  Box,
  Flex,
  Text,
  useDisclosure,
  IconButton,
  useColorModeValue,
  Card,
  CardBody,
  List,
  ListItem,
  Icon,
  Link,
  Heading,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { IoMenu } from "react-icons/io5";
import NextLink from "next/link";

import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";
import { SidebarNavigation } from "../[lessonId]/components/SidebarNavigation";
import { LessonNavigation } from "../[lessonId]/components/LessonNavigation";

type MdxSectionViewProps = {
  sectionData: {
    title: string;
    author: string | { name: string; url: string };
    content: string;
    lessons: {
      id: string;
      title: string;
      slug: string;
    }[];
    navigation: {
      prev: { link: string; title: string } | null;
      next: { link: string; title: string };
      courseLink: string;
    };
    courseSlug: string;
    currentSectionId: string;
    sections: {
      id: string;
      title: string;
      slug: string;
      lessons: {
        id: string;
        title: string;
        slug: string;
      }[];
    }[];
  };
};

export const MdxSectionView: React.FC<MdxSectionViewProps> = ({
  sectionData,
}) => {
  const {
    title,
    content,
    lessons,
    navigation,
    courseSlug,
    currentSectionId,
    sections,
  } = sectionData;

  // For mobile sidebar
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Use color mode values for better dark/light mode support
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const linkHoverBg = useColorModeValue("gray.50", "gray.700");

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
            currentLessonId=""
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

        {/* Lessons list for mobile */}
        {lessons.length > 0 && (
          <Box mt={6}>
            <Heading as="h2" size="lg" mb={4}>
              Lessons in this section
            </Heading>
            <List spacing={3}>
              {lessons.map((lesson) => (
                <ListItem
                  key={lesson.id}
                  p={2}
                  borderBottom="1px"
                  borderColor="gray.700"
                >
                  <Link
                    as={NextLink}
                    href={`/courses/${courseSlug}/lesson/${currentSectionId}/${lesson.id}`}
                    display="flex"
                    alignItems="center"
                    color="green.300"
                    fontWeight="medium"
                  >
                    <Icon as={ChevronRightIcon} mr={2} />
                    {lesson.title}
                  </Link>
                </ListItem>
              ))}
            </List>
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
            currentLessonId=""
            courseLink={navigation.courseLink}
          />
        </Box>
        <Box flex="1" overflow="hidden">
          {/* Content area */}
          <Box
            h="calc(100vh - 110px)"
            overflowY="auto"
            p={6}
            pb={20} // Extra padding for the navigation bar
          >
            <Box
              pt={8}
              maxW="4xl"
              mx="auto" // Center the content horizontally
              px={[4, 6, 8]} // Responsive padding on the sides
            >
              <Text as="h1" fontSize="2xl" fontWeight="bold" mb={6}>
                {title}
              </Text>

              {/* Section content */}
              <Box className="mdx-content" mb={10}>
                <MDXBundlerRenderer code={content} />
              </Box>

              {/* Lessons list */}
              {lessons.length > 0 && (
                <Card
                  variant="outline"
                  bg={cardBg}
                  borderColor={cardBorder}
                  borderRadius="lg"
                  shadow="md"
                  overflow="hidden"
                  mt={8}
                >
                  <CardBody p={0}>
                    <Box p={6} borderBottom="1px" borderColor={dividerColor}>
                      <Heading as="h2" size="lg" mb={2} color={headingColor}>
                        Lessons in this section
                      </Heading>
                      <Text color="gray.500" fontSize="md">
                        Complete these lessons to master this section
                      </Text>
                    </Box>

                    <List spacing={0}>
                      {lessons.map((lesson, index) => (
                        <ListItem
                          key={lesson.id}
                          borderBottom={
                            index < lessons.length - 1 ? "1px" : "0"
                          }
                          borderColor={dividerColor}
                          transition="all 0.2s"
                          _hover={{ bg: linkHoverBg }}
                        >
                          <Link
                            as={NextLink}
                            href={`/courses/${courseSlug}/lesson/${currentSectionId}/${lesson.id}`}
                            display="flex"
                            alignItems="center"
                            p={4}
                            color="green.300"
                            fontWeight="medium"
                            width="100%"
                            _hover={{ textDecoration: "none" }}
                          >
                            <Icon as={ChevronRightIcon} mr={3} boxSize={5} />
                            {lesson.title}
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </CardBody>
                </Card>
              )}
            </Box>
          </Box>

          {/* Navigation buttons */}
          <LessonNavigation next={navigation.next} prev={navigation.prev} />
        </Box>
      </Flex>
    </Box>
  );
};
