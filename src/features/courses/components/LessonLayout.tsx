import { useState } from "react";
import { IoChevronDown, IoChevronUp, IoCodeSlash } from "react-icons/io5";

import ResizablePane from "@/shared/components/ResizablePane";

import type { CodeFile, DiffFile } from "../types";
import CodeEditor from "./code-editor/CodeEditor";
import LessonContent from "./LessonContent";

interface Props {
  code: string;
  title: string;
  lastUpdated?: string;
  editorFiles: CodeFile[];
  diffFiles: DiffFile[];
  solutionFiles: CodeFile[];
  readOnly: boolean;
  pageUrl?: string;
  githubEditUrl?: string;
}

export default function LessonLayout({
  code,
  title,
  lastUpdated,
  editorFiles,
  diffFiles,
  solutionFiles,
  readOnly,
  pageUrl,
  githubEditUrl,
}: Props) {
  const hasEditor = editorFiles.length > 0;
  const [mobileEditorOpen, setMobileEditorOpen] = useState(true);

  if (!hasEditor) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <LessonContent
            code={code}
            title={title}
            lastUpdated={lastUpdated}
            pageUrl={pageUrl}
            githubEditUrl={githubEditUrl}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Desktop: side-by-side resizable panes */}
      <div className="hidden md:flex flex-1 min-h-0">
        <ResizablePane
          left={
            <LessonContent
              code={code}
              title={title}
              lastUpdated={lastUpdated}
              pageUrl={pageUrl}
              githubEditUrl={githubEditUrl}
            />
          }
          right={
            <div className="h-full">
              <CodeEditor
                files={editorFiles}
                diff={diffFiles}
                solutionFiles={solutionFiles}
                readOnly={readOnly}
              />
            </div>
          }
          defaultSplit={50}
        />
      </div>

      {/* Mobile: stacked — content on top, collapsible editor below */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        <div className="flex-1 overflow-y-auto">
          <LessonContent
            code={code}
            title={title}
            lastUpdated={lastUpdated}
            pageUrl={pageUrl}
            githubEditUrl={githubEditUrl}
          />
        </div>

        {/* Toggle bar */}
        <button
          onClick={() => setMobileEditorOpen((prev) => !prev)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-surface border-t border-border text-xs text-content-muted hover:text-content-secondary transition-colors shrink-0"
        >
          <IoCodeSlash className="text-sm" />
          <span>{mobileEditorOpen ? "Hide Editor" : "Show Editor"}</span>
          {mobileEditorOpen ? (
            <IoChevronDown className="text-xs" />
          ) : (
            <IoChevronUp className="text-xs" />
          )}
        </button>

        {mobileEditorOpen && (
          <div className="h-[400px] min-h-[400px] border-t border-border">
            <CodeEditor
              files={editorFiles}
              diff={diffFiles}
              solutionFiles={solutionFiles}
              readOnly={readOnly}
            />
          </div>
        )}
      </div>
    </div>
  );
}
