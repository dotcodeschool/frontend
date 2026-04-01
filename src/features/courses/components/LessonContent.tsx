import MdxRenderer from "@/shared/components/MdxRenderer";

import ShareButtons from "./ShareButtons";

interface Props {
  code: string;
  title: string;
  lastUpdated?: string;
  pageUrl?: string;
  githubEditUrl?: string;
}

export default function LessonContent({
  code,
  title,
  lastUpdated,
  pageUrl,
  githubEditUrl,
}: Props) {
  return (
    <div className="overflow-y-auto p-8 h-full">
      <h1 className="font-heading text-2xl font-bold mb-2">{title}</h1>
      {lastUpdated && (
        <p className="text-content-muted text-xs mb-6">
          Last updated {lastUpdated}
        </p>
      )}
      <div className="prose prose-invert max-w-none text-content-body prose-headings:font-heading prose-headings:text-content-primary">
        <MdxRenderer code={code} />
      </div>
      {pageUrl && (
        <ShareButtons
          title={title}
          url={pageUrl}
          githubEditUrl={githubEditUrl}
        />
      )}
    </div>
  );
}
