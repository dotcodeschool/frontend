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
} from "@chakra-ui/react";
import NextLink from "next/link";
import { IoCheckmarkCircle, IoEllipseOutline } from "react-icons/io5";
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
};

export const SidebarNavigation = ({
  courseSlug,
  sections,
  currentSectionId,
  currentLessonId,
}: SidebarNavigationProps) => {
  const activeBg = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const borderColor = "whiteAlpha.200";

  return (
    <Box
      as="nav"
      h="calc(100vh - 140px)"
      overflowY="auto"
      w="100%"
      borderRight="1px"
      borderColor={borderColor}
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
        {sections.map((section) => (
          <AccordionItem key={section.id} border="none">
            <AccordionButton
              py={3}
              px={4}
              _hover={{ bg: hoverBg }}
              fontWeight="medium"
            >
              <Box flex="1" textAlign="left">
                {section.title}
              </Box>
              <AccordionIcon />
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
                            color={lesson.completed ? "green.500" : "gray.400"}
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
        ))}
      </Accordion>
    </Box>
  );
};
