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
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { SiVisualstudiocode } from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import { FiCode } from "react-icons/fi";
import { ButtonPrimary } from "@/components";
import { createSyncUri } from "@/app/courses/helpers/gitorialCommands";

interface IdeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: string;
  repo: string;
  commitHash: string;
}

const IdeSelectionModal = ({
  isOpen,
  onClose,
  creator,
  repo,
  commitHash,
}: IdeSelectionModalProps) => {
  const [selectedIde, setSelectedIde] = useState("cursor");

  const ides = [
    {
      id: "cursor",
      name: "Cursor",
      icon: FiCode,
      description: "AI-powered code editor with advanced features",
      protocol: "cursor",
    },
    {
      id: "vscode",
      name: "Visual Studio Code",
      icon: SiVisualstudiocode,
      description: "Popular open-source code editor by Microsoft",
      protocol: "vscode",
    },
    {
      id: "vscodium",
      name: "VSCodium",
      icon: VscCode,
      description: "Open-source binaries of VS Code without telemetry",
      protocol: "vscodium",
    },
  ];

  const handleOpenInIde = () => {
    const selectedIdeData = ides.find((ide) => ide.id === selectedIde);
    if (selectedIdeData) {
      const syncUri = createSyncUri(
        selectedIdeData.protocol,
        "github",
        creator,
        repo,
        commitHash,
      );
      window.open(syncUri, "_blank");
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Your IDE</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>Select your preferred IDE to open the code:</Text>
          <RadioGroup onChange={setSelectedIde} value={selectedIde}>
            <Stack spacing={4}>
              {ides.map((ide) => (
                <Box
                  key={ide.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={
                    selectedIde === ide.id ? "green.500" : "gray.400"
                  }
                  bg={selectedIde === ide.id ? "green.800" : "gray.600"}
                  cursor="pointer"
                  onClick={() => setSelectedIde(ide.id)}
                >
                  <Radio value={ide.id}>
                    <HStack spacing={3} mt={1}>
                      <Icon as={ide.icon} boxSize={5} />
                      <Text fontWeight="bold">{ide.name}</Text>
                    </HStack>
                  </Radio>
                  <Text ml={6} mt={2} fontSize="sm" color="gray.300">
                    {ide.description}
                  </Text>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <ButtonPrimary onClick={handleOpenInIde}>
            Open in {ides.find((ide) => ide.id === selectedIde)?.name}
          </ButtonPrimary>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IdeSelectionModal;
