import { Heading, HStack, Switch, Text } from "@chakra-ui/react";

const ProgressMarker = () => (
  <HStack
    borderY="1px dashed gray"
    justify="center"
    maxW="md"
    mt={8}
    mx="auto"
    py={8}
    spacing={4}
    wrap="wrap"
  >
    <Heading as="h3" fontWeight="bold" size="md" textAlign="center">
      Finished this lesson?
    </Heading>
    <HStack>
      <Switch colorScheme="green" />
      <Text>Mark as complete</Text>
    </HStack>
  </HStack>
);

export { ProgressMarker };
