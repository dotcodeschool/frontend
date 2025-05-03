import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  // Button,
} from "@chakra-ui/react";

import ArticleBreadcrumb from "./components/ArticleBreadcrumb";
import ArticleCard from "./components/ArticleCard";
import FeaturedArticleCard from "./components/FeaturedArticleCard";

// Types for our article metadata
interface ArticleMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
  author: string;
  date: string;
  featured?: boolean;
}

interface ArticleWithSlug extends ArticleMetadata {
  slug: string;
}

type ArticlesSearchParams = {
  category?: string;
  tag?: string;
};

// Helper function to format category or tag labels
function formatLabel(label: string): string {
  return label
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: ArticlesSearchParams;
}) {
  const { category, tag } = searchParams;
  const allArticles = await getArticles();

  // Filter articles based on category or tag if provided
  let articles = allArticles;
  let pageTitle = "Articles";
  let pageDescription =
    "Technical insights, tutorials, and updates from Polkadot's core developers";

  if (category) {
    const formattedCategory = formatLabel(category);
    articles = allArticles.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase(),
    );
    pageTitle = `${formattedCategory} Articles`;
    pageDescription = `Browse our collection of articles about ${category.toLowerCase()} in the Polkadot ecosystem`;

    if (articles.length === 0) {
      notFound();
    }
  } else if (tag) {
    const formattedTag = formatLabel(tag);
    articles = allArticles.filter((article) =>
      article.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
    pageTitle = `Articles tagged with ${formattedTag}`;
    pageDescription = `Browse our collection of articles about ${tag.toLowerCase()} in the Polkadot ecosystem`;

    if (articles.length === 0) {
      notFound();
    }
  }

  // Only show featured articles on the main page
  // const categories = Array.from(
  //   new Set(allArticles.map((article) => article.category)),
  // );
  const featuredArticles = allArticles.filter((article) => article.featured);
  const isFiltered = !!category || !!tag;

  // Format dates server-side
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format dates for all articles upfront
  const articlesWithFormattedDates = articles.map((article) => ({
    ...article,
    formattedDate: formatDate(article.date),
  }));

  const featuredArticlesWithFormattedDates = featuredArticles.map(
    (article) => ({
      ...article,
      formattedDate: formatDate(article.date),
    }),
  );

  return (
    <Container maxW="container.xl" py={8}>
      {/* Breadcrumb for filtered views */}
      {isFiltered && (
        <ArticleBreadcrumb
          category={category}
          tag={tag}
          categoryLabel={category ? formatLabel(category) : undefined}
          tagLabel={tag ? formatLabel(tag) : undefined}
        />
      )}

      <Box mb={8}>
        <Heading as="h1" size="2xl" mb={2}>
          {pageTitle}
        </Heading>
        <Text fontSize="xl" color="gray.400">
          {pageDescription}
        </Text>
      </Box>

      {/* Popular Topics - always show */}
      {/* <Box mb={10}>
        <Heading as="h2" size="lg" mb={4}>
          Popular topics
        </Heading>
        <Flex flexWrap="wrap" gap={2}>
          {categories.map((categoryName) => (
            <Button
              key={categoryName}
              as="a"
              href={`/articles?category=${categoryName.toLowerCase()}`}
              size="md"
              variant="outline"
              colorScheme="green"
              bg={
                category?.toLowerCase() === categoryName.toLowerCase()
                  ? "green.900"
                  : undefined
              }
            >
              {categoryName}
            </Button>
          ))}
        </Flex>
      </Box> */}

      {/* Featured Articles - only show on main page */}
      {!isFiltered && featuredArticlesWithFormattedDates.length > 0 && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>
            Trending
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {featuredArticlesWithFormattedDates.map((article) => (
              <FeaturedArticleCard key={article.slug} article={article} />
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Articles List */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="lg">
            {isFiltered ? "Articles" : "Browse all articles"}
          </Heading>
          <Text color="gray.500">
            {articlesWithFormattedDates.length}{" "}
            {articlesWithFormattedDates.length === 1 ? "article" : "articles"}
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {articlesWithFormattedDates.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}

// Function to get all articles
async function getArticles(): Promise<ArticleWithSlug[]> {
  const articlesDirectory = path.join(process.cwd(), "content/articles");
  const fileNames = fs.readdirSync(articlesDirectory);

  const articles = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      // Remove .mdx extension to get slug
      const slug = fileName.replace(/\.mdx$/, "");

      // Read file content
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Extract frontmatter
      const { data } = matter(fileContents);

      // Return article with metadata
      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        tags: data.tags || [],
        category: data.category || "General",
        author: data.author || "Anonymous",
        date: data.date || new Date().toISOString(),
        featured: data.featured || false,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}
