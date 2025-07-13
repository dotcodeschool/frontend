"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Box,
  Tooltip,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ButtonPrimary } from "@/components";

interface FormatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  inBrowserSlug: string;
  onMachineSlug: string;
}

const FormatSelectionModal = ({
  isOpen,
  onClose,
  courseTitle,
  inBrowserSlug,
  onMachineSlug,
}: FormatSelectionModalProps) => {
  const [selectedFormat, setSelectedFormat] = useState("inBrowser");
  const router = useRouter();

  const handleStartCourse = () => {
    const targetSlug =
      selectedFormat === "inBrowser" ? inBrowserSlug : onMachineSlug;
    router.push(`/courses/${targetSlug}`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Course Format</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Select how you&apos;d like to take the &quot;{courseTitle}&quot;
            course:
          </Text>
          <RadioGroup onChange={setSelectedFormat} value={selectedFormat}>
            <Stack spacing={4}>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={
                  selectedFormat === "inBrowser" ? "green.500" : "gray.400"
                }
                bg={selectedFormat === "inBrowser" ? "green.800" : "gray.600"}
              >
                <Radio value="inBrowser">
                  <HStack spacing={2} mt={1}>
                    <Text fontWeight="bold">In-Browser</Text>
                    <Tag colorScheme="green" size="sm">
                      Recommended
                    </Tag>
                  </HStack>
                </Radio>
                <Text ml={6} mt={2} fontSize="sm" color="gray.300">
                  Complete the course directly in your browser. No setup
                  required.
                </Text>
              </Box>

              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={
                  selectedFormat === "onMachine" ? "green.500" : "gray.400"
                }
                bg={selectedFormat === "onMachine" ? "green.800" : "gray.600"}
              >
                <Radio value="onMachine">
                  <HStack spacing={2} mt={1}>
                    <Text fontWeight="bold">On-Machine</Text>
                    <Tag colorScheme="gray" size="sm">
                      Legacy
                    </Tag>
                    <Tooltip
                      label="Runs on your local machine. This format is unstable and no longer recommended."
                      placement="top"
                    >
                      <InfoIcon boxSize={3} />
                    </Tooltip>
                  </HStack>
                </Radio>
                <Text ml={6} mt={2} fontSize="sm" color="gray.300">
                  Run the course on your local machine. Requires setup and
                  installation. This format is no longer recommended.
                </Text>
              </Box>
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <ButtonPrimary onClick={handleStartCourse}>
            Start Course
          </ButtonPrimary>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export { FormatSelectionModal };
