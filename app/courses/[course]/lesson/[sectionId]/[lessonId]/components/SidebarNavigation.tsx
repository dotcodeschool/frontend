"use client";

import {
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";
import {
  IoCheckmarkCircle,
  IoEllipseOutline,
  IoArrowBack,
} from "react-icons/io5";
import React from "react";

type Lesson = {
  id: string;
  title: string;
  completed?: boolean;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type SidebarNavigationProps = {
  courseSlug: string;
  sections: Section[];
  currentSectionId: string;
  currentLessonId: string;
  courseLink?: string; // Link to go back to course page
};

export const SidebarNavigation = ({
  courseSlug,
  sections,
  currentSectionId,
  currentLessonId,
  courseLink,
}: SidebarNavigationProps) => {
  // Determine if we're in mobile view based on parent container
  const isMobile = useColorModeValue(false, true); // Dark mode is used for mobile sidebar

  // Colors based on mobile/desktop view
  const activeBg = isMobile ? "gray.600" : "whiteAlpha.200";
  const hoverBg = "gray.600";
  const borderColor = "whiteAlpha.200";
  const textColor = isMobile ? "white" : "inherit";
  const iconColor = isMobile ? "green.300" : "green.500";

  return (
    <Box
      as="nav"
      h={{ base: "calc(100vh - 60px)", md: "calc(100vh - 110px)" }}
      w="100%"
      borderRight="1px"
      borderColor={borderColor}
      display="flex"
      flexDirection="column"
      color={textColor}
    >
      {/* Back to course link */}
      {courseLink && (
        <Flex px={4} py={3} borderBottom="1px" borderColor={borderColor}>
          <Link
            as={NextLink}
            href={courseLink}
            color={iconColor}
            fontSize="md"
            display="flex"
            alignItems="center"
            _hover={{
              textDecoration: "none",
              color: isMobile ? "green.300" : "green.600",
            }}
          >
            <Icon as={IoArrowBack} mr={2} />
            <Text>Back to Course</Text>
          </Link>
        </Flex>
      )}

      <Box
        overflowY="auto"
        flex="1"
        sx={{
          "::-webkit-scrollbar": {
            width: "2px",
          },
          ":hover::-webkit-scrollbar-thumb": {
            background: "whiteAlpha.300",
          },
        }}
      >
        <Accordion
          allowMultiple
          defaultIndex={sections.findIndex((s) => s.id === currentSectionId)}
        >
          {sections.map((section) => {
            const isSectionActive = section.id === currentSectionId;
            return (
              <AccordionItem key={section.id} border="none">
                <AccordionButton
                  py={3}
                  px={4}
                  _hover={{ bg: hoverBg }}
                  fontWeight="medium"
                  bg={
                    isSectionActive && !currentLessonId
                      ? activeBg
                      : "transparent"
                  }
                  borderLeft="4px solid"
                  borderColor={
                    isSectionActive && !currentLessonId
                      ? "green.500"
                      : "transparent"
                  }
                >
                  <Link
                    as={NextLink}
                    href={`/courses/${courseSlug}/lesson/${section.id}`}
                    flex="1"
                    textAlign="left"
                    _hover={{ textDecoration: "none" }}
                    onClick={(e) => e.stopPropagation()} // Prevent accordion from toggling when clicking the link
                  >
                    {section.title}
                  </Link>
                  {section.lessons.length > 0 && <AccordionIcon />}
                </AccordionButton>
                <AccordionPanel pb={4} px={0}>
                  <VStack align="stretch" spacing={1}>
                    {section.lessons.map((lesson) => {
                      const isActive =
                        section.id === currentSectionId &&
                        lesson.id === currentLessonId;
                      return (
                        <Box
                          key={lesson.id}
                          bg={isActive ? activeBg : "transparent"}
                          _hover={{ bg: hoverBg }}
                          borderLeft="4px solid"
                          borderColor={isActive ? "green.500" : "transparent"}
                        >
                          <Link
                            as={NextLink}
                            href={`/courses/${courseSlug}/lesson/${section.id}/${lesson.id}`}
                            display="block"
                            py={2}
                            px={6}
                            fontSize="sm"
                          >
                            <HStack spacing={2}>
                              <Icon
                                as={
                                  lesson.completed
                                    ? IoCheckmarkCircle
                                    : IoEllipseOutline
                                }
                                color={
                                  lesson.completed
                                    ? iconColor
                                    : isMobile
                                      ? "gray.300"
                                      : "gray.400"
                                }
                              />
                              <Text>{lesson.title}</Text>
                            </HStack>
                          </Link>
                        </Box>
                      );
                    })}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Box>
    </Box>
  );
};
