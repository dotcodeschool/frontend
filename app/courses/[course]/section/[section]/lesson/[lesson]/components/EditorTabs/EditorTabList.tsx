import { TabList, Flex, Text } from "@chakra-ui/react";
import { isEmpty, map } from "lodash";
import React from "react";

import { EditorTab } from "./EditorTab";
import { EditorTabListActions } from "./EditorTabListActions";

export const EditorTabList = ({
  editorContent,
  isOpen,
  showActions = true,
  handleFullscreenToggle,
  ...props
}) => (
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
          <EditorTab file={file} index={i} key={i} {...props} />
        ))
      )}
    </Flex>
    {showActions ? (
      <EditorTabListActions
        editorContent={editorContent}
        handleFullscreenToggle={handleFullscreenToggle}
        isOpen={isOpen}
        {...props}
      />
    ) : null}
  </TabList>
);
