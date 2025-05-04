import { Heading, HStack, Tag, Text, Box, Flex } from "@chakra-ui/react";

import { CourseDetails } from "../types";

const CourseHeader = ({
  title,
  author,
  description,
  level,
  language,
  last_updated,
  format = "contentful", // Default to contentful format
}: Pick<
  CourseDetails,
  "title" | "author" | "description" | "level" | "language"
> & {
  format?: string; // Add format prop to determine if it's an MDX or Contentful course
  last_updated?: string; // Add last_updated prop
}) => (
  <>
    <Heading as="h1" fontWeight="800" my={4} size="xl">
      {title}
    </Heading>
    {author ? (
      <Text>
        Written by{" "}
        {typeof author === "string" ? (
          author
        ) : author.name && author.url ? (
          <a
            href={author.url}
            rel="noopener noreferrer"
            style={{ color: "#68D391" }}
            target="_blank"
          >
            {author.name}
          </a>
        ) : (
          author.name
        )}
      </Text>
    ) : null}
    <Text mt={6}>{description}</Text>

    {/* Display last updated date if available */}
    {last_updated && (
      <Text fontSize="sm" color="gray.500" mt={2}>
        Last updated:{" "}
        {new Date(last_updated).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    )}

    {/* Only show tags for Contentful courses */}
    {format !== "mdxCourse" && (
      <HStack mt={4}>
        {[level, language].map((tag, key) => (
          <Tag colorScheme="green" key={key} size="md" variant="subtle">
            {tag}
          </Tag>
        ))}
      </HStack>
    )}
  </>
);

export { CourseHeader };
