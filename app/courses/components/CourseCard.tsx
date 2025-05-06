"use client";

import {
  Box,
  Card,
  Circle,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  HStack,
  Tag,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { ButtonPrimary } from "@/components";
import { FormatSelectionModal } from "./FormatSelectionModal";
import { useState } from "react";

interface CourseFormats {
  hasInBrowser: boolean;
  hasOnMachine: boolean;
  inBrowserSlug?: string;
  onMachineSlug?: string;
}

interface CourseCardProps {
  index: number;
  title: string;
  description: string;
  level: string;
  language: string;
  slug: string;
  formats?: CourseFormats;
  isLastItem: boolean;
}

const CourseCard = ({
  index,
  title,
  description,
  level,
  language,
  slug,
  formats,
  isLastItem,
}: CourseCardProps) => {
  const {
    isOpen: isModalOpen,
    onOpen: onOpenModal,
    onClose: onCloseModal,
  } = useDisclosure();
  return (
    <Box position="relative">
      {/* Connecting line - only show if not the last item */}
      {!isLastItem && (
        <Box
          position="absolute"
          left="32px"
          top="64px" // Start from bottom of circle
          height="calc(100% - 64px)" // Extend to next circle
          width="4px"
          bg="gray.700"
          zIndex={1}
        />
      )}
      <Flex>
        <Circle
          size="64px"
          bg="green.300"
          color="gray.900"
          fontWeight="bold"
          fontSize="xl"
          mr={4}
          zIndex={2}
          position="relative"
        >
          {index + 1}
        </Circle>
        <Card
          flex="1"
          direction={{ base: "column", md: "row" }}
          overflow="hidden"
          mb={12}
          p={8}
          borderLeft="4px"
          borderLeftColor="green.500"
        >
          <Stack>
            <Heading as="h2" size="md">
              {title}
            </Heading>
            <Text>
              {level} • {language}
            </Text>
            <Text py={2}>{description}</Text>
            <HStack mt={4} spacing={4}>
              {formats?.hasInBrowser && formats?.hasOnMachine ? (
                <>
                  <ButtonPrimary
                    onClick={() => {
                      // Open the format selection modal
                      onOpenModal();
                    }}
                    w="fit-content"
                  >
                    Start Course
                  </ButtonPrimary>
                  <FormatSelectionModal
                    isOpen={isModalOpen}
                    onClose={onCloseModal}
                    courseTitle={title}
                    inBrowserSlug={formats.inBrowserSlug || ""}
                    onMachineSlug={formats.onMachineSlug || ""}
                  />
                </>
              ) : (
                <ButtonPrimary
                  as={Link}
                  href={`/courses/${formats?.inBrowserSlug || formats?.onMachineSlug || slug}`}
                  _hover={{ textDecor: "none" }}
                  w="fit-content"
                >
                  Start Course
                </ButtonPrimary>
              )}
            </HStack>
          </Stack>
        </Card>
      </Flex>
    </Box>
  );
};

export { CourseCard };
