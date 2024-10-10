import { Heading, HStack, Tag, Text } from "@chakra-ui/react";

import { CourseDetails } from "../types";

const CourseHeader = ({
  title,
  author,
  description,
  level,
  language,
}: Pick<
  CourseDetails,
  "title" | "author" | "description" | "level" | "language"
>) => (
  <>
    <Heading as="h1" fontWeight="800" my={4} size="xl">
      {title}
    </Heading>
    {author?.name && author.url ? (
      <Text>
        Written by{" "}
        <a
          href={author.url}
          rel="noopener noreferrer"
          style={{ color: "#68D391" }}
          target="_blank"
        >
          {author.name}
        </a>
      </Text>
    ) : null}
    <Text mt={6}>{description}</Text>
    <HStack mt={4}>
      {[level, language].map((tag, key) => (
        <Tag colorScheme="green" key={key} size="md" variant="subtle">
          {tag}
        </Tag>
      ))}
    </HStack>
  </>
);

export { CourseHeader };
