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
import { useParams } from "next/navigation";

import { LogTabs } from "./LogTabs";
import { TestStatus } from "./TestStatus";

const modalBodyProps = {
  maxW: "4xl",
  mx: "auto",
  w: "full",
};

type TestLogDisplayModalProps = {
  logstreamId: string;
  repoName: string;
};

type TestStatusData = {
  passed: boolean;
  total?: number;
  passedCount?: number;
};

const TestLogDisplayModal = ({
  logstreamId,
  repoName,
}: TestLogDisplayModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [testStatus, setTestStatus] = useState<TestStatusData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get section and lesson IDs from the URL
  const params = useParams();
  const sectionId = params.section as string;
  const lessonId = params.lesson as string;

  useEffect(() => {
    if (!isOpen || !repoName) return;

    const fetchTestStatus = async () => {
      try {
        setIsLoading(true);

        // Include section and lesson IDs in the request
        const url = `/api/test-status?repoName=${repoName}&sectionId=${sectionId}&lessonId=${lessonId}`;
        console.log("[TestLogDisplayModal] Fetching test status from:", url);
        console.log("[TestLogDisplayModal] Parameters:", {
          repoName,
          sectionId,
          lessonId,
        });

        const response = await fetch(url);
        console.log(
          "[TestLogDisplayModal] Response status:",
          response.status,
          response.statusText,
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch test status: ${response.statusText}`,
          );
        }

        const data = await response.json();
        console.log("[TestLogDisplayModal] Received data:", data);

        // Set test status
        if (data.status) {
          console.log(
            "[TestLogDisplayModal] Setting test status:",
            data.status,
          );
          setTestStatus(data.status);
        } else {
          console.log(
            "[TestLogDisplayModal] No status in response, setting default failed status",
          );
          setTestStatus({ passed: false });
        }
      } catch (error) {
        console.error(
          "[TestLogDisplayModal] Error fetching test status:",
          error,
        );
        setTestStatus({ passed: false });
      } finally {
        setIsLoading(false);
      }
    };

    console.log("[TestLogDisplayModal] Modal opened, fetching test status");
    void fetchTestStatus();
  }, [isOpen, repoName, sectionId, lessonId]);

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
              <TestStatus
                didTestPass={testStatus?.passed || false}
                isLoading={isLoading}
                total={testStatus?.total}
                passedCount={testStatus?.passedCount}
              />
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
