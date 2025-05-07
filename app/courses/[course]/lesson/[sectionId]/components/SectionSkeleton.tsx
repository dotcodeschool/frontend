"use client";

import { Box, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

const SectionSkeleton = () => {
  return (
    <Box h="calc(100vh - 80px)" overflow="hidden" position="relative">
      <Flex h="full">
        {/* Left side - Sidebar skeleton */}
        <Box w="250px" borderRight="1px" borderColor="gray.700" p={4}>
          <Skeleton height="24px" mb={6} width="80%" />
          <SkeletonText mt={4} noOfLines={10} spacing={4} />
        </Box>

        {/* Right side - Content skeleton */}
        <Box flex="1" h="full" overflowY="auto" p={6}>
          <Skeleton height="40px" mb={6} width="60%" />
          <SkeletonText mb={8} mt={4} noOfLines={6} spacing={4} />

          {/* Lessons list skeleton */}
          <Skeleton height="40px" mb={4} mt={8} width="40%" />
          <Flex direction="column" gap={3} mb={8}>
            <Skeleton height="24px" width="90%" />
            <Skeleton height="24px" width="85%" />
            <Skeleton height="24px" width="80%" />
            <Skeleton height="24px" width="88%" />
          </Flex>
        </Box>
      </Flex>

      {/* Bottom navigation skeleton */}
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
        <Skeleton height="30px" width="120px" />
        <Skeleton height="30px" width="120px" />
      </Flex>
    </Box>
  );
};

export { SectionSkeleton };
