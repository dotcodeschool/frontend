"use client";

import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

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
      <Button onClick={onOpen}>Show logs</Button>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader {...modalBodyProps}>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody {...modalBodyProps}>
            <p>Test log content</p>
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
