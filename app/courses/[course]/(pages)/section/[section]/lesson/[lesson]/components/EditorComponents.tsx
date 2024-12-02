"use client";

import { Box, Flex } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { TypeFile } from "@/lib/types";

import { EditorProvider } from "./EditorProvider";
import { FullscreenEditorModal } from "./FullscreenEditorModal";

import { EditorTabs } from ".";

const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false });

export const EditorComponents = ({
  showHints,
  readOnly,
  solution,
  editorContent,
  mdxContent,
}: {
  showHints: boolean;
  readOnly?: boolean;
  solution: TypeFile[];
  editorContent: TypeFile[];
  mdxContent?: React.ReactNode;
}) => {
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
    readOnly: readOnly ?? false,
    editorContent,
    isOpen,
    handleFullscreenToggle,
  };

  return (
    <Box
      as={SplitPane}
      defaultSize={mdxContent ? "50%" : "100%"}
      maxSize={-200}
      minSize={200}
      split="vertical"
    >
      {mdxContent ? (
        <Box
          h={["fit-content", "calc(100vh - 140px)"]}
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
      ) : null}
      <Flex
        height="calc(100vh - 129px)"
        key={2}
        px={{ base: 4, md: 0 }}
        w="full"
      >
        <EditorProvider initialContent={editorContent} solution={solution}>
          <EditorTabs {...editorProps} />
          <FullscreenEditorModal
            editorProps={editorProps}
            isOpen={isOpen}
            onClose={onClose}
          />
        </EditorProvider>
      </Flex>
    </Box>
  );
};
