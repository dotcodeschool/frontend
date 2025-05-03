import { Box, Flex, Link, Text } from "@chakra-ui/react";
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
  return (
    <Flex
      bg="gray.800"
      bottom={0}
      h="60px"
      justify="space-between"
      left={0}
      p={4}
      position="absolute"
      right={0}
      zIndex={10}
    >
      {prev ? (
        <Link alignItems="center" display="flex" href={prev.link}>
          <IoArrowBack style={{ marginRight: "8px" }} />
          <Text>Previous: {prev.title}</Text>
        </Link>
      ) : (
        <Box />
      )}

      {next && (
        <Link alignItems="center" display="flex" href={next.link}>
          <Text>Next: {next.title}</Text>
          <IoArrowForward style={{ marginLeft: "8px" }} />
        </Link>
      )}
    </Flex>
  );
};

export { LessonNavigation };
