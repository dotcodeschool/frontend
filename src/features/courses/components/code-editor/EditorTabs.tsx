import { IoGitCompareOutline } from 'react-icons/io5'
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi'
import type { CodeFile, DiffFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  files: CodeFile[]
  diff: DiffFile[]
}

export function EditorTabs({ files, diff }: Props) {
  const { activeTab, setActiveTab, showDiff, toggleDiff, isFullscreen, toggleFullscreen, incorrectFiles } = useEditorStore()
  const hasDiff = diff.length > 0

  return (
    <div className="flex items-center border-b border-white/[0.06] h-9 shrink-0" style={{ background: '#111318' }}>
      {/* Scrollable tab area */}
      <div className="flex-1 flex items-center overflow-x-auto min-w-0 px-1 scrollbar-none">
        {files.map((file, i) => {
          const isIncorrect = incorrectFiles.includes(file.path)
          const isActive = activeTab === i && !showDiff

          return (
            <button
              key={file.path}
              onClick={() => setActiveTab(i)}
              className={`px-3.5 h-9 text-xs font-mono transition-colors border-b-2 whitespace-nowrap shrink-0 ${
                isActive
                  ? isIncorrect ? 'text-red-400 border-red-400' : 'text-accent border-accent'
                  : isIncorrect
                    ? 'text-red-400/60 border-transparent hover:text-red-400'
                    : 'text-content-muted border-transparent hover:text-content-secondary'
              }`}
            >
              {file.path}
            </button>
          )
        })}
        {showDiff && (
          <button
            className="px-3.5 h-9 text-xs font-mono text-accent border-b-2 border-accent italic flex items-center gap-1 whitespace-nowrap shrink-0"
            onClick={toggleDiff}
          >
            changes.diff
            <span className="text-content-muted text-[10px] ml-1 cursor-pointer hover:text-content-secondary">✕</span>
          </button>
        )}
      </div>

      {/* Fixed action buttons */}
      <div className="flex items-center gap-1 px-2 shrink-0 border-l border-white/[0.06]">
        {hasDiff && (
          <button
            onClick={toggleDiff}
            className="w-7 h-7 flex items-center justify-center rounded text-content-muted hover:bg-elevated hover:text-content-secondary transition-colors"
            title={showDiff ? 'Hide Changes' : 'Open Changes'}
          >
            <IoGitCompareOutline className="text-sm" />
          </button>
        )}
        <button
          onClick={toggleFullscreen}
          className="w-7 h-7 flex items-center justify-center rounded text-content-muted hover:bg-elevated hover:text-content-secondary transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FiMinimize2 className="text-sm" /> : <FiMaximize2 className="text-sm" />}
        </button>
      </div>
    </div>
  )
}
