interface Props {
  html: string
  title: string
  lastUpdated?: string
}

export default function LessonContent({ html, title, lastUpdated }: Props) {
  return (
    <div className="overflow-y-auto p-8 h-full">
      <h1 className="font-heading text-2xl font-bold mb-2">{title}</h1>
      {lastUpdated && (
        <p className="text-content-muted text-xs mb-6">Last updated {lastUpdated}</p>
      )}
      <div
        className="prose prose-invert max-w-none text-content-secondary
                   prose-headings:font-heading prose-headings:text-content-primary
                   prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                   prose-code:text-accent prose-code:bg-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                   prose-pre:bg-code prose-pre:border prose-pre:border-border"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
