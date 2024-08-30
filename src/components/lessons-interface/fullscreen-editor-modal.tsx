import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import EditorTabs from "./editor-tabs";
import { FullscreenEditorModalProps } from "@/types/types";

const FullscreenEditorModal = ({ editorProps }: FullscreenEditorModalProps) => {
  const {
    showHints,
    isAnswerOpen,
    readOnly,
    incorrectFiles,
    solution,
    editorContent,
    isOpen,
    tabIndex,
    showDiff,
    setShowDiff,
    setTabIndex,
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
            tabIndex={tabIndex}
            showDiff={showDiff}
            setShowDiff={setShowDiff}
            setTabIndex={setTabIndex}
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
