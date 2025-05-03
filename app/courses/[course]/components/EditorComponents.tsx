"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { TypeFile } from "@/lib/types";

// Dynamically import SplitPane to avoid SSR issues
const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

// Dynamically import the EditorTabs component
const EditorTabs = dynamic(
  () => import("../../../components/EditorTabs").then((mod) => mod.EditorTabs),
  { ssr: false },
);

type EditorComponentsProps = {
  showHints: boolean;
  readOnly: boolean;
  solution: TypeFile[];
  editorContent: TypeFile[];
  mdxContent?: React.ReactNode;
};

export const EditorComponents = ({
  showHints,
  readOnly,
  solution,
  editorContent,
  mdxContent,
}: EditorComponentsProps) => {
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

  const editorProps = {
    showHints,
    readOnly,
    isOpen,
    handleFullscreenToggle,
  };

  // If there's no MDX content, just show the editor
  if (!mdxContent) {
    return (
      <Flex height="calc(100vh - 140px)" w="full">
        <EditorTabs
          editorContent={editorContent}
          solution={solution}
          {...editorProps}
        />
      </Flex>
    );
  }

  // Otherwise, show a split pane with MDX content and editor
  return (
    <Box
      as={SplitPane}
      defaultSize="50%"
      maxSize={-200}
      minSize={200}
      split="vertical"
    >
      {/* Left side - MDX content */}
      <Box
        h="calc(100vh - 140px)"
        key={1}
        mr={1}
        overflowY="auto"
        pt={6}
        px={[6, 12]}
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

      {/* Right side - Editor */}
      <Flex height="calc(100vh - 140px)" key={2} w="full">
        <EditorTabs
          editorContent={editorContent}
          solution={solution}
          {...editorProps}
        />
      </Flex>
    </Box>
  );
};
