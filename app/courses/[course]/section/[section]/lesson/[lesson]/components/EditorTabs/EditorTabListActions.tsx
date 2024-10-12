import { Flex, Tooltip, IconButton } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { IoGitCompareOutline } from "react-icons/io5";

export const EditorTabListActions = ({
  editorContent,
  isOpen,
  handleFullscreenToggle,
  showDiff,
  toggleDiff,
  isUserInteraction,
}) => (
  <Flex
    alignItems="center"
    display={isEmpty(editorContent) ? "none" : "flex"}
    px={2}
  >
    <Tooltip
      hasArrow
      label={showDiff ? "Hide Changes" : "Open Changes"}
      maxW={32}
      textAlign="center"
    >
      <IconButton
        aria-label={showDiff ? "Hide Changes" : "Open Changes"}
        bg="none"
        icon={<IoGitCompareOutline size={18} />}
        onClick={() => {
          isUserInteraction.current = showDiff;
          toggleDiff();
        }}
        p={0}
        size="sm"
      />
    </Tooltip>
    <Tooltip
      hasArrow
      label={
        isOpen ? "Exit Fullscreen Code Editor" : "Enter Fullscreen Code Editor"
      }
      maxW={32}
      textAlign="center"
    >
      <IconButton
        aria-label={
          isOpen
            ? "Exit Fullscreen Code Editor"
            : "Enter Fullscreen Code Editor"
        }
        bg="none"
        icon={isOpen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />}
        onClick={handleFullscreenToggle}
        p={0}
        size="sm"
      />
    </Tooltip>
  </Flex>
);
