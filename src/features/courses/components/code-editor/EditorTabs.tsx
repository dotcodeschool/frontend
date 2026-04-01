import type { CodeFile, DiffFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  files: CodeFile[]
  diff: DiffFile[]
}

export function EditorTabs({ files, diff }: Props) {
  const { activeTab, setActiveTab, showDiff, toggleDiff } = useEditorStore()
  const hasDiff = diff.length > 0

  return (
    <div className="flex items-center bg-surface border-b border-border h-9 shrink-0">
      {/* Scrollable tab area */}
      <div className="flex-1 flex items-center overflow-x-auto min-w-0 px-1 scrollbar-none">
        {files.map((file, i) => (
          <button
            key={file.path}
            onClick={() => setActiveTab(i)}
            className={`px-3.5 h-9 text-xs font-mono transition-colors border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === i && !showDiff
                ? 'text-accent border-accent'
                : 'text-content-muted border-transparent hover:text-content-secondary'
            }`}
          >
            {file.path}
          </button>
        ))}
        {showDiff && (
          <button
            className="px-3.5 h-9 text-xs font-mono text-accent border-b-2 border-accent italic flex items-center gap-1 whitespace-nowrap shrink-0"
            onClick={toggleDiff}
          >
            changes.diff
            <span className="text-content-faint text-[10px] ml-1 cursor-pointer">✕</span>
          </button>
        )}
      </div>

      {/* Fixed action buttons */}
      <div className="flex items-center gap-1 px-2 shrink-0 border-l border-border">
        {hasDiff && (
          <button
            onClick={toggleDiff}
            className="w-7 h-7 flex items-center justify-center rounded text-content-muted hover:bg-elevated hover:text-content-secondary transition-colors text-sm"
            title={showDiff ? 'Hide Changes' : 'Open Changes'}
          >
            ⇄
          </button>
        )}
        <button
          onClick={() => useEditorStore.getState().toggleFullscreen()}
          className="w-7 h-7 flex items-center justify-center rounded text-content-muted hover:bg-elevated hover:text-content-secondary transition-colors text-sm"
          title="Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  )
}
