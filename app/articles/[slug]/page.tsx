import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { bundleMdxContent } from "@/lib/mdx-bundle";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Container } from "@chakra-ui/react";
import ArticleContent from "./components/ArticleContent";
import { Navbar } from "@/components";

// Use React cache to avoid redundant processing
const getArticleBySlug = cache(async (slug: string) => {
  const articlesDirectory = path.join(process.cwd(), "content/articles");
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Use the same bundling approach as lesson pages
    try {
      const result = await bundleMdxContent(content);

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        tags: data.tags || [],
        category: data.category || "General",
        author: data.author || "Anonymous",
        date: data.date || new Date().toISOString(),
        last_updated: data.last_updated, // Extract last_updated from frontmatter
        estimatedTime: data.estimatedTime, // Extract estimatedTime from frontmatter
        code: result.code,
        rawContent: content, // Pass the raw MDX content for reading time calculation
      };
    } catch (error) {
      const bundleError = error as Error;
      console.error(`Error bundling MDX for ${slug}:`, bundleError);
      // Return partial data without code to prevent 404
      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        tags: data.tags || [],
        category: data.category || "General",
        author: data.author || "Anonymous",
        date: data.date || new Date().toISOString(),
        last_updated: data.last_updated, // Extract last_updated from frontmatter
        estimatedTime: data.estimatedTime, // Extract estimatedTime from frontmatter
        rawContent: content, // Pass the raw MDX content for reading time calculation
        code: `
              export default function ErrorComponent() {
                return React.createElement(
                  'div',
                  { style: { color: 'red', padding: '1rem', border: '1px solid red' } },
                  [
                    React.createElement('h2', { key: 'title' }, 'Error rendering content'),
                    React.createElement('p', { key: 'message' }, ${JSON.stringify(bundleError.message)})
                  ]
                )
              }
            `,
      };
    }
  } catch (error) {
    console.error(`Error reading file ${fullPath}:`, error);
    return null;
  }
});

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), "content/articles");
  const fileNames = fs.readdirSync(articlesDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => ({
      slug: fileName.replace(/\.mdx$/, ""),
    }));
}

// Get related articles based on tags
async function getRelatedArticles(
  tags: string[],
  currentSlug: string,
  limit = 3,
) {
  const articlesDirectory = path.join(process.cwd(), "content/articles");
  const fileNames = fs.readdirSync(articlesDirectory);

  const articles = fileNames
    .filter(
      (fileName) =>
        fileName.endsWith(".mdx") && fileName !== `${currentSlug}.mdx`,
    )
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      // Calculate how many tags match
      const matchingTags = (data.tags || []).filter((tag: string) =>
        tags.includes(tag),
      );

      return {
        slug,
        title: data.title || "Untitled",
        description: data.description || "",
        matchingTagsCount: matchingTags.length,
      };
    })
    // Sort by number of matching tags, then limit results
    .sort((a, b) => b.matchingTagsCount - a.matchingTagsCount)
    .slice(0, limit);

  return articles;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Find related articles based on tags
  const relatedArticles = await getRelatedArticles(article.tags, slug);

  // Format the date for display
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Container maxW="container.xl">
      <Navbar />
      <Container maxW="container.md" py={8}>
        {/* Pass all necessary data to a client component */}
        <ArticleContent
          article={article}
          formattedDate={formattedDate}
          relatedArticles={relatedArticles}
        />
      </Container>
    </Container>
  );
}
