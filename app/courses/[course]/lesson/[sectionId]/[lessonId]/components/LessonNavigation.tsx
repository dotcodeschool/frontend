import { Box, Flex, Link, Text, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

type NavigationLink = {
  link: string;
  title: string;
} | null;

type LessonNavigationProps = {
  prev: NavigationLink;
  next: NavigationLink;
};

const LessonNavigation = ({ prev, next }: LessonNavigationProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  // For mobile, we'll show just the icons with shorter titles
  const prevTitle =
    isMobile && prev?.title
      ? prev.title.length > 15
        ? prev.title.substring(0, 15) + "..."
        : prev.title
      : prev?.title;

  const nextTitle =
    isMobile && next?.title
      ? next.title.length > 15
        ? next.title.substring(0, 15) + "..."
        : next.title
      : next?.title;

  return (
    <Flex
      bg="gray.800"
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
      h={{ base: "60px", md: "70px" }}
      justify="space-between"
      align="center"
      p={{ base: 3, md: 4 }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={999}
      width="100%"
    >
      {prev ? (
        <Link
          alignItems="center"
          display="flex"
          href={prev.link}
          maxW={{ base: "45%", md: "auto" }}
        >
          <IoArrowBack style={{ marginRight: "8px", flexShrink: 0 }} />
          <Text noOfLines={1} fontWeight="bold">
            {isMobile ? prevTitle : `Previous: ${prevTitle}`}
          </Text>
        </Link>
      ) : (
        <Box />
      )}

      {next && (
        <Link
          alignItems="center"
          display="flex"
          href={next.link}
          maxW={{ base: "45%", md: "auto" }}
        >
          <Text noOfLines={1} fontWeight="bold">
            {isMobile ? nextTitle : `Next: ${nextTitle}`}
          </Text>
          <IoArrowForward style={{ marginLeft: "8px", flexShrink: 0 }} />
        </Link>
      )}
    </Flex>
  );
};

export { LessonNavigation };
