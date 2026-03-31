import { Flex, Tooltip, IconButton, useDisclosure } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import React, { useMemo } from "react";
import { FiMaximize2, FiMinimize2, FiCloud, FiCloudOff } from "react-icons/fi";
import { IoGitCompareOutline } from "react-icons/io5";

import { TypeFile } from "@/lib/types";
import IdeSelectionModal from "./IdeSelectionModal";

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
  gitorialUrl?: string;
  commitHash?: string;
}> = ({
  editorContent,
  isOpen,
  handleFullscreenToggle,
  showDiff,
  toggleDiff,
  isUserInteraction,
  gitorialUrl,
  commitHash,
}) => {
  const {
    isOpen: isIdeModalOpen,
    onOpen: onIdeModalOpen,
    onClose: onIdeModalClose,
  } = useDisclosure();

  const creator = useMemo(() => {
    if (!gitorialUrl) return "";
    const url = new URL(gitorialUrl);
    return url.pathname.split("/")[1];
  }, [gitorialUrl]);

  const repo = useMemo(() => {
    if (!gitorialUrl) return "";
    const url = new URL(gitorialUrl);
    return url.pathname.split("/")[2];
  }, [gitorialUrl]);

  return (
    <Flex
      alignItems="center"
      display={isEmpty(editorContent) ? "none" : "flex"}
      px={2}
    >
      {gitorialUrl && commitHash && (
        <Tooltip hasArrow label="Open in IDE" maxW={32} textAlign="center">
          <IconButton
            aria-label="Open in IDE"
            bg="none"
            icon={<FiCloud size={18} />}
            onClick={onIdeModalOpen}
            p={0}
            size="sm"
          />
        </Tooltip>
      )}
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
      {gitorialUrl && commitHash && (
        <IdeSelectionModal
          isOpen={isIdeModalOpen}
          onClose={onIdeModalClose}
          creator={creator}
          repo={repo}
          commitHash={commitHash}
        />
      )}
    </Flex>
  );
};
