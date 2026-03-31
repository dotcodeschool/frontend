import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const ARTICLES_DIR = path.join(process.cwd(), "content/articles")

export interface ArticleSummary {
  slug: string
  title: string
  description: string
  author: string
  date: string
  tags: string[]
  category?: string
  featured?: boolean
}

export interface Article extends ArticleSummary {
  content: string
  lastUpdated?: string
  estimatedTime?: string
}

export function getArticles(): ArticleSummary[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'))
  const articles: ArticleSummary[] = []

  for (const file of files) {
    const slug = file.replace('.mdx', '')
    if (slug.startsWith('_')) continue

    const { data } = matter(fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8'))
    articles.push({
      slug,
      title: data.title ?? slug,
      description: data.description ?? '',
      author: data.author ?? 'Unknown',
      date: data.date ?? '',
      tags: data.tags ?? [],
      category: data.category,
      featured: data.featured ?? false,
    })
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getArticle(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    author: data.author ?? 'Unknown',
    date: data.date ?? '',
    tags: data.tags ?? [],
    category: data.category,
    featured: data.featured ?? false,
    content,
    lastUpdated: data.last_updated,
    estimatedTime: data.estimatedTime,
  }
}
