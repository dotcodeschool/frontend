import { Skeleton, VStack } from "@chakra-ui/react";
import React from "react";

const RepoStepLoadingSkeleton = () => (
  <VStack align="start" h="full" justify="center" minH={24} w="full">
    <Skeleton
      endColor="gray.500"
      height={8}
      startColor="gray.700"
      width="75%"
    />
    <Skeleton
      endColor="gray.500"
      height={16}
      startColor="gray.700"
      width="100%"
    />
    <Skeleton
      endColor="gray.500"
      height={8}
      mt={6}
      startColor="gray.700"
      width="75%"
    />
    <Skeleton
      endColor="gray.500"
      height={16}
      startColor="gray.700"
      width="100%"
    />
    <Skeleton
      endColor="gray.500"
      height={8}
      mt={6}
      startColor="gray.700"
      width="75%"
    />
    <Skeleton
      endColor="gray.500"
      height={16}
      startColor="gray.700"
      width="100%"
    />
  </VStack>
);

export { RepoStepLoadingSkeleton };
