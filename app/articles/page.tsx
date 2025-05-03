// app/articles/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Tag,
  TagLabel,
  Card,
  CardBody,
  Stack,
  HStack,
  Button,
  Badge,
} from "@chakra-ui/react";

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

export default async function ArticlesPage() {
  const articles = await getArticles();
  const categories = Array.from(
    new Set(articles.map((article) => article.category)),
  );
  const featuredArticles = articles.filter((article) => article.featured);

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="2xl" mb={2}>
          Articles
        </Heading>
        <Text fontSize="xl" color="gray.400">
          Technical insights, tutorials, and updates from Polkadot&apos;s core
          developers
        </Text>
      </Box>

      {/* Popular Topics */}
      <Box mb={10}>
        <Heading as="h2" size="lg" mb={4}>
          Popular topics
        </Heading>
        <Flex flexWrap="wrap" gap={2}>
          {categories.map((category) => (
            <Button
              key={category}
              as={Link}
              href={`/articles/category/${category.toLowerCase()}`}
              size="md"
              variant="outline"
              colorScheme="green"
            >
              {category}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>
            Trending
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {featuredArticles.map((article) => (
              <FeaturedArticleCard key={article.slug} article={article} />
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* All Articles */}
      <Box>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h2" size="lg">
            Browse all articles
          </Heading>
          <Text color="gray.500">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </Text>
        </Flex>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}

// Article card component
function ArticleCard({ article }: { article: ArticleWithSlug }) {
  return (
    <Card
      as={Link}
      href={`/articles/${article.slug}`}
      overflow="hidden"
      variant="outline"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <CardBody>
        <Stack spacing={3}>
          <Heading as="h3" size="md">
            {article.title}
          </Heading>
          <Flex flexWrap="wrap" gap={1}>
            {article.tags.map((tag) => (
              <Tag key={tag} size="sm" colorScheme="green" variant="subtle">
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
          <Text color="gray.400" fontSize="sm">
            {article.description}
          </Text>
          <HStack justify="space-between" fontSize="sm" color="gray.500">
            <Text>{article.author}</Text>
            <Text>{formatDate(article.date)}</Text>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
}

function FeaturedArticleCard({ article }: { article: ArticleWithSlug }) {
  return (
    <Card
      as={Link}
      href={`/articles/${article.slug}`}
      overflow="hidden"
      variant="outline"
      borderWidth="1px"
      borderColor="green.200"
      bg="green.900"
      color="gray.100"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
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
                colorScheme="blackAlpha.500"
                variant="solid"
              >
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))}
          </Flex>
          <Text color="gray.400" fontSize="sm">
            {article.description}
          </Text>
          <HStack justify="space-between" fontSize="sm" color="gray.500">
            <Text>{article.author}</Text>
            <Text>{formatDate(article.date)}</Text>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
