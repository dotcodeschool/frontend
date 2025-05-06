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
  Badge,
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

export default function FeaturedArticleCard({
  article,
}: {
  article: ArticleProps;
}) {
  // Stop propagation for nested links
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      overflow="hidden"
      variant="outline"
      borderWidth="1px"
      borderColor="green.200"
      bg="green.900"
      color="gray.100"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => (window.location.href = `/articles/${article.slug}`)}
    >
      <CardBody>
        <Badge colorScheme="gray" mb={2}>
          Featured
        </Badge>
        <Stack spacing={3}>
          <Heading as="h3" size="md">
            {article.title}
          </Heading>
          <Flex flexWrap="wrap" gap={1}>
            {article.tags.map((tag) => (
              <Tag
                key={tag}
                size="sm"
                colorScheme="blackAlpha"
                variant="solid"
                as={Link}
                href={`/articles?tag=${tag.toLowerCase()}`}
                _hover={{ textDecoration: "none", bg: "blackAlpha.400" }}
                onClick={handleClick}
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
          <Text color="gray.400" fontSize="sm">
            {article.description}
          </Text>
          <HStack justify="space-between" fontSize="sm" color="gray.400">
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
