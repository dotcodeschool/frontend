import { Box, Flex, Skeleton, SkeletonText } from "@chakra-ui/react";
import React from "react";

const LessonSkeleton = () => {
  return (
    <Box h="calc(100vh - 80px)" overflow="hidden" position="relative">
      <Flex h="full">
        {/* Left side - Content skeleton */}
        <Box h="full" overflowY="auto" p={6} w="50%">
          <Skeleton height="40px" mb={6} width="80%" />
          <SkeletonText mb={8} mt={4} noOfLines={4} spacing={4} />
          <SkeletonText mb={8} mt={4} noOfLines={6} spacing={4} />
          <SkeletonText mb={8} mt={4} noOfLines={8} spacing={4} />
        </Box>

        {/* Right side - Editor skeleton */}
        <Box bg="gray.800" h="full" w="50%">
          <Flex bg="gray.700" h="40px" p={2}>
            <Skeleton height="100%" width="120px" />
          </Flex>
          <Box p={4}>
            <SkeletonText mb={4} noOfLines={15} spacing={4} />
          </Box>
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

export { LessonSkeleton };
