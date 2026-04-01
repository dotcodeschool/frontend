import { useState, useEffect } from 'react'
import { IoChevronForward } from 'react-icons/io5'
import type { ArticleSummary } from '../lib/loader'
import { ArticleCard } from './ArticleCard'

interface Props {
  articles: ArticleSummary[]
}

export default function ArticlesPage({ articles }: Props) {
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setFilterTag(params.get('tag'))
    setFilterCategory(params.get('category'))
  }, [])

  const isFiltered = filterTag !== null || filterCategory !== null

  const filtered = articles.filter((a) => {
    if (filterTag && !a.tags.some(t => t.toLowerCase() === filterTag.toLowerCase())) return false
    if (filterCategory && a.category?.toLowerCase() !== filterCategory.toLowerCase()) return false
    return true
  })

  const featured = articles.filter(a => a.featured)

  const handleTagClick = (tag: string) => {
    setFilterTag(tag)
    setFilterCategory(null)
    window.history.pushState({}, '', `?tag=${encodeURIComponent(tag)}`)
  }

  const handleCategoryClick = (category: string) => {
    setFilterCategory(category)
    setFilterTag(null)
    window.history.pushState({}, '', `?category=${encodeURIComponent(category)}`)
  }

  const clearFilters = () => {
    setFilterTag(null)
    setFilterCategory(null)
    window.history.pushState({}, '', '/articles')
  }

  const filterLabel = filterTag ?? filterCategory ?? ''

  return (
    <div>
      {/* Breadcrumb (only when filtered) */}
      {isFiltered && (
        <nav className="flex items-center gap-1.5 text-sm text-content-muted mb-6">
          <a href="/" className="hover:text-content-secondary transition-colors no-underline">Home</a>
          <IoChevronForward className="text-xs" />
          <button onClick={clearFilters} className="hover:text-content-secondary transition-colors">
            Articles
          </button>
          <IoChevronForward className="text-xs" />
          <span className="text-content-secondary">{filterLabel}</span>
        </nav>
      )}

      {/* Header */}
      <h1 className="font-heading text-3xl font-bold mb-2">
        {isFiltered ? `${filterLabel}` : 'Articles'}
      </h1>
      <p className="text-content-muted text-base mb-10">
        {isFiltered
          ? `${filtered.length} ${filtered.length === 1 ? 'article' : 'articles'} found`
          : 'Technical insights, tutorials, and updates from Polkadot\'s core developers'
        }
      </p>

      {/* Trending section (only unfiltered) */}
      {!isFiltered && featured.length > 0 && (
        <div className="mb-12">
          <h2 className="font-heading text-xl font-semibold text-content-primary mb-4">Trending</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                onTagClick={handleTagClick}
                onCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Browse section */}
      <div className="mb-12">
        {!isFiltered && (
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold text-content-primary">Browse all articles</h2>
            <span className="text-content-muted text-sm">{filtered.length} articles</span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-content-muted text-lg mb-4">No articles found</p>
            <button onClick={clearFilters} className="text-accent hover:text-accent-dim transition-colors text-sm">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                onTagClick={handleTagClick}
                onCategoryClick={handleCategoryClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
