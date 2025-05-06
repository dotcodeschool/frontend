"use client";

import {
  Box,
  Button,
  HStack,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { FormatSelectionModal } from "../../../courses/components/FormatSelectionModal";
import { PiArrowsLeftRight } from "react-icons/pi";

type FormatToggleProps = {
  slug: string;
  hasInBrowser: boolean;
  hasOnMachine: boolean;
  currentFormat: string;
  title?: string;
};

const FormatToggle = ({
  slug,
  hasInBrowser,
  hasOnMachine,
  currentFormat,
  title,
}: FormatToggleProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isInBrowser = currentFormat === "inBrowserCourse";

  console.log(
    "FormatToggle - hasInBrowser:",
    hasInBrowser,
    "hasOnMachine:",
    hasOnMachine,
    "currentFormat:",
    currentFormat,
    "slug:",
    slug,
  );

  // Calculate the target slugs for navigation
  const baseSlug = isInBrowser ? slug.replace("in-browser-", "") : slug;
  const inBrowserSlug = `in-browser-${baseSlug}`;
  const courseTitle = title || "this course";

  // Check if the alternate format exists
  const alternateExists =
    (isInBrowser && hasOnMachine) || (!isInBrowser && hasInBrowser);

  console.log(
    "FormatToggle - alternateExists:",
    alternateExists,
    "isInBrowser:",
    isInBrowser,
  );

  return (
    <Box mb={4} mt={2}>
      <HStack>
        {/* Show the appropriate tag based on the current format */}
        {!isInBrowser ? (
          <Tag colorScheme="gray" size="md">
            <Text mr={2}>Beta</Text>
            <Tooltip
              label="Runs on your local machine. Currently in early testing — setup required."
              placement="top"
            >
              <InfoIcon />
            </Tooltip>
          </Tag>
        ) : (
          alternateExists && (
            <Tag colorScheme="green" size="md">
              <Text mr={2}>Recommended</Text>
              <Tooltip
                label="We recommend the in-browser format for simplicity and a better learning experience. The on-machine option is available but requires additional setup."
                placement="top"
              >
                <InfoIcon />
              </Tooltip>
            </Tag>
          )
        )}

        {/* Only show the Change Format button if an alternate format exists */}
        {alternateExists && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={onOpen}
            leftIcon={<PiArrowsLeftRight />}
          >
            Switch to {isInBrowser ? "On-Machine" : "In-Browser"} Format
          </Button>
        )}
      </HStack>

      <FormatSelectionModal
        isOpen={isOpen}
        onClose={onClose}
        courseTitle={courseTitle}
        inBrowserSlug={isInBrowser ? slug : inBrowserSlug}
        onMachineSlug={!isInBrowser ? slug : baseSlug}
      />
    </Box>
  );
};

export { FormatToggle };
