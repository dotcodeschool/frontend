"use client";

import {
  Box,
  Card,
  Circle,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { ButtonPrimary } from "@/components";

interface CourseCardProps {
  index: number;
  title: string;
  description: string;
  level: string;
  language: string;
  slug: string;
  isLastItem: boolean;
}

const CourseCard = ({
  index,
  title,
  description,
  level,
  language,
  slug,
  isLastItem,
}: CourseCardProps) => {
  return (
    <Box position="relative">
      {!isLastItem && (
        <Box
          position="absolute"
          left="32px"
          top="64px"
          height="calc(100% - 64px)"
          width="4px"
          bg="gray.700"
          zIndex={1}
        />
      )}
      <Flex>
        <Circle
          size="64px"
          bg="green.300"
          color="gray.900"
          fontWeight="bold"
          fontSize="xl"
          mr={4}
          zIndex={2}
          position="relative"
        >
          {index + 1}
        </Circle>
        <Card
          flex="1"
          direction={{ base: "column", md: "row" }}
          overflow="hidden"
          mb={12}
          p={8}
          borderLeft="4px"
          borderLeftColor="green.500"
        >
          <Stack>
            <Heading as="h2" size="md">
              {title}
            </Heading>
            <Text>
              {level} • {language}
            </Text>
            <Text py={2}>{description}</Text>
            <HStack mt={4} spacing={4}>
              <ButtonPrimary
                as={Link}
                href={`/courses/${slug}`}
                _hover={{ textDecor: "none" }}
                w="fit-content"
              >
                Start Course
              </ButtonPrimary>
            </HStack>
          </Stack>
        </Card>
      </Flex>
    </Box>
  );
};

export { CourseCard };
