"use client";

import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { IoTerminal } from "react-icons/io5";

import { LogTabs } from "./LogTabs";
import { TestStatus } from "./TestStatus";

const modalBodyProps = {
  maxW: "4xl",
  mx: "auto",
  w: "full",
};

const TestLogDisplayModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const didTestPass = true;

  return (
    <>
      <Button leftIcon={<IoTerminal />} onClick={onOpen} size="sm">
        View logs
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="gray.900">
          <ModalCloseButton />
          <ModalBody {...modalBodyProps}>
            <LogTabs />
          </ModalBody>
          <ModalFooter>
            <HStack
              borderTop="1px solid"
              borderTopColor="whiteAlpha.300"
              justifyContent="center"
              pt={2}
              spacing={2}
              {...modalBodyProps}
            >
              <TestStatus didTestPass={didTestPass} />
              <Button onClick={onClose} size="xs">
                Hide logs
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { TestLogDisplayModal };
