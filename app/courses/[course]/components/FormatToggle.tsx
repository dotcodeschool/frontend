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
import Link from "next/link";

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
        {!isInBrowser && (
          <Tag colorScheme="gray" size="md">
            <Text mr={2}>Legacy</Text>
            <Tooltip
              label="Runs on your local machine. This format is unstable and no longer recommended."
              placement="top"
            >
              <InfoIcon />
            </Tooltip>
          </Tag>
        )}

        {/* Only show the Change Format button if an alternate format exists */}
        {alternateExists && !isInBrowser && (
          <Button
            as={Link}
            href={`/courses/${inBrowserSlug}`}
            size="sm"
            variant="outline"
            colorScheme="gray"
            leftIcon={<PiArrowsLeftRight />}
          >
            Switch to In-Browser Format
          </Button>
        )}
      </HStack>
    </Box>
  );
};

export { FormatToggle };
