"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { createContext, useContext, useState } from "react";
import EditorTabs from "./editor-tabs";
import FullscreenEditorModal from "./fullscreen-editor-modal";
import { TypeFile } from "@/app/lib/types/TypeFile";

const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

const EditorContext = createContext<EditorContextType | null>(null);

interface EditorProviderProps {
  children: React.ReactNode;
  initialContent: TypeFile[];
  initialTabIndex?: number;
  initialShowDiff?: boolean;
}

interface EditorContextType {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  showDiff: boolean;
  setShowDiff: React.Dispatch<React.SetStateAction<boolean>>;
  editorContent: TypeFile[];
  setEditorContent: React.Dispatch<React.SetStateAction<TypeFile[]>>;
  toggleDiff: () => void;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initialContent,
  initialTabIndex = 0,
  initialShowDiff = false,
}) => {
  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [showDiff, setShowDiff] = useState(initialShowDiff);
  const [editorContent, setEditorContent] =
    useState<TypeFile[]>(initialContent);

  const toggleDiff = () => {
    setShowDiff((prevShowDiff) => {
      const newShowDiff = !prevShowDiff;

      if (newShowDiff) {
        const diffIndex = editorContent.length - 1;
        if (diffIndex !== -1) {
          setTabIndex(diffIndex);
        }
      } else if (tabIndex === editorContent.length - 1) {
        const lastNonDiffIndex = editorContent.length - 2;
        if (lastNonDiffIndex !== -1) {
          setTabIndex(lastNonDiffIndex);
        }
      }

      return newShowDiff;
    });
  };

  const value: EditorContextType = {
    tabIndex,
    setTabIndex,
    showDiff,
    setShowDiff,
    editorContent,
    setEditorContent,
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

export function EditorComponents({
  showHints,
  isAnswerOpen,
  readOnly,
  incorrectFiles,
  solution,
  editorContent,
  mdxContent,
}: {
  showHints: boolean;
  isAnswerOpen: boolean;
  readOnly?: boolean;
  incorrectFiles: TypeFile[];
  solution: TypeFile[];
  editorContent: TypeFile[];
  mdxContent?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

  const onClose = () => setIsOpen(false);

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  const setEditorContent = (newContent: TypeFile[]) => {
    // WIP: Implement this for comparing answers
    // eslint-disable-next-line no-console
    console.log("setting editor content", newContent);
  };

  const editorProps = {
    showHints,
    isAnswerOpen,
    readOnly,
    incorrectFiles,
    solution,
    editorContent,
    isOpen,
    handleFullscreenToggle,
    setEditorContent,
  };

  return (
    <Box
      as={SplitPane}
      split="vertical"
      defaultSize={mdxContent ? "50%" : "100%"}
      minSize={200}
      maxSize={-200}
    >
      {mdxContent && (
        <Box
          key={1}
          h={["fit-content", "calc(100vh - 140px)"]}
          overflowY="auto"
          pt={6}
          px={[6, 12]}
          mr={1}
          sx={{
            overflowX: "auto",
            height: "100%",
            "::-webkit-scrollbar": {
              width: "2px",
            },
            ":hover::-webkit-scrollbar-thumb": { background: "whiteAlpha.300" },
          }}
        >
          {mdxContent}
        </Box>
      )}
      <Flex
        height="calc(100vh - 129px)"
        w="full"
        key={2}
        px={{ base: 4, md: 0 }}
      >
        <EditorProvider initialContent={editorContent}>
          <EditorTabs {...editorProps} />
          <FullscreenEditorModal
            isOpen={isOpen}
            onClose={onClose}
            editorProps={editorProps}
          />
        </EditorProvider>
      </Flex>
    </Box>
  );
}
