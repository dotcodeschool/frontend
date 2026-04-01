import { create } from "zustand";

import type { CodeFile } from "../../types";

interface EditorState {
  // Tab management
  activeTab: number;
  previousTab: number;

  // File content (tracks user edits)
  fileContents: Record<string, string>;

  // Diff view
  showDiff: boolean;

  // Fullscreen
  isFullscreen: boolean;

  // Answer checking
  incorrectFiles: string[];
  doesAnswerMatch: boolean | null;
  showSolution: boolean;

  // Actions
  setActiveTab: (tab: number) => void;
  setFileContent: (path: string, content: string) => void;
  getFileContent: (file: CodeFile) => string;
  toggleDiff: () => void;
  toggleFullscreen: () => void;
  checkAnswer: (editorFiles: CodeFile[], solutionFiles: CodeFile[]) => void;
  toggleSolution: () => void;
  resetAnswer: () => void;
}

function stripComments(code: string): string {
  return code
    .replace(/\/\/.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\n/gm, "")
    .trim();
}

function normalizeWhitespace(code: string): string {
  return code.replace(/\s+/g, " ").trim();
}

export const useEditorStore = create<EditorState>((set) => ({
  activeTab: 0,
  previousTab: 0,
  fileContents: {},
  showDiff: false,
  isFullscreen: false,
  incorrectFiles: [],
  doesAnswerMatch: null,
  showSolution: false,

  setActiveTab: (tab) => set({ activeTab: tab, showDiff: false }),

  setFileContent: (path, content) =>
    set((s) => ({
      fileContents: { ...s.fileContents, [path]: content },
    })),

  getFileContent: (file) => {
    const contents = useEditorStore.getState().fileContents;
    return contents[file.path] ?? file.content;
  },

  toggleDiff: () =>
    set((s) => {
      if (s.showDiff) {
        return { showDiff: false, activeTab: s.previousTab };
      }
      return { showDiff: true, previousTab: s.activeTab };
    }),

  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),

  checkAnswer: (editorFiles, solutionFiles) => {
    const incorrect: string[] = [];
    const contents = useEditorStore.getState().fileContents;

    for (const editorFile of editorFiles) {
      const solutionFile = solutionFiles.find(
        (s) => s.path === editorFile.path,
      );
      if (!solutionFile) continue;

      const currentContent = contents[editorFile.path] ?? editorFile.content;
      const editorNorm = normalizeWhitespace(stripComments(currentContent));
      const solutionNorm = normalizeWhitespace(
        stripComments(solutionFile.content),
      );

      if (editorNorm !== solutionNorm) {
        incorrect.push(editorFile.path);
      }
    }

    set({
      incorrectFiles: incorrect,
      doesAnswerMatch: incorrect.length === 0,
    });
  },

  toggleSolution: () => set((s) => ({ showSolution: !s.showSolution })),

  resetAnswer: () =>
    set({ incorrectFiles: [], doesAnswerMatch: null, showSolution: false }),
}));
