// app/courses/[course]/(pages)/section/[section]/lesson/[lesson]/components/LessonSkeleton.tsx
import { Box, Flex, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";
import React from "react";

export const LessonSkeleton = () => (
  <Box maxW="4xl" mx="auto" px={4}>
    <Skeleton height="40px" my={4} width="80%" />

    <SkeletonText mt={4} noOfLines={2} skeletonHeight="4" spacing={4} />

    <Skeleton height="32px" my={8} width="50%" />

    <Stack spacing={6} mb={8}>
      <Flex align="flex-start">
        <Skeleton height="24px" width="24px" mr={3} />
        <Skeleton height="24px" width="80%" />
      </Flex>

      <Box
        bg="gray.700"
        border="1px solid"
        borderColor="gray.600"
        borderRadius="md"
        overflow="hidden"
        ml={8}
        mb={6}
      >
        <Box bg="gray.800" py={2} px={4}>
          <Skeleton height="20px" width="100px" />
        </Box>
        <Box py={4} px={4}>
          <SkeletonText noOfLines={2} skeletonHeight="4" spacing={4} />
        </Box>
      </Box>

      <SkeletonText noOfLines={2} skeletonHeight="4" spacing={4} mb={6} />

      <Flex align="flex-start">
        <Skeleton height="24px" width="24px" mr={3} />
        <Skeleton height="24px" width="70%" />
      </Flex>

      <Box
        bg="gray.700"
        border="1px solid"
        borderColor="gray.600"
        borderRadius="md"
        overflow="hidden"
        ml={8}
        mb={6}
      >
        <Box bg="gray.800" py={2} px={4}>
          <Skeleton height="20px" width="100px" />
        </Box>
        <Box py={4} px={4}>
          <SkeletonText noOfLines={1} skeletonHeight="4" spacing={4} />
        </Box>
      </Box>
    </Stack>

    <SkeletonText mt={6} noOfLines={2} skeletonHeight="4" spacing={4} />

    <Flex align="flex-start" mt={6}>
      <Skeleton height="24px" width="24px" mr={3} />
      <Skeleton height="24px" width="75%" />
    </Flex>

    <Box
      bg="gray.700"
      borderY="1px dashed"
      borderColor="gray.600"
      py={8}
      my={12}
      px={6}
      rounded="md"
    >
      <Flex justify="center" direction="column" align="center">
        <Skeleton height="24px" width="200px" mb={4} />
        <Flex align="center">
          <Skeleton height="24px" width="24px" mr={2} />
          <Skeleton height="20px" width="150px" />
        </Flex>
      </Flex>
    </Box>

    {/* Bottom navigation placeholder */}
    <Box py={12}>{/* This space is just to add padding at the bottom */}</Box>
  </Box>
);
