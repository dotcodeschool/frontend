import MdxRenderer from '@/shared/components/MdxRenderer'

interface Props {
  code: string
  title: string
  lastUpdated?: string
}

export default function LessonContent({ code, title, lastUpdated }: Props) {
  return (
    <div className="overflow-y-auto p-8 h-full">
      <h1 className="font-heading text-2xl font-bold mb-2">{title}</h1>
      {lastUpdated && (
        <p className="text-content-muted text-xs mb-6">Last updated {lastUpdated}</p>
      )}
      <div className="prose prose-invert max-w-none text-content-secondary
                       prose-headings:font-heading prose-headings:text-content-primary">
        <MdxRenderer code={code} />
      </div>
    </div>
  )
}
