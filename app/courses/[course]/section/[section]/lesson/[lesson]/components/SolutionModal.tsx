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

const SolutionModal = () => {
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

  const dummyContent: TypeFile[] = [
    {
      fileName: "solution.js",
      language: "javascript",
      code: `function solution() {
  // your solution here
  }`,
    },
  ];

  return (
    <EditorProvider initialContent={dummyContent} solution={[]}>
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
