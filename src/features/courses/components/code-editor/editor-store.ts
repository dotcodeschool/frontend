import { create } from 'zustand'

interface EditorState {
  activeTab: number
  showDiff: boolean
  isFullscreen: boolean
  setActiveTab: (tab: number) => void
  toggleDiff: () => void
  toggleFullscreen: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: 0,
  showDiff: false,
  isFullscreen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleDiff: () => set((s) => ({ showDiff: !s.showDiff })),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
}))
