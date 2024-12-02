import { TabList, Flex, Text, TabListProps } from "@chakra-ui/react";
import { isEmpty, map } from "lodash";
import React from "react";

import { TypeFile } from "@/lib/types";

import { EditorTab } from "./EditorTab";
import { EditorTabListActions } from "./EditorTabListActions";

type EditorTabListProps = TabListProps & {
  editorContent: TypeFile[];
  isOpen: boolean;
  showActions?: boolean;
  handleFullscreenToggle: (e: React.MouseEvent) => void;
  incorrectFiles: Array<{ fileName: string }>;
  showDiff: boolean;
  toggleDiff: () => void;
  handleTabClick: () => void;
  isUserInteraction: React.MutableRefObject<boolean>;
};

export const EditorTabList = ({
  editorContent,
  isOpen,
  showActions = true,
  handleFullscreenToggle,
  incorrectFiles,
  showDiff,
  toggleDiff,
  handleTabClick,
  isUserInteraction,
  ...props
}: EditorTabListProps) => (
  <TabList>
    <Flex
      position="relative"
      sx={{
        overflowX: "auto",
        height: "100%",
        "::-webkit-scrollbar": { height: "2px" },
        ":hover::-webkit-scrollbar-thumb": { background: "whiteAlpha.300" },
      }}
      w="full"
    >
      {isEmpty(editorContent) ? (
        <Text m={4}>No files edited in this step.</Text>
      ) : (
        map(editorContent, (file, i) => (
          <EditorTab
            file={file}
            handleTabClick={handleTabClick}
            incorrectFiles={incorrectFiles}
            isUserInteraction={isUserInteraction}
            key={i}
            showDiff={showDiff}
            toggleDiff={toggleDiff}
          />
        ))
      )}
    </Flex>
    {showActions ? (
      <EditorTabListActions
        editorContent={editorContent}
        handleFullscreenToggle={handleFullscreenToggle}
        isOpen={isOpen}
        isUserInteraction={isUserInteraction}
        showDiff={showDiff}
        toggleDiff={toggleDiff}
      />
    ) : null}
  </TabList>
);
