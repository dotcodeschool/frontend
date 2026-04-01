import type { LessonFiles, DiffFile } from '../types'
import ResizablePane from '@/shared/components/ResizablePane'
import LessonContent from './LessonContent'
import CodeEditor from './code-editor/CodeEditor'

interface Props {
  code: string
  title: string
  lastUpdated?: string
  files: LessonFiles | null
  diff: DiffFile[]
  readOnly: boolean
  pageUrl?: string
  githubEditUrl?: string
}

export default function LessonLayout({ code, title, lastUpdated, files, diff, readOnly, pageUrl, githubEditUrl }: Props) {
  const hasEditor = files !== null

  if (!hasEditor) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <LessonContent code={code} title={title} lastUpdated={lastUpdated} pageUrl={pageUrl} githubEditUrl={githubEditUrl} />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: side-by-side resizable panes */}
      <div className="hidden md:flex flex-1 min-h-0">
        <ResizablePane
          left={<LessonContent code={code} title={title} lastUpdated={lastUpdated} pageUrl={pageUrl} githubEditUrl={githubEditUrl} />}
          right={
            <div className="h-full">
              <CodeEditor files={files} diff={diff} readOnly={readOnly} />
            </div>
          }
          defaultSplit={50}
        />
      </div>

      {/* Mobile: stacked — content on top, editor below */}
      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        <div className="flex-1 overflow-y-auto">
          <LessonContent code={code} title={title} lastUpdated={lastUpdated} pageUrl={pageUrl} githubEditUrl={githubEditUrl} />
        </div>
        <div className="h-[400px] min-h-[400px] border-t border-border">
          <CodeEditor files={files} diff={diff} readOnly={readOnly} />
        </div>
      </div>
    </>
  )
}
