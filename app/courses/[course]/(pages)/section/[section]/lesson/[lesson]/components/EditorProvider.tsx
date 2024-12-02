import { find, reduce } from "lodash";
import { createContext, useContext, useState } from "react";
import stripComments from "strip-comments";

import { TypeFile } from "@/lib/types";

const EditorContext = createContext<EditorContextType | null>(null);

type EditorProviderProps = {
  children: React.ReactNode;
  initialContent: TypeFile[];
  initialTabIndex?: number;
  initialShowDiff?: boolean;
  initialDoesAnswerMatch?: boolean;
  initialIsAnswerOpen?: boolean;
  isOnMachineCourse?: boolean;
  solution: TypeFile[];
};

type EditorContextType = {
  compareAnswerAndUpdateState: () => void;
  doesAnswerMatch: boolean;
  incorrectFiles: TypeFile[];
  isAnswerOpen: boolean;
  isOnMachineCourse: boolean;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  solution: TypeFile[];
  showDiff: boolean;
  setShowDiff: React.Dispatch<React.SetStateAction<boolean>>;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  toggleAnswer: () => void;
  toggleDiff: () => void;
};

const updateTabIndex = (
  newShowDiff: boolean,
  editorContent: TypeFile[],
  currentTabIndex: number,
): number => {
  const diffIndex = editorContent.length - 1;
  const lastNonDiffIndex = editorContent.length - 2;

  if (newShowDiff) {
    return diffIndex >= 0 ? diffIndex : currentTabIndex;
  }

  if (currentTabIndex === diffIndex) {
    return lastNonDiffIndex >= 0 ? lastNonDiffIndex : currentTabIndex;
  }

  return currentTabIndex;
};

const stripAndClean = (code: string) => stripComments(code).replace(/\s/g, "");

export const EditorProvider = ({
  children,
  initialContent: content,
  initialTabIndex = 0,
  initialShowDiff = false,
  initialDoesAnswerMatch = false,
  initialIsAnswerOpen = false,
  isOnMachineCourse = false,
  solution,
}: EditorProviderProps) => {
  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [showDiff, setShowDiff] = useState(initialShowDiff);
  const [doesAnswerMatch, setDoesAnswerMatch] = useState(
    initialDoesAnswerMatch,
  );
  const [isAnswerOpen, setIsAnswerOpen] = useState(initialIsAnswerOpen);
  const [incorrectFiles, setIncorrectFiles] = useState<TypeFile[]>([]);
  const [editorContent, setEditorContent] = useState<TypeFile[]>(content);

  const toggleAnswer = () => setIsAnswerOpen((prev) => !prev);

  const toggleDiff = () => {
    setShowDiff((prev) => {
      const newShowDiff = !prev;
      setTabIndex(updateTabIndex(newShowDiff, editorContent, tabIndex));

      return newShowDiff;
    });
  };

  const compareAnswerAndUpdateState = () => {
    const doesMatch = reduce(
      editorContent,
      (acc, file) => {
        const solutionFile = find(
          solution,
          (sf: TypeFile) => sf.fileName === file.fileName,
        );

        if (!solutionFile) {
          return acc;
        }

        const solutionClean = stripAndClean(solutionFile.code);
        const fileClean = stripAndClean(file.code);
        const doFilesMatch = solutionClean === fileClean;

        setIncorrectFiles((prev) => {
          if (doFilesMatch) {
            return prev.filter((f) => f.fileName !== file.fileName);
          }

          return [...prev, file];
        });

        return doFilesMatch && acc;
      },
      true,
    );
    setDoesAnswerMatch(doesMatch);
  };

  const value: EditorContextType = {
    compareAnswerAndUpdateState,
    doesAnswerMatch,
    incorrectFiles,
    isAnswerOpen,
    isOnMachineCourse,
    tabIndex,
    setTabIndex,
    solution,
    showDiff,
    setShowDiff,
    editorContent,
    setEditorContent,
    toggleAnswer,
    toggleDiff,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (context === null) {
    throw new Error("useEditor must be used within an EditorProvider");
  }

  return context;
};
