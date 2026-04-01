import { create } from 'zustand'
import type { CodeFile } from '../../types'

interface EditorState {
  // Tab management
  activeTab: number
  previousTab: number

  // Diff view
  showDiff: boolean

  // Fullscreen
  isFullscreen: boolean

  // Answer checking
  incorrectFiles: string[]
  doesAnswerMatch: boolean | null

  // Actions
  setActiveTab: (tab: number) => void
  toggleDiff: () => void
  toggleFullscreen: () => void
  checkAnswer: (editorFiles: CodeFile[], solutionFiles: CodeFile[]) => void
  resetAnswer: () => void
}

function stripComments(code: string): string {
  return code
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\n/gm, '')
    .trim()
}

function normalizeWhitespace(code: string): string {
  return code.replace(/\s+/g, ' ').trim()
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: 0,
  previousTab: 0,
  showDiff: false,
  isFullscreen: false,
  incorrectFiles: [],
  doesAnswerMatch: null,

  setActiveTab: (tab) => set({ activeTab: tab, showDiff: false }),

  toggleDiff: () => set((s) => {
    if (s.showDiff) {
      return { showDiff: false, activeTab: s.previousTab }
    }
    return { showDiff: true, previousTab: s.activeTab }
  }),

  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

  checkAnswer: (editorFiles, solutionFiles) => {
    const incorrect: string[] = []

    for (const editorFile of editorFiles) {
      const solutionFile = solutionFiles.find(s => s.path === editorFile.path)
      if (!solutionFile) continue

      const editorNorm = normalizeWhitespace(stripComments(editorFile.content))
      const solutionNorm = normalizeWhitespace(stripComments(solutionFile.content))

      if (editorNorm !== solutionNorm) {
        incorrect.push(editorFile.path)
      }
    }

    set({
      incorrectFiles: incorrect,
      doesAnswerMatch: incorrect.length === 0,
    })
  },

  resetAnswer: () => set({ incorrectFiles: [], doesAnswerMatch: null }),
}))
