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
}

export default function LessonLayout({ code, title, lastUpdated, files, diff, readOnly }: Props) {
  const hasEditor = files !== null

  if (!hasEditor) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <LessonContent code={code} title={title} lastUpdated={lastUpdated} />
        </div>
      </div>
    )
  }

  return (
    <ResizablePane
      left={<LessonContent code={code} title={title} lastUpdated={lastUpdated} />}
      right={
        <div className="h-full">
          <CodeEditor files={files} diff={diff} readOnly={readOnly} />
        </div>
      }
      defaultSplit={50}
    />
  )
}
