import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import EditorTabs, { EditorTabsProps } from "./editor-tabs";

interface FullscreenEditorModalProps {
  isOpen: boolean;
  editorProps: EditorTabsProps;
  handleClose
}

const FullscreenEditorModal = ({ editorProps }: FullscreenEditorModalProps) => {
  const {
    showHints,
    isAnswerOpen,
    readOnly,
    incorrectFiles,
    solution,
    editorContent,
    isOpen,
    onOpen,
    onClose,
    setEditorContent,
  } = editorProps;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent background="none" shadow="none" w="90%">
        <ModalBody p={0}>
          <EditorTabs
            showHints={showHints}
            isAnswerOpen={isAnswerOpen}
            readOnly={readOnly}
            incorrectFiles={incorrectFiles}
            solution={solution}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullscreenEditorModal;
