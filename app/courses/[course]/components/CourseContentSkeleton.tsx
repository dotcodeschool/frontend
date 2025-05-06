import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const CourseContentSkeleton = () => (
  <Box maxW="4xl" mx="auto">
    <Skeleton height="40px" my={4} width="80%" />
    <Skeleton height="20px" mb={6} width="40%" />

    <SkeletonText mt={4} noOfLines={3} skeletonHeight="4" spacing={4} />

    <HStack mt={4} spacing={2}>
      <Skeleton height="24px" width="60px" />
      <Skeleton height="24px" width="80px" />
    </HStack>

    <Skeleton height="48px" mt={8} width="120px" />

    <Box
      bg="gray.700"
      border="2px solid"
      borderColor="gray.600"
      my={12}
      p={8}
      rounded={16}
      shadow="2xl"
    >
      <Skeleton height="28px" mb={6} width="60%" />
      <VStack align="stretch" spacing={4}>
        {[...Array(4)].map((_, index) => (
          <HStack key={index}>
            <SkeletonCircle height="20px" width="20px" />
            <Skeleton height="20px" width="80%" />
          </HStack>
        ))}
      </VStack>
    </Box>

    <Skeleton height="32px" my={8} width="40%" />
    <Skeleton height="20px" mb={8} width="30%" />

    <Accordion allowToggle>
      {[...Array(3)].map((_, index) => (
        <AccordionItem key={index}>
          <AccordionButton py={6}>
            <VStack align="start" spacing={4} w="full">
              <HStack w="full">
                <Skeleton height="24px" width="80%" />
                <Skeleton height="24px" width="24px" />
              </HStack>
              <Skeleton height="8px" width="90%" />
            </VStack>
          </AccordionButton>
          <AccordionPanel pb={12} pt={0} w="90%">
            <SkeletonText mt={4} noOfLines={3} skeletonHeight="4" spacing={4} />
            <Skeleton height="40px" mt={12} width="120px" />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
);

export { CourseContentSkeleton };
