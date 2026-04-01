import { IoGitCompareOutline } from 'react-icons/io5'
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi'
import type { CodeFile, DiffFile } from '../../types'
import { useEditorStore } from './editor-store'

interface Props {
  files: CodeFile[]
  diff: DiffFile[]
}

// Hardcoded dark colors so editor chrome stays dark in light mode
const muted = '#6b7394'
const secondary = '#9ba3be'
const hoverBg = 'rgba(255,255,255,0.06)'

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
              className="px-3.5 h-9 text-xs font-mono transition-colors border-b-2 whitespace-nowrap shrink-0"
              style={{
                color: isActive
                  ? isIncorrect ? '#f87171' : '#6b8aed'
                  : isIncorrect ? 'rgba(248,113,113,0.6)' : muted,
                borderColor: isActive
                  ? isIncorrect ? '#f87171' : '#6b8aed'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = isIncorrect ? '#f87171' : secondary
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = isIncorrect ? 'rgba(248,113,113,0.6)' : muted
              }}
            >
              {file.path}
            </button>
          )
        })}
        {showDiff && (
          <button
            className="px-3.5 h-9 text-xs font-mono italic flex items-center gap-1 whitespace-nowrap shrink-0 border-b-2"
            style={{ color: '#6b8aed', borderColor: '#6b8aed' }}
            onClick={toggleDiff}
          >
            changes.diff
            <span
              className="text-[10px] ml-1 cursor-pointer transition-colors"
              style={{ color: muted }}
              onMouseEnter={(e) => { e.currentTarget.style.color = secondary }}
              onMouseLeave={(e) => { e.currentTarget.style.color = muted }}
            >
              ✕
            </span>
          </button>
        )}
      </div>

      {/* Fixed action buttons */}
      <div className="flex items-center gap-1 px-2 shrink-0 border-l border-white/[0.06]">
        {hasDiff && (
          <button
            onClick={toggleDiff}
            className="w-7 h-7 flex items-center justify-center rounded transition-colors"
            style={{ color: muted }}
            onMouseEnter={(e) => { e.currentTarget.style.color = secondary; e.currentTarget.style.background = hoverBg }}
            onMouseLeave={(e) => { e.currentTarget.style.color = muted; e.currentTarget.style.background = '' }}
            title={showDiff ? 'Hide Changes' : 'Open Changes'}
          >
            <IoGitCompareOutline className="text-sm" />
          </button>
        )}
        <button
          onClick={toggleFullscreen}
          className="w-7 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: muted }}
          onMouseEnter={(e) => { e.currentTarget.style.color = secondary; e.currentTarget.style.background = hoverBg }}
          onMouseLeave={(e) => { e.currentTarget.style.color = muted; e.currentTarget.style.background = '' }}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <FiMinimize2 className="text-sm" /> : <FiMaximize2 className="text-sm" />}
        </button>
      </div>
    </div>
  )
}
