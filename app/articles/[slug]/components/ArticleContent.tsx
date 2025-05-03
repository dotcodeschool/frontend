"use client";

import Link from "next/link";
import {
  Box,
  Heading,
  Text,
  Flex,
  Tag,
  Avatar,
  HStack,
  Divider,
  Button,
  VStack,
  LinkBox,
  LinkOverlay,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { ChevronRightIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { MDXBundlerRenderer } from "@/components/mdx-bundler-renderer";

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  code: string;
}

interface RelatedArticle {
  slug: string;
  title: string;
  description: string;
}

interface ArticleContentProps {
  article: ArticleData;
  formattedDate: string;
  relatedArticles: RelatedArticle[];
}

export default function ArticleContent({
  article,
  formattedDate,
  relatedArticles,
}: ArticleContentProps) {
  return (
    <>
      {/* Article Header */}
      <Box mb={8}>
        {/* Breadcrumb */}
        <Breadcrumb
          separator={<ChevronRightIcon color="gray.500" />}
          mb={6}
          fontSize="sm"
          color="gray.500"
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/articles">
              Articles
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{article.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Button
          as={Link}
          href="/articles"
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          size="sm"
          mb={4}
        >
          Back to articles
        </Button>

        <Heading as="h1" size="2xl" mb={4}>
          {article.title}
        </Heading>

        <Flex wrap="wrap" gap={2} mb={4}>
          {article.tags.map((tag) => (
            <Tag key={tag} colorScheme="gray" size="md">
              {tag}
            </Tag>
          ))}
        </Flex>

        <HStack mt={6} spacing={4}>
          <Avatar
            name={article.author}
            size="md"
            src={`/authors/${article.author.toLowerCase().replace(" ", "-")}.jpg`}
          />
          <Box>
            <Text fontWeight="bold">{article.author}</Text>
            <Text fontSize="sm" color="gray.500">
              {formattedDate}
            </Text>
          </Box>
        </HStack>

        <Divider my={6} />
      </Box>

      {/* Article Content using the existing MDXBundlerRenderer */}
      <Box className="article-content">
        <MDXBundlerRenderer code={article.code} />
      </Box>

      <Divider my={10} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Box mt={10}>
          <Heading as="h3" size="lg" mb={6}>
            Related Articles
          </Heading>
          <VStack spacing={4} align="stretch">
            {relatedArticles.map((relatedArticle) => (
              <LinkBox
                key={relatedArticle.slug}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                _hover={{ bg: "gray.700" }}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <LinkOverlay
                      as={Link}
                      href={`/articles/${relatedArticle.slug}`}
                    >
                      <Heading as="h4" size="md">
                        {relatedArticle.title}
                      </Heading>
                    </LinkOverlay>
                    <Text fontSize="sm" color="gray.500" noOfLines={2}>
                      {relatedArticle.description}
                    </Text>
                  </Box>
                  <ChevronRightIcon boxSize={6} color="green.500" />
                </Flex>
              </LinkBox>
            ))}
          </VStack>
        </Box>
      )}
    </>
  );
}
