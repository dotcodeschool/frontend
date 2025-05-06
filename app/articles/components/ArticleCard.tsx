"use client";

import Link from "next/link";
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  Flex,
  HStack,
  Tag,
  TagLabel,
} from "@chakra-ui/react";

interface ArticleProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  author: string;
  formattedDate: string;
}

export default function ArticleCard({ article }: { article: ArticleProps }) {
  // Stop propagation for nested links
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      overflow="hidden"
      variant="outline"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => (window.location.href = `/articles/${article.slug}`)}
    >
      <CardBody>
        <Stack spacing={3}>
          <Heading as="h3" size="md">
            {article.title}
          </Heading>
          <Flex flexWrap="wrap" gap={1}>
            {article.tags.map((tag) => (
              <Tag
                key={tag}
                size="sm"
                colorScheme="green"
                variant="subtle"
                as={Link}
                href={`/articles?tag=${tag.toLowerCase()}`}
                _hover={{ textDecoration: "none", bg: "green.800" }}
                onClick={handleClick}
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
          <Text color="gray.400" fontSize="sm">
            {article.description}
          </Text>
          <HStack justify="space-between" fontSize="sm" color="gray.500">
            <Text
              as={Link}
              href={`/articles?category=${article.category.toLowerCase()}`}
              color="green.400"
              _hover={{ textDecoration: "underline" }}
              onClick={handleClick}
            >
              {article.category}
            </Text>
            <Text>{article.formattedDate}</Text>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
}
