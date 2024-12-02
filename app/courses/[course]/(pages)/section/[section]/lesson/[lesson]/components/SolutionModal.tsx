"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FaFileCode } from "react-icons/fa";

import { TypeFile } from "@/lib/types";

import { EditorProvider } from "./EditorProvider";
import { EditorTabs } from "./EditorTabs";

const SolutionModal = ({
  template,
  solution,
}: {
  template: TypeFile[];
  solution: TypeFile[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  return (
    <EditorProvider
      initialContent={template}
      initialIsAnswerOpen={true}
      isOnMachineCourse={true}
      solution={solution}
    >
      <Button leftIcon={<FaFileCode />} my={4} onClick={onOpen} variant="ghost">
        View solution
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent background="none" shadow="none" w="90%">
          <ModalBody p={0}>
            <EditorTabs
              handleFullscreenToggle={handleFullscreenToggle}
              isOpen={isOpen}
              readOnly={true}
              showActions={false}
              showHints={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </EditorProvider>
  );
};

export { SolutionModal };
