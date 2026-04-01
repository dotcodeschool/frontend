import type { ArticleSummary } from '../lib/loader'

interface Props {
  article: ArticleSummary
  onTagClick?: (tag: string) => void
  onCategoryClick?: (category: string) => void
}

export function ArticleCard({ article, onTagClick, onCategoryClick }: Props) {
  const isFeatured = article.featured

  return (
    <a
      href={`/articles/${article.slug}`}
      className={`block p-6 rounded-xl border transition-all no-underline hover:shadow-lg hover:-translate-y-0.5 ${
        isFeatured
          ? 'border-accent/30 bg-accent-bg'
          : 'border-border bg-surface hover:bg-elevated'
      }`}
    >
      {isFeatured && (
        <span className="inline-block text-[10px] font-bold tracking-wider text-accent uppercase mb-2">
          Featured
        </span>
      )}

      <h3 className="font-heading text-lg font-semibold text-content-primary mb-2 leading-snug">
        {article.title}
      </h3>

      <p className="text-content-secondary text-sm mb-3 line-clamp-2">
        {article.description}
      </p>

      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {article.tags.map((tag) => (
            <span
              key={tag}
              onClick={(e) => {
                if (onTagClick) {
                  e.preventDefault()
                  onTagClick(tag)
                }
              }}
              className="text-xs text-content-muted bg-elevated px-2 py-0.5 rounded hover:text-accent transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-content-muted">
        {article.category && (
          <span
            onClick={(e) => {
              if (onCategoryClick) {
                e.preventDefault()
                onCategoryClick(article.category!)
              }
            }}
            className="text-accent hover:text-accent-dim transition-colors cursor-pointer"
          >
            {article.category}
          </span>
        )}
        <span className="ml-auto">{article.date}</span>
      </div>
    </a>
  )
}
