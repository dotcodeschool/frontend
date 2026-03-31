import { Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";

import { EditorTabs, EditorTabsProps } from "./EditorTabs";

type FullscreenEditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editorProps: EditorTabsProps;
};

const FullscreenEditorModal = ({
  isOpen,
  onClose,
  editorProps,
}: FullscreenEditorModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} size="full">
    <ModalOverlay />
    <ModalContent background="none" shadow="none" w="90%">
      <ModalBody p={0}>
        <EditorTabs {...editorProps} />
      </ModalBody>
    </ModalContent>
  </Modal>
);

export { FullscreenEditorModal };
