import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  SkeletonText,
  VStack,
} from "@chakra-ui/react";

const StepsComponentSkeleton = () => (
  <Card maxW="lg" mt={24} mx="auto" width="full">
    <CardHeader>
      <Skeleton h="3em" w="50%" />
    </CardHeader>
    <CardBody>
      <Skeleton h="2em" mb={4} w="75%" />
      <SkeletonText fontSize="lg" />
      <VStack mt={8}>
        <Skeleton h="2.5em" mb={4} w="full" />
        <Skeleton h="2.5em" mb={4} w="full" />
        <Skeleton h="2.5em" mb={4} w="full" />
      </VStack>
    </CardBody>
  </Card>
);

export { StepsComponentSkeleton };
