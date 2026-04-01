import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { bundleMDX } from "mdx-bundler";
import rehypeMdxCodeProps from "rehype-mdx-code-props";
import remarkGfm from "remark-gfm";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  category?: string;
  featured?: boolean;
}

export interface Article extends ArticleSummary {
  code: string;
  lastUpdated?: string;
  estimatedTime?: string;
  wordCount: number;
}

export function getArticles(): ArticleSummary[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx"));
  const articles: ArticleSummary[] = [];

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    if (slug.startsWith("_")) continue;

    const { data } = matter(
      fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8"),
    );
    articles.push({
      slug,
      title: data.title ?? slug,
      description: data.description ?? "",
      author: data.author ?? "Unknown",
      date: data.date ?? "",
      tags: data.tags ?? [],
      category: data.category,
      featured: data.featured ?? false,
    });
  }

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getArticle(slug: string): Promise<Article | null> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const wordCount = content.trim().split(/\s+/).length;
  const { code } = await bundleMDX({
    source: content,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMdxCodeProps,
      ];
      return options;
    },
  });

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    author: data.author ?? "Unknown",
    date: data.date ?? "",
    tags: data.tags ?? [],
    category: data.category,
    featured: data.featured ?? false,
    code,
    lastUpdated: data.last_updated,
    estimatedTime: data.estimatedTime,
    wordCount,
  };
}

export function getRelatedArticles(
  currentSlug: string,
  tags: string[],
  limit: number = 3,
): ArticleSummary[] {
  const allArticles = getArticles();
  const lowerTags = tags.map((t) => t.toLowerCase());

  const scored = allArticles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => {
      const matchCount = a.tags.filter((t) =>
        lowerTags.includes(t.toLowerCase()),
      ).length;
      return { article: a, matchCount };
    })
    .filter((s) => s.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, limit);

  return scored.map((s) => s.article);
}
