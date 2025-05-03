import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Circle,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

type MdxLesson = {
  id: string;
  title: string;
  slug: string;
  order: number;
  content: string;
  hasFiles: boolean;
  fileType: string | null;
};

type MdxSection = {
  id: string;
  title: string;
  slug: string;
  order: number;
  content: string;
  lessons: MdxLesson[];
};

type MdxModuleItemProps = {
  index: number;
  section: MdxSection;
  slug: string;
};

const MdxModuleItem = ({ index, section, slug }: MdxModuleItemProps) => {
  return (
    <AccordionItem border="none" mb={4}>
      <AccordionButton
        _expanded={{ bg: "gray.800", color: "white" }}
        _hover={{ bg: "gray.700" }}
        bg="gray.900"
        borderRadius="md"
        p={4}
      >
        <Flex align="center" flex="1" textAlign="left">
          <Circle
            bg="green.300"
            color="gray.900"
            fontSize="md"
            fontWeight="bold"
            mr={4}
            size="32px"
          >
            {index + 1}
          </Circle>
          <Box>
            <Heading as="h3" fontWeight="600" size="md">
              {section.title}
            </Heading>
            <Text color="gray.400" fontSize="sm" mt={1}>
              {section.lessons.length} lessons
            </Text>
          </Box>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4} pt={2}>
        {section.lessons.map((lesson, lessonIndex) => (
          <Flex
            key={lesson.id}
            _hover={{ bg: "gray.800" }}
            align="center"
            borderRadius="md"
            mb={2}
            p={3}
          >
            <Circle
              bg="gray.700"
              color="gray.300"
              fontSize="sm"
              fontWeight="bold"
              mr={4}
              size="24px"
            >
              {lessonIndex + 1}
            </Circle>
            <Link
              as={NextLink}
              color="gray.300"
              flex="1"
              fontWeight="500"
              href={`/courses/${slug}/lesson/${section.id}/${lesson.id}`}
              _hover={{ color: "white", textDecoration: "none" }}
            >
              {lesson.title}
            </Link>
            {lesson.hasFiles && (
              <Text color="gray.500" fontSize="xs" ml={2}>
                {lesson.fileType === 'source' ? 'Source Files' : 'Exercise'}
              </Text>
            )}
          </Flex>
        ))}
      </AccordionPanel>
    </AccordionItem>
  );
};

export { MdxModuleItem };
