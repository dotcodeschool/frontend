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
import { useEffect, useState } from "react";

import { LogTabs } from "./LogTabs";
import { TestStatus } from "./TestStatus";

const modalBodyProps = {
  maxW: "4xl",
  mx: "auto",
  w: "full",
};

type TestLogDisplayModalProps = {
  logstreamId: string;
};

const TestLogDisplayModal = ({ logstreamId }: TestLogDisplayModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [didTestPass, setDidTestPass] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const repoName = logstreamId ? logstreamId.split("/").pop() : "";

  useEffect(() => {
    if (!isOpen || !repoName) return;

    const fetchTestStatus = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/test-status?repoName=${repoName}`);

        if (!response.ok) {
          throw new Error("Failed to fetch test status");
        }

        const data = await response.json();

        // Set default to false
        if (data.status) {
          setDidTestPass(data.status.passed);
        } else {
          setDidTestPass(false);
        }
      } catch (error) {
        console.error("Error fetching test status:", error);
        setDidTestPass(false);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTestStatus();
  }, [isOpen, repoName]);

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
            <LogTabs logstreamId={logstreamId} />
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
              <TestStatus didTestPass={didTestPass} isLoading={isLoading} />
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
