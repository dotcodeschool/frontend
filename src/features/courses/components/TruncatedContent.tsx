import { useEffect, useRef, useState } from "react";

import MdxRenderer from "@/shared/components/MdxRenderer";

interface Props {
  code: string;
  maxHeight?: number;
}

export default function TruncatedContent({ code, maxHeight = 200 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsTruncation(contentRef.current.scrollHeight > maxHeight);
    }
  }, [code, maxHeight]);

  return (
    <div>
      <div
        ref={contentRef}
        className="relative overflow-hidden transition-[max-height] duration-300"
        style={{
          maxHeight: expanded || !needsTruncation ? "none" : `${maxHeight}px`,
        }}
      >
        <div
          className="prose prose-invert max-w-none text-content-body
                         prose-headings:font-heading prose-headings:text-content-primary"
        >
          <MdxRenderer code={code} />
        </div>
        {!expanded && needsTruncation && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-base to-transparent" />
        )}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-accent text-sm font-medium mt-2 hover:text-accent-dim transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
