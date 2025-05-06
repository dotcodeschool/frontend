import { Flex, Tooltip, IconButton } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import { IoGitCompareOutline } from "react-icons/io5";

import { TypeFile } from "@/lib/types";

const getFullscreenLabel = (isOpen: boolean) =>
  isOpen ? "Exit Fullscreen Code Editor" : "Enter Fullscreen Code Editor";

const getFullscreenIcon = (isOpen: boolean) =>
  isOpen ? <FiMinimize2 size={18} /> : <FiMaximize2 size={18} />;

export const EditorTabListActions: React.FC<{
  editorContent: TypeFile[];
  isOpen: boolean;
  handleFullscreenToggle: (e: React.MouseEvent) => void;
  showDiff: boolean;
  toggleDiff: () => void;
  isUserInteraction: React.MutableRefObject<boolean>;
}> = ({
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
      label={getFullscreenLabel(isOpen)}
      maxW={32}
      textAlign="center"
    >
      <IconButton
        aria-label={getFullscreenLabel(isOpen)}
        bg="none"
        icon={getFullscreenIcon(isOpen)}
        onClick={handleFullscreenToggle}
        p={0}
        size="sm"
      />
    </Tooltip>
  </Flex>
);
